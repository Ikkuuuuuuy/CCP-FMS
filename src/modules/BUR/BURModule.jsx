import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, XCircle, Eye, ChevronDown, Edit, Printer, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import BURForm from './BURForm';
import BURDetail from './BURDetail';
import BURPrintTemplate from '../../components/Print/BURPrintTemplate';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CCP_OFFICES } from '../../data/seedData';

const BUR_STATUS_TRANSITIONS = {
  PREPARED:              { label: 'Submit Box A',      action: 'ADVANCE' },
  FORWARDED_TO_TREASURY: { label: 'Certify Box B',     action: 'ADVANCE' },
  FOR_APPROVAL_OP:       { label: 'Approve Allotment', action: 'ADVANCE' },
  APPROVED:              { label: 'Obligate BUR',      action: 'ADVANCE' },
};

export default function BURModule() {
  const { state, dispatch } = useApp();
  const { burs, currentUser, allotments } = state;

  const [view, setView] = useState('list'); // 'list' | 'form' | 'detail'
  const [selectedBUR, setSelectedBUR] = useState(null);
  const [printBUR, setPrintBUR] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterOffice, setFilterOffice] = useState('ALL');
  const [searchText, setSearchText] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  const canCreate = currentUser?.permissions.includes('all') || currentUser?.permissions.includes('bur.create');
  const canCertify = currentUser?.permissions.includes('all') || currentUser?.permissions.includes('bur.certify');
  const canReject = currentUser?.permissions.includes('all') || currentUser?.permissions.includes('bur.reject');

  const filtered = burs.filter((b) => {
    const matchStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchOffice = filterOffice === 'ALL' || b.office === filterOffice || b.responsibilityCenter === filterOffice;
    const matchSearch = !searchText ||
      b.burNo?.toLowerCase().includes(searchText.toLowerCase()) ||
      b.office?.toLowerCase().includes(searchText.toLowerCase()) ||
      b.responsibilityCenter?.toLowerCase().includes(searchText.toLowerCase()) ||
      b.mfoPap?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchOffice && matchSearch;
  });

  const handleAdvance = (burId) => {
    try {
      dispatch({ type: 'DOCUMENT_ADVANCE', payload: { burId } });
      setError('');
    } catch (e) { setError(e.message); }
  };

  const handleSubmit = (id) => {
    try {
      dispatch({ type: 'BUR_SUBMIT', payload: { id } });
      setError('');
    } catch (e) { setError(e.message); }
  };

  const handleCertify = (id) => {
    try {
      dispatch({ type: 'BUR_CERTIFY', payload: { id } });
      setError('');
    } catch (e) { setError(e.message); }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) { setError('Rejection reason is required.'); return; }
    try {
      dispatch({ type: 'BUR_REJECT', payload: { id: rejectModal, reason: rejectReason.trim() } });
      setRejectModal(null);
      setRejectReason('');
      setError('');
    } catch (e) { setError(e.message); }
  };

  const STATUS_FILTERS = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PREPARED', label: 'Prepared' },
    { value: 'PENDING_BUDGET_CERTIFICATION', label: 'Pending Certification' },
    { value: 'OBLIGATED', label: 'Obligated' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  if (view === 'form') {
    return (
      <div className="page-wrapper">
        <BURForm
          allotments={allotments}
          initialData={selectedBUR || undefined}
          onSubmit={(data) => {
            try {
              if (selectedBUR) {
                dispatch({ type: 'DOCUMENT_UPDATE', payload: { type: 'BUR', id: selectedBUR.id, data } });
              } else {
                dispatch({ type: 'DOCUMENT_CREATE', payload: data });
              }
              setView('list');
              setSelectedBUR(null);
              setError('');
            } catch (e) { setError(e.message); }
          }}
          onCancel={() => { setView('list'); setSelectedBUR(null); }}
          error={error}
        />
      </div>
    );
  }

  if (view === 'detail' && selectedBUR) {
    return (
      <div className="page-wrapper">
        <BURDetail
          bur={selectedBUR}
          onBack={() => { setView('list'); setSelectedBUR(null); }}
        />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header no-print">
        <div className="page-header-info">
          <div className="page-title">Budget Utilization Requests</div>
          <div className="page-subtitle">
            {burs.length} total BURs · {burs.filter((b) => b.status === 'OBLIGATED').length} obligated
          </div>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => { setView('form'); setSelectedBUR(null); setError(''); }}>
            <Plus size={14} /> New BUR
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger mb-4 no-print">
          <div className="alert-icon"><XCircle size={16} /></div>
          <div className="alert-text">{error}</div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="filter-bar no-print">
        <div className="search-input-wrapper">
          <Search size={14} className="search-input-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search BUR No, office, or MFO/PAP..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            Office:
          </label>
          <select
            className="form-control"
            style={{ width: 190, padding: '6px 10px', fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'pointer' }}
            value={filterOffice}
            onChange={(e) => setFilterOffice(e.target.value)}
          >
            <option value="ALL">All CCP Offices</option>
            {CCP_OFFICES.map((off) => (
              <option key={off.code} value={off.name}>
                {off.name} ({off.code})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            Status:
          </label>
          <select
            className="form-control"
            style={{ width: 160, padding: '6px 10px', fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'pointer' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Grid */}
      <div className="data-grid-wrapper no-print">
        <table className="data-grid">
          <thead>
            <tr>
              <th>BUR No.</th>
              <th>Payee Name</th>
              <th>RC Code</th>
              <th>Assigned Staff</th>
              <th>Allotment Class</th>
              <th className="text-right">Obligated Amount</th>
              <th className="text-right">Disbursed Amount</th>
              <th className="text-right">Remaining Balance</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <div className="grid-empty">
                    <div className="grid-empty-icon">📄</div>
                    <div className="grid-empty-text">No BURs found</div>
                    <div className="grid-empty-sub">
                      {canCreate ? 'Click "New BUR" to create the first request.' : 'No BURs match the current filter.'}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((bur) => {
                const disbursed = state.dvs
                  .filter(d => (d.burRef === bur.burNo || d.burRef === bur.id) && d.status === 'PAID')
                  .reduce((s, d) => s + (d.grossClaim || 0), 0);
                const remaining = Math.max(0, bur.amount - disbursed);
                return (
                  <tr key={bur.id} onClick={() => { setSelectedBUR(bur); setView('detail'); }}>
                    <td className="mono" style={{ fontWeight: 700 }}>{bur.burNo}</td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{bur.payeeName || 'N/A'}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{bur.office || bur.responsibilityCenter}</div>
                    </td>
                    <td className="mono" style={{ fontSize: 12 }}>{bur.responsibilityCenter || '08'}</td>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937' }}>
                        👤 {bur.assignedToName || 'Unassigned'}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: bur.allotmentClass === 'PS' ? '#2563EB' : bur.allotmentClass === 'MOOE' ? '#059669' : '#D97706',
                      }}>{bur.allotmentClass}</span>
                    </td>
                    <td className="text-right mono" style={{ fontWeight: 700 }}>
                      {formatCurrency(bur.amount)}
                    </td>
                    <td className="text-right mono" style={{ color: '#059669', fontSize: 12 }}>
                      {formatCurrency(disbursed)}
                    </td>
                    <td className="text-right mono" style={{ fontWeight: 700, color: remaining > 0 ? '#111827' : '#6B7280' }}>
                      {formatCurrency(remaining)}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={bur.status} />
                    </td>
                    <td className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
                        {bur.status !== 'OBLIGATED' && bur.status !== 'REJECTED' && (
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
                            title="Advance to Next Stage"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvance(bur.id);
                            }}
                          >
                            <ArrowRight size={12} />
                            <span>{BUR_STATUS_TRANSITIONS[bur.status]?.label || 'Advance Stage'}</span>
                          </button>
                        )}
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="View Details"
                          onClick={() => { setSelectedBUR(bur); setView('detail'); }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Edit BUR Request"
                          onClick={() => { setSelectedBUR(bur); setView('form'); }}
                        >
                          <Edit size={14} style={{ color: '#2563EB' }} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Print Official BUR"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrintBUR(bur);
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
                <td colSpan={4} className="text-right" style={{ color: '#6B7280', fontWeight: 400 }}>
                  Total ({filtered.length} BURs)
                </td>
                <td className="text-right mono" style={{ fontWeight: 800 }}>
                  {formatCurrency(filtered.reduce((s, b) => s + b.amount, 0))}
                </td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => { setRejectModal(null); setRejectReason(''); setError(''); }}
        title="Reject BUR"
        subtitle="Provide a mandatory reason for rejection (captured in audit log)"
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setRejectModal(null); setRejectReason(''); setError(''); }}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleReject}>
              <XCircle size={14} /> Reject BUR
            </button>
          </>
        }
      >
        {error && <div className="alert alert-danger mb-4"><div className="alert-text">{error}</div></div>}
        <div className="form-group">
          <label className="form-label">Rejection Reason <span className="required">*</span></label>
          <textarea
            className={`form-control ${error && !rejectReason.trim() ? 'error' : ''}`}
            rows={4}
            placeholder="Enter detailed reason for rejection..."
            value={rejectReason}
            onChange={(e) => { setRejectReason(e.target.value); setError(''); }}
          />
          <div className="form-hint">This reason will be permanently recorded in the audit trail.</div>
        </div>
      </Modal>

      <BURPrintTemplate bur={printBUR || selectedBUR || (burs && burs[0])} />
    </div>
  );
}
