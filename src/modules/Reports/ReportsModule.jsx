import React, { useState, useMemo } from 'react';
import { Printer, FileText, BarChart2, ClipboardList } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { computeAccountBalances, verifyLedgerHealth } from '../../utils/ledgerEngine';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { CHART_OF_ACCOUNTS, FUND_CLUSTERS } from '../../data/seedData';

export default function ReportsModule() {
  const { state } = useApp();
  const { burs, dvs, journalEntries, auditLog, allotments } = state;
  const [activeReport, setActiveReport] = useState('sbu');

  const allLines = useMemo(() =>
    journalEntries.flatMap((je) => je.lines.map((l) => ({ ...l, je_id: je.je_id }))),
    [journalEntries]
  );
  const accountBalances = useMemo(() => computeAccountBalances(allLines), [allLines]);
  const ledgerHealth = useMemo(() => verifyLedgerHealth(journalEntries), [journalEntries]);

  const enrichedBalances = accountBalances.map((b) => {
    const coa = CHART_OF_ACCOUNTS.find((a) => a.code === b.account_code);
    return { ...b, type: coa?.type || 'UNKNOWN', normal: coa?.normal || 'DEBIT' };
  }).sort((a, b) => a.account_code.localeCompare(b.account_code));

  const REPORTS = [
    { id: 'sbu', label: 'Statement of Budget Utilization', icon: BarChart2 },
    { id: 'perf', label: 'Statement of Financial Performance', icon: FileText },
    { id: 'trial', label: 'Trial Balance', icon: FileText },
    { id: 'audit', label: 'Audit Summary', icon: ClipboardList },
  ];

  const handlePrint = () => window.print();

  const PrintHeader = ({ title, subtitle }) => (
    <div className="print-header" style={{
      borderBottom: '2px solid #111827',
      paddingBottom: 16, marginBottom: 24,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>
        REPUBLIC OF THE PHILIPPINES
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '4px 0' }}>
        CULTURAL CENTER OF THE PHILIPPINES
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        Finance Division — Financial Management System
      </div>
      <div style={{
        margin: '12px 0 4px',
        fontSize: 16, fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.05em', color: '#D4AF37',
      }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: '#6B7280' }}>{subtitle}</div>}
      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>
        Generated: {new Date().toLocaleString('en-PH')} · FY 2026
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="page-header no-print">
        <div className="page-header-info">
          <div className="page-title">Financial Reports</div>
          <div className="page-subtitle">Official financial reporting generators</div>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={14} /> Print Report
        </button>
      </div>

      {/* Report Selector */}
      <div className="card no-print mb-6" style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {REPORTS.map((report, i) => (
            <div
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 20px', cursor: 'pointer',
                background: activeReport === report.id ? 'rgba(212,175,55,0.06)' : 'white',
                borderRight: i < REPORTS.length - 1 ? '1px solid #E5E7EB' : 'none',
                borderBottom: activeReport === report.id ? `3px solid #D4AF37` : '3px solid transparent',
                transition: 'all 150ms',
              }}
            >
              <report.icon size={20} style={{ color: activeReport === report.id ? '#D4AF37' : '#6B7280' }} />
              <span style={{
                fontWeight: activeReport === report.id ? 700 : 500,
                color: activeReport === report.id ? '#111827' : '#6B7280',
                fontSize: 13,
              }}>{report.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ====== STATEMENT OF BUDGET UTILIZATION ====== */}
      {activeReport === 'sbu' && (
        <div id="report-content">
          <PrintHeader
            title="Statement of Budget Utilization"
            subtitle={`As of ${formatDate(new Date().toISOString())}`}
          />
          {FUND_CLUSTERS.map((fc) => {
            const fcAllot = allotments[fc.code];
            const fcBURs = burs.filter((b) => b.fundCluster === fc.code);
            return (
              <div key={fc.code} style={{ marginBottom: 32 }}>
                <div style={{
                  background: '#F9FAFB', padding: '10px 16px',
                  borderLeft: '4px solid #D4AF37', marginBottom: 12,
                  fontSize: 13, fontWeight: 700,
                }}>
                  Fund Cluster {fc.code} — {fc.name}
                </div>
                <div className="data-grid-wrapper">
                  <table className="data-grid">
                    <thead>
                      <tr>
                        <th>Allotment Class</th>
                        <th className="text-right">Total Allotment</th>
                        <th className="text-right">Total Obligated</th>
                        <th className="text-right">Total Disbursed</th>
                        <th className="text-right">Unobligated Balance</th>
                        <th className="text-right">Utilization %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(fcAllot).map(([cls, val]) => {
                        const unobligated = val.total - val.obligated;
                        const pct = val.total > 0 ? ((val.obligated / val.total) * 100).toFixed(2) : '0.00';
                        return (
                          <tr key={cls}>
                            <td style={{ fontWeight: 700 }}>{cls}</td>
                            <td className="text-right mono">{formatCurrency(val.total)}</td>
                            <td className="text-right mono" style={{ color: '#D97706' }}>{formatCurrency(val.obligated)}</td>
                            <td className="text-right mono" style={{ color: '#059669' }}>{formatCurrency(val.disbursed)}</td>
                            <td className="text-right mono" style={{ color: unobligated < 0 ? '#DC2626' : '#111827' }}>
                              {formatCurrency(unobligated)}
                            </td>
                            <td className="text-right">
                              <span style={{
                                fontWeight: 700,
                                color: parseFloat(pct) > 80 ? '#DC2626' : parseFloat(pct) > 60 ? '#D97706' : '#059669',
                              }}>{pct}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td style={{ fontWeight: 700, color: '#6B7280' }}>TOTAL FC-{fc.code}</td>
                        <td className="text-right mono">{formatCurrency(Object.values(fcAllot).reduce((s, v) => s + v.total, 0))}</td>
                        <td className="text-right mono" style={{ color: '#D97706' }}>{formatCurrency(Object.values(fcAllot).reduce((s, v) => s + v.obligated, 0))}</td>
                        <td className="text-right mono" style={{ color: '#059669' }}>{formatCurrency(Object.values(fcAllot).reduce((s, v) => s + v.disbursed, 0))}</td>
                        <td className="text-right mono">{formatCurrency(Object.values(fcAllot).reduce((s, v) => s + v.total - v.obligated, 0))}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {fcBURs.length > 0 && (
                  <>
                    <div style={{ marginTop: 16, marginBottom: 8, fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
                      BUR Transactions — FC {fc.code}
                    </div>
                    <div className="data-grid-wrapper">
                      <table className="data-grid">
                        <thead>
                          <tr>
                            <th>BUR No.</th>
                            <th>Responsibility Center</th>
                            <th>MFO/PAP</th>
                            <th>Allotment Class</th>
                            <th className="text-right">Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fcBURs.map((bur) => (
                            <tr key={bur.id}>
                              <td className="mono">{bur.burNo}</td>
                              <td style={{ fontSize: 12 }}>{bur.responsibilityCenter}</td>
                              <td style={{ fontSize: 12, color: '#6B7280' }}>{bur.mfoPap}</td>
                              <td><span style={{ fontWeight: 700, fontSize: 11 }}>{bur.allotmentClass}</span></td>
                              <td className="text-right mono" style={{ fontWeight: 700 }}>{formatCurrency(bur.amount)}</td>
                              <td style={{ fontSize: 11, fontWeight: 600, color: bur.status === 'OBLIGATED' ? '#059669' : bur.status === 'REJECTED' ? '#DC2626' : '#D97706' }}>
                                {bur.status}
                              </td>
                              <td style={{ fontSize: 11, color: '#6B7280' }}>{formatDate(bur.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ====== STATEMENT OF FINANCIAL PERFORMANCE ====== */}
      {activeReport === 'perf' && (
        <div id="report-content">
          <PrintHeader
            title="Statement of Financial Performance"
            subtitle={`For the Period Ended ${formatDate(new Date().toISOString())} · FY 2026`}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Revenue */}
            <div className="card">
              <div className="card-header" style={{ background: '#ECFDF5', borderBottom: '1px solid #A7F3D0' }}>
                <div className="card-title" style={{ color: '#065F46' }}>Revenue / Operating Income</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontSize: 13 }}>
                  <span>Subsidy from National Government (GAA)</span>
                  <span className="mono" style={{ fontWeight: 700 }}>{formatCurrency(98500000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontSize: 13 }}>
                  <span>Income from Cultural Performances & Ticket Sales</span>
                  <span className="mono" style={{ fontWeight: 700 }}>{formatCurrency(18500000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontSize: 13 }}>
                  <span>Rental Income — CCP Complex & Facilities</span>
                  <span className="mono" style={{ fontWeight: 700 }}>{formatCurrency(12400000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontWeight: 800, fontSize: 14 }}>
                  <span>TOTAL REVENUE</span>
                  <span className="mono" style={{ color: '#059669' }}>{formatCurrency(129400000)}</span>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="card">
              <div className="card-header" style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA' }}>
                <div className="card-title" style={{ color: '#991B1B' }}>Operating Expenses</div>
              </div>
              <div className="card-body">
                {(() => {
                  const totalExp = enrichedBalances.filter(b => b.type === 'EXPENSE').reduce((s, b) => s + b.totalDebit, 0);
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontSize: 13 }}>
                        <span>Janitorial & Security General Services</span>
                        <span className="mono" style={{ fontWeight: 700 }}>{formatCurrency(totalExp || 11498489.52)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontSize: 13 }}>
                        <span>IT Hosting & Technical Maintenance Services</span>
                        <span className="mono" style={{ fontWeight: 700 }}>{formatCurrency(200750)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontSize: 13 }}>
                        <span>Utilities, Electricity & Water Expenses</span>
                        <span className="mono" style={{ fontWeight: 700 }}>{formatCurrency(850000)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontWeight: 800, fontSize: 14 }}>
                        <span>TOTAL EXPENSES</span>
                        <span className="mono" style={{ color: '#DC2626' }}>{formatCurrency((totalExp || 11498489.52) + 200750 + 850000)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== TRIAL BALANCE ====== */}
      {activeReport === 'trial' && (
        <div id="report-content">
          <PrintHeader
            title="Trial Balance"
            subtitle={`As of ${formatDate(new Date().toISOString())} · ${journalEntries.length} journal entries`}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '10px 16px',
            background: ledgerHealth.healthy ? '#ECFDF5' : '#FEF2F2',
            border: `1px solid ${ledgerHealth.healthy ? '#A7F3D0' : '#FECACA'}`,
            borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 700,
            color: ledgerHealth.healthy ? '#065F46' : '#991B1B',
          }}>
            <span>{ledgerHealth.healthy ? '✓ Ledger is Balanced' : '✕ Ledger Discrepancy Detected'}</span>
            <span>{journalEntries.length} Journal Entries Verified</span>
          </div>
          <div className="data-grid-wrapper">
            <table className="data-grid">
              <thead>
                <tr>
                  <th>Account Code</th>
                  <th>Account Name</th>
                  <th>Account Type</th>
                  <th className="text-right">Debit (₱)</th>
                  <th className="text-right">Credit (₱)</th>
                </tr>
              </thead>
              <tbody>
                {enrichedBalances.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>No transactions posted.</td></tr>
                ) : (
                  enrichedBalances.map((b) => (
                    <tr key={b.account_code}>
                      <td className="mono">{b.account_code}</td>
                      <td>{b.account_name}</td>
                      <td style={{ fontSize: 11, fontWeight: 600 }}>{b.type}</td>
                      <td className="text-right mono">{b.totalDebit > 0 ? formatCurrency(b.totalDebit) : '—'}</td>
                      <td className="text-right mono">{b.totalCredit > 0 ? formatCurrency(b.totalCredit) : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {enrichedBalances.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right" style={{ color: '#6B7280' }}>GRAND TOTALS</td>
                    <td className="text-right mono" style={{ color: '#2563EB' }}>{formatCurrency(enrichedBalances.reduce((s, b) => s + b.totalDebit, 0))}</td>
                    <td className="text-right mono" style={{ color: '#059669' }}>{formatCurrency(enrichedBalances.reduce((s, b) => s + b.totalCredit, 0))}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* ====== AUDIT SUMMARY ====== */}
      {activeReport === 'audit' && (
        <div id="report-content">
          <PrintHeader
            title="Audit Summary Report"
            subtitle={`${auditLog.length} total audit entries · Period: FY 2026`}
          />
          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {['CREATE', 'CERTIFY', 'PAID', 'REJECT'].map((action) => {
              const count = auditLog.filter((e) => e.action_type === action).length;
              const colors = { CREATE: '#2563EB', CERTIFY: '#059669', PAID: '#065F46', REJECT: '#DC2626' };
              return (
                <div key={action} style={{
                  padding: 16, background: 'white', border: '1px solid #E5E7EB',
                  borderRadius: 8, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: colors[action] }}>{count}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, marginTop: 4 }}>{action} actions</div>
                </div>
              );
            })}
          </div>
          <div className="data-grid-wrapper">
            <table className="data-grid">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Module</th>
                  <th>Action</th>
                  <th>Document Reference</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.slice().reverse().map((entry) => (
                  <tr key={entry.log_id}>
                    <td className="mono" style={{ fontSize: 11 }}>{entry.log_id}</td>
                    <td style={{ fontSize: 11, color: '#6B7280' }}>{formatDateTime(entry.timestamp)}</td>
                    <td style={{ fontSize: 12 }}>{entry.actor_name}</td>
                    <td style={{ fontSize: 11, fontWeight: 600 }}>{entry.module}</td>
                    <td style={{ fontSize: 11, fontWeight: 700 }}>{entry.action_type}</td>
                    <td className="mono" style={{ fontSize: 11 }}>{entry.document_ref || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
