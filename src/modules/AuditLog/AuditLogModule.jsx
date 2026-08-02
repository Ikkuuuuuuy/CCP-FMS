import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatDateTime } from '../../utils/formatters';

const ACTION_COLORS = {
  CREATE: { color: '#2563EB', bg: '#EFF6FF' },
  SUBMIT: { color: '#7C3AED', bg: '#F5F3FF' },
  CERTIFY: { color: '#059669', bg: '#ECFDF5' },
  REJECT: { color: '#DC2626', bg: '#FEF2F2' },
  ADVANCE: { color: '#D97706', bg: '#FFFBEB' },
  PAID: { color: '#065F46', bg: '#D1FAE5' },
  POST: { color: '#0891B2', bg: '#ECFEFF' },
};

export default function AuditLogModule() {
  const { state } = useApp();
  const { auditLog } = state;
  const [searchText, setSearchText] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');
  const [filterAction, setFilterAction] = useState('ALL');
  const [expandedLog, setExpandedLog] = useState(null);

  const filtered = auditLog.filter((entry) => {
    const matchModule = filterModule === 'ALL' || entry.module === filterModule;
    const matchAction = filterAction === 'ALL' || entry.action_type === filterAction;
    const matchSearch = !searchText ||
      entry.document_ref?.toLowerCase().includes(searchText.toLowerCase()) ||
      entry.actor_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      entry.action_type?.toLowerCase().includes(searchText.toLowerCase());
    return matchModule && matchAction && matchSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-title">Audit Log</div>
          <div className="page-subtitle">
            {auditLog.length} total entries · Immutable activity trail & security record
          </div>
        </div>
        <div style={{
          padding: '8px 14px',
          background: '#ECFDF5', border: '1px solid #A7F3D0',
          borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#065F46',
        }}>
          🔒 Tamper-Evident Log
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={14} className="search-input-icon" />
          <input type="text" className="form-control search-input"
            placeholder="Search by reference, actor, or action..."
            value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 'auto' }}
          value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
          <option value="ALL">All Modules</option>
          <option value="BUR">BUR</option>
          <option value="DV">DV</option>
          <option value="LEDGER">Ledger</option>
        </select>
        <select className="form-control" style={{ width: 'auto' }}
          value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
          <option value="ALL">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="SUBMIT">Submit</option>
          <option value="CERTIFY">Certify</option>
          <option value="REJECT">Reject</option>
          <option value="ADVANCE">Advance</option>
          <option value="PAID">Paid</option>
          <option value="POST">Post</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="grid-empty" style={{ padding: 64 }}>
            <div className="grid-empty-icon">📋</div>
            <div className="grid-empty-text">No audit entries found</div>
            <div className="grid-empty-sub">The audit log captures every state-changing action in the FMS.</div>
          </div>
        </div>
      ) : (
        <div className="data-grid-wrapper">
          <table className="data-grid">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Module</th>
                <th>Action</th>
                <th>Document Reference</th>
                <th className="text-center">Delta</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice().reverse().map((entry) => {
                const actionConf = ACTION_COLORS[entry.action_type] || { color: '#6B7280', bg: '#F3F4F6' };
                const isExpanded = expandedLog === entry.log_id;
                const hasDelta = entry.payload_delta?.old || entry.payload_delta?.new;
                return (
                  <>
                    <tr key={entry.log_id} onClick={() => hasDelta && setExpandedLog(isExpanded ? null : entry.log_id)}
                      style={{ cursor: hasDelta ? 'pointer' : 'default' }}>
                      <td className="mono" style={{ fontSize: 11 }}>{entry.log_id}</td>
                      <td style={{ fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap' }}>
                        {formatDateTime(entry.timestamp)}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>{entry.actor_name}</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>{entry.actor_id}</div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px',
                          background: entry.module === 'BUR' ? '#EFF6FF' : entry.module === 'DV' ? '#F5F3FF' : '#ECFEFF',
                          color: entry.module === 'BUR' ? '#2563EB' : entry.module === 'DV' ? '#7C3AED' : '#0891B2',
                          borderRadius: 4,
                        }}>{entry.module}</span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 8px',
                          background: actionConf.bg, color: actionConf.color, borderRadius: 4,
                        }}>{entry.action_type}</span>
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>{entry.document_ref || '—'}</td>
                      <td className="text-center">
                        {hasDelta && (
                          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                            {isExpanded ? '▲ Hide' : '▼ View'}
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && hasDelta && (
                      <tr key={`${entry.log_id}-delta`}>
                        <td colSpan={7} style={{ padding: '0 14px 16px', background: '#F9FAFB' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                            {entry.payload_delta.old && (
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', marginBottom: 6 }}>BEFORE</div>
                                <pre style={{
                                  fontSize: 11, background: '#FEF2F2', border: '1px solid #FECACA',
                                  borderRadius: 6, padding: 12, overflow: 'auto', color: '#991B1B',
                                  fontFamily: 'JetBrains Mono, monospace', maxHeight: 200,
                                }}>
                                  {JSON.stringify(entry.payload_delta.old, null, 2)}
                                </pre>
                              </div>
                            )}
                            {entry.payload_delta.new && (
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', marginBottom: 6 }}>AFTER</div>
                                <pre style={{
                                  fontSize: 11, background: '#ECFDF5', border: '1px solid #A7F3D0',
                                  borderRadius: 6, padding: 12, overflow: 'auto', color: '#065F46',
                                  fontFamily: 'JetBrains Mono, monospace', maxHeight: 200,
                                }}>
                                  {JSON.stringify(entry.payload_delta.new, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
