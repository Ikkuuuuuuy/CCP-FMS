import React from 'react';
import { ArrowLeft, CheckCircle, XCircle, Send, Printer } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { useApp } from '../../contexts/AppContext';
import BURPrintTemplate from '../../components/Print/BURPrintTemplate';

const BUR_LIFECYCLE = [
  { status: 'PREPARED', label: 'Prepared' },
  { status: 'FORWARDED_TO_TREASURY', label: 'Forwarded to Treasury' },
  { status: 'FOR_APPROVAL_OP', label: 'For Approval OP' },
  { status: 'APPROVED', label: 'Approved' },
  { status: 'OBLIGATED', label: 'Obligated' },
];

function LifecycleStepper({ currentStatus }) {
  const isRejected = currentStatus === 'REJECTED';
  const currentIdx = BUR_LIFECYCLE.findIndex((s) => s.status === currentStatus);

  return (
    <div className="lifecycle-steps">
      {BUR_LIFECYCLE.map((step, i) => {
        let stepClass = '';
        if (isRejected && i <= currentIdx) stepClass = i === currentIdx ? 'rejected' : 'completed';
        else if (i < currentIdx) stepClass = 'completed';
        else if (i === currentIdx) stepClass = 'active';

        return (
          <div key={step.status} className={`lifecycle-step ${stepClass}`}>
            <div className="lifecycle-step-dot">
              {stepClass === 'completed' ? '✓' : stepClass === 'rejected' ? '✕' : i + 1}
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

export default function BURDetail({ bur, onBack }) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const canAdvance = currentUser?.permissions.includes('all') || currentUser?.permissions.includes('bur.submit');

  const handleAdvance = () => {
    dispatch({ type: 'DOCUMENT_ADVANCE', payload: { burId: bur.id } });
    onBack();
  };

  const handleReject = () => {
    dispatch({ type: 'DOCUMENT_REJECT', payload: { burId: bur.id, reason: 'Manually rejected' } });
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
            <div className="page-title" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{bur.burNo}</div>
            <div style={{ marginTop: 6 }}>
              <StatusBadge status={bur.status} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
            {bur.status !== 'REJECTED' && bur.status !== 'OBLIGATED' && (
              <button className="btn btn-primary" onClick={handleAdvance} style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#FFF', fontWeight: 700, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
              }}>
                <CheckCircle size={15} />
                <span>
                  {bur.status === 'PREPARED' ? 'Sign & Submit Box A (Requesting Office)' :
                   bur.status === 'FORWARDED_TO_TREASURY' ? 'Certify Budget Allotment (Box B)' :
                   bur.status === 'FOR_APPROVAL_OP' ? 'Approve Allotment (Kaye C. Tinga)' :
                   'Certify & Obligate BUR'}
                </span>
              </button>
            )}
            {bur.status === 'OBLIGATED' && (
              <div style={{
                padding: '6px 14px', background: '#ECFDF5', border: '1px solid #A7F3D0',
                borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#065F46', display: 'flex', alignItems: 'center', gap: 6
              }}>
                <CheckCircle size={14} /> Obligated & Certified
              </div>
            )}
            <button className="btn btn-ghost" onClick={() => window.print()}>
              <Printer size={14} /> Print BUR
            </button>
          </div>
        </div>

        <LifecycleStepper currentStatus={bur.status} />

        {bur.status === 'REJECTED' && (
          <div className="alert alert-danger mb-4">
            <XCircle size={16} className="alert-icon" />
            <div className="alert-text">
              <div className="alert-title">Rejection Reason</div>
              {bur.rejectionReason}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Details Card */}
          <div className="card">
            <div className="card-header"><div className="card-title">BUR Details</div></div>
            <div className="card-body">
              {[
                ['BUR Number', bur.burNo, true],
                ['Allotment Class', bur.allotmentClass, false],
                ['Account Code', bur.accountCode, true],
                ['Responsibility Center', bur.responsibilityCenter, false],
                ['MFO/PAP Code', bur.mfoPap, false],
                ['Amount Requested', formatCurrency(bur.amount), false],
                ['Payee Name', bur.payeeName || '—', false],
                ['Payee TIN', bur.payeeTIN || '—', true],
                ['Address', bur.address || '—', false],
                ['Mode of Payment', bur.modeOfPayment || '—', false],
              ].map(([label, val, mono]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit' }}>{val}</span>
                </div>
              ))}
              <div style={{ paddingTop: 12 }}>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Particulars</div>
                <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{bur.particulars || '—'}</div>
              </div>
              {bur.purpose && (
                <div style={{ paddingTop: 12 }}>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Purpose / Justification</div>
                  <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{bur.purpose}</div>
                </div>
              )}
            </div>
          </div>

          {/* Approval History */}
          <div className="card">
            <div className="card-header"><div className="card-title">Approval History</div></div>
            <div className="card-body">
              {bur.history?.map((h, i) => (
                <div key={i} className="audit-entry" style={{ padding: '10px 0' }}>
                  <div className="audit-timeline-dot" style={{
                    background: h.status === 'REJECTED' ? '#DC2626' : h.status === 'OBLIGATED' ? '#059669' : '#D4AF37',
                  }} />
                  <div className="audit-content">
                    <div className="audit-action">
                      <StatusBadge status={h.status} />
                    </div>
                    <div className="audit-meta" style={{ marginTop: 4 }}>{h.actor} · {formatDateTime(h.timestamp)}</div>
                    {h.note && <div style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>{h.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BURPrintTemplate bur={bur} />
    </div>
  );
}
