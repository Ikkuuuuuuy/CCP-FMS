import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Check } from 'lucide-react';
import {
  FUND_CLUSTERS, ALLOTMENT_CLASSES, MFO_PAP_CODES, RESPONSIBILITY_CENTERS, CHART_OF_ACCOUNTS, CCP_OFFICES, MOCK_USERS,
} from '../../data/seedData';
import { formatCurrency, calcUtilizationPct } from '../../utils/formatters';
import Modal from '../../components/Modal';

export default function BURForm({ allotments, onSubmit, onCancel, error, initialData }) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        fundCluster: initialData.fundCluster || '101',
        allotmentClass: initialData.allotmentClass || 'MOOE',
        office: initialData.office || 'Financial Services Department',
        responsibilityCenter: initialData.responsibilityCenter || 'FSD',
        mfoPap: initialData.mfoPap || 'PAP-4.2',
        accountCode: initialData.accountCode || '5021202000',
        amount: initialData.amount || '',
        status: initialData.status || 'OBLIGATED',
        assignedTo: initialData.assignedTo || 'user-001',
        particulars: initialData.particulars || initialData.description || '',
        reference: initialData.reference || 'CONTRACT OF SERVICE',
        purpose: initialData.purpose || '',
        payeeName: initialData.payeeName || '',
        address: initialData.address || '',
      };
    }
    return {
      fundCluster: '101',
      allotmentClass: 'MOOE',
      office: 'Financial Services Department',
      responsibilityCenter: 'FSD',
      mfoPap: 'PAP-4.2',
      accountCode: '5021202000',
      amount: '',
      status: 'OBLIGATED',
      assignedTo: 'user-001',
      particulars: '',
      reference: 'CONTRACT OF SERVICE',
      purpose: '',
      payeeName: '',
      address: '',
    };
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const allotment = allotments[form.fundCluster]?.[form.allotmentClass];
  const available = allotment ? allotment.total - allotment.obligated : 0;
  const requested = parseFloat(form.amount) || 0;
  const isOverBudget = requested > available;

  const expenseAccounts = CHART_OF_ACCOUNTS.filter((a) => a.type === 'EXPENSE');

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0 || !form.payeeName) return;
    if (isOverBudget) return;
    setShowConfirm(true);
  };

  const handleFinalSubmit = () => {
    setShowConfirm(false);
    const assignedUser = MOCK_USERS.find(u => u.id === form.assignedTo);
    onSubmit({
      fundCluster: form.fundCluster,
      fundClusterName: form.fundCluster === '101' ? 'REGULAR' : 'SPECIAL',
      allotmentClass: form.allotmentClass,
      office: form.office,
      responsibilityCenter: form.responsibilityCenter,
      mfoPap: form.mfoPap,
      accountCode: form.accountCode,
      amount: parseFloat(form.amount),
      status: form.status,
      assignedTo: form.assignedTo,
      assignedToName: assignedUser ? assignedUser.name : 'Unassigned',
      particulars: form.particulars,
      reference: form.reference,
      purpose: form.purpose,
      payeeName: form.payeeName,
      address: form.address,
    });
  };

  const selectedAccount = expenseAccounts.find((a) => a.code === form.accountCode);
  const selectedUser = MOCK_USERS.find((u) => u.id === form.assignedTo);
  const selectedFC = FUND_CLUSTERS.find((fc) => fc.code === form.fundCluster);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-title">{initialData ? 'Edit Budget Utilization Request' : 'New Budget Utilization Request'}</div>
          <div className="page-subtitle">
            {initialData ? `Updating ${initialData.burNo}` : 'BUR No. will be auto-generated upon submission (e.g. 26-01-0023)'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" form="bur-form" type="submit" disabled={isOverBudget || !form.amount || !form.payeeName}>
            Save & Submit BUR
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <AlertTriangle size={16} className="alert-icon" />
          <div className="alert-text">{error}</div>
        </div>
      )}

      <form id="bur-form" onSubmit={handleOpenConfirm}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left Column */}
          <div>
            <div className="card">
              <div className="card-header"><div className="card-title">Fund & Account Classification</div></div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Fund Cluster <span className="required">*</span></label>
                  <select className="form-control" value={form.fundCluster} onChange={set('fundCluster')}>
                    {FUND_CLUSTERS.map((fc) => (
                      <option key={fc.code} value={fc.code}>{fc.code} — {fc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Allotment Class <span className="required">*</span></label>
                  <select className="form-control" value={form.allotmentClass} onChange={set('allotmentClass')}>
                    {ALLOTMENT_CLASSES.map((ac) => (
                      <option key={ac.code} value={ac.code}>{ac.code} — {ac.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">UACS Account Code <span className="required">*</span></label>
                  <select className="form-control" value={form.accountCode} onChange={set('accountCode')}>
                    {expenseAccounts.map((a) => (
                      <option key={a.code} value={a.code}>{a.code} — {a.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header"><div className="card-title">Payee Information</div></div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Payee Name <span className="required">*</span></label>
                  <input type="text" required className="form-control" placeholder="e.g. LSERV CORPORATION"
                    value={form.payeeName} onChange={set('payeeName')} />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Address <span className="required">*</span></label>
                  <input type="text" required className="form-control" placeholder="Full address"
                    value={form.address} onChange={set('address')} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="card">
              <div className="card-header"><div className="card-title">Office & Particulars Details</div></div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Requesting Office / Department <span className="required">*</span></label>
                  <select
                    required
                    className="form-control"
                    value={form.office}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const matchedOff = CCP_OFFICES.find((o) => o.name === selectedVal || o.shortName === selectedVal);
                      setForm((f) => ({
                        ...f,
                        office: selectedVal,
                        responsibilityCenter: matchedOff?.code || f.responsibilityCenter,
                      }));
                    }}
                  >
                    <option value="">-- Select CCP Office / Department --</option>
                    {CCP_OFFICES.map((off) => (
                      <option key={off.code} value={off.name}>
                        {off.name} ({off.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Responsibility Center Code <span className="required">*</span></label>
                  <select
                    required
                    className="form-control"
                    value={form.responsibilityCenter}
                    onChange={(e) => {
                      const codeVal = e.target.value;
                      const matchedOff = CCP_OFFICES.find((o) => o.code === codeVal);
                      setForm((f) => ({
                        ...f,
                        responsibilityCenter: codeVal,
                        office: matchedOff?.name || f.office,
                      }));
                    }}
                  >
                    <option value="">-- Select Code --</option>
                    {CCP_OFFICES.map((off) => (
                      <option key={off.code} value={off.code}>
                        {off.code} — {off.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">BUR Status <span className="required">*</span></label>
                  <select className="form-control" value={form.status} onChange={set('status')}>
                    <option value="OBLIGATED">Obligated (Certified)</option>
                    <option value="PREPARED">Prepared</option>
                    <option value="FORWARDED_TO_TREASURY">Forwarded to Treasury</option>
                    <option value="FOR_APPROVAL_OP">For Approval OP</option>
                    <option value="APPROVED">Approved</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Personnel / Processor <span className="required">*</span></label>
                  <select className="form-control" value={form.assignedTo} onChange={set('assignedTo')}>
                    {MOCK_USERS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.roleLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Amount Requested (₱) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${isOverBudget ? 'error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="1"
                    value={form.amount}
                    onChange={set('amount')}
                  />
                  {isOverBudget && (
                    <div className="form-error">
                      <AlertTriangle size={11} />
                      Amount exceeds available allotment balance. BUR cannot be obligated.
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Particulars / Description <span className="required">*</span></label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="e.g. Contract of Service for indoor janitorial..."
                    value={form.particulars}
                    onChange={set('particulars')}
                  />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Reference Document / Contract No.</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. CONTRACT OF SERVICE, PO No. 2026-08"
                    value={form.reference}
                    onChange={set('reference')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* CONFIRMATION MODAL BEFORE ADDING BUR */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={initialData ? "Confirm BUR Update" : "Confirm Budget Utilization Request"}
        subtitle="Please review the obligation and payee details before submitting."
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
              Back / Edit
            </button>
            <button className="btn btn-primary" onClick={handleFinalSubmit}>
              <Check size={16} /> Confirm & Submit BUR
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
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Amount to Obligate</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', fontFamily: 'JetBrains Mono, monospace' }}>
                {formatCurrency(parseFloat(form.amount) || 0)}
              </div>
            </div>
            <div style={{
              fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: '6px',
              backgroundColor: form.status === 'OBLIGATED' ? '#ECFDF5' : '#EFF6FF',
              color: form.status === 'OBLIGATED' ? '#059669' : '#2563EB',
              border: `1px solid ${form.status === 'OBLIGATED' ? '#A7F3D0' : '#BFDBFE'}`
            }}>
              Status: {form.status}
            </div>
          </div>

          <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600, width: '38%' }}>Payee Name:</td>
                <td style={{ padding: '8px 4px', fontWeight: 700, color: '#1E293B' }}>{form.payeeName}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Address:</td>
                <td style={{ padding: '8px 4px', color: '#334155' }}>{form.address || '—'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Requesting Office:</td>
                <td style={{ padding: '8px 4px', fontWeight: 600, color: '#1E293B' }}>{form.office} ({form.responsibilityCenter})</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Fund Cluster / Allotment:</td>
                <td style={{ padding: '8px 4px', color: '#1E293B' }}>
                  <strong>{form.fundCluster}</strong> ({selectedFC?.name || 'REGULAR'}) · <strong>{form.allotmentClass}</strong>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Account Classification:</td>
                <td style={{ padding: '8px 4px', color: '#334155' }}>
                  <span className="mono">{form.accountCode}</span> — {selectedAccount?.name || 'Expense'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Assigned Processor:</td>
                <td style={{ padding: '8px 4px', color: '#1E293B' }}>👤 {selectedUser?.name || 'Unassigned'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Particulars:</td>
                <td style={{ padding: '8px 4px', color: '#334155' }}>{form.particulars || '—'}</td>
              </tr>
              {form.reference && (
                <tr>
                  <td style={{ padding: '8px 4px', color: '#64748B', fontWeight: 600 }}>Reference Doc:</td>
                  <td style={{ padding: '8px 4px', color: '#334155' }}>{form.reference}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
            backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '6px',
            fontSize: 12, color: '#92400E'
          }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>Submitting will record this transaction and obligate funds against the {form.allotmentClass} budget.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
