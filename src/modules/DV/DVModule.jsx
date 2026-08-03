import React, { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Eye, ArrowRight, Send, Edit, Printer } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import DVForm from './DVForm';
import DVDetail from './DVDetail';
import DVPrintTemplate from '../../components/Print/DVPrintTemplate';
import { formatCurrency, formatDate } from '../../utils/formatters';

const DV_STATUS_TRANSITIONS = {
  PREPARED:              { label: 'Submit to Accounting',  action: 'ADVANCE', btnClass: 'btn-primary' },
  PENDING_ACCOUNTING:    { label: 'Approve for Payment',   action: 'ADVANCE', btnClass: 'btn-success' },
  APPROVED_FOR_PAYMENT:  { label: 'Prepare Check',         action: 'ADVANCE', btnClass: 'btn-warning' },
  FOR_CHECK_PREPARATION: { label: 'Mark for Release',      action: 'ADVANCE', btnClass: 'btn-info' },
  FOR_RELEASE:           { label: 'Stamp & Mark PAID',     action: 'ADVANCE', btnClass: 'btn-success' },
};

export default function DVModule() {
  const { state, dispatch } = useApp();
  const { dvs, burs, currentUser } = state;

  const [view, setView] = useState('list');
  const [selectedDV, setSelectedDV] = useState(null);
  const [printDV, setPrintDV] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const canCreate = !currentUser || currentUser.permissions.includes('all') || currentUser.permissions.includes('dv.create') || currentUser.permissions.includes('bur.create') || currentUser.role === 'IT/ADMIN' || currentUser.role === 'Budget Officer';
  const obligatedBURs = burs.filter((b) => b.status === 'OBLIGATED');

  const filtered = dvs.filter((d) => {
    const matchStatus = filterStatus === 'ALL' || d.status === filterStatus;
    const matchSearch = !searchText ||
      d.dvNo?.toLowerCase().includes(searchText.toLowerCase()) ||
      d.payeeName?.toLowerCase().includes(searchText.toLowerCase()) ||
      d.burRef?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleAdvance = (id) => {
    try {
      dispatch({ type: 'DV_ADVANCE', payload: { id } });
      if (selectedDV?.id === id) {
        const updated = dvs.find((d) => d.id === id);
        setSelectedDV(updated);
      }
      setError('');
    } catch (e) { setError(e.message); }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) { setError('Rejection reason is required.'); return; }
    try {
      dispatch({ type: 'DV_REJECT', payload: { id: rejectModal, reason: rejectReason.trim() } });
      setRejectModal(null); setRejectReason(''); setError('');
    } catch (e) { setError(e.message); }
  };

  const STATUS_FILTERS = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PENDING_ACCOUNTING', label: 'Pending Accounting' },
    { value: 'APPROVED_FOR_PAYMENT', label: 'Approved for Payment' },
    { value: 'FOR_CHECK_PREPARATION', label: 'For Check preparation' },
    { value: 'FOR_RELEASE', label: 'For Release' },
    { value: 'PAID', label: 'Paid' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  if (view === 'form') {
    return (
      <div className="page-wrapper">
        <DVForm
          obligatedBURs={obligatedBURs}
          allDVs={dvs}
          initialData={selectedDV || undefined}
          onSubmit={(data) => {
            try {
              if (selectedDV) {
                dispatch({ type: 'DOCUMENT_UPDATE', payload: { type: 'DV', id: selectedDV.id, data } });
              } else {
                dispatch({ type: 'DOCUMENT_CREATE_DV', payload: data });
              }
              setView('list'); 
              setSelectedDV(null);
              setError('');
            } catch (e) { setError(e.message); }
          }}
          onCancel={() => { setView('list'); setSelectedDV(null); }}
          error={error}
        />
      </div>
    );
  }

  if (view === 'detail' && selectedDV) {
    const liveSelectedDV = dvs.find((d) => d.id === selectedDV.id) || selectedDV;
    return (
      <div className="page-wrapper">
        <DVDetail
          dv={liveSelectedDV}
          onBack={() => { setView('list'); setSelectedDV(null); }}
        />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header no-print">
        <div className="page-header-info">
          <div className="page-title">Disbursement Vouchers</div>
          <div className="page-subtitle">
            {dvs.length} total DVs · {dvs.filter((d) => d.status === 'PAID').length} paid
          </div>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => { setView('form'); setSelectedDV(null); setError(''); }}>
            <Plus size={14} /> New Disbursement Voucher
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger mb-4 no-print">
          <XCircle size={16} className="alert-icon" />
          <div className="alert-text">{error}</div>
        </div>
      )}

      <div className="filter-bar no-print">
        <div className="search-input-wrapper">
          <Search size={14} className="search-input-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search DV No, payee, or BUR reference..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            Filter Status:
          </label>
          <select
            className="form-control"
            style={{ width: 220 }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {DV_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="data-grid-wrapper no-print">
        <table className="data-grid">
          <thead>
            <tr>
              <th>DV No.</th>
              <th>Date</th>
              <th>Payee</th>
              <th>BUR Reference</th>
              <th>Assigned Staff</th>
              <th className="text-right">Gross Claim</th>
              <th className="text-right">Deductions</th>
              <th className="text-right">Net Amount</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <div className="grid-empty">
                    <div className="grid-empty-icon">💳</div>
                    <div className="grid-empty-text">No Disbursement Vouchers found</div>
                    <div className="grid-empty-sub">
                      Click "New Disbursement Voucher" to process a payment linked to an obligated BUR.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((dv) => {
                return (
                  <tr key={dv.id} onClick={() => { setSelectedDV(dv); setView('detail'); }}>
                    <td className="mono">{dv.dvNo}</td>
                    <td style={{ fontSize: 12, color: '#6B7280' }}>{formatDate(dv.createdAt)}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{dv.payeeName}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>TIN: {dv.payeeTIN || '—'}</div>
                    </td>
                    <td className="mono" style={{ fontSize: 12, color: '#6B7280' }}>{dv.burRef || '—'}</td>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937' }}>
                        👤 {dv.assignedToName || 'Unassigned'}
                      </div>
                    </td>
                    <td className="text-right mono" style={{ fontWeight: 700 }}>{formatCurrency(dv.grossClaim)}</td>
                    <td className="text-right mono" style={{ color: '#DC2626', fontSize: 12 }}>
                      ({formatCurrency(dv.taxDeductions?.totalDeductions || 0)})
                    </td>
                    <td className="text-right mono" style={{ fontWeight: 800, color: '#059669' }}>
                      {formatCurrency(dv.netAmount || dv.grossClaim)}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={dv.status} />
                    </td>
                    <td className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
                        {dv.status !== 'PAID' && dv.status !== 'REJECTED' && (
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
                            title="Advance to Next Stage"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvance(dv.id);
                            }}
                          >
                            <ArrowRight size={12} />
                            <span>{DV_STATUS_TRANSITIONS[dv.status]?.label || 'Advance Stage'}</span>
                          </button>
                        )}
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="View Details"
                          onClick={() => { setSelectedDV(dv); setView('detail'); }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Edit DV Request"
                          onClick={() => { setSelectedDV(dv); setView('form'); }}
                        >
                          <Edit size={14} style={{ color: '#2563EB' }} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Print Official DV"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrintDV(dv);
                            setTimeout(() => window.print(), 100);
                          }}
                        >
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={5} className="text-right" style={{ color: '#6B7280', fontWeight: 400 }}>
                  Total ({filtered.length} records)
                </td>
                <td className="text-right mono">{formatCurrency(filtered.reduce((s, d) => s + d.grossClaim, 0))}</td>
                <td className="text-right mono" style={{ color: '#DC2626' }}>
                  ({formatCurrency(filtered.reduce((s, d) => s + (d.taxDeductions?.totalDeductions || 0), 0))})
                </td>
                <td className="text-right mono" style={{ color: '#059669' }}>
                  {formatCurrency(filtered.reduce((s, d) => s + (d.netAmount || d.grossClaim), 0))}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <Modal
        isOpen={!!rejectModal}
        onClose={() => { setRejectModal(null); setRejectReason(''); setError(''); }}
        title="Reject Disbursement Voucher"
        subtitle="Mandatory rejection reason required for audit compliance"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setRejectModal(null); setRejectReason(''); setError(''); }}>Cancel</button>
            <button className="btn btn-danger" onClick={handleReject}><XCircle size={14} /> Reject DV</button>
          </>
        }
      >
        {error && <div className="alert alert-danger mb-4"><div className="alert-text">{error}</div></div>}
        <div className="form-group">
          <label className="form-label">Rejection Reason <span className="required">*</span></label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Enter detailed reason..."
            value={rejectReason}
            onChange={(e) => { setRejectReason(e.target.value); setError(''); }}
          />
        </div>
      </Modal>

      <DVPrintTemplate dv={printDV || selectedDV || (dvs && dvs[0])} />
    </div>
  );
}
