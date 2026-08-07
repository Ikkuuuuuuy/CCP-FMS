import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, AlertTriangle, BookOpen, Printer, Plus, FileText, UserCheck, Calendar, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { computeAccountBalances, verifyLedgerHealth } from '../../utils/ledgerEngine';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { CHART_OF_ACCOUNTS } from '../../data/seedData';
import Modal from '../../components/Modal';
import SubsidiaryLedgerPrintTemplate from '../../components/Print/SubsidiaryLedgerPrintTemplate';

export default function LedgerModule() {
  const { state, dispatch } = useApp();
  const { journalEntries, subsidiaryLedgers = [] } = state;

  const [activeTab, setActiveTab] = useState('subsidiary'); // default to subsidiary to immediately show CCP form
  const [selectedLedgerId, setSelectedLedgerId] = useState('SL-063'); // default to Philippine Sailing Association
  const [searchText, setSearchText] = useState('');
  const [expandedJE, setExpandedJE] = useState(null);
  
  // Modal for adding a new entry
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const totalDebits = enrichedBalances.reduce((s, b) => s + b.totalDebit, 0);
  const totalCredits = enrichedBalances.reduce((s, b) => s + b.totalCredit, 0);

  // Subsidiary summary stats
  const activeEntries = activeLedger?.entries || [];
  const slTotalDebit = activeEntries.reduce((s, e) => s + (e.debit || 0), 0);
  const slTotalCredit = activeEntries.reduce((s, e) => s + (e.credit || 0), 0);
  const slCurrentBalance = activeEntries.length > 0 ? activeEntries[activeEntries.length - 1].balance : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleAddEntrySubmit = (e) => {
    e.preventDefault();
    try {
      dispatch({
        type: 'SUBSIDIARY_ENTRY_ADD',
        payload: {
          ledgerId: activeLedger.id,
          entryData: newEntryData,
        },
      });
      setIsAddModalOpen(false);
      setNewEntryData({
        month: '', day: '', year: '', reference: '', particulars: '', folio: 'pd', debit: '', credit: '', dateMarker: ''
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 300 }}>
                <UserCheck size={18} style={{ color: 'var(--color-primary)' }} />
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', display: 'block', marginBottom: 4 }}>
                    Select Customer / Tenant Account Ledger:
                  </label>
                  <select
                    className="form-control"
                    style={{ fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                    value={selectedLedgerId}
                    onChange={(e) => setSelectedLedgerId(e.target.value)}
                  >
                    {subsidiaryLedgers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.accountOf} — (Account Symbol: {l.accountSymbol}, Sheet #{l.sheetNo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', gap: 24, padding: '8px 16px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
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
                    {activeEntries.map((entry, index) => {
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
          </div>

          {filteredJEs.length === 0 ? (
            <div className="card">
              <div className="grid-empty" style={{ padding: 64 }}>
                <div className="grid-empty-icon">📒</div>
                <div className="grid-empty-text">No Journal Entries</div>
                <div className="grid-empty-sub">Journal entries are automatically posted when DVs reach PAID status.</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredJEs.slice().reverse().map((je) => {
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

      {/* MODAL: ADD LEDGER ENTRY */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          title={`Add Entry to ${activeLedger?.accountOf}`}
          onClose={() => setIsAddModalOpen(false)}
        >
          <form onSubmit={handleAddEntrySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                  placeholder="e.g. 2025"
                  value={newEntryData.year}
                  onChange={(e) => setNewEntryData({ ...newEntryData, year: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reference No. / Statement / OR</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. SA07-25-0485, 0171411 VAT"
                value={newEntryData.reference}
                onChange={(e) => setNewEntryData({ ...newEntryData, reference: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Particulars (Description)</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="e.g. Electric Consumption - June 8 - July 7, 2025"
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
                placeholder="e.g. 7/31/25"
                value={newEntryData.dateMarker}
                onChange={(e) => setNewEntryData({ ...newEntryData, dateMarker: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Entry
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
