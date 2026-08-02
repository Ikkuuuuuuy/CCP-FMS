import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import {
  FUND_CLUSTERS, ALLOTMENT_CLASSES, MFO_PAP_CODES, RESPONSIBILITY_CENTERS, CHART_OF_ACCOUNTS,
} from '../../data/seedData';
import { formatCurrency, calcUtilizationPct } from '../../utils/formatters';

export default function BURForm({ allotments, onSubmit, onCancel, error, initialData }) {
  const [form, setForm] = useState(initialData || {
    fundCluster: '101',
    allotmentClass: 'MOOE',
    responsibilityCenter: 'FD',
    mfoPap: 'PAP-4.2',
    accountCode: '5-02-99',
    amount: '',
    particulars: '',
    purpose: '',
    payeeName: '',
    payeeTIN: '',
    address: '',
    modeOfPayment: 'Check'
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const allotment = allotments[form.fundCluster]?.[form.allotmentClass];
  const available = allotment ? allotment.total - allotment.obligated : 0;
  const requested = parseFloat(form.amount) || 0;
  const isOverBudget = requested > available;
  const utilizationAfter = calcUtilizationPct(allotment ? allotment.obligated + requested : requested, allotment?.total || 1);

  const expenseAccounts = CHART_OF_ACCOUNTS.filter((a) => a.type === 'EXPENSE');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return;
    onSubmit({
      fundCluster: form.fundCluster,
      allotmentClass: form.allotmentClass,
      responsibilityCenter: form.responsibilityCenter,
      mfoPap: form.mfoPap,
      accountCode: form.accountCode,
      amount: parseFloat(form.amount),
      particulars: form.particulars,
      purpose: form.purpose,
      payeeName: form.payeeName,
      payeeTIN: form.payeeTIN,
      address: form.address,
      modeOfPayment: form.modeOfPayment
    });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-title">New Budget Utilization Request</div>
          <div className="page-subtitle">
            BUR No. will be auto-generated upon submission
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" form="bur-form" type="submit" disabled={isOverBudget || !form.amount}>
            Save as Draft
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
              <div className="card-header"><div className="card-title">Fund Classification</div></div>
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

                <div className="form-group">
                  <label className="form-label">Expense Account <span className="required">*</span></label>
                  <select className="form-control" value={form.accountCode} onChange={set('accountCode')}>
                    {expenseAccounts.map((a) => (
                      <option key={a.code} value={a.code}>{a.code} — {a.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>


            
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header"><div className="card-title">Payee Details</div></div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Payee Name</label>
                  <input type="text" className="form-control" placeholder="Full name or business name"
                    value={form.payeeName} onChange={set('payeeName')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Payee TIN</label>
                  <input type="text" className="form-control" placeholder="000-000-000-000"
                    value={form.payeeTIN} onChange={set('payeeTIN')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" placeholder="Full address"
                    value={form.address} onChange={set('address')} />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Mode of Payment</label>
                  <select className="form-control" value={form.modeOfPayment} onChange={set('modeOfPayment')}>
                    <option value="Check">Check</option>
                    <option value="LDDAP-ADA">LDDAP-ADA</option>
                    <option value="Cash">Cash</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="card">
              <div className="card-header"><div className="card-title">Request Details</div></div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Requesting Office / Responsibility Center <span className="required">*</span></label>
                  <select className="form-control" value={form.responsibilityCenter} onChange={set('responsibilityCenter')}>
                    {RESPONSIBILITY_CENTERS.map((rc) => (
                      <option key={rc.code} value={rc.code}>{rc.code} — {rc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">MFO/PAP Code <span className="required">*</span></label>
                  <select className="form-control" value={form.mfoPap} onChange={set('mfoPap')}>
                    {MFO_PAP_CODES.map((m) => (
                      <option key={m.code} value={m.code}>{m.code} — {m.name}</option>
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
                    placeholder="Describe the nature of expenditure..."
                    value={form.particulars}
                    onChange={set('particulars')}
                  />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Purpose / Justification</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter purpose and justification for the request..."
                    value={form.purpose}
                    onChange={set('purpose')}
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
