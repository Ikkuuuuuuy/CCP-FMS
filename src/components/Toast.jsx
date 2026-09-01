import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export default function Toast({ 
  show, 
  onClose, 
  title, 
  message, 
  type = 'success', 
  duration = 4500,
  actionButton
}) {
  useEffect(() => {
    if (!show || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const typeConfig = {
    success: {
      bg: '#064E3B',
      border: '#059669',
      iconColor: '#34D399',
      titleColor: '#ECFDF5',
      msgColor: '#D1FAE5',
      Icon: CheckCircle2,
    },
    info: {
      bg: '#1E3A8A',
      border: '#3B82F6',
      iconColor: '#60A5FA',
      titleColor: '#EFF6FF',
      msgColor: '#DBEAFE',
      Icon: Info,
    },
    warning: {
      bg: '#78350F',
      border: '#D97706',
      iconColor: '#FBBF24',
      titleColor: '#FFFBEB',
      msgColor: '#FEF3C7',
      Icon: AlertCircle,
    },
    error: {
      bg: '#7F1D1D',
      border: '#DC2626',
      iconColor: '#F87171',
      titleColor: '#FEF2F2',
      msgColor: '#FEE2E2',
      Icon: XCircle,
    },
  };

  const config = typeConfig[type] || typeConfig.success;
  const { Icon } = config;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 99999,
        maxWidth: '440px',
        minWidth: '320px',
        backgroundColor: config.bg,
        color: '#FFFFFF',
        borderRadius: '10px',
        border: `1.5px solid ${config.border}`,
        boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.3), 0 8px 16px -6px rgba(0, 0, 0, 0.2)',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        animation: 'slideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <Icon size={22} style={{ color: config.iconColor }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{ fontWeight: 800, fontSize: '14px', color: config.titleColor, marginBottom: '4px', letterSpacing: '-0.2px' }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: '12.5px', lineHeight: '1.45', color: config.msgColor, wordBreak: 'break-word', fontWeight: 500 }}>
          {message}
        </div>
        {actionButton && (
          <div style={{ marginTop: '8px' }}>
            {actionButton}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: config.msgColor,
          opacity: 0.75,
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.15s, background-color 0.15s',
          marginLeft: '4px',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        title="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
