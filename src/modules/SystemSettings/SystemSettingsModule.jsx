import React, { useState } from 'react';
import { Settings, Sliders, Database, ShieldCheck, FileCheck, CheckCircle, Save, RefreshCw } from 'lucide-react';

export default function SystemSettingsModule() {
  const [fiscalYear, setFiscalYear] = useState('FY 2026 GAA');
  const [strictEnforce, setStrictEnforce] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [govPkiRequired, setGovPkiRequired] = useState(true);

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF', padding: '20px 24px', borderRadius: '12px',
        border: '1px solid #E8E2D9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1A1209', margin: 0 }}>System Settings & Controls</h2>
          <p style={{ fontSize: '13px', color: '#6B6355', marginTop: '2px' }}>
            Configure financial rules, allotment checks, tax deduction engine, and compliance security
          </p>
        </div>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '9px 18px', borderRadius: '6px', backgroundColor: '#8C1515',
          color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
        }}>
          <Save size={15} /> Save Changes
        </button>
      </div>

      {/* 2x2 Executive Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Card 1: Fiscal Year & Budget Controls */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
          padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
            <Sliders size={20} style={{ color: '#8C1515' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Fiscal Year & Allotment Rules</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>General Appropriations Act (GAA) & budget balance enforcement</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Active Fiscal Year (FY)</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Current operational budget year</div>
              </div>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB',
                  fontSize: '12px', fontWeight: 700, backgroundColor: '#FFFBEB', color: '#B45309'
                }}
              >
                <option value="FY 2026 GAA">FY 2026 GAA (Current)</option>
                <option value="FY 2025 GAA">FY 2025 GAA (Closed)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '8px', borderTop: '1px dashed #F3F4F6' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Real-time Allotment Balance Check</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Block BUR creation if requested amount exceeds balance</div>
              </div>
              <button
                onClick={() => setStrictEnforce(!strictEnforce)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer',
                  backgroundColor: strictEnforce ? '#ECFDF5' : '#FEF2F2',
                  color: strictEnforce ? '#047857' : '#DC2626',
                  border: strictEnforce ? '1px solid #A7F3D0' : '1px solid #FCA5A5'
                }}
              >
                {strictEnforce ? 'STRICT ENFORCE' : 'ALLOW OVERDRAFT'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Tax Withholding Engine */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
          padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
            <FileCheck size={20} style={{ color: '#BFA046' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Tax Deduction Engine Rules</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Automated BIR withholding tax rules for DVs</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Final VAT Tax Deduction Rate</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Government supplier Final VAT</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#92400E' }}>
                5% Final VAT
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '8px', borderTop: '1px dashed #F3F4F6' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Expanded Withholding Tax (EWT)</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Goods & services withholding rate</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#1E40AF' }}>
                1% Goods / 2% Services
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Database & Security Audit */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
          padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
            <Database size={20} style={{ color: '#2563EB' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Database & Backup Retention</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>COA-compliant record retention and daily backups</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Automated Daily Backups</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Scheduled nightly backup at 02:00 AM</div>
              </div>
              <button
                onClick={() => setAutoBackup(!autoBackup)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer',
                  backgroundColor: autoBackup ? '#ECFDF5' : '#F3F4F6',
                  color: autoBackup ? '#047857' : '#6B7280',
                  border: autoBackup ? '1px solid #A7F3D0' : '1px solid #E5E7EB'
                }}
              >
                {autoBackup ? 'ACTIVE' : 'PAUSED'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '8px', borderTop: '1px dashed #F3F4F6' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Audit Trail Retention Period</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Government financial audit legal mandate</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>
                7 Years
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Compliance Security */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
          padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
            <ShieldCheck size={20} style={{ color: '#059669' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>GovPKI Security & Signatures</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>DICT PKI digital certificate enforcement</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>GovPKI Digital Signature Mandate</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Require digital signing for BUR/DV approvals</div>
              </div>
              <button
                onClick={() => setGovPkiRequired(!govPkiRequired)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer',
                  backgroundColor: govPkiRequired ? '#ECFDF5' : '#FEF2F2',
                  color: govPkiRequired ? '#047857' : '#DC2626',
                  border: govPkiRequired ? '1px solid #A7F3D0' : '1px solid #FCA5A5'
                }}
              >
                {govPkiRequired ? 'ENFORCED' : 'OPTIONAL'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '8px', borderTop: '1px dashed #F3F4F6' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Ledger Health Check</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Double-entry debit/credit verification</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#047857' }}>
                BALANCED (0 DISCREPANCIES)
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
