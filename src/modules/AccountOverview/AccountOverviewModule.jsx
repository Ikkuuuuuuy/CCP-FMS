import React, { useState } from 'react';
import { Wallet, UserCheck, Shield, Key, History, Smartphone, Globe, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function AccountOverviewModule() {
  const { state } = useApp();
  const { currentUser } = state;
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const activeSessions = [
    { id: 1, device: 'Chrome on Windows 11 (Current)', ip: '112.198.102.45', location: 'CCP Complex, Pasay City', time: 'Active Now' },
    { id: 2, device: 'Safari on iPad Pro', ip: '112.198.102.88', location: 'CCP Admin Building', time: '2 hours ago' },
  ];

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF', padding: '20px 24px', borderRadius: '12px',
        border: '1px solid #E8E2D9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1A1209', margin: 0 }}>Account Overview</h2>
          <p style={{ fontSize: '13px', color: '#6B6355', marginTop: '2px' }}>
            User profile details, role permissions matrix, and GovPKI security authentication
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px', backgroundColor: '#ECFDF5',
            color: '#065F46', border: '1px solid #A7F3D0', fontSize: '12px', fontWeight: 700
          }}>
            <CheckCircle size={14} /> GovPKI Certified Active Account
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        
        {/* Left Column: User Profile Card */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
          padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', textAling: 'center'
        }}>
          {/* Avatar Circle */}
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #BFA046, #D4AF37)', color: '#000',
            fontSize: '30px', fontWeight: 800, display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 6px 16px rgba(191,160,70,0.3)',
            marginBottom: '16px', border: '3px solid #FFF'
          }}>
            {currentUser?.avatar || 'JR'}
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1A1209', margin: 0 }}>
            {currentUser?.name || 'Jose Reyes'}
          </h3>
          <span style={{
            display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#8C1515',
            backgroundColor: '#FDF0F0', border: '1px solid rgba(140,21,21,0.2)',
            padding: '3px 12px', borderRadius: '12px', marginTop: '6px'
          }}>
            {currentUser?.roleLabel || 'Admin / Budget Officer'}
          </span>
          <p style={{ fontSize: '12px', color: '#6B6355', marginTop: '8px' }}>
            {currentUser?.email || 'jose.reyes@culturalcenter.gov.ph'}
          </p>

          {/* Profile Details List */}
          <div style={{
            width: '100%', borderTop: '1px solid #F3F4F6', marginTop: '20px', pt: '16px',
            display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>Division / Office:</span>
              <span style={{ fontWeight: 700, color: '#1A1209' }}>{currentUser?.division || 'Financial Services Division (FSD)'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>User Account ID:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#8C1515' }}>{currentUser?.id || 'CCP-USER-001'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>GovPKI Cert Serial:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#059669', fontWeight: 600 }}>PH-DICT-88942-PKI</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>Account Status:</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>ACTIVE & CERTIFIED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B6355', fontWeight: 500 }}>Last Login:</span>
              <span style={{ color: '#4B5563', fontWeight: 600 }}>Today, 08:30 AM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Permissions & Security Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Role Permissions Matrix */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
            padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Shield size={20} style={{ color: '#BFA046' }} />
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1209', margin: 0 }}>Role Permissions & Access Matrix</h4>
                <p style={{ fontSize: '12px', color: '#6B6355', margin: 0 }}>System scopes granted under COA/GAM security protocols</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(currentUser?.permissions || [
                'bur.create', 'bur.certify', 'bur.approve', 'dv.create', 'dv.certify',
                'ledger.entry', 'ledger.view', 'audit.export', 'system.configure'
              ]).map((perm) => (
                <span
                  key={perm}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '6px', backgroundColor: '#F8F6F3',
                    border: '1px solid #E8E2D9', fontSize: '11px', fontFamily: 'monospace',
                    fontWeight: 600, color: '#1A1209'
                  }}
                >
                  <CheckCircle size={12} style={{ color: '#059669' }} />
                  {perm}
                </span>
              ))}
            </div>
          </div>

          {/* Security & Authentication Options */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
            padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Lock size={20} style={{ color: '#2563EB' }} />
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1209', margin: 0 }}>GovPKI Security & 2FA Settings</h4>
                <p style={{ fontSize: '12px', color: '#6B6355', margin: 0 }}>Multi-factor authentication and session management</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>GovPKI Digital Certificate (2FA)</div>
                  <div style={{ fontSize: '12px', color: '#6B6355' }}>Mandatory digital signing for BUR obligations & DV approvals</div>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  style={{
                    padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    backgroundColor: twoFactorEnabled ? '#ECFDF5' : '#FEF2F2',
                    color: twoFactorEnabled ? '#047857' : '#DC2626',
                    border: twoFactorEnabled ? '1px solid #A7F3D0' : '1px solid #FCA5A5'
                  }}
                >
                  {twoFactorEnabled ? 'ENABLED & VERIFIED' : 'DISABLED'}
                </button>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Automatic Session Timeout</div>
                  <div style={{ fontSize: '12px', color: '#6B6355' }}>Locks session after inactivity to prevent unauthorized access</div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>30 Minutes</span>
              </div>
            </div>
          </div>

          {/* Active Sessions Table */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
            padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1209', margin: '0 0 12px 0' }}>Active Login Sessions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '8px', border: '1px solid #F3F4F6', backgroundColor: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Globe size={18} style={{ color: '#6B6355' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{session.device}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>IP: {session.ip} · {session.location}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                    backgroundColor: session.time === 'Active Now' ? '#ECFDF5' : '#F3F4F6',
                    color: session.time === 'Active Now' ? '#047857' : '#6B7280'
                  }}>
                    {session.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
