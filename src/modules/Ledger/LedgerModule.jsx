import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, AlertTriangle, BookOpen, Printer, Plus, FileText, UserCheck, Calendar, Filter, Check, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { computeAccountBalances, verifyLedgerHealth } from '../../utils/ledgerEngine';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { CHART_OF_ACCOUNTS } from '../../data/seedData';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import SubsidiaryLedgerPrintTemplate from '../../components/Print/SubsidiaryLedgerPrintTemplate';

export default function LedgerModule() {
  const { state, dispatch } = useApp();
  const { journalEntries, subsidiaryLedgers = [] } = state;

  const [activeTab, setActiveTab] = useState('subsidiary'); // default to subsidiary to immediately show CCP form
  const [selectedLedgerId, setSelectedLedgerId] = useState('SL-063'); // default to Philippine Sailing Association
  const [searchText, setSearchText] = useState('');
  const [expandedJE, setExpandedJE] = useState(null);
  const [toast, setToast] = useState(null);
  const [journalSortOrder, setJournalSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [entrySortOrder, setEntrySortOrder] = useState('chronological'); // 'chronological' | 'newest'
  
  // Modal for adding a new entry
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmEntryOpen, setIsConfirmEntryOpen] = useState(false);
  const [newEntryData, setNewEntryData] = useState({
    month: '',
    day: '',
    year: '',
    reference: '',
    particulars: '',
    folio: 'pd',
    debit: '',
    credit: '',
    dateMarker: '',
  });

  // Modal for creating a new Customer/Tenant Account Ledger
  const [isCreateLedgerModalOpen, setIsCreateLedgerModalOpen] = useState(false);
  const [isConfirmCreateLedgerOpen, setIsConfirmCreateLedgerOpen] = useState(false);
  const [newLedgerForm, setNewLedgerForm] = useState({
    accountOf: '',
    address: 'CCP Complex, Pasay City',
    accountSymbol: '',
    sheetNo: '01',
    period: 'Jan. 1, 2026 to Dec. 31, 2026',
    memo: 'Rental 0.00\ngarbage 0.00\nTOTAL 0.00\ndue every 5th of the month',
    initialBalance: '0',
  });

  // Sort subsidiary ledgers Newest to Oldest by default
  const sortedSubsidiaryLedgers = useMemo(() => {
    return [...subsidiaryLedgers].sort((a, b) => {
      const idNumA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0;
      const idNumB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0;
      return idNumB - idNumA;
    });
  }, [subsidiaryLedgers]);

  const activeLedger = useMemo(() => {
    return subsidiaryLedgers.find((l) => l.id === selectedLedgerId) || subsidiaryLedgers[0];
  }, [subsidiaryLedgers, selectedLedgerId]);

  const ledgerHealth = useMemo(() => verifyLedgerHealth(journalEntries), [journalEntries]);
  const allLines = useMemo(() =>
    journalEntries.flatMap((je) => je.lines.map((l) => ({ ...l, je_id: je.je_id }))),
    [journalEntries]
  );
  const accountBalances = useMemo(() => computeAccountBalances(allLines), [allLines]);

  // Enrich balances with COA metadata
  const enrichedBalances = accountBalances.map((b) => {
    const coa = CHART_OF_ACCOUNTS.find((a) => a.code === b.account_code);
    return { ...b, type: coa?.type || 'UNKNOWN', normal: coa?.normal || 'DEBIT' };
  }).sort((a, b) => a.account_code.localeCompare(b.account_code));

  const filteredJEs = journalEntries.filter((je) =>
    !searchText ||
    je.je_id.toLowerCase().includes(searchText.toLowerCase()) ||
    je.reference.toLowerCase().includes(searchText.toLowerCase()) ||
    je.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sort journal entries based on sort order (Newest first by default)
  const sortedJEs = useMemo(() => {
    return [...filteredJEs].sort((a, b) => {
      const timeA = new Date(a.date || a.postedAt || a.id).getTime() || 0;
      const timeB = new Date(b.date || b.postedAt || b.id).getTime() || 0;
      if (timeA !== timeB) {
        return journalSortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      }
      return journalSortOrder === 'newest'
        ? (b.je_id || '').localeCompare(a.je_id || '')
        : (a.je_id || '').localeCompare(b.je_id || '');
    });
  }, [filteredJEs, journalSortOrder]);

  const totalDebits = enrichedBalances.reduce((s, b) => s + b.totalDebit, 0);
  const totalCredits = enrichedBalances.reduce((s, b) => s + b.totalCredit, 0);

  // Subsidiary summary stats
  const rawEntries = activeLedger?.entries || [];
  const slTotalDebit = rawEntries.reduce((s, e) => s + (e.debit || 0), 0);
  const slTotalCredit = rawEntries.reduce((s, e) => s + (e.credit || 0), 0);
  const slCurrentBalance = rawEntries.length > 0 ? rawEntries[rawEntries.length - 1].balance : 0;

  // Active entries displayed according to sort order
  const displayedEntries = useMemo(() => {
    if (entrySortOrder === 'newest') {
      return [...rawEntries].reverse();
    }
    return rawEntries;
  }, [rawEntries, entrySortOrder]);

  const handlePrint = () => {
    window.print();
  };

  // 1. Add Entry submission flow (Validation -> Confirm Modal -> Execute)
  const handleAddEntryPreSubmit = (e) => {
    e.preventDefault();
    if (!newEntryData.reference.trim() || !newEntryData.particulars.trim()) {
      alert('Reference No. and Particulars are required.');
      return;
    }
    setIsConfirmEntryOpen(true);
  };

  const handleExecuteAddEntry = () => {
    try {
      const debit = parseFloat(newEntryData.debit || 0);
      const credit = parseFloat(newEntryData.credit || 0);
      const lastEntry = rawEntries[rawEntries.length - 1];
      const prevBal = lastEntry ? lastEntry.balance : 0;
      const newBal = prevBal + debit - credit;

      dispatch({
        type: 'SUBSIDIARY_ENTRY_ADD',
        payload: {
          ledgerId: activeLedger.id,
          entryData: newEntryData,
        },
      });

      setIsConfirmEntryOpen(false);
      setIsAddModalOpen(false);
      setNewEntryData({
        month: '', day: '', year: '', reference: '', particulars: '', folio: 'pd', debit: '', credit: '', dateMarker: ''
      });

      setToast({
        title: 'Ledger Entry Added Successfully!',
        message: `Entry "${newEntryData.reference}" posted to ${activeLedger.accountOf}. Resulting balance: ₱${Math.max(0, Math.round(newBal * 100) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}.`,
        type: 'success',
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // 2. Create Ledger submission flow (Validation -> Confirm Modal -> Execute)
  const handleCreateLedgerPreSubmit = (e) => {
    e.preventDefault();
    if (!newLedgerForm.accountOf.trim()) {
      alert('Please enter Account / Tenant Name.');
      return;
    }
    if (!newLedgerForm.accountSymbol.trim()) {
      alert('Please enter Account Symbol.');
      return;
    }
    setIsConfirmCreateLedgerOpen(true);
  };

  const handleExecuteCreateLedger = () => {
    try {
      const newId = `SL-${Date.now()}`;
      dispatch({
        type: 'SUBSIDIARY_LEDGER_CREATE',
        payload: {
          ...newLedgerForm,
          id: newId,
        },
      });
      setSelectedLedgerId(newId);
      setIsConfirmCreateLedgerOpen(false);
      setIsCreateLedgerModalOpen(false);

      setToast({
        title: 'Customer Ledger Created!',
        message: `New Subsidiary Ledger for "${newLedgerForm.accountOf}" (Symbol: ${newLedgerForm.accountSymbol}) initialized.`,
        type: 'success',
      });

      // Reset form
      setNewLedgerForm({
        accountOf: '',
        address: 'CCP Complex, Pasay City',
        accountSymbol: '',
        sheetNo: '01',
        period: 'Jan. 1, 2026 to Dec. 31, 2026',
        memo: 'Rental 0.00\ngarbage 0.00\nTOTAL 0.00\ndue every 5th of the month',
        initialBalance: '0',
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const formatPesos = (val) => {
    if (!val || val === 0) return '';
    const parts = val.toFixed(2).split('.');
    return Number(parts[0]).toLocaleString('en-US');
  };

  const formatCents = (val) => {
    if (val === undefined || val === null) return '';
    if (val === 0) return '—';
    const parts = val.toFixed(2).split('.');
    return parts[1];
  };

  return (
    <div className="page-wrapper">
      {/* Toast Notification Pop-up */}
      <Toast
        show={!!toast}
        onClose={() => setToast(null)}
        title={toast?.title}
        message={toast?.message}
        type={toast?.type || 'success'}
      />

      {/* Printable template container */}
      <SubsidiaryLedgerPrintTemplate ledger={activeLedger} />

      {/* Screen UI Header */}
      <div className="page-header no-print">
        <div className="page-header-info">
          <div className="page-title">Subsidiary & General Ledger</div>
          <div className="page-subtitle">
            Cultural Center of the Philippines Complex · Credit & Collections Bookkeeping System
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Form 63</span>
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px',
            background: ledgerHealth.healthy ? '#ECFDF5' : '#FEF2F2',
            border: `1px solid ${ledgerHealth.healthy ? '#A7F3D0' : '#FECACA'}`,
            borderRadius: 8, fontSize: 13, fontWeight: 700,
            color: ledgerHealth.healthy ? '#065F46' : '#991B1B',
          }}>
            {ledgerHealth.healthy ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
            {ledgerHealth.healthy
              ? `Ledger Balanced`
              : `${ledgerHealth.errors.length} Integrity Error`}
          </div>
        </div>
      </div>

      {!ledgerHealth.healthy && (
        <div className="alert alert-danger mb-4 no-print">
          <AlertTriangle size={16} className="alert-icon" />
          <div className="alert-text">
            <div className="alert-title">Ledger Integrity Errors</div>
            {ledgerHealth.errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs no-print">
        {[
          { id: 'subsidiary', label: 'CCP Subsidiary Ledger (Form 63)' },
          { id: 'journal', label: 'General Journal Entries' },
          { id: 'trial', label: 'General Ledger & Trial Balance' },
        ].map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* TAB 1: SUBSIDIARY LEDGER (FORM 63 REPLICA) */}
      {activeTab === 'subsidiary' && activeLedger && (
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Account Selector & Control Bar */}
          <div className="card" style={{ padding: '16px 20px', background: '#ffffff', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 320 }}>
                <UserCheck size={18} style={{ color: 'var(--color-primary)' }} />
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', display: 'block', marginBottom: 4 }}>
                    Select Customer / Tenant Account Ledger (Sorted New to Old):
                  </label>
                  <select
                    className="form-control"
                    style={{ fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                    value={selectedLedgerId}
                    onChange={(e) => setSelectedLedgerId(e.target.value)}
                  >
                    {sortedSubsidiaryLedgers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.accountOf} — (Account Symbol: {l.accountSymbol}, Sheet #{l.sheetNo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 20, padding: '8px 16px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280' }}>TOTAL DEBIT</div>
                    <div style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 700, color: '#2563EB' }}>
                      {formatCurrency(slTotalDebit)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280' }}>TOTAL CREDIT</div>
                    <div style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 700, color: '#059669' }}>
                      {formatCurrency(slTotalCredit)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280' }}>CURRENT BALANCE</div>
                    <div style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 700, color: slCurrentBalance > 0 ? '#DC2626' : '#059669' }}>
                      {formatCurrency(slCurrentBalance)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select
                    className="form-control"
                    style={{ width: 150, padding: '6px 10px', fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'pointer' }}
                    value={entrySortOrder}
                    onChange={(e) => setEntrySortOrder(e.target.value)}
                    title="Sort entries in ledger form"
                  >
                    <option value="chronological">Form Standard (Chronological)</option>
                    <option value="newest">Newest Entries First</option>
                  </select>
                </div>

                <button className="btn btn-secondary" onClick={() => setIsCreateLedgerModalOpen(true)}>
                  <Plus size={15} />
                  <span>New Customer Ledger</span>
                </button>

                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                  <Plus size={15} />
                  <span>Add Ledger Entry</span>
                </button>
              </div>
            </div>
          </div>

          {/* Physical Form Replica Wrapper Container */}
          <div className="card" style={{ padding: '28px', backgroundColor: '#FAF8F5', border: '1px solid #D1D5DB', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            {/* Header Title */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: '"Times New Roman", serif', letterSpacing: 1, color: '#111827', margin: 0, textTransform: 'uppercase' }}>
                CULTURAL CENTER OF THE PHILIPPINES COMPLEX
              </h2>
              <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: '"Times New Roman", serif', letterSpacing: 4, color: '#374151', margin: '4px 0 0', textTransform: 'uppercase' }}>
                SUBSIDIARY LEDGER
              </h3>
            </div>

            {/* Account Details Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 16, fontSize: 12, textTransform: 'uppercase' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, width: 110, color: '#374151' }}>ACCOUNT OF:</span>
                  <span style={{ flex: 1, borderBottom: '1px solid #111827', paddingLeft: 8, fontWeight: 800, fontSize: 15, fontFamily: 'Courier New, monospace', color: '#111827' }}>
                    {activeLedger.accountOf}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, width: 110, color: '#374151' }}>ADDRESS:</span>
                  <span style={{ flex: 1, borderBottom: '1px solid #6B7280', paddingLeft: 8, color: '#374151' }}>
                    {activeLedger.address || '—'}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, marginRight: 8, color: '#374151' }}>ACCOUNT SYMBOL:</span>
                  <span style={{ borderBottom: '1px solid #111827', width: 90, textAlign: 'center', fontWeight: 800, fontSize: 18, fontFamily: 'Courier New, monospace', color: '#B91C1C' }}>
                    {activeLedger.accountSymbol}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: 800, marginRight: 8, color: '#374151' }}>SHEET NO.:</span>
                  <span style={{ borderBottom: '1px solid #6B7280', width: 90, textAlign: 'center', fontWeight: 800, color: '#111827' }}>
                    {activeLedger.sheetNo}
                  </span>
                </div>
              </div>
            </div>

            {/* Ledger Form Sheet Layout (Left Sidebar + Table Grid) */}
            <div style={{ display: 'flex', border: '2px solid #111827', backgroundColor: '#FFFFFF' }}>
              
              {/* Left Margin Sidebar (Billing Notes & Billing Term) */}
              <div style={{
                width: 150, borderRight: '2px solid #111827', padding: '12px',
                backgroundColor: '#FFFBEB', fontSize: 11, color: '#78350F',
                display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div style={{ borderBottom: '1px solid #FCD34D', paddingBottom: 6, fontWeight: 800, textTransform: 'uppercase', fontSize: 10 }}>
                  {activeLedger.period || 'Jan. 1, 2025 to Dec. 31, 2025'}
                </div>
                <div style={{ fontSize: 10, lineHeight: 1.5, fontFamily: 'Courier New, monospace' }}>
                  {(activeLedger.memo || []).map((m, idx) => (
                    <div key={idx} style={{ marginBottom: 4 }}>{m}</div>
                  ))}
                </div>
              </div>

              {/* Main Table Grid */}
              <div style={{ flex: 1, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '2px solid #111827', textAlign: 'center', fontWeight: 800, textTransform: 'uppercase', fontSize: 11 }}>
                      <th style={{ width: 100, borderRight: '1px solid #111827', padding: 6 }}>Date</th>
                      <th style={{ width: 110, borderRight: '1px solid #111827', padding: 6 }}>Reference</th>
                      <th style={{ borderRight: '1px solid #111827', padding: 6, letterSpacing: 1 }}>P A R T I C U L A R S</th>
                      <th style={{ width: 35, borderRight: '1px solid #111827', padding: 6 }}>F</th>
                      <th style={{ width: 100, borderRight: '1px solid #111827', padding: 6 }}>Debit</th>
                      <th style={{ width: 100, borderRight: '1px solid #111827', padding: 6 }}>Credit</th>
                      <th style={{ width: 110, padding: 6 }}>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedEntries.map((entry, index) => {
                      const isZeroBal = entry.balance === 0 && entry.particulars !== 'Forwarded Balance';
                      return (
                        <tr key={index} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
                          
                          {/* Date (Month & Day) */}
                          <td style={{ borderRight: '1px solid #111827', padding: '6px 8px', verticalAlign: 'top', fontWeight: 600 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#4B5563', fontSize: 10, fontWeight: 700 }}>{entry.month}</span>
                              <span style={{ color: '#111827' }}>{entry.day}</span>
                            </div>
                          </td>

                          {/* Reference Code */}
                          <td style={{ borderRight: '1px solid #111827', padding: '6px 8px', fontFamily: 'Courier New, monospace', fontWeight: 700, color: '#1E40AF', verticalAlign: 'top' }}>
                            {entry.reference}
                          </td>

                          {/* Particulars */}
                          <td style={{ borderRight: '1px solid #111827', padding: '6px 10px', color: '#111827', verticalAlign: 'top', fontWeight: 500 }}>
                            {entry.particulars}
                          </td>

                          {/* Folio / Checkmark */}
                          <td style={{ borderRight: '1px solid #111827', padding: '6px 4px', textAlign: 'center', color: '#059669', fontWeight: 700, verticalAlign: 'top' }}>
                            {entry.folio}
                          </td>

                          {/* Debit Column (Split Pesos & Centavos) */}
                          <td style={{ borderRight: '1px solid #111827', padding: '6px 8px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Courier New, monospace', fontWeight: 700, color: '#1E3A8A' }}>
                              <span>{formatPesos(entry.debit)}</span>
                              {entry.debit > 0 && <span style={{ borderLeft: '1px dotted #9CA3AF', paddingLeft: 4, color: '#4B5563' }}>{formatCents(entry.debit)}</span>}
                            </div>
                          </td>

                          {/* Credit Column (Split Pesos & Centavos) */}
                          <td style={{ borderRight: '1px solid #111827', padding: '6px 8px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Courier New, monospace', fontWeight: 700, color: '#065F46' }}>
                              <span>{formatPesos(entry.credit)}</span>
                              {entry.credit > 0 && <span style={{ borderLeft: '1px dotted #9CA3AF', paddingLeft: 4, color: '#4B5563' }}>{formatCents(entry.credit)}</span>}
                            </div>
                          </td>

                          {/* Balance Column */}
                          <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Courier New, monospace', fontWeight: 800 }}>
                              {isZeroBal ? (
                                <span style={{ width: '100%', textAlign: 'center', color: '#9CA3AF' }}>— 0 —</span>
                              ) : (
                                <>
                                  <span style={{ color: '#111827' }}>{entry.balance > 0 ? formatPesos(entry.balance) : ''}</span>
                                  {entry.balance > 0 && <span style={{ borderLeft: '1px dotted #9CA3AF', paddingLeft: 4, color: '#4B5563' }}>{formatCents(entry.balance)}</span>}
                                </>
                              )}
                            </div>
                            {entry.dateMarker && (
                              <div style={{ textAlign: 'right', fontSize: 9, color: '#6B7280', borderTop: '1px solid #E5E7EB', marginTop: 3, paddingTop: 1 }}>
                                {entry.dateMarker}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GENERAL JOURNAL ENTRIES */}
      {activeTab === 'journal' && (
        <div className="no-print">
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search size={14} className="search-input-icon" />
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search by JE No., reference, or description..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                Sort:
              </label>
              <select
                className="form-control"
                style={{ width: 175, padding: '6px 10px', fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'pointer' }}
                value={journalSortOrder}
                onChange={(e) => setJournalSortOrder(e.target.value)}
              >
                <option value="newest">Newest First (New to Old)</option>
                <option value="oldest">Oldest First (Old to New)</option>
              </select>
            </div>
          </div>

          {sortedJEs.length === 0 ? (
            <div className="card">
              <div className="grid-empty" style={{ padding: 64 }}>
                <div className="grid-empty-icon">📒</div>
                <div className="grid-empty-text">No Journal Entries</div>
                <div className="grid-empty-sub">Journal entries are automatically posted when DVs reach PAID status.</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sortedJEs.map((je) => {
                const jeDebits = je.lines.reduce((s, l) => s + (l.debit || 0), 0);
                const jeCredits = je.lines.reduce((s, l) => s + (l.credit || 0), 0);
                const isExpanded = expandedJE === je.id;
                return (
                  <div key={je.id} className="card">
                    <div
                      className="card-header"
                      onClick={() => setExpandedJE(isExpanded ? null : je.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                        <BookOpen size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 13 }}>{je.je_id}</span>
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: '1px 6px',
                              background: je.source === 'DV_AUTO_POST' ? '#EFF6FF' : '#F5F3FF',
                              color: je.source === 'DV_AUTO_POST' ? '#2563EB' : '#7C3AED',
                              borderRadius: 4,
                            }}>{je.source === 'DV_AUTO_POST' ? 'Auto-Post' : 'Manual'}</span>
                          </div>
                          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                            {je.description} · Ref: <span style={{ fontFamily: 'monospace' }}>{je.reference}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: '#6B7280' }}>DR / CR</div>
                          <div style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                            {formatCurrency(jeDebits)} / {formatCurrency(jeCredits)}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>{je.date}</div>
                        <span style={{ fontSize: 18, color: '#6B7280' }}>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: '0 20px 20px' }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12, marginTop: 12 }}>
                          Posted by {je.postedByName} · {formatDateTime(je.postedAt)}
                        </div>
                        <table className="je-lines">
                          <thead>
                            <tr>
                              <th>Account Code</th>
                              <th>Account Name</th>
                              <th style={{ textAlign: 'right' }}>Debit (DR)</th>
                              <th style={{ textAlign: 'right' }}>Credit (CR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {je.lines.map((line, i) => (
                              <tr key={i}>
                                <td>{line.account_code}</td>
                                <td className="account-name">{line.account_name}</td>
                                <td style={{ textAlign: 'right' }} className={line.debit > 0 ? 'debit' : 'zero'}>
                                  {line.debit > 0 ? formatCurrency(line.debit) : '—'}
                                </td>
                                <td style={{ textAlign: 'right' }} className={line.credit > 0 ? 'credit' : 'zero'}>
                                  {line.credit > 0 ? formatCurrency(line.credit) : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={2} style={{ textAlign: 'right', fontFamily: 'inherit', color: '#6B7280', fontSize: 12, fontWeight: 600 }}>TOTALS</td>
                              <td style={{ textAlign: 'right' }} className="debit">{formatCurrency(jeDebits)}</td>
                              <td style={{ textAlign: 'right' }} className="credit">{formatCurrency(jeCredits)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRIAL BALANCE / GENERAL LEDGER SUMMARY */}
      {activeTab === 'trial' && (
        <div className="no-print">
          <div className="data-grid-wrapper">
            <table className="data-grid">
              <thead>
                <tr>
                  <th>Account Code</th>
                  <th>Account Name</th>
                  <th>Type</th>
                  <th className="text-right">Total Debit</th>
                  <th className="text-right">Total Credit</th>
                  <th className="text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {enrichedBalances.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="grid-empty" style={{ padding: 48 }}>
                        <div className="grid-empty-icon">⚖️</div>
                        <div className="grid-empty-text">General Ledger is empty</div>
                        <div className="grid-empty-sub">No journal entries have been posted yet.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  enrichedBalances.map((b) => {
                    const isDebitNormal = b.normal === 'DEBIT';
                    const balance = isDebitNormal ? (b.totalDebit - b.totalCredit) : (b.totalCredit - b.totalDebit);
                    const typeColors = {
                      ASSET: '#2563EB', LIABILITY: '#DC2626',
                      EQUITY: '#7C3AED', REVENUE: '#059669', EXPENSE: '#D97706',
                    };
                    return (
                      <tr key={b.account_code}>
                        <td className="mono">{b.account_code}</td>
                        <td>{b.account_name}</td>
                        <td>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 8px',
                            background: `${typeColors[b.type]}18`, color: typeColors[b.type],
                            borderRadius: 4,
                          }}>{b.type}</span>
                        </td>
                        <td className="text-right mono">{b.totalDebit > 0 ? formatCurrency(b.totalDebit) : '—'}</td>
                        <td className="text-right mono">{b.totalCredit > 0 ? formatCurrency(b.totalCredit) : '—'}</td>
                        <td className="text-right mono" style={{ fontWeight: 700, color: balance >= 0 ? '#111827' : '#DC2626' }}>
                          {formatCurrency(Math.abs(balance))}
                          {balance < 0 && ' (Cr)'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {enrichedBalances.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right" style={{ fontWeight: 400, color: '#6B7280' }}>
                      Grand Totals ({enrichedBalances.length} accounts)
                    </td>
                    <td className="text-right mono" style={{ color: '#2563EB' }}>{formatCurrency(totalDebits)}</td>
                    <td className="text-right mono" style={{ color: '#059669' }}>{formatCurrency(totalCredits)}</td>
                    <td className="text-right">
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: '3px 10px',
                        background: ledgerHealth.healthy ? '#ECFDF5' : '#FEF2F2',
                        color: ledgerHealth.healthy ? '#059669' : '#DC2626',
                        borderRadius: 6,
                      }}>
                        {ledgerHealth.healthy ? '✓ Balanced' : '✕ Unbalanced'}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD LEDGER ENTRY FORM */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          title={`Add Entry to ${activeLedger?.accountOf}`}
          onClose={() => setIsAddModalOpen(false)}
        >
          <form onSubmit={handleAddEntryPreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Month</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. July"
                  value={newEntryData.month}
                  onChange={(e) => setNewEntryData({ ...newEntryData, month: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Day</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 15"
                  value={newEntryData.day}
                  onChange={(e) => setNewEntryData({ ...newEntryData, day: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2026"
                  value={newEntryData.year}
                  onChange={(e) => setNewEntryData({ ...newEntryData, year: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reference No. / Statement / OR <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. SA07-26-0485, 0171411 VAT"
                value={newEntryData.reference}
                onChange={(e) => setNewEntryData({ ...newEntryData, reference: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Particulars (Description) <span style={{ color: 'red' }}>*</span></label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="e.g. Electric Consumption - June 8 - July 7, 2026"
                value={newEntryData.particulars}
                onChange={(e) => setNewEntryData({ ...newEntryData, particulars: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Folio (F)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. pd, pd/, ✓"
                  value={newEntryData.folio}
                  onChange={(e) => setNewEntryData({ ...newEntryData, folio: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Debit Amount (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={newEntryData.debit}
                  onChange={(e) => setNewEntryData({ ...newEntryData, debit: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Credit Amount (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={newEntryData.credit}
                  onChange={(e) => setNewEntryData({ ...newEntryData, credit: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date Marker (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 7/31/26"
                value={newEntryData.dateMarker}
                onChange={(e) => setNewEntryData({ ...newEntryData, dateMarker: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Review & Add Entry
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CONFIRMATION MODAL: ADD LEDGER ENTRY */}
      {isConfirmEntryOpen && (
        <Modal
          isOpen={isConfirmEntryOpen}
          title="Confirm Ledger Entry"
          subtitle={`Posting new entry to ${activeLedger?.accountOf}`}
          size="md"
          onClose={() => setIsConfirmEntryOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setIsConfirmEntryOpen(false)}>
                Back / Edit
              </button>
              <button className="btn btn-primary" onClick={handleExecuteAddEntry}>
                <Check size={16} /> Confirm & Post Entry
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              padding: '14px 18px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Target Customer Account</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                  {activeLedger?.accountOf}
                </div>
                <div style={{ fontSize: 12, color: '#B91C1C', fontWeight: 700, fontFamily: 'Courier New, monospace' }}>
                  Symbol: {activeLedger?.accountSymbol} · Sheet #{activeLedger?.sheetNo}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Previous Bal: {formatCurrency(slCurrentBalance)}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#059669', fontFamily: 'JetBrains Mono, monospace' }}>
                  New Bal: {formatCurrency(Math.max(0, slCurrentBalance + (parseFloat(newEntryData.debit) || 0) - (parseFloat(newEntryData.credit) || 0)))}
                </div>
              </div>
            </div>

            <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600, width: '38%' }}>Date:</td>
                  <td style={{ padding: '8px 4px', fontWeight: 600, color: '#1E293B' }}>
                    {[newEntryData.month, newEntryData.day, newEntryData.year].filter(Boolean).join(' ') || 'Current Date'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Reference No.:</td>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#1E40AF', fontFamily: 'monospace' }}>
                    {newEntryData.reference}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Particulars:</td>
                  <td style={{ padding: '8px 4px', color: '#334155' }}>{newEntryData.particulars}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Folio:</td>
                  <td style={{ padding: '8px 4px', color: '#059669', fontWeight: 700 }}>{newEntryData.folio || '—'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Debit (DR):</td>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>
                    {newEntryData.debit ? formatCurrency(parseFloat(newEntryData.debit)) : '₱0.00'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Credit (CR):</td>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#065F46', fontFamily: 'monospace' }}>
                    {newEntryData.credit ? formatCurrency(parseFloat(newEntryData.credit)) : '₱0.00'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* MODAL: CREATE NEW CUSTOMER / TENANT SUBSIDIARY LEDGER */}
      {isCreateLedgerModalOpen && (
        <Modal
          isOpen={isCreateLedgerModalOpen}
          title="Create New Customer / Tenant Account Ledger (Form 63)"
          onClose={() => setIsCreateLedgerModalOpen(false)}
        >
          <form onSubmit={handleCreateLedgerPreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">
                Account of (Customer / Tenant / Entity Name) <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. BALLET PHILIPPINES FOUNDATION, INC."
                value={newLedgerForm.accountOf}
                onChange={(e) => setNewLedgerForm({ ...newLedgerForm, accountOf: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address / Office Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 4th Floor, CCP Main Building, Pasay City"
                value={newLedgerForm.address}
                onChange={(e) => setNewLedgerForm({ ...newLedgerForm, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">
                  Account Symbol <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 64, 102, T-05"
                  value={newLedgerForm.accountSymbol}
                  onChange={(e) => setNewLedgerForm({ ...newLedgerForm, accountSymbol: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sheet No.</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="01"
                  value={newLedgerForm.sheetNo}
                  onChange={(e) => setNewLedgerForm({ ...newLedgerForm, sheetNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Balance (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={newLedgerForm.initialBalance}
                  onChange={(e) => setNewLedgerForm({ ...newLedgerForm, initialBalance: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Accounting Period</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Jan. 1, 2026 to Dec. 31, 2026"
                value={newLedgerForm.period}
                onChange={(e) => setNewLedgerForm({ ...newLedgerForm, period: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rental / Billing Memorandum & Rates (One line per note)</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder={"Rental 500,000.00\ngarbage 1,500.00\nTOTAL 501,500.00\ndue every 5th of the month"}
                value={newLedgerForm.memo}
                onChange={(e) => setNewLedgerForm({ ...newLedgerForm, memo: e.target.value })}
              />
              <span style={{ fontSize: 11, color: '#6B7280', marginTop: 4, display: 'block' }}>
                These rates appear in the left memo stamp box on CCP Form 63.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsCreateLedgerModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Review & Create Ledger
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CONFIRMATION MODAL: CREATE NEW CUSTOMER SUBSIDIARY LEDGER */}
      {isConfirmCreateLedgerOpen && (
        <Modal
          isOpen={isConfirmCreateLedgerOpen}
          title="Confirm New Customer / Tenant Ledger"
          subtitle="Please confirm the customer bookkeeping details before initializing."
          size="md"
          onClose={() => setIsConfirmCreateLedgerOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setIsConfirmCreateLedgerOpen(false)}>
                Back / Edit
              </button>
              <button className="btn btn-primary" onClick={handleExecuteCreateLedger}>
                <Check size={16} /> Confirm & Create Ledger
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              padding: '14px 18px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Tenant / Customer Name</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                  {newLedgerForm.accountOf}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>ACCOUNT SYMBOL</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#B91C1C', fontFamily: 'Courier New, monospace' }}>
                  {newLedgerForm.accountSymbol}
                </div>
              </div>
            </div>

            <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600, width: '38%' }}>Address:</td>
                  <td style={{ padding: '8px 4px', color: '#334155' }}>{newLedgerForm.address || '—'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Sheet No.:</td>
                  <td style={{ padding: '8px 4px', fontWeight: 600, color: '#1E293B' }}>{newLedgerForm.sheetNo || '01'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Accounting Period:</td>
                  <td style={{ padding: '8px 4px', color: '#334155' }}>{newLedgerForm.period}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Initial Balance:</td>
                  <td style={{ padding: '8px 4px', fontWeight: 700, color: '#059669', fontFamily: 'monospace' }}>
                    {formatCurrency(parseFloat(newLedgerForm.initialBalance) || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
