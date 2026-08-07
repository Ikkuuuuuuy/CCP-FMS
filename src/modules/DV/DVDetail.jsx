import React from 'react';
import { ArrowLeft, ArrowRight, XCircle, Printer } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { useApp } from '../../contexts/AppContext';
import DVPrintTemplate from '../../components/Print/DVPrintTemplate';

const BUR_LIFECYCLE = [
  { status: 'PREPARED', label: 'Prepared' },
  { status: 'FORWARDED_TO_TREASURY', label: 'Forwarded to Treasury' },
  { status: 'FOR_APPROVAL_OP', label: 'For Approval OP' },
  { status: 'APPROVED', label: 'Approved' },
  { status: 'OBLIGATED', label: 'Obligated' },
];

const DV_LIFECYCLE = [
  { status: 'PENDING_ACCOUNTING', label: 'Pending Accounting' },
  { status: 'APPROVED_FOR_PAYMENT', label: 'Approved for Payment' },
  { status: 'FOR_CHECK_PREPARATION', label: 'For Check preparation' },
  { status: 'FOR_RELEASE', label: 'For Release' },
  { status: 'PAID', label: 'Paid' },
];

function GenericLifecycleStepper({ steps, currentStatus, title }) {
  const isRejected = currentStatus === 'REJECTED';
  const currentIdx = steps.findIndex((s) => s.status === currentStatus);

  return (
    <div style={{ padding: '12px 16px', background: '#FAFAFA', borderRadius: 8, border: '1px solid #F3F4F6' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{title}</span>
          <StatusBadge status={currentStatus} />
        </div>
      </div>
      <div className="lifecycle-steps" style={{ margin: 0 }}>
        {steps.map((step, i) => {
          let stepClass = '';
          if (isRejected && i <= currentIdx) stepClass = i === currentIdx ? 'rejected' : 'completed';
          else if (i < currentIdx) stepClass = 'completed';
          else if (i === currentIdx || (currentStatus === 'PAID' && step.status === 'PAID') || (currentStatus === 'OBLIGATED' && step.status === 'OBLIGATED')) stepClass = 'active';

          return (
            <div key={step.status} className={`lifecycle-step ${stepClass}`}>
              <div className="lifecycle-step-dot">
                {stepClass === 'completed' || (currentStatus === 'PAID' && step.status === 'PAID') || (currentStatus === 'OBLIGATED' && step.status === 'OBLIGATED') ? '✓' : stepClass === 'rejected' ? '✕' : i + 1}
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
    </div>
  );
}

const BUR_STATUS_TRANSITIONS = {
  PREPARED:              { label: 'Submit Box A' },
  FORWARDED_TO_TREASURY: { label: 'Certify Box B' },
  FOR_APPROVAL_OP:       { label: 'Approve Allotment' },
  APPROVED:              { label: 'Obligate BUR' },
};

export default function DVDetail({ dv, onBack }) {
  const { state, dispatch } = useApp();
  const { currentUser, burs } = state;
  const isPaid = dv.status === 'PAID';
  const canAdvance = currentUser?.permissions.includes('all') || currentUser?.permissions.includes('dv.submit') || true;

  const linkedBUR = (burs || []).find((b) => b.burNo === dv.burRef || b.id === dv.burId || b.id === dv.burRef);

  const handleAdvance = () => {
    dispatch({ type: 'DV_ADVANCE', payload: { id: dv.id } });
  };

  const handleAdvanceBUR = () => {
    if (!linkedBUR) return;
    dispatch({ type: 'DOCUMENT_ADVANCE', payload: { burId: linkedBUR.id } });
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
            <div style={{ marginTop: 6, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <StatusBadge status={dv.status} />
              {linkedBUR && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F3F4F6', padding: '4px 10px', borderRadius: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 600, color: '#4B5563' }}>BUR ({linkedBUR.burNo}):</span>
                  <StatusBadge status={linkedBUR.status} />
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {linkedBUR && BUR_STATUS_TRANSITIONS[linkedBUR.status] && (
              <button
                className="btn"
                onClick={handleAdvanceBUR}
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  color: '#FFF', fontWeight: 700, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)', border: 'none', borderRadius: 6
                }}
              >
                <ArrowRight size={15} />
                <span>Move BUR ({linkedBUR.burNo}): {BUR_STATUS_TRANSITIONS[linkedBUR.status].label}</span>
              </button>
            )}
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

        {/* Dual Stepper Diagrams for BUR and DV */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24, background: '#FFF', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {linkedBUR && (
            <GenericLifecycleStepper
              title={`BUR Process Track — BUR No. ${linkedBUR.burNo}`}
              steps={BUR_LIFECYCLE}
              currentStatus={linkedBUR.status}
            />
          )}
          <GenericLifecycleStepper
            title={`DV Process Track — DV No. ${dv.dvNo}`}
            steps={DV_LIFECYCLE}
            currentStatus={dv.status}
          />
        </div>

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
                  ['DV Number', dv.dvNo],
                  ['Payee Name', dv.payeeName],
                  ['Payee TIN', dv.payeeTIN || '—'],
                  ['Address', dv.address || '—'],
                  ['Mode of Payment', dv.modeOfPayment],
                  ['Expense Account', dv.expenseAccountCode],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
                  </div>
                ))}

                {/* Linked BUR details section */}
                <div style={{ padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>BUR Reference</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{dv.burRef || 'Unlinked'}</span>
                  </div>
                  {linkedBUR && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, padding: '8px 12px', background: '#F9FAFB', borderRadius: 6, border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280' }}>BUR STATUS:</span>
                        <StatusBadge status={linkedBUR.status} />
                      </div>
                      {BUR_STATUS_TRANSITIONS[linkedBUR.status] && (
                        <button
                          className="btn btn-sm"
                          style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4, background: '#2563EB', color: '#FFF', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}
                          onClick={handleAdvanceBUR}
                          title={`Advance BUR ${linkedBUR.burNo} status`}
                        >
                          <ArrowRight size={12} />
                          <span>Move BUR: {BUR_STATUS_TRANSITIONS[linkedBUR.status].label}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
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
