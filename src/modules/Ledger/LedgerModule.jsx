import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, AlertTriangle, BookOpen } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { computeAccountBalances, verifyLedgerHealth } from '../../utils/ledgerEngine';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { CHART_OF_ACCOUNTS } from '../../data/seedData';

export default function LedgerModule() {
  const { state } = useApp();
  const { journalEntries } = state;
  const [activeTab, setActiveTab] = useState('journal');
  const [searchText, setSearchText] = useState('');
  const [expandedJE, setExpandedJE] = useState(null);

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

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-title">Credit & Collections</div>
          <div className="page-subtitle">
            General Ledger · Subsidiary Ledger Entries & Double-Entry Bookkeeping
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px',
          background: ledgerHealth.healthy ? '#ECFDF5' : '#FEF2F2',
          border: `1px solid ${ledgerHealth.healthy ? '#A7F3D0' : '#FECACA'}`,
          borderRadius: 10, fontSize: 13, fontWeight: 700,
          color: ledgerHealth.healthy ? '#065F46' : '#991B1B',
        }}>
          {ledgerHealth.healthy ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
          {ledgerHealth.healthy
            ? `Ledger Balanced · ${journalEntries.length} JEs`
            : `${ledgerHealth.errors.length} Discrepancy Detected`}
        </div>
      </div>

      {!ledgerHealth.healthy && (
        <div className="alert alert-danger mb-4">
          <AlertTriangle size={16} className="alert-icon" />
          <div className="alert-text">
            <div className="alert-title">Ledger Integrity Errors</div>
            {ledgerHealth.errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        </div>
      )}

      <div className="tabs">
        {[
          { id: 'journal', label: 'Journal Entries' },
          { id: 'trial', label: 'Subsidiary Ledger Entries' },
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

      {activeTab === 'journal' && (
        <>
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search size={14} className="search-input-icon" />
              <input type="text" className="form-control search-input"
                placeholder="Search by JE No., reference, or description..."
                value={searchText} onChange={(e) => setSearchText(e.target.value)} />
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
        </>
      )}

      {activeTab === 'trial' && (
        <>
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
                        <div className="grid-empty-text">Subsidiary Ledger is empty</div>
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
        </>
      )}
    </div>
  );
}
