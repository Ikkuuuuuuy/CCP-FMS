import React from 'react';
import { STATUS_CONFIG } from '../utils/formatters';

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
  return (
    <span
      className="status-badge"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span className="status-dot" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}
