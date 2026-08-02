import React, { useState } from 'react';
import { Sliders, CheckCircle, RefreshCw, Server, Landmark, ShieldCheck, FileCheck, ArrowUpRight } from 'lucide-react';

const INITIAL_INTEGRATIONS = [
  {
    name: 'Landbank eMDS (Modified Disbursement Scheme)',
    status: 'Connected',
    desc: 'Landbank of the Philippines eMDS API gateway for Advice of Checks Issued & LDDAP-ADA submission',
    code: 'LBP-MDS-v2.4',
    latency: '42ms',
    lastSync: '5 mins ago',
    icon: Landmark,
    color: '#059669'
  },
  {
    name: 'GovPKI Digital Certificate Gateway',
    status: 'Active',
    desc: 'DICT National PKI certificate authentication engine for digital BUR/DV signatures',
    code: 'DICT-PKI-v1.8',
    latency: '18ms',
    lastSync: 'Just now',
    icon: ShieldCheck,
    color: '#2563EB'
  },
  {
    name: 'PhilGEPS e-Procurement Gateway',
    status: 'Syncing',
    desc: 'Public bidding, Notice of Award, and BAC contract matching portal',
    code: 'GEPS-API-v4.1',
    latency: '120ms',
    lastSync: '12 mins ago',
    icon: Server,
    color: '#D97706'
  },
  {
    name: 'BIR Online Tax Filing (eFPS)',
    status: 'Connected',
    desc: 'Automated 2307 & 1600 tax report exports and electronic filing portal',
    code: 'BIR-eFPS-v3.0',
    latency: '65ms',
    lastSync: '1 hour ago',
    icon: FileCheck,
    color: '#8C1515'
  },
];

export default function IntegrationsModule() {
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [syncingCode, setSyncingCode] = useState(null);

  const handleSync = (code) => {
    setSyncingCode(code);
    setTimeout(() => {
      setIntegrations(prev => prev.map(item => item.code === code ? { ...item, lastSync: 'Just now', status: 'Connected' } : item));
      setSyncingCode(null);
    }, 1200);
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF', padding: '20px 24px', borderRadius: '12px',
        border: '1px solid #E8E2D9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1A1209', margin: 0 }}>System Integrations</h2>
          <p style={{ fontSize: '13px', color: '#6B6355', marginTop: '2px' }}>
            Government portal gateways, Landbank eMDS APIs, DICT GovPKI, and BIR eFPS connectors
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px', backgroundColor: '#ECFDF5',
            color: '#065F46', border: '1px solid #A7F3D0', fontSize: '12px', fontWeight: 700
          }}>
            <CheckCircle size={14} /> 4 / 4 Gateways Online
          </span>
        </div>
      </div>

      {/* 2x2 Integration Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {integrations.map((item) => {
          const Icon = item.icon;
          const isSyncing = syncingCode === item.code;
          return (
            <div
              key={item.code}
              style={{
                backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
                padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex',
                flexDirection: 'column', justifyContent: 'space-between', gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#F8F6F3',
                      border: '1px solid #E8E2D9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: item.color, flexShrink: 0
                    }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1209', margin: 0, lineHeight: '1.3' }}>
                        {item.name}
                      </h3>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6B7280' }}>
                        {item.code}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800,
                    backgroundColor: item.status === 'Connected' || item.status === 'Active' ? '#ECFDF5' : '#FEF3C7',
                    color: item.status === 'Connected' || item.status === 'Active' ? '#047857' : '#B45309',
                    border: item.status === 'Connected' || item.status === 'Active' ? '1px solid #A7F3D0' : '1px solid #FDE68A'
                  }}>
                    <CheckCircle size={12} />
                    {item.status}
                  </span>
                </div>

                <p style={{ fontSize: '12.5px', color: '#4B5563', margin: 0, lineHeight: '1.5' }}>
                  {item.desc}
                </p>
              </div>

              {/* Card Footer Details */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '14px', borderTop: '1px solid #F3F4F6', fontSize: '11px', color: '#6B7280'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span>Latency: <strong style={{ color: '#111827' }}>{item.latency}</strong></span>
                  <span>Last Sync: <strong style={{ color: '#111827' }}>{item.lastSync}</strong></span>
                </div>

                <button
                  onClick={() => handleSync(item.code)}
                  disabled={isSyncing}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '6px', backgroundColor: '#F8F6F3',
                    color: '#8C1515', border: '1px solid #E8E2D9', fontSize: '11px', fontWeight: 700,
                    cursor: isSyncing ? 'wait' : 'pointer', transition: 'all 150ms ease'
                  }}
                >
                  <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                  {isSyncing ? 'Syncing...' : 'Sync Gateway'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
