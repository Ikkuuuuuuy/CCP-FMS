import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, BarChart2, FileText, CreditCard, BookOpen,
  ClipboardList, History, Users, LogOut, ChevronDown, User, UserCheck
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

// Authentic Official Cultural Center of the Philippines (CCP) Emblem Processor
function CCPOfficialEmblem({ size = 36 }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = '/ccp-official-logo.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Crop top 72% which contains the golden emblem mark
      const cropHeight = Math.floor(img.height * 0.72);
      canvas.width = img.width;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, cropHeight, 0, 0, img.width, cropHeight);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Convert white/light grey background pixels to 100% transparent
        if (r > 190 && g > 190 && b > 190) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setDataUrl(canvas.toDataURL());
    };
  }, []);

  if (!dataUrl) {
    return <div style={{ width: `${size}px`, height: `${size}px`, flexShrink: 0 }} />;
  }

  return (
    <img
      src={dataUrl}
      alt="Official CCP Emblem"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        flexShrink: 0,
      }}
    />
  );
}

// Categorized Navigation Sections matching modern sidebar design
const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'bur', label: 'Budget Requests (BUR)', icon: FileText, badgeKey: 'bur' },
      { id: 'dv', label: 'Disbursement Vouchers', icon: CreditCard, badgeKey: 'dv' },
    ]
  },
  {
    title: 'Ledgers & Processing',
    items: [
      { id: 'ledger', label: 'Credit & Collections', icon: BookOpen, badgeKey: 'ledger' },
      { id: 'work-assignments', label: 'Work Assignments', icon: UserCheck },
    ]
  },
  {
    title: 'Reports & Logs',
    items: [
      { id: 'reports', label: 'Financial Reports', icon: BarChart2 },
      { id: 'audit', label: 'Audit Logs', icon: ClipboardList },
      { id: 'transactions', label: 'Transaction Logs', icon: History },
    ]
  },
  {
    title: 'User Management',
    items: [
      { id: 'users', label: 'Users & Roles', icon: Users, adminOnly: true },
      { id: 'account', label: 'Account Overview', icon: User },
    ]
  }
];

export default function Sidebar({ activePage, onNavigate, mobileOpen, onCloseMobile }) {
  const { state, dispatch } = useApp();
  const { currentUser, burs = [], dvs = [], subsidiaryLedgers = [] } = state;
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const roleUpper = (currentUser?.role || '').toUpperCase();
  const isAdmin = roleUpper === 'IT/ADMIN' || roleUpper === 'ADMIN';

  // Compute dynamic badge numbers
  const pendingBURCount = burs.filter(b => b.status === 'PREPARED' || b.status === 'BOX_A_SUBMITTED').length;
  const pendingDVCount = dvs.filter(d => d.status === 'PREPARED' || d.status === 'SUBMITTED' || d.status === 'ACCOUNTING_VERIFIED').length;
  const activeLedgersCount = subsidiaryLedgers.length;

  const getBadgeCount = (badgeKey) => {
    if (badgeKey === 'bur') return pendingBURCount > 0 ? pendingBURCount : null;
    if (badgeKey === 'dv') return pendingDVCount > 0 ? pendingDVCount : null;
    if (badgeKey === 'ledger') return activeLedgersCount > 0 ? activeLedgersCount : null;
    return null;
  };

  const isItemVisible = (item) => {
    if (isAdmin) return true;
    if (item.adminOnly) return false;
    
    const perms = currentUser?.permissions || [];
    if (perms.includes('all')) return true;
    
    switch (item.id) {
      case 'dashboard':
        return roleUpper !== 'BOOKKEEPER';
      case 'bur':
        return perms.includes('bur.view');
      case 'dv':
        return perms.includes('dv.view');
      case 'ledger':
        return perms.includes('ledger.view');
      case 'reports':
        return roleUpper !== 'BOOKKEEPER'; 
      case 'audit':
        return perms.includes('audit.view');
      case 'transactions':
        return perms.includes('logs.view') || roleUpper === 'DIVISION CHIEF';
      case 'work-assignments':
        return true;
      case 'account':
        return true;
      default:
        return false;
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="mobile-backdrop"
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(3px)', zIndex: 250, cursor: 'pointer'
          }}
        />
      )}

      <aside className={`no-print sidebar-drawer ${mobileOpen ? 'mobile-open' : ''}`} style={{
        width: 'var(--sidebar-width, 256px)',
        minWidth: 'var(--sidebar-width, 256px)',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#0F172A', // Modern Dark Navy Slate Sidebar
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 300,
        boxSizing: 'border-box',
        transition: 'transform 0.25s ease, width 0.2s ease'
      }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* === BRAND HEADER (Height aligned with TopBar) === */}
        <div style={{
          height: 'var(--topbar-height, 90px)',
          padding: '0 12px',
          borderBottom: '1px solid rgba(212,175,55,0.4)',
          backgroundColor: '#8C1515', // CCP Official Crimson Red Top Banner
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
          transition: 'height 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Official CCP Golden Logo Emblem */}
            <CCPOfficialEmblem size={72} />

            <div>
              <div style={{
                fontSize: '12.5px',
                fontWeight: 900,
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#FFFFFF',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                lineHeight: '1.25',
                whiteSpace: 'nowrap'
              }}>
                CULTURAL CENTER<br />OF THE PHILIPPINES
              </div>
            </div>
          </div>
        </div>

        {/* === CATEGORIZED NAVIGATION LIST === */}
        <nav style={{ padding: '12px 10px 24px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_SECTIONS.map((section, secIdx) => {
            const visibleItems = section.items.filter(isItemVisible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} style={{ marginTop: secIdx > 0 ? '12px' : '4px' }}>
                {/* Section Header Title */}
                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748B', // Soft Slate Category Title
                  padding: '6px 12px',
                  letterSpacing: '0.03em',
                  textTransform: 'none',
                  userSelect: 'none'
                }}>
                  {section.title}
                </div>

                {/* Section Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                  {visibleItems.map(({ id, label, icon: Icon, badgeKey }) => {
                    const isActive = activePage === id;
                    const badgeCount = badgeKey ? getBadgeCount(badgeKey) : null;

                    return (
                      <button
                        key={id}
                        onClick={() => {
                          onNavigate(id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: isActive ? 700 : 500,
                          textAlign: 'left',
                          cursor: 'pointer',
                          border: 'none',
                          backgroundColor: isActive ? '#1E293B' : 'transparent', // Solid active highlight container
                          color: isActive ? '#FFFFFF' : '#94A3B8',
                          boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.25)' : 'none',
                          transition: 'all 150ms ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.color = '#F1F5F9';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#94A3B8';
                          }
                        }}
                      >
                        <Icon
                          size={17}
                          style={{
                            color: isActive ? '#D4AF37' : '#64748B',
                            flexShrink: 0,
                            transition: 'color 150ms ease'
                          }}
                        />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {label}
                        </span>

                        {/* Optional Numeric Badge Pill */}
                        {badgeCount !== null && (
                          <span style={{
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '1px 7px',
                            borderRadius: '12px',
                            lineHeight: 1.3,
                            flexShrink: 0,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          }}>
                            {badgeCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* === USER FOOTER WITH DROPDOWN MENU === */}
      <div style={{
        position: 'relative',
        padding: '12px 14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#0B1120', // Sleek Footer Base
      }}>
        {/* User Card Trigger */}
        <div
          onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            borderRadius: '8px',
            backgroundColor: showRoleSwitcher ? '#1E293B' : 'rgba(255,255,255,0.03)',
            border: showRoleSwitcher ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'all 150ms ease'
          }}
          title="Account Menu"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #BFA046, #E5C158)',
              color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '11px', flexShrink: 0,
              overflow: 'hidden', border: '1.5px solid rgba(212,175,55,0.6)'
            }}>
              {currentUser?.avatarPhoto ? (
                <img
                  src={currentUser.avatarPhoto}
                  alt={currentUser.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                currentUser?.avatar || 'JR'
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.name || 'Jose Reyes'}
              </div>
              <div style={{ fontSize: '10px', color: '#E5C158', fontWeight: 600 }}>
                {currentUser?.roleLabel || 'IT/ADMIN'}
              </div>
            </div>
          </div>

          <ChevronDown size={15} style={{ color: '#E5C158', transform: showRoleSwitcher ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease', flexShrink: 0 }} />
        </div>

        {/* Dropdown Popup Menu (Account Overview & Sign Out Only) */}
        {showRoleSwitcher && (
          <div style={{
            position: 'absolute', bottom: '100%', left: '10px', right: '10px', marginBottom: '8px',
            backgroundColor: '#1E293B', border: '1px solid rgba(212,175,55,0.35)', borderRadius: '10px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)', overflow: 'hidden', zIndex: 120
          }}>
            {/* Account Overview Quick Action Button */}
            <div
              onClick={() => { onNavigate('account'); setShowRoleSwitcher(false); }}
              style={{
                padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#FDE68A',
                display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                backgroundColor: 'rgba(212,175,55,0.12)', borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <User size={16} style={{ color: '#D4AF37' }} />
              <span>Account Overview</span>
            </div>

            {/* Sign Out Action Button */}
            <div
              onClick={() => { dispatch({ type: 'LOGOUT' }); setShowRoleSwitcher(false); }}
              style={{
                padding: '12px 14px', fontSize: '13px', color: '#F87171', display: 'flex', alignItems: 'center', gap: '10px',
                cursor: 'pointer', fontWeight: 700, backgroundColor: 'rgba(239, 68, 68, 0.08)'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  </>
  );
}
