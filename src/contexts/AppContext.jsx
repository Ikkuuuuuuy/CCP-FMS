import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { SEED_ALLOTMENTS, MOCK_USERS, MOCK_BURS, MOCK_DVS, MOCK_JOURNAL_ENTRIES, MOCK_AUDIT_LOGS } from '../data/seedData';
import {
  generateBURNumber, generateDVNumber, generateJENumber,
  generateAuditLogId, getCurrentYear, getCurrentMonth, getTodayISO,
} from '../utils/formatters';
import { validateJournalEntry, buildDVPaymentJournalEntry } from '../utils/ledgerEngine';
import { computeTaxDeductions } from '../utils/taxEngine';

const AppContext = createContext(null);

// =============================================================================
// Initial State
// =============================================================================
const getInitialState = () => {
  try {
    const saved = localStorage.getItem('ccp_fms_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate structure before restoring (ensure mock data loaded if empty)
      if (parsed.burs && parsed.dvs && parsed.journalEntries && parsed.auditLog && parsed.allotments) {
        if (!parsed.auditLog || parsed.auditLog.length === 0) {
          parsed.auditLog = MOCK_AUDIT_LOGS;
        }
        if (parsed.burs.length === 0 && parsed.dvs.length === 0) {
          parsed.burs = MOCK_BURS;
          parsed.dvs = MOCK_DVS;
          parsed.journalEntries = MOCK_JOURNAL_ENTRIES;
        }
        return parsed;
      }
    }
  } catch (e) { /* ignore corrupted state */ }

  return {
    currentUser: null,
    burs: MOCK_BURS,
    dvs: MOCK_DVS,
    journalEntries: MOCK_JOURNAL_ENTRIES,
    auditLog: MOCK_AUDIT_LOGS,
    allotments: JSON.parse(JSON.stringify(SEED_ALLOTMENTS)),
    sequences: { bur: { 2026: { 8: 5 } }, dv: 4, je: 3, audit: 9 },
  };
};

// =============================================================================
// Pure Helper: Write Audit Log Entry
// =============================================================================
function createAuditEntry(state, { actorId, actorName, module, actionType, documentRef, oldData, newData }) {
  const seq = state.sequences.audit + 1;
  return {
    entry: {
      log_id: generateAuditLogId(seq),
      timestamp: new Date().toISOString(),
      actor_id: actorId,
      actor_name: actorName,
      module,
      action_type: actionType,
      document_ref: documentRef,
      payload_delta: { old: oldData || null, new: newData || null },
    },
    newSeq: seq,
  };
}

// =============================================================================
// Reducer
// =============================================================================
function appReducer(state, action) {
  const { currentUser } = state;
  const actor = currentUser || { id: 'system', name: 'System' };

  switch (action.type) {

    // --- AUTH ---
    case 'LOGIN': {
      return { ...state, currentUser: action.payload };
    }
    case 'LOGOUT': {
      return { ...state, currentUser: null };
    }

    // =========================================================================
    // DOCUMENT ACTIONS (BUR & DV Unified Workflow)
    // =========================================================================
    // =========================================================================
    // DOCUMENT ACTIONS (BUR & DV Decoupled Workflows)
    // =========================================================================
    case 'DOCUMENT_CREATE': {
      const { fundCluster = '101', allotmentClass = 'MOOE', amount } = action.payload;
      const year = getCurrentYear();
      const month = getCurrentMonth();

      // Validate allotment balance
      const allot = state.allotments[fundCluster]?.[allotmentClass];
      if (!allot) throw new Error('Invalid fund cluster or allotment class.');
      const available = allot.total - allot.obligated;
      if (amount > available) {
        throw new Error(`Insufficient allotment balance. Available: ₱${available.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`);
      }

      // Generate BUR number
      const fcKey = `${fundCluster}_${allotmentClass}`;
      const seqNum = (state.sequences.bur[fcKey] || 0) + 1;
      const burNo = generateBURNumber(year, month, seqNum);

      const newBUR = {
        ...action.payload,
        id: `bur-${Date.now()}`,
        burNo,
        status: 'OBLIGATED', // Immediately obligate upon certification
        createdAt: new Date().toISOString(),
        createdBy: actor.id,
        createdByName: actor.name,
        history: [{ status: 'OBLIGATED', actor: actor.name, timestamp: new Date().toISOString(), note: 'BUR created and certified.' }],
      };

      // Instantly deduct allotment obligation
      const newAllotments = JSON.parse(JSON.stringify(state.allotments));
      newAllotments[fundCluster][allotmentClass].obligated += amount;

      const { entry: burEntry, newSeq: auditSeq1 } = createAuditEntry(state, {
        actorId: actor.id, actorName: actor.name,
        module: 'BUR', actionType: 'CREATE',
        documentRef: burNo, newData: newBUR,
      });

      return {
        ...state,
        burs: [...state.burs, newBUR],
        allotments: newAllotments,
        auditLog: [...state.auditLog, burEntry],
        sequences: {
          ...state.sequences,
          bur: { ...state.sequences.bur, [fcKey]: seqNum },
          audit: auditSeq1,
        },
      };
    }

    case 'DOCUMENT_CREATE_DV': {
      const { burRef, payeeName, payeeTIN, address, modeOfPayment, expenseAccountCode, grossClaim, taxTypes, particulars } = action.payload;
      const year = getCurrentYear();
      const month = getCurrentMonth();

      // Find linked BUR
      const bur = state.burs.find(b => b.burNo === burRef || b.id === burRef);
      if (!bur) throw new Error('Selected BUR reference not found.');

      // Calculate tax deductions
      const taxDed = computeTaxDeductions(grossClaim, taxTypes || ['EWT_2PCT', 'FINAL_VAT']);

      const dvSeq = state.sequences.dv + 1;
      const dvNo = generateDVNumber(year, month, dvSeq);

      const newDV = {
        id: `dv-${Date.now()}`,
        dvNo,
        burRef: bur.burNo,
        burId: bur.id,
        payeeName: payeeName || bur.payeeName,
        payeeTIN: payeeTIN || bur.payeeTIN || '000-000-000-000',
        address: address || bur.address || 'CCP Complex, Roxas Blvd, Pasay City',
        modeOfPayment: modeOfPayment || 'Check',
        department: bur.office || bur.responsibilityCenter || '08',
        expenseAccountCode: expenseAccountCode || bur.accountCode || '5021202000',
        description: particulars || bur.particulars,
        grossClaim,
        taxTypes: taxTypes || ['EWT_2PCT', 'FINAL_VAT'],
        taxDeductions: taxDed,
        netAmount: taxDed.netAmount,
        status: 'PENDING_ACCOUNTING',
        createdAt: new Date().toISOString(),
        createdBy: actor.id,
        createdByName: actor.name,
        history: [{ status: 'PENDING_ACCOUNTING', actor: actor.name, timestamp: new Date().toISOString(), note: 'DV created linked to BUR.' }],
      };

      const { entry: dvEntry, newSeq: auditSeq } = createAuditEntry(state, {
        actorId: actor.id, actorName: actor.name,
        module: 'DV', actionType: 'CREATE',
        documentRef: dvNo, newData: newDV,
      });

      return {
        ...state,
        dvs: [...state.dvs, newDV],
        auditLog: [...state.auditLog, dvEntry],
        sequences: {
          ...state.sequences,
          dv: dvSeq,
          audit: auditSeq,
        },
      };
    }

    case 'DV_ADVANCE': {
      const { id } = action.payload;
      const dIdx = state.dvs.findIndex(d => d.id === id);
      if (dIdx === -1) throw new Error('DV not found.');
      const dv = state.dvs[dIdx];

      const transitions = {
        PREPARED: 'PENDING_ACCOUNTING',
        PENDING_ACCOUNTING: 'APPROVED_FOR_PAYMENT',
        APPROVED_FOR_PAYMENT: 'PAID',
      };

      const nextStatus = transitions[dv.status];
      if (!nextStatus) throw new Error(`DV cannot be advanced from status: ${dv.status}`);

      const now = new Date().toISOString();
      let newJournalEntries = state.journalEntries;
      let newSequences = state.sequences;
      let newAllotments = state.allotments;

      // On PAID: Post General Ledger Journal Entry & Record Disbursement
      if (nextStatus === 'PAID') {
        const jeSeq = state.sequences.je + 1;
        const jeNo = generateJENumber(getCurrentYear(), jeSeq);
        const lines = buildDVPaymentJournalEntry(dv);

        validateJournalEntry(lines);

        const journalEntry = {
          id: `je-${Date.now()}`,
          je_id: jeNo,
          reference: dv.dvNo,
          date: getTodayISO(),
          description: `DV Payment — ${dv.payeeName} (${dv.dvNo})`,
          lines,
          postedBy: actor.id,
          postedByName: actor.name,
          postedAt: now,
          source: 'DV_AUTO_POST',
        };

        newJournalEntries = [...state.journalEntries, journalEntry];
        newSequences = { ...newSequences, je: jeSeq };

        // Update disbursed on allotment
        const bur = state.burs.find(b => b.burNo === dv.burRef || b.id === dv.burRef);
        if (bur) {
          newAllotments = JSON.parse(JSON.stringify(newAllotments));
          newAllotments[bur.fundCluster][bur.allotmentClass].disbursed += dv.grossClaim;
        }
      }

      const updatedDv = {
        ...dv,
        status: nextStatus,
        ...(nextStatus === 'PAID' && {
          paidAt: now, paidBy: actor.id,
          checkNo: '527225', checkDate: 'July 28, 2026', bankName: 'LANDBANK',
          receivedByName: 'REYMART P. CASTILO', receivedDate: 'July 29, 2026'
        }),
        history: [...dv.history, { status: nextStatus, actor: actor.name, timestamp: now, note: `Advanced to ${nextStatus}` }],
      };

      const { entry: dvAudit, newSeq: auditSeq } = createAuditEntry(state, {
        actorId: actor.id, actorName: actor.name,
        module: 'DV', actionType: nextStatus === 'PAID' ? 'PAID' : 'ADVANCE',
        documentRef: dv.dvNo, oldData: { status: dv.status }, newData: { status: nextStatus },
      });

      const newDVs = [...state.dvs];
      newDVs[dIdx] = updatedDv;

      return {
        ...state,
        dvs: newDVs,
        journalEntries: newJournalEntries,
        allotments: newAllotments,
        auditLog: [...state.auditLog, dvAudit],
        sequences: { ...newSequences, audit: auditSeq },
      };
    }

    case 'DOCUMENT_UPDATE': {
      // Allows updating a BUR or DV while in PREPARED state
      const { type, id, data } = action.payload; // type: 'BUR' or 'DV'
      const collection = type === 'BUR' ? 'burs' : 'dvs';
      const idx = state[collection].findIndex(item => item.id === id);
      if (idx === -1) throw new Error(`${type} not found.`);
      
      const item = state[collection][idx];
      if (item.status !== 'PREPARED') throw new Error(`Only PREPARED documents can be updated.`);
      
      const updated = { ...item, ...data };
      
      // If updating DV, recalculate taxes if grossClaim or taxTypes change
      if (type === 'DV' && (data.grossClaim !== undefined || data.taxTypes !== undefined)) {
        const taxDed = computeTaxDeductions(updated.grossClaim, updated.taxTypes || []);
        updated.taxDeductions = taxDed;
        updated.netAmount = taxDed.netAmount || updated.grossClaim;
      }
      
      const { entry, newSeq } = createAuditEntry(state, {
        actorId: actor.id, actorName: actor.name,
        module: type, actionType: 'UPDATE',
        documentRef: item.burNo || item.dvNo, 
        oldData: item, newData: updated,
      });
      
      const newCollection = [...state[collection]];
      newCollection[idx] = updated;
      
      return {
        ...state,
        [collection]: newCollection,
        auditLog: [...state.auditLog, entry],
        sequences: { ...state.sequences, audit: newSeq },
      };
    }

    case 'DOCUMENT_ADVANCE': {
      const { burId, note } = action.payload;
      const bIdx = state.burs.findIndex(b => b.id === burId);
      if (bIdx === -1) throw new Error('BUR not found.');
      const bur = state.burs[bIdx];
      
      const dIdx = state.dvs.findIndex(d => d.burRef === burId);
      const dv = dIdx !== -1 ? state.dvs[dIdx] : null;

      const transitions = {
        PREPARED:               'FORWARDED_TO_TREASURY',
        FORWARDED_TO_TREASURY:  'FOR_APPROVAL_OP',
        FOR_APPROVAL_OP:        'APPROVED',
        APPROVED:               'FOR_RELEASE',
      };

      const nextStatus = transitions[bur.status];
      if (!nextStatus) throw new Error(`Document cannot be advanced from status: ${bur.status}`);

      let newJournalEntries = state.journalEntries;
      let newSequences = state.sequences;
      let newAllotments = state.allotments;
      const now = new Date().toISOString();
      const statusNote = note || `Advanced to ${nextStatus.replace(/_/g, ' ')}`;

      // On APPROVED: Obligate Funds
      if (nextStatus === 'APPROVED') {
        newAllotments = JSON.parse(JSON.stringify(state.allotments));
        newAllotments[bur.fundCluster][bur.allotmentClass].obligated += bur.amount;
      }

      // On FOR_RELEASE: Post Journal Entry & Disburse Funds
      if (nextStatus === 'FOR_RELEASE' && dv) {
        const jeSeq = state.sequences.je + 1;
        const jeNo = generateJENumber(getCurrentYear(), jeSeq);
        const lines = buildDVPaymentJournalEntry(dv);

        validateJournalEntry(lines);

        const journalEntry = {
          id: `je-${Date.now()}`,
          je_id: jeNo,
          reference: dv.dvNo,
          date: getTodayISO(),
          description: `DV Payment — ${dv.payeeName} (${dv.dvNo})`,
          lines,
          postedBy: actor.id,
          postedByName: actor.name,
          postedAt: now,
          source: 'DV_AUTO_POST',
        };

        newJournalEntries = [...state.journalEntries, journalEntry];
        newSequences = { ...newSequences, je: jeSeq };

        // Update disbursed
        newAllotments = JSON.parse(JSON.stringify(newAllotments));
        newAllotments[bur.fundCluster][bur.allotmentClass].disbursed += dv.grossClaim;
      }

      // Update BUR
      const updatedBur = {
        ...bur,
        status: nextStatus,
        ...(nextStatus === 'APPROVED' && { certifiedAt: now, certifiedBy: actor.id }),
        history: [...bur.history, { status: nextStatus, actor: actor.name, timestamp: now, note: statusNote }],
      };

      const { entry: burAudit, newSeq: auditSeq1 } = createAuditEntry(state, {
        actorId: actor.id, actorName: actor.name,
        module: 'BUR', actionType: nextStatus === 'FOR_RELEASE' ? 'PAID' : 'ADVANCE',
        documentRef: bur.burNo, oldData: { status: bur.status }, newData: { status: nextStatus },
      });
      
      const newBURs = [...state.burs];
      newBURs[bIdx] = updatedBur;
      
      let newDVs = state.dvs;
      let auditLogs = [...state.auditLog, burAudit];
      let auditSeq2 = auditSeq1;

      // Update DV if it exists
      if (dv) {
        const updatedDv = {
          ...dv,
          status: nextStatus,
          ...(nextStatus === 'FOR_RELEASE' && { paidAt: now, paidBy: actor.id }),
          history: [...dv.history, { status: nextStatus, actor: actor.name, timestamp: now, note: statusNote }],
        };
        
        const { entry: dvAudit, newSeq: tempSeq } = createAuditEntry({ ...state, sequences: { ...state.sequences, audit: auditSeq1 } }, {
          actorId: actor.id, actorName: actor.name,
          module: 'DV', actionType: nextStatus === 'FOR_RELEASE' ? 'PAID' : 'ADVANCE',
          documentRef: dv.dvNo, oldData: { status: dv.status }, newData: { status: nextStatus },
        });
        
        newDVs = [...state.dvs];
        newDVs[dIdx] = updatedDv;
        auditLogs.push(dvAudit);
        auditSeq2 = tempSeq;
      }

      return {
        ...state,
        burs: newBURs,
        dvs: newDVs,
        journalEntries: newJournalEntries,
        allotments: newAllotments,
        auditLog: auditLogs,
        sequences: { ...newSequences, audit: auditSeq2 },
      };
    }

    case 'DOCUMENT_REJECT': {
      const { burId, reason } = action.payload;
      const bIdx = state.burs.findIndex((b) => b.id === burId);
      if (bIdx === -1) throw new Error('BUR not found.');
      const bur = state.burs[bIdx];
      
      const dIdx = state.dvs.findIndex(d => d.burRef === burId);
      const dv = dIdx !== -1 ? state.dvs[dIdx] : null;

      const now = new Date().toISOString();

      const updatedBur = {
        ...bur,
        status: 'REJECTED',
        rejectedAt: now,
        rejectedBy: actor.id,
        rejectionReason: reason,
        history: [...bur.history, { status: 'REJECTED', actor: actor.name, timestamp: now, note: `Rejected: ${reason}` }],
      };

      const { entry: burAudit, newSeq: auditSeq1 } = createAuditEntry(state, {
        actorId: actor.id, actorName: actor.name,
        module: 'BUR', actionType: 'REJECT',
        documentRef: bur.burNo, oldData: { status: bur.status }, newData: { status: 'REJECTED', reason },
      });
      
      const newBURs = [...state.burs];
      newBURs[bIdx] = updatedBur;

      let newDVs = state.dvs;
      let auditLogs = [...state.auditLog, burAudit];
      let auditSeq2 = auditSeq1;

      if (dv) {
        const updatedDv = {
          ...dv,
          status: 'REJECTED',
          rejectedAt: now,
          rejectedBy: actor.id,
          rejectionReason: reason,
          history: [...dv.history, { status: 'REJECTED', actor: actor.name, timestamp: now, note: `Rejected: ${reason}` }],
        };
        
        const { entry: dvAudit, newSeq: tempSeq } = createAuditEntry({ ...state, sequences: { ...state.sequences, audit: auditSeq1 } }, {
          actorId: actor.id, actorName: actor.name,
          module: 'DV', actionType: 'REJECT',
          documentRef: dv.dvNo, oldData: { status: dv.status }, newData: { status: 'REJECTED', reason },
        });
        
        newDVs = [...state.dvs];
        newDVs[dIdx] = updatedDv;
        auditLogs.push(dvAudit);
        auditSeq2 = tempSeq;
      }

      return { 
        ...state, 
        burs: newBURs, 
        dvs: newDVs,
        auditLog: auditLogs, 
        sequences: { ...state.sequences, audit: auditSeq2 } 
      };
    }

    // =========================================================================
    // MANUAL JOURNAL ENTRY
    // =========================================================================
    case 'LEDGER_POST_MANUAL': {
      const { lines, description, reference } = action.payload;
      // Hard integrity check
      validateJournalEntry(lines);

      const jeSeq = state.sequences.je + 1;
      const jeNo = generateJENumber(getCurrentYear(), jeSeq);
      const now = new Date().toISOString();

      const journalEntry = {
        id: `je-${Date.now()}`,
        je_id: jeNo,
        reference: reference || 'MANUAL',
        date: getTodayISO(),
        description,
        lines,
        postedBy: actor.id,
        postedByName: actor.name,
        postedAt: now,
        source: 'MANUAL',
      };

      const { entry, newSeq } = createAuditEntry(state, {
        actorId: actor.id, actorName: actor.name,
        module: 'LEDGER', actionType: 'POST',
        documentRef: jeNo, newData: journalEntry,
      });

      return {
        ...state,
        journalEntries: [...state.journalEntries, journalEntry],
        auditLog: [...state.auditLog, entry],
        sequences: { ...state.sequences, je: jeSeq, audit: newSeq },
      };
    }

    default:
      return state;
  }
}

// =============================================================================
// Context Provider
// =============================================================================
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Persist state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('ccp_fms_state', JSON.stringify(state));
    } catch (e) { /* quota exceeded — ignore */ }
  }, [state]);

  const safeDispatch = useCallback((action) => {
    try {
      dispatch(action);
    } catch (err) {
      // Rethrow for component-level error handling
      throw err;
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch: safeDispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
