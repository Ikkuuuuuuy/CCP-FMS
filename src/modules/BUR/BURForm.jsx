import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import {
  FUND_CLUSTERS, ALLOTMENT_CLASSES, MFO_PAP_CODES, RESPONSIBILITY_CENTERS, CHART_OF_ACCOUNTS, CCP_OFFICES,
} from '../../data/seedData';
import { formatCurrency, calcUtilizationPct } from '../../utils/formatters';

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
      particulars: '',
      reference: 'CONTRACT OF SERVICE',
      purpose: '',
      payeeName: '',
      address: '',
    };
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const allotment = allotments[form.fundCluster]?.[form.allotmentClass];
  const available = allotment ? allotment.total - allotment.obligated : 0;
  const requested = parseFloat(form.amount) || 0;
  const isOverBudget = requested > available;

  const expenseAccounts = CHART_OF_ACCOUNTS.filter((a) => a.type === 'EXPENSE');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0 || !form.payeeName) return;
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
      particulars: form.particulars,
      reference: form.reference,
      purpose: form.purpose,
      payeeName: form.payeeName,
      address: form.address,
    });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-title">New Budget Utilization Request</div>
          <div className="page-subtitle">
            BUR No. will be auto-generated upon submission (e.g. 26-01-0023)
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

      <form id="bur-form" onSubmit={handleSubmit}>
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
    </div>
  );
}
