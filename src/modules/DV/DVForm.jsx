import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { CHART_OF_ACCOUNTS } from '../../data/seedData';
import { computeTaxDeductions, TAX_OPTIONS } from '../../utils/taxEngine';
import { formatCurrency } from '../../utils/formatters';

export default function DVForm({ obligatedBURs, onSubmit, onCancel, error, initialData }) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        payeeName: initialData.payeeName || '',
        payeeTIN: initialData.payeeTIN || '',
        address: initialData.address || '',
        modeOfPayment: initialData.modeOfPayment || 'Check',
        status: initialData.status || 'APPROVED_FOR_PAYMENT',
        burRef: initialData.burRef || initialData.burNo || '',
        expenseAccountCode: initialData.expenseAccountCode || initialData.accountCode || '5021202000',
        grossClaim: initialData.grossClaim || initialData.amount || '',
        taxTypes: Array.isArray(initialData.taxTypes) ? initialData.taxTypes : ['EWT_2PCT', 'FINAL_VAT'],
        particulars: initialData.particulars || initialData.description || '',
      };
    }
    return {
      payeeName: '',
      payeeTIN: '',
      address: '',
      modeOfPayment: 'Check',
      status: 'APPROVED_FOR_PAYMENT',
      burRef: '',
      expenseAccountCode: '5021202000',
      grossClaim: '',
      taxTypes: ['EWT_2PCT', 'FINAL_VAT'],
      particulars: '',
    };
  });

  const [taxCalc, setTaxCalc] = useState({ finalVat: 0, ewt: 0, totalDeductions: 0, netAmount: 0 });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleTax = (taxCode) => {
    setForm((f) => {
      const currentTaxes = Array.isArray(f.taxTypes) ? f.taxTypes : [];
      const taxes = currentTaxes.includes(taxCode)
        ? currentTaxes.filter((t) => t !== taxCode)
        : [...currentTaxes, taxCode];
      return { ...f, taxTypes: taxes };
    });
  };

  useEffect(() => {
    const calc = computeTaxDeductions(parseFloat(form.grossClaim) || 0, form.taxTypes || []);
    setTaxCalc(calc);
  }, [form.grossClaim, form.taxTypes]);

  const selectedBUR = obligatedBURs.find((b) => b.burNo === form.burRef || b.id === form.burRef);
  const expenseAccounts = CHART_OF_ACCOUNTS.filter((a) => a.type === 'EXPENSE');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.payeeName || !form.grossClaim || parseFloat(form.grossClaim) <= 0) return;
    onSubmit({
      payeeName: form.payeeName,
      payeeTIN: form.payeeTIN,
      address: form.address,
      modeOfPayment: form.modeOfPayment,
      status: form.status,
      burRef: form.burRef || null,
      expenseAccountCode: form.expenseAccountCode,
      expenseAccountName: expenseAccounts.find((a) => a.code === form.expenseAccountCode)?.name,
      grossClaim: parseFloat(form.grossClaim),
      taxTypes: form.taxTypes,
      particulars: form.particulars,
    });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-title">New Disbursement Voucher</div>
          <div className="page-subtitle">DV No. will be auto-generated upon saving</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" form="dv-form" type="submit"
            disabled={!form.payeeName || !form.grossClaim}>
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

      <form id="dv-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            {/* Payee Info */}
            <div className="card mb-4">
              <div className="card-header"><div className="card-title">Payee Information</div></div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Payee Name <span className="required">*</span></label>
                  <input type="text" required className="form-control" placeholder="Full name or business name"
                    value={form.payeeName} onChange={set('payeeName')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Payee TIN <span className="required">*</span></label>
                  <input type="text" required className="form-control" placeholder="000-000-000-000"
                    value={form.payeeTIN} onChange={set('payeeTIN')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address <span className="required">*</span></label>
                  <input type="text" required className="form-control" placeholder="Full address"
                    value={form.address} onChange={set('address')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mode of Payment <span className="required">*</span></label>
                  <select className="form-control" value={form.modeOfPayment} onChange={set('modeOfPayment')}>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Disbursement Status <span className="required">*</span></label>
                  <select className="form-control" value={form.status} onChange={set('status')}>
                    <option value="APPROVED_FOR_PAYMENT">Approved for Payment</option>
                    <option value="FOR_CHECK_PREPARATION">For Check preparation</option>
                    <option value="FOR_RELEASE">For Release</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* BUR Link */}
            <div className="card">
              <div className="card-header"><div className="card-title">BUR Reference (Obligation Link)</div></div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Linked BUR No. (Obligation Reference)</label>
                  <select className="form-control" value={form.burRef} onChange={(e) => {
                    const refNo = e.target.value;
                    const foundBUR = obligatedBURs.find((b) => b.burNo === refNo || b.id === refNo);
                    if (foundBUR) {
                      setForm((f) => ({
                        ...f,
                        burRef: foundBUR.burNo,
                        payeeName: foundBUR.payeeName || f.payeeName,
                        address: foundBUR.address || f.address,
                        particulars: foundBUR.particulars || foundBUR.description || f.particulars,
                        expenseAccountCode: foundBUR.accountCode || f.expenseAccountCode,
                        grossClaim: foundBUR.amount || f.grossClaim,
                      }));
                    } else {
                      setForm((f) => ({ ...f, burRef: refNo }));
                    }
                  }}>
                    <option value="">— Select an Obligated BUR to link —</option>
                    {obligatedBURs.map((b) => (
                      <option key={b.id} value={b.burNo}>
                        {b.burNo} · {b.payeeName || b.office} · {formatCurrency(b.amount)}
                      </option>
                    ))}
                  </select>
                  <div className="form-hint">Selecting an obligated BUR auto-fills payee details, particulars, and account code.</div>
                </div>
                {selectedBUR && (
                  <div style={{
                    padding: 12, background: '#ECFDF5', border: '1px solid #A7F3D0',
                    borderRadius: 8, fontSize: 12, color: '#065F46',
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>✓ Linked to {selectedBUR.burNo}</div>
                    <div>Payee: <strong>{selectedBUR.payeeName}</strong></div>
                    <div>Office: {selectedBUR.office || selectedBUR.responsibilityCenter} · Allotment: {selectedBUR.allotmentClass}</div>
                    <div style={{ marginTop: 4 }}>Total Obligated Budget: <strong>{formatCurrency(selectedBUR.amount)}</strong></div>
                  </div>
                )}
                <div className="form-group" style={{ marginTop: 12, marginBottom: 0 }}>
                  <label className="form-label">Expense Account</label>
                  <select className="form-control" value={form.expenseAccountCode} onChange={set('expenseAccountCode')}>
                    {expenseAccounts.map((a) => (
                      <option key={a.code} value={a.code}>{a.code} — {a.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Amount & Taxes */}
            <div className="card mb-4">
              <div className="card-header"><div className="card-title">Claim Amount & Tax Deductions</div></div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Gross Claim Amount (₱) <span className="required">*</span></label>
                  <input type="number" className="form-control" placeholder="0.00"
                    step="0.01" min="1" value={form.grossClaim} onChange={set('grossClaim')} />
                </div>

                <div className="form-group">
                  <label className="form-label">Applicable Tax Withholdings</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {TAX_OPTIONS.map((tax) => (
                      <label key={tax.code} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', border: '1px solid',
                        borderColor: (form.taxTypes || []).includes(tax.code) ? '#D4AF37' : '#E5E7EB',
                        borderRadius: 6, cursor: 'pointer',
                        background: (form.taxTypes || []).includes(tax.code) ? 'rgba(212,175,55,0.05)' : 'white',
                        transition: 'all 150ms',
                      }}>
                        <input
                          type="checkbox"
                          checked={(form.taxTypes || []).includes(tax.code)}
                          onChange={() => toggleTax(tax.code)}
                          style={{ accentColor: '#D4AF37' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{tax.label}</div>
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#DC2626' }}>
                          ({formatCurrency(computeTaxDeductions(parseFloat(form.grossClaim) || 0, [tax.code]).totalDeductions)})
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Net Amount Summary */}
                <div style={{
                  marginTop: 16, padding: 16, background: '#F9FAFB',
                  border: '1px solid #E5E7EB', borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      ['Gross Claim', formatCurrency(parseFloat(form.grossClaim) || 0), 'normal'],
                      ['Final VAT (5%)', `(${formatCurrency(taxCalc.finalVat)})`, 'danger'],
                      ['EWT', `(${formatCurrency(taxCalc.ewt)})`, 'danger'],
                      ['Total Deductions', `(${formatCurrency(taxCalc.totalDeductions)})`, 'danger'],
                    ].map(([label, val, type]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: '#6B7280' }}>{label}</span>
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                          color: type === 'danger' ? '#DC2626' : '#374151',
                        }}>{val}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>Net Amount Payable</span>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: 16,
                        color: '#059669',
                      }}>{formatCurrency(taxCalc.netAmount || parseFloat(form.grossClaim) || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><div className="card-title">Particulars</div></div>
              <div className="card-body">
                <div className="form-group mb-0">
                  <label className="form-label">Description of Claim <span className="required">*</span></label>
                  <textarea className="form-control" rows={4}
                    placeholder="Describe the nature and purpose of this payment..."
                    value={form.particulars} onChange={set('particulars')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
