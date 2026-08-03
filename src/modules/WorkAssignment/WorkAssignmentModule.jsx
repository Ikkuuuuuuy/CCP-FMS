import React, { useState } from 'react';
import { Users, Search, FileText, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { MOCK_USERS } from '../../data/seedData';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

export default function WorkAssignmentModule() {
  const { state } = useApp();
  const { burs, dvs } = state;
  const [searchText, setSearchText] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('ALL');

  // Compute workload per staff member
  const personnelWorkload = MOCK_USERS.map((user) => {
    const userBURs = burs.filter((b) => b.assignedTo === user.id || b.assignedToName === user.name);
    const userDVs = dvs.filter((d) => d.assignedTo === user.id || d.assignedToName === user.name);
    
    const totalBURAmount = userBURs.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalDVAmount = userDVs.reduce((sum, d) => sum + (d.netAmount || d.grossClaim || 0), 0);
    const totalAmount = totalBURAmount + totalDVAmount;

    const completedDVs = userDVs.filter((d) => d.status === 'PAID').length;
    const completedBURs = userBURs.filter((b) => b.status === 'OBLIGATED').length;
    const totalItems = userBURs.length + userDVs.length;
    const completedItems = completedBURs + completedDVs;

    return {
      user,
      burs: userBURs,
      dvs: userDVs,
      totalBURAmount,
      totalDVAmount,
      totalAmount,
      totalItems,
      completedItems,
      completionPct: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
    };
  });

  const filteredWorkload = personnelWorkload.filter((pw) => {
    const matchUser = selectedUserFilter === 'ALL' || pw.user.id === selectedUserFilter;
    const matchSearch = !searchText ||
      pw.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      pw.user.roleLabel.toLowerCase().includes(searchText.toLowerCase()) ||
      pw.burs.some((b) => b.burNo.toLowerCase().includes(searchText.toLowerCase())) ||
      pw.dvs.some((d) => d.dvNo.toLowerCase().includes(searchText.toLowerCase()));
    return matchUser && matchSearch;
  });

  const grandTotalItems = burs.length + dvs.length;
  const grandTotalValue = burs.reduce((s, b) => s + b.amount, 0) + dvs.reduce((s, d) => s + (d.netAmount || d.grossClaim), 0);
  const activePersonnelCount = personnelWorkload.filter((pw) => pw.totalItems > 0).length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-info">
          <div className="page-title">Work Assignments & Personnel Task Table</div>
          <div className="page-subtitle">
            Track staff workload, assigned BURs, assigned DVs, and processing statuses
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid mb-6">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Active Personnel</div>
            <div className="metric-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="metric-value">{activePersonnelCount} Staff</div>
          <div className="metric-sub">Assigned active BUR/DV tasks</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Total Assigned Tasks</div>
            <div className="metric-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
              <FileText size={18} />
            </div>
          </div>
          <div className="metric-value">{grandTotalItems} Documents</div>
          <div className="metric-sub">{burs.length} BURs · {dvs.length} DVs</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Total Workload Value</div>
            <div className="metric-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="metric-value mono" style={{ fontSize: 20 }}>{formatCurrency(grandTotalValue)}</div>
          <div className="metric-sub">Combined BUR & DV value</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar no-print mb-4">
        <div className="search-input-wrapper">
          <Search size={14} className="search-input-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search staff member, BUR No, or DV No..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            Filter Staff:
          </label>
          <select
            className="form-control"
            style={{ width: 220 }}
            value={selectedUserFilter}
            onChange={(e) => setSelectedUserFilter(e.target.value)}
          >
            <option value="ALL">All Staff Members</option>
            {MOCK_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.roleLabel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Personnel Workload Table */}
      <div className="data-grid-wrapper no-print">
        <table className="data-grid">
          <thead>
            <tr>
              <th>Personnel / Staff Member</th>
              <th>Role & Division</th>
              <th>Assigned BURs ({burs.length})</th>
              <th>Assigned DVs ({dvs.length})</th>
              <th className="text-right">Total Workload Amount</th>
              <th className="text-center">Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkload.map(({ user, burs: uBURs, dvs: uDVs, totalAmount, totalItems, completedItems, completionPct }) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                      color: '#FFF', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {user.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{user.roleLabel}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>Div: {user.division}</div>
                </td>
                <td>
                  {uBURs.length === 0 ? (
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>No BURs assigned</span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {uBURs.map((b) => (
                        <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                          <span className="mono" style={{ fontWeight: 700 }}>{b.burNo}</span>
                          <StatusBadge status={b.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td>
                  {uDVs.length === 0 ? (
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>No DVs assigned</span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {uDVs.map((d) => (
                        <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                          <span className="mono" style={{ fontWeight: 700 }}>{d.dvNo}</span>
                          <StatusBadge status={d.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="text-right mono" style={{ fontWeight: 800, fontSize: 14, color: '#059669' }}>
                  {formatCurrency(totalAmount)}
                </td>
                <td className="text-center">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: completionPct === 100 ? '#059669' : '#1F2937' }}>
                      {completedItems} / {totalItems} ({completionPct}%)
                    </div>
                    <div style={{ width: 80, height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        width: `${completionPct}%`, height: '100%',
                        background: completionPct === 100 ? '#059669' : 'linear-gradient(90deg, #2563EB, #059669)',
                      }} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
