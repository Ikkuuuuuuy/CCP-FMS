import React, { useState, useEffect } from 'react';
import { Bell, LogOut, CheckCircle, FileText, CreditCard, Calendar, Clock, ShieldCheck, Menu } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const PAGE_NAMES = {
  dashboard:    'ANALYTICS & OVERVIEW',
  reports:      'FINANCIAL REPORTS',
  bur:          'BUDGET UTILIZATION REQUESTS',
  dv:           'DISBURSEMENT VOUCHERS',
  ledger:       'CREDIT & COLLECTIONS',
  audit:        'AUDIT LOGS',
  account:      'ACCOUNT OVERVIEW',
  transactions: 'TRANSACTION LOGS',
  users:        'USER MANAGEMENT',
};

export default function TopBar({ activePage, onNavigate, onToggleMobile }) {
  const { state, dispatch } = useApp();
  const { burs = [], dvs = [], journalEntries = [], currentUser } = state;

  const [showNotifications, setShowNotifications] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
  const [timeString, setTimeString] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeString(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Accurate Live System Notifications
  const pendingBURs = burs.filter(b => b.status === 'PREPARED' || b.status === 'APPROVED' || b.status === 'FORWARDED_TO_TREASURY');
  const pendingDVs = dvs.filter(d => d.status === 'PENDING_ACCOUNTING' || d.status === 'APPROVED_FOR_PAYMENT' || d.status === 'PREPARED');
  const paidDVs = dvs.filter(d => d.status === 'PAID');

  const accurateNotifications = [
    {
      id: 'notif-bur',
      title: `${pendingBURs.length} Pending BUR Obligations`,
      time: 'Requires Budget Certification',
      type: 'warning',
      actionPage: 'bur',
    },
    {
      id: 'notif-dv',
      title: `${pendingDVs.length} DVs Awaiting Accounting/Check Approval`,
      time: 'Action Required',
      type: 'info',
      actionPage: 'dv',
    },
    {
      id: 'notif-paid',
      title: `${paidDVs.length} Paid Disbursements Logged`,
      time: 'General Ledger Posted',
      type: 'success',
      actionPage: 'ledger',
    },
  ];

  const unreadCount = accurateNotifications.filter((n) => !readIds.has(n.id)).length;

  const markAllRead = () => {
    setReadIds(new Set(accurateNotifications.map(n => n.id)));
  };

  return (
    <header className="no-print topbar-header" style={{
      position: 'fixed',
      top: 0,
      right: 0,
      left: 'var(--sidebar-width, 256px)',
      height: 'var(--topbar-height, 90px)',
      background: 'linear-gradient(90deg, #8C1515 0%, #A31B1B 50%, #8C1515 100%)',
      borderBottom: '2px solid rgba(212,175,55,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 90,
      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      boxSizing: 'border-box',
      transition: 'left 0.2s ease, height 0.2s ease, padding 0.2s ease'
    }}>
      {/* Background Subtle Heritage Grid Glow */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      {/* Header Left Title Section & Mobile Hamburger */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onToggleMobile}
          className="mobile-hamburger-btn"
          aria-label="Toggle navigation menu"
          style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(212,175,55,0.4)',
            color: '#FFF', width: 36, height: 36, borderRadius: 8, display: 'none',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <Menu size={20} />
        </button>

        <h1 className="topbar-title" style={{
          fontSize: '24px',
          fontWeight: 900,
          fontFamily: "'Playfair Display', Georgia, serif",
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          margin: 0,
          color: '#FFFFFF',
          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap'
        }}>
          FINANCIAL MANAGEMENT SYSTEM
        </h1>
      </div>

      {/* Header Right Controls */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Date & Live Real-Time Digital Clock Widget */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '20px', padding: '6px 14px', color: '#FDE68A', fontSize: '11px', fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} style={{ color: '#D4AF37' }} />
            <span>Aug 02, 2026</span>
          </div>
          <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FDE68A', fontWeight: 700, fontFamily: 'monospace' }}>
            <Clock size={13} style={{ color: '#D4AF37' }} />
            <span>{timeString}</span>
          </div>
        </div>

        {/* Real Interactive Notifications Bell Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative', backgroundColor: showNotifications ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(212,175,55,0.35)', width: '40px', height: '40px', borderRadius: '50%',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'all 150ms ease'
            }}
            title="Notifications"
          >
            <Bell size={18} style={{ color: '#FDE68A' }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-1px', right: '-1px', width: '17px', height: '17px',
                backgroundColor: '#EF4444', color: '#FFFFFF', fontWeight: 800, fontSize: '9px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #8C1515'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Floating Notifications Panel */}
          {showNotifications && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '12px', width: '330px',
              backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px',
              boxShadow: '0 12px 35px rgba(0,0,0,0.25)', padding: '14px 0', zIndex: 120
            }}>
              <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{ fontSize: '11px', fontWeight: 600, color: '#8C1515', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {accurateNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setReadIds(prev => new Set([...prev, n.id]))}
                    style={{
                      padding: '10px 16px', display: 'flex', gap: '12px', borderBottom: '1px solid #F9FAFB',
                      backgroundColor: n.unread ? '#FEFCE8' : 'transparent', cursor: 'pointer'
                    }}
                  >
                    <div style={{ marginTop: '2px', color: n.type === 'bur' ? '#D97706' : n.type === 'dv' ? '#DC2626' : n.type === 'security' ? '#8C1515' : '#059669' }}>
                      {n.type === 'bur' ? <FileText size={16} /> : n.type === 'dv' ? <CreditCard size={16} /> : <CheckCircle size={16} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{n.title}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '1px' }}>{n.desc}</div>
                      <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '4px' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exit / Sign Out Button */}
        <button
          onClick={() => dispatch({ type: 'LOGOUT' })}
          style={{
            backgroundColor: 'rgba(0,0,0,0.25)', border: '1px solid rgba(212,175,55,0.35)',
            width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDE68A',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>

      </div>
    </header>
  );
}
