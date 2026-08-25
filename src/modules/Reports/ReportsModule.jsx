import React, { useState, useMemo } from 'react';
import { Printer, FileText, BarChart2, ClipboardList, ShieldCheck } from 'lucide-react';
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

  // Government & CCP Official Print Header Component
  const PrintHeader = ({ title, subtitle }) => (
    <div className="report-print-header" style={{
      borderBottom: '2px solid #111827',
      paddingBottom: 14,
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img
          src="/favicon.png"
          alt="CCP Official Logo"
          style={{ width: 64, height: 64, objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4B5563', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Republic of the Philippines
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#111827', letterSpacing: '0.02em', textTransform: 'uppercase', margin: '2px 0' }}>
            Cultural Center of the Philippines
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
            Financial Services Department — Financial Management System (CCP-FMS)
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: 16,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: '#8C1515'
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', marginTop: 2 }}>
            {subtitle}
          </div>
        )}
        <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 4 }}>
          Generated: {new Date().toLocaleString('en-PH')} · FY 2026
        </div>
      </div>
    </div>
  );

  // Official Signatory Block Component
  const ReportSignatories = () => (
    <div className="report-signatories" style={{
      marginTop: 36,
      paddingTop: 20,
      borderTop: '1px solid #D1D5DB',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24,
      pageBreakInside: 'avoid'
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: 36 }}>
          Prepared By:
        </div>
        <div style={{ fontWeight: 800, fontSize: 13, borderBottom: '1px solid #111827', paddingBottom: 4, color: '#111827' }}>
          JUAN DELA CRUZ
        </div>
        <div style={{ fontSize: 11, color: '#4B5563', marginTop: 3 }}>
          Bookkeeper / Financial Analyst
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: 36 }}>
          Certified Correct:
        </div>
        <div style={{ fontWeight: 800, fontSize: 13, borderBottom: '1px solid #111827', paddingBottom: 4, color: '#111827' }}>
          LOURDES S. MENDOZA
        </div>
        <div style={{ fontSize: 11, color: '#4B5563', marginTop: 3 }}>
          Chief Accountant / Dept. Manager III, FSD
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: 36 }}>
          Approved By:
        </div>
        <div style={{ fontWeight: 800, fontSize: 13, borderBottom: '1px solid #111827', paddingBottom: 4, color: '#111827' }}>
          KAYE C. TINGA
        </div>
        <div style={{ fontSize: 11, color: '#4B5563', marginTop: 3 }}>
          President, Cultural Center of the Philippines
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="page-header no-print">
        <div className="page-header-info">
          <div className="page-title">Financial Reports</div>
          <div className="page-subtitle">Official financial reporting generators & COA print outputs</div>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={15} />
          <span>Print Official Report</span>
        </button>
      </div>

      {/* Sleek Report Selector Dropdown Bar */}
      <div className="card no-print mb-6" style={{ padding: '16px 20px', background: '#FFFFFF', border: '1px solid #E8E2D9' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #8C1515, #7A1010)',
              color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(140,21,21,0.25)'
            }}>
              {React.createElement(REPORTS.find(r => r.id === activeReport)?.icon || FileText, { size: 20 })}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8C1515', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Active Report Module
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>
                {REPORTS.find(r => r.id === activeReport)?.label}
              </div>
            </div>
          </div>

          <div style={{ minWidth: '320px', flex: 1, maxWidth: '450px' }}>
            <select
              value={activeReport}
              onChange={(e) => setActiveReport(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#1A1209',
                backgroundColor: '#FDFBF7',
                border: '1.5px solid #BFA046',
                borderRadius: '8px',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 2px 6px rgba(191, 160, 70, 0.15)'
              }}
            >
              {REPORTS.map((r) => (
                <option key={r.id} value={r.id}>
                  📊 {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Report Print Sheet */}
      <div className="report-print-container" style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 8 }}>
        
        {/* ====== 1. STATEMENT OF BUDGET UTILIZATION ====== */}
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
                <div key={fc.code} className="report-section" style={{ marginBottom: 28 }}>
                  <div style={{
                    background: '#F3F4F6',
                    padding: '8px 14px',
                    borderLeft: '4px solid #8C1515',
                    borderTop: '1px solid #E5E7EB',
                    borderRight: '1px solid #E5E7EB',
                    borderBottom: '1px solid #E5E7EB',
                    marginBottom: 10,
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#111827'
                  }}>
                    Fund Cluster {fc.code} — {fc.name}
                  </div>

                  <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB' }}>
                        <th style={{ textAlign: 'left', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800, color: '#374151' }}>Allotment Class</th>
                        <th style={{ textAlign: 'right', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800, color: '#374151' }}>Total Allotment</th>
                        <th style={{ textAlign: 'right', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800, color: '#374151' }}>Total Obligated</th>
                        <th style={{ textAlign: 'right', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800, color: '#374151' }}>Total Disbursed</th>
                        <th style={{ textAlign: 'right', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800, color: '#374151' }}>Unobligated Balance</th>
                        <th style={{ textAlign: 'right', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800, color: '#374151' }}>Utilization %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(fcAllot).map(([cls, val]) => {
                        const unobligated = val.total - val.obligated;
                        const pct = val.total > 0 ? ((val.obligated / val.total) * 100).toFixed(2) : '0.00';
                        return (
                          <tr key={cls}>
                            <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', fontWeight: 700 }}>{cls}</td>
                            <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(val.total)}</td>
                            <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', textAlign: 'right', fontFamily: 'monospace', color: '#B45309' }}>{formatCurrency(val.obligated)}</td>
                            <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', textAlign: 'right', fontFamily: 'monospace', color: '#047857' }}>{formatCurrency(val.disbursed)}</td>
                            <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', textAlign: 'right', fontFamily: 'monospace', color: unobligated < 0 ? '#DC2626' : '#111827' }}>
                              {formatCurrency(unobligated)}
                            </td>
                            <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', textAlign: 'right', fontWeight: 700 }}>
                              {pct}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#F3F4F6', fontWeight: 800 }}>
                        <td style={{ padding: '8px 10px', border: '1px solid #D1D5DB', borderTop: '2px solid #111827', borderBottom: '3px double #111827' }}>TOTAL FC-{fc.code}</td>
                        <td style={{ padding: '8px 10px', border: '1px solid #D1D5DB', borderTop: '2px solid #111827', borderBottom: '3px double #111827', textAlign: 'right', fontFamily: 'monospace' }}>
                          {formatCurrency(Object.values(fcAllot).reduce((s, v) => s + v.total, 0))}
                        </td>
                        <td style={{ padding: '8px 10px', border: '1px solid #D1D5DB', borderTop: '2px solid #111827', borderBottom: '3px double #111827', textAlign: 'right', fontFamily: 'monospace', color: '#B45309' }}>
                          {formatCurrency(Object.values(fcAllot).reduce((s, v) => s + v.obligated, 0))}
                        </td>
                        <td style={{ padding: '8px 10px', border: '1px solid #D1D5DB', borderTop: '2px solid #111827', borderBottom: '3px double #111827', textAlign: 'right', fontFamily: 'monospace', color: '#047857' }}>
                          {formatCurrency(Object.values(fcAllot).reduce((s, v) => s + v.disbursed, 0))}
                        </td>
                        <td style={{ padding: '8px 10px', border: '1px solid #D1D5DB', borderTop: '2px solid #111827', borderBottom: '3px double #111827', textAlign: 'right', fontFamily: 'monospace' }}>
                          {formatCurrency(Object.values(fcAllot).reduce((s, v) => s + v.total - v.obligated, 0))}
                        </td>
                        <td style={{ padding: '8px 10px', border: '1px solid #D1D5DB', borderTop: '2px solid #111827', borderBottom: '3px double #111827' }} />
                      </tr>
                    </tfoot>
                  </table>

                  {fcBURs.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: '#4B5563' }}>
                        BUR Transactions Breakdown — FC {fc.code}
                      </div>
                      <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F9FAFB' }}>
                            <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>BUR No.</th>
                            <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Responsibility Center</th>
                            <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>MFO/PAP</th>
                            <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Class</th>
                            <th style={{ textAlign: 'right', padding: '6px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Amount</th>
                            <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '6px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fcBURs.map((bur) => (
                            <tr key={bur.id}>
                              <td style={{ padding: '5px 8px', border: '1px solid #E5E7EB', fontFamily: 'monospace', fontSize: 11.5 }}>{bur.burNo}</td>
                              <td style={{ padding: '5px 8px', border: '1px solid #E5E7EB', fontSize: 11.5 }}>{bur.responsibilityCenter}</td>
                              <td style={{ padding: '5px 8px', border: '1px solid #E5E7EB', fontSize: 11.5, color: '#4B5563' }}>{bur.mfoPap}</td>
                              <td style={{ padding: '5px 8px', border: '1px solid #E5E7EB', fontSize: 11.5, fontWeight: 700 }}>{bur.allotmentClass}</td>
                              <td style={{ padding: '5px 8px', border: '1px solid #E5E7EB', textAlign: 'right', fontFamily: 'monospace', fontSize: 11.5, fontWeight: 700 }}>
                                {formatCurrency(bur.amount)}
                              </td>
                              <td style={{ padding: '5px 8px', border: '1px solid #E5E7EB', fontSize: 11, fontWeight: 700, color: bur.status === 'OBLIGATED' ? '#047857' : bur.status === 'REJECTED' ? '#DC2626' : '#B45309' }}>
                                {bur.status}
                              </td>
                              <td style={{ padding: '5px 8px', border: '1px solid #E5E7EB', fontSize: 11, color: '#4B5563' }}>{formatDate(bur.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}

            <ReportSignatories />
          </div>
        )}

        {/* ====== 2. STATEMENT OF FINANCIAL PERFORMANCE ====== */}
        {activeReport === 'perf' && (
          <div id="report-content">
            <PrintHeader
              title="Statement of Financial Performance"
              subtitle={`For the Period Ended ${formatDate(new Date().toISOString())} · FY 2026`}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              {/* Revenue */}
              <div className="report-card" style={{ border: '1px solid #D1D5DB', borderRadius: 6, overflow: 'hidden' }}>
                <div className="report-card-header" style={{ background: '#ECFDF5', borderBottom: '1px solid #A7F3D0', padding: '10px 14px' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#065F46' }}>REVENUE & OPERATING INCOME</div>
                </div>
                <div className="report-card-body" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: 12.5 }}>
                    <span>Subsidy from National Government (GAA)</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(98500000)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: 12.5 }}>
                    <span>Income from Cultural Performances & Ticket Sales</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(18500000)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: 12.5 }}>
                    <span>Rental Income — CCP Complex & Facilities</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(12400000)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontWeight: 800, fontSize: 13.5, borderTop: '2px solid #111827', marginTop: 10 }}>
                    <span>TOTAL OPERATING REVENUE</span>
                    <span style={{ fontFamily: 'monospace', color: '#047857' }}>{formatCurrency(129400000)}</span>
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className="report-card" style={{ border: '1px solid #D1D5DB', borderRadius: 6, overflow: 'hidden' }}>
                <div className="report-card-header" style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA', padding: '10px 14px' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#991B1B' }}>OPERATING EXPENSES</div>
                </div>
                <div className="report-card-body" style={{ padding: '14px' }}>
                  {(() => {
                    const totalExp = enrichedBalances.filter(b => b.type === 'EXPENSE').reduce((s, b) => s + b.totalDebit, 0);
                    const totalExpensesVal = (totalExp || 11498489.52) + 200750 + 850000;
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: 12.5 }}>
                          <span>Janitorial & Security General Services</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(totalExp || 11498489.52)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: 12.5 }}>
                          <span>IT Hosting & Technical Maintenance Services</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(200750)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: 12.5 }}>
                          <span>Utilities, Electricity & Water Expenses</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{formatCurrency(850000)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontWeight: 800, fontSize: 13.5, borderTop: '2px solid #111827', marginTop: 10 }}>
                          <span>TOTAL OPERATING EXPENSES</span>
                          <span style={{ fontFamily: 'monospace', color: '#DC2626' }}>{formatCurrency(totalExpensesVal)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Net Surplus Summary Bar */}
            <div style={{
              padding: '12px 18px',
              background: '#F3F4F6',
              border: '2px solid #111827',
              borderRadius: 6,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 800,
              fontSize: 14,
              marginBottom: 20
            }}>
              <span>NET OPERATING SURPLUS / (DEFICIT) FOR THE PERIOD</span>
              <span style={{ fontFamily: 'monospace', fontSize: 16, color: '#047857' }}>
                {formatCurrency(129400000 - ((enrichedBalances.filter(b => b.type === 'EXPENSE').reduce((s, b) => s + b.totalDebit, 0) || 11498489.52) + 200750 + 850000))}
              </span>
            </div>

            <ReportSignatories />
          </div>
        )}

        {/* ====== 3. TRIAL BALANCE ====== */}
        {activeReport === 'trial' && (
          <div id="report-content">
            <PrintHeader
              title="Trial Balance"
              subtitle={`As of ${formatDate(new Date().toISOString())} · ${journalEntries.length} General Journal Entries`}
            />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 14px',
              background: ledgerHealth.healthy ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${ledgerHealth.healthy ? '#A7F3D0' : '#FECACA'}`,
              borderRadius: 6,
              marginBottom: 14,
              fontSize: 12,
              fontWeight: 700,
              color: ledgerHealth.healthy ? '#065F46' : '#991B1B',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} />
                {ledgerHealth.healthy ? 'COA Verified: General Ledger is in Strict Balance (Debits = Credits)' : 'Ledger Discrepancy Detected'}
              </span>
              <span>{journalEntries.length} General Journal Entries Audited</span>
            </div>

            <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th style={{ textAlign: 'left', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800 }}>Account Code</th>
                  <th style={{ textAlign: 'left', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800 }}>Account Title / Particulars</th>
                  <th style={{ textAlign: 'left', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800 }}>Account Type</th>
                  <th style={{ textAlign: 'right', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800 }}>Debit (₱)</th>
                  <th style={{ textAlign: 'right', padding: '8px 10px', border: '1px solid #D1D5DB', fontWeight: 800 }}>Credit (₱)</th>
                </tr>
              </thead>
              <tbody>
                {enrichedBalances.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 30, color: '#6B7280', border: '1px solid #E5E7EB' }}>
                      No posted journal transactions found.
                    </td>
                  </tr>
                ) : (
                  enrichedBalances.map((b) => (
                    <tr key={b.account_code}>
                      <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', fontFamily: 'monospace', fontWeight: 700 }}>{b.account_code}</td>
                      <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', fontSize: 12.5 }}>{b.account_name}</td>
                      <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', fontSize: 11, fontWeight: 700, color: '#4B5563' }}>{b.type}</td>
                      <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', textAlign: 'right', fontFamily: 'monospace' }}>
                        {b.totalDebit > 0 ? formatCurrency(b.totalDebit) : '—'}
                      </td>
                      <td style={{ padding: '7px 10px', border: '1px solid #E5E7EB', textAlign: 'right', fontFamily: 'monospace' }}>
                        {b.totalCredit > 0 ? formatCurrency(b.totalCredit) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {enrichedBalances.length > 0 && (
                <tfoot>
                  <tr style={{ background: '#F3F4F6', fontWeight: 800 }}>
                    <td colSpan={3} style={{ padding: '8px 10px', border: '1px solid #D1D5DB', borderTop: '2px solid #111827', borderBottom: '3px double #111827', textAlign: 'right' }}>
                      GRAND TOTALS
                    </td>
                    <td style={{ padding: '8px 10px', border: '1px solid #D1D5DB', borderTop: '2px solid #111827', borderBottom: '3px double #111827', textAlign: 'right', fontFamily: 'monospace', color: '#1D4ED8' }}>
                      {formatCurrency(enrichedBalances.reduce((s, b) => s + b.totalDebit, 0))}
                    </td>
                    <td style={{ padding: '8px 10px', border: '1px solid #D1D5DB', borderTop: '2px solid #111827', borderBottom: '3px double #111827', textAlign: 'right', fontFamily: 'monospace', color: '#047857' }}>
                      {formatCurrency(enrichedBalances.reduce((s, b) => s + b.totalCredit, 0))}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>

            <ReportSignatories />
          </div>
        )}

        {/* ====== 4. AUDIT SUMMARY ====== */}
        {activeReport === 'audit' && (
          <div id="report-content">
            <PrintHeader
              title="Financial Audit Summary Report"
              subtitle={`${auditLog.length} Total Audit Entries Logged · FY 2026`}
            />

            {/* Summary stat counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {['CREATE', 'CERTIFY', 'PAID', 'REJECT'].map((action) => {
                const count = auditLog.filter((e) => e.action_type === action).length;
                const colors = { CREATE: '#1D4ED8', CERTIFY: '#047857', PAID: '#0F766E', REJECT: '#DC2626' };
                return (
                  <div key={action} style={{
                    padding: '12px', background: '#F9FAFB', border: '1px solid #D1D5DB',
                    borderRadius: 6, textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: colors[action] }}>{count}</div>
                    <div style={{ fontSize: 10.5, color: '#4B5563', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>{action} actions</div>
                  </div>
                );
              })}
            </div>

            <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th style={{ textAlign: 'left', padding: '7px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Log ID</th>
                  <th style={{ textAlign: 'left', padding: '7px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Timestamp</th>
                  <th style={{ textAlign: 'left', padding: '7px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Actor / Signatory</th>
                  <th style={{ textAlign: 'left', padding: '7px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Module</th>
                  <th style={{ textAlign: 'left', padding: '7px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Action</th>
                  <th style={{ textAlign: 'left', padding: '7px 8px', border: '1px solid #D1D5DB', fontSize: 11 }}>Document Reference</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.slice().reverse().map((entry) => (
                  <tr key={entry.log_id}>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB', fontFamily: 'monospace', fontSize: 11 }}>{entry.log_id}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB', fontSize: 11, color: '#4B5563' }}>{formatDateTime(entry.timestamp)}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB', fontSize: 11.5, fontWeight: 600 }}>{entry.actor_name}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB', fontSize: 11, fontWeight: 700, color: '#4B5563' }}>{entry.module}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB', fontSize: 11, fontWeight: 800, color: entry.action_type === 'REJECT' ? '#DC2626' : '#1D4ED8' }}>
                      {entry.action_type}
                    </td>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB', fontFamily: 'monospace', fontSize: 11 }}>{entry.document_ref || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ReportSignatories />
          </div>
        )}

      </div>
    </div>
  );
}
