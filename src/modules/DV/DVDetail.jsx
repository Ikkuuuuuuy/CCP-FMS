import React from 'react';
import { ArrowLeft, ArrowRight, XCircle, Printer } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { useApp } from '../../contexts/AppContext';
import DVPrintTemplate from '../../components/Print/DVPrintTemplate';

const DV_LIFECYCLE = [
  { status: 'PENDING_ACCOUNTING', label: 'Pending Accounting' },
  { status: 'APPROVED_FOR_PAYMENT', label: 'Approved for Payment' },
  { status: 'FOR_CHECK_PREPARATION', label: 'For Check preparation' },
  { status: 'FOR_RELEASE', label: 'For Release' },
  { status: 'PAID', label: 'Paid' },
];

function LifecycleStepper({ currentStatus }) {
  const isRejected = currentStatus === 'REJECTED';
  const currentIdx = DV_LIFECYCLE.findIndex((s) => s.status === currentStatus);

  return (
    <div className="lifecycle-steps">
      {DV_LIFECYCLE.map((step, i) => {
        let stepClass = '';
        if (isRejected && i <= currentIdx) stepClass = i === currentIdx ? 'rejected' : 'completed';
        else if (i < currentIdx) stepClass = 'completed';
        else if (i === currentIdx || (currentStatus === 'PAID' && step.status === 'PAID')) stepClass = 'active';

        return (
          <div key={step.status} className={`lifecycle-step ${stepClass}`}>
            <div className="lifecycle-step-dot">
              {stepClass === 'completed' || currentStatus === 'PAID' ? '✓' : stepClass === 'rejected' ? '✕' : i + 1}
            </div>
            <div className="lifecycle-step-label">{step.label}</div>
          </div>
        );
      })}
      {isRejected && currentIdx === -1 && (
        <div className="lifecycle-step rejected">
          <div className="lifecycle-step-dot">✕</div>
          <div className="lifecycle-step-label">Rejected</div>
        </div>
      )}
    </div>
  );
}

export default function DVDetail({ dv, onBack }) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const isPaid = dv.status === 'PAID';
  const canAdvance = currentUser?.permissions.includes('all') || currentUser?.permissions.includes('dv.submit') || true;

  const handleAdvance = () => {
    dispatch({ type: 'DV_ADVANCE', payload: { id: dv.id } });
  };

  const handleReject = () => {
    dispatch({ type: 'DV_REJECT', payload: { id: dv.id, reason: 'Manually rejected' } });
    onBack();
  };

  return (
    <div>
      <div className="no-print">
        <div className="page-header">
          <div className="page-header-info">
            <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 8 }}>
              <ArrowLeft size={14} /> Back to list
            </button>
            <div className="page-title" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{dv.dvNo}</div>
            <div style={{ marginTop: 6 }}><StatusBadge status={dv.status} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {dv.status !== 'PAID' && dv.status !== 'REJECTED' && (
              <button className="btn btn-primary" onClick={handleAdvance} style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#FFF', fontWeight: 700, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
              }}>
                <span>
                  {dv.status === 'PREPARED' ? 'Submit to Accounting' :
                   dv.status === 'PENDING_ACCOUNTING' ? 'Approve for Payment (Accounting Division)' :
                   dv.status === 'APPROVED_FOR_PAYMENT' ? 'Proceed to Check Preparation (Treasury Division)' :
                   dv.status === 'FOR_CHECK_PREPARATION' ? 'Release Payment (Treasury Division)' :
                   'Stamp PAID & Transmit to Bookkeeping'}
                </span>
              </button>
            )}
            {dv.status === 'PAID' && (
              <div style={{
                padding: '6px 14px', background: '#ECFDF5', border: '1px solid #A7F3D0',
                borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#065F46', display: 'flex', alignItems: 'center', gap: 6
              }}>
                ✓ Paid & Transmitted to Bookkeeping / COA
              </div>
            )}
            <button className="btn btn-ghost" onClick={() => window.print()}>
              <Printer size={14} /> Print DV
            </button>
          </div>
        </div>

        <LifecycleStepper currentStatus={dv.status} />

        {dv.status === 'REJECTED' && (
          <div className="alert alert-danger mb-4">
            <XCircle size={16} className="alert-icon" />
            <div className="alert-text">
              <div className="alert-title">Rejection Reason</div>
              {dv.rejectionReason}
            </div>
          </div>
        )}

        {isPaid && (
          <div className="alert alert-success mb-4">
            <div className="alert-text">
              <div className="alert-title">✓ Payment Completed — Ledger Auto-Posted</div>
              This DV has been paid and a double-entry journal entry has been automatically posted to the General Ledger.
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left: DV Details */}
          <div>
            <div className="card mb-4">
              <div className="card-header"><div className="card-title">DV Details</div></div>
              <div className="card-body">
                {[
                  ['DV Number', dv.dvNo, true],
                  ['Payee Name', dv.payeeName, false],
                  ['Payee TIN', dv.payeeTIN || '—', true],
                  ['Address', dv.address || '—', false],
                  ['Mode of Payment', dv.modeOfPayment, false],
                  ['BUR Reference', dv.burRef || 'Unlinked', true],
                  ['Expense Account', dv.expenseAccountCode, true],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Summary */}
            <div className="card">
              <div className="card-header"><div className="card-title">Tax Deduction Summary</div></div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['Gross Claim', formatCurrency(dv.grossClaim), '#111827'],
                    ['Final VAT (5%)', `(${formatCurrency(dv.taxDeductions?.finalVat || 0)})`, '#DC2626'],
                    ['EWT', `(${formatCurrency(dv.taxDeductions?.ewt || 0)})`, '#DC2626'],
                    ['Total Deductions', `(${formatCurrency(dv.taxDeductions?.totalDeductions || 0)})`, '#DC2626'],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: '#6B7280' }}>{label}</span>
                      <span style={{ fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ fontWeight: 700 }}>Net Amount Payable</span>
                    <span style={{ fontWeight: 800, color: '#059669', fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatCurrency(dv.netAmount || dv.grossClaim)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Approval History */}
          <div className="card">
            <div className="card-header"><div className="card-title">Approval History & Audit Trail</div></div>
            <div className="card-body">
              {dv.history?.map((h, i) => (
                <div key={i} className="audit-entry" style={{ padding: '10px 0' }}>
                  <div className="audit-timeline-dot" style={{
                    background: h.status === 'PAID' ? '#059669' : h.status === 'REJECTED' ? '#DC2626' : '#D4AF37',
                  }} />
                  <div className="audit-content">
                    <StatusBadge status={h.status} />
                    <div className="audit-meta" style={{ marginTop: 4 }}>{h.actor} · {formatDateTime(h.timestamp)}</div>
                    {h.note && <div style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>{h.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DVPrintTemplate dv={dv} />
    </div>
  );
}
