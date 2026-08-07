import React, { useState } from 'react';
import {
  Users, Search, FileText, CreditCard, CheckCircle, Clock, AlertCircle,
  Plus, UserCheck, BarChart3, Grid, List, Shield, ArrowRight, TrendingUp, Sparkles, Filter
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { MOCK_USERS } from '../../data/seedData';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { formatCurrency } from '../../utils/formatters';

export default function WorkAssignmentModule() {
  const { state, dispatch } = useApp();
  const { burs = [], dvs = [] } = state;

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table' | 'analytics'
  const [searchText, setSearchText] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('ALL');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  // Assignment Modal Form State
  const [assignDocType, setAssignDocType] = useState('BUR'); // 'BUR' | 'DV'
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('NORMAL');
  const [assignmentNote, setAssignmentNote] = useState('');

  // Compute rich workload per staff member
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

    const completionPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      user,
      burs: userBURs,
      dvs: userDVs,
      totalBURAmount,
      totalDVAmount,
      totalAmount,
      totalItems,
      completedItems,
      completionPct,
    };
  });

  const filteredWorkload = personnelWorkload.filter((pw) => {
    const matchUser = selectedUserFilter === 'ALL' || pw.user.id === selectedUserFilter;
    const matchSearch = !searchText ||
      pw.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      pw.user.roleLabel.toLowerCase().includes(searchText.toLowerCase()) ||
      pw.user.division?.toLowerCase().includes(searchText.toLowerCase()) ||
      pw.burs.some((b) => b.burNo.toLowerCase().includes(searchText.toLowerCase()) || b.payeeName?.toLowerCase().includes(searchText.toLowerCase())) ||
      pw.dvs.some((d) => d.dvNo.toLowerCase().includes(searchText.toLowerCase()) || d.payeeName?.toLowerCase().includes(searchText.toLowerCase()));
    return matchUser && matchSearch;
  });

  const grandTotalItems = burs.length + dvs.length;
  const grandTotalValue = burs.reduce((s, b) => s + (b.amount || 0), 0) + dvs.reduce((s, d) => s + (d.netAmount || d.grossClaim || 0), 0);
  const activePersonnelCount = personnelWorkload.filter((pw) => pw.totalItems > 0).length;
  
  const totalCompletedDocs = burs.filter(b => b.status === 'OBLIGATED').length + dvs.filter(d => d.status === 'PAID').length;
  const overallAvgCompletion = grandTotalItems > 0 ? Math.round((totalCompletedDocs / grandTotalItems) * 100) : 0;

  const handleOpenAssignModal = (user = null) => {
    setTargetUser(user);
    setSelectedStaffId(user ? user.id : (MOCK_USERS[0]?.id || ''));
    setSelectedDocId('');
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedDocId || !selectedStaffId) {
      alert('Please select both a document and a personnel officer.');
      return;
    }

    const assignedStaff = MOCK_USERS.find((u) => u.id === selectedStaffId);
    try {
      dispatch({
        type: 'DOCUMENT_UPDATE',
        payload: {
          type: assignDocType,
          id: selectedDocId,
          data: {
            assignedTo: assignedStaff.id,
            assignedToName: assignedStaff.name,
            priority: priorityLevel,
            assignmentNote: assignmentNote,
            assignedAt: new Date().toISOString(),
          },
        },
      });
      setAssignModalOpen(false);
      setAssignmentNote('');
    } catch (err) {
      alert(err.message);
    }
  };

  // Available documents for assignment dropdown
  const availableDocs = assignDocType === 'BUR' ? burs : dvs;

  const getRoleGradient = (role) => {
    switch (role) {
      case 'Budget Officer':
        return 'linear-gradient(135deg, #059669, #10B981)';
      case 'Chief Accountant':
        return 'linear-gradient(135deg, #1E3A8A, #2563EB)';
      case 'Bookkeeper':
        return 'linear-gradient(135deg, #6D28D9, #7C3AED)';
      case 'Treasury':
        return 'linear-gradient(135deg, #D97706, #EA580C)';
      case 'IT/ADMIN':
        return 'linear-gradient(135deg, #1E293B, #334155)';
      default:
        return 'linear-gradient(135deg, #374151, #4B5563)';
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* ========================================================================= */}
      {/* TOP HEADER & CONTROLS BAR */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #8C1515, #BFA046)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', boxShadow: '0 4px 12px rgba(140,21,21,0.25)'
            }}>
              <UserCheck size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', margin: 0, letterSpacing: '-0.02em' }}>
                Personnel Work Assignments
              </h1>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
                Cultural Center of the Philippines · Financial Services & Processing Capacity Dashboard
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Mode Switcher */}
          <div style={{ display: 'flex', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '4px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: 'none',
                backgroundColor: viewMode === 'grid' ? '#8C1515' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : '#64748B',
                boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(140,21,21,0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Grid size={15} />
              <span>Personnel Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: 'none',
                backgroundColor: viewMode === 'table' ? '#8C1515' : 'transparent',
                color: viewMode === 'table' ? '#FFFFFF' : '#64748B',
                boxShadow: viewMode === 'table' ? '0 2px 6px rgba(140,21,21,0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <List size={15} />
              <span>Task Matrix</span>
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: 'none',
                backgroundColor: viewMode === 'analytics' ? '#8C1515' : 'transparent',
                color: viewMode === 'analytics' ? '#FFFFFF' : '#64748B',
                boxShadow: viewMode === 'analytics' ? '0 2px 6px rgba(140,21,21,0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <BarChart3 size={15} />
              <span>Workload Analytics</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenAssignModal(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '9px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
              background: 'linear-gradient(135deg, #8C1515, #BFA046)', color: '#FFFFFF', border: '1px solid #D4AF37',
              boxShadow: '0 4px 14px rgba(140,21,21,0.3)', transition: 'all 0.2s ease'
            }}
          >
            <Plus size={16} />
            <span>Assign Document</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KPI METRIC CARDS (EXPLICIT GRID) */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Card 1: Active Officers */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)', borderLeft: '4px solid #2563EB',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Processing Officers</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#1E293B', marginBottom: '4px' }}>
            {activePersonnelCount} <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748B' }}>Officers</span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
            {MOCK_USERS.length} total registered CCP personnel
          </div>
        </div>

        {/* Card 2: Assigned Documents */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)', borderLeft: '4px solid #059669',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Documents</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#059669', marginBottom: '4px' }}>
            {grandTotalItems} <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748B' }}>Active Tasks</span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
            {burs.length} BURs · {dvs.length} DVs in queue
          </div>
        </div>

        {/* Card 3: Total Pipeline Value */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)', borderLeft: '4px solid #D97706',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Processing Value</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#BFA046', fontFamily: 'monospace', marginBottom: '4px' }}>
            {formatCurrency(grandTotalValue)}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
            Cumulative claims in execution
          </div>
        </div>

        {/* Card 4: Completion Rate */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)', borderLeft: '4px solid #7C3AED',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Overall Processing Rate</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#7C3AED', marginBottom: '4px' }}>
            {overallAvgCompletion}%
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
            {totalCompletedDocs} of {grandTotalItems} documents finalized
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEARCH AND FILTER BAR */}
      {/* ========================================================================= */}
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px 20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search officer name, role, division, BUR No, or DV No..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', backgroundColor: '#F8FAFC'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={15} style={{ color: '#64748B' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569' }}>Filter Officer:</span>
          <select
            value={selectedUserFilter}
            onChange={(e) => setSelectedUserFilter(e.target.value)}
            style={{
              padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#1E293B', backgroundColor: '#FFFFFF', outline: 'none', cursor: 'pointer'
            }}
          >
            <option value="ALL">All CCP Staff Members</option>
            {MOCK_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.roleLabel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: PERSONNEL CARDS GRID VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredWorkload.map(({ user, burs: uBURs, dvs: uDVs, totalAmount, totalItems, completedItems, completionPct }) => (
            <div
              key={user.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                {/* Header Banner Accent */}
                <div
                  style={{
                    background: getRoleGradient(user.roleLabel),
                    padding: '20px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        fontWeight: 900,
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '17px', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px', fontWeight: 600 }}>
                        {user.roleLabel}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                    }}
                  >
                    {user.division}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px' }}>
                  {/* Micro Stats Bar */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #F1F5F9',
                      marginBottom: '18px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>BURs</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#2563EB', marginTop: '2px' }}>{uBURs.length}</div>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>DVs</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#7C3AED', marginTop: '2px' }}>{uDVs.length}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>WORKLOAD ₱</div>
                      <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
                        {formatCurrency(totalAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Task Completion Progress Meter */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#334155' }}>Task Completion Rate</span>
                      <span style={{ fontWeight: 900, color: completionPct === 100 ? '#059669' : '#2563EB' }}>
                        {completedItems} / {totalItems} ({completionPct}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${completionPct}%`,
                          height: '100%',
                          background: completionPct === 100 ? '#059669' : 'linear-gradient(90deg, #2563EB, #059669)',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Assigned Documents Container */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                      ASSIGNED DOCUMENTS ({totalItems})
                    </div>

                    {totalItems === 0 ? (
                      <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', padding: '12px 0', textAlign: 'center', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                        No active documents currently assigned.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                        {uBURs.map((b) => (
                          <div
                            key={b.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justify: 'space-between',
                              padding: '8px 12px',
                              backgroundColor: '#F0F9FF',
                              border: '1px solid #BAE6FD',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <FileText size={14} style={{ color: '#0284C7' }} />
                              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0369A1' }}>{b.burNo}</span>
                            </div>
                            <StatusBadge status={b.status} />
                          </div>
                        ))}

                        {uDVs.map((d) => (
                          <div
                            key={d.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justify: 'space-between',
                              padding: '8px 12px',
                              backgroundColor: '#F5F3FF',
                              border: '1px solid #DDD6FE',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CreditCard size={14} style={{ color: '#7C3AED' }} />
                              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#6D28D9' }}>{d.dvNo}</span>
                            </div>
                            <StatusBadge status={d.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#F8FAFC',
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  {user.email}
                </span>
                <button
                  onClick={() => handleOpenAssignModal(user)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                    backgroundColor: '#FFFFFF', color: '#8C1515', border: '1px solid #D4AF37', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <Plus size={13} />
                  <span>Assign</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: TASK MATRIX TABLE VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <table className="data-grid" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Personnel Officer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Role & Division</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Assigned BURs ({burs.length})</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Assigned DVs ({dvs.length})</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Workload Value</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Completion Rate</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkload.map(({ user, burs: uBURs, dvs: uDVs, totalAmount, totalItems, completedItems, completionPct }) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: getRoleGradient(user.roleLabel),
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                        }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>{user.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#334155' }}>{user.roleLabel}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Division: {user.division}</div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    {uBURs.length === 0 ? (
                      <span style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>None assigned</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {uBURs.map((b) => (
                          <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                            <span className="mono" style={{ fontWeight: 800, color: '#2563EB' }}>{b.burNo}</span>
                            <StatusBadge status={b.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    {uDVs.length === 0 ? (
                      <span style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>None assigned</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {uDVs.map((d) => (
                          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                            <span className="mono" style={{ fontWeight: 800, color: '#7C3AED' }}>{d.dvNo}</span>
                            <StatusBadge status={d.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right' }} className="mono">
                    <span style={{ fontWeight: 900, fontSize: '14px', color: '#059669' }}>
                      {formatCurrency(totalAmount)}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: completionPct === 100 ? '#059669' : '#1E293B' }}>
                        {completedItems} / {totalItems} ({completionPct}%)
                      </div>
                      <div style={{ width: '80px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${completionPct}%`,
                            height: '100%',
                            background: completionPct === 100 ? '#059669' : 'linear-gradient(90deg, #2563EB, #059669)',
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleOpenAssignModal(user)}
                      style={{
                        padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                        backgroundColor: '#F8FAFC', color: '#8C1515', border: '1px solid #CBD5E1'
                      }}
                    >
                      + Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: WORKLOAD BALANCE ANALYTICS VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} style={{ color: '#8C1515' }} />
              <span>Division Workload Balance & Capacity Distribution</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {['Budget Office', 'Accounting Division', 'Treasury & Cashiering', 'IT & Administration'].map((dept, idx) => {
                const deptUsers = MOCK_USERS.filter((u) => {
                  if (dept.includes('Budget')) return u.roleLabel.includes('Budget');
                  if (dept.includes('Accounting')) return u.roleLabel.includes('Accountant') || u.roleLabel.includes('Bookkeeper');
                  if (dept.includes('Treasury')) return u.roleLabel.includes('Treasury');
                  return u.roleLabel.includes('IT');
                });

                const deptTotalItems = deptUsers.reduce((sum, u) => {
                  const pw = personnelWorkload.find((p) => p.user.id === u.id);
                  return sum + (pw ? pw.totalItems : 0);
                }, 0);

                const deptTotalValue = deptUsers.reduce((sum, u) => {
                  const pw = personnelWorkload.find((p) => p.user.id === u.id);
                  return sum + (pw ? pw.totalAmount : 0);
                }, 0);

                return (
                  <div key={idx} style={{ padding: '18px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#1E293B', marginBottom: '4px' }}>{dept}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>{deptUsers.length} assigned personnel officers</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#475569' }}>Active Documents</span>
                      <span style={{ fontWeight: 800, color: '#2563EB' }}>{deptTotalItems} Tasks</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '14px' }}>
                      <span style={{ fontWeight: 700, color: '#475569' }}>Total Assigned Value</span>
                      <span style={{ fontWeight: 900, color: '#059669', fontFamily: 'monospace' }}>{formatCurrency(deptTotalValue)}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {deptUsers.map((u) => {
                        const pw = personnelWorkload.find((p) => p.user.id === u.id);
                        return (
                          <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                            <span style={{ fontWeight: 800, color: '#0F172A' }}>{u.name}</span>
                            <span style={{ fontWeight: 800, color: '#64748B' }}>{pw ? pw.totalItems : 0} items ({pw ? formatCurrency(pw.totalAmount) : '₱0'})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ASSIGN DOCUMENT MODAL */}
      {/* ========================================================================= */}
      {assignModalOpen && (
        <Modal
          title={`Assign Document to ${targetUser ? targetUser.name : 'Officer'}`}
          onClose={() => setAssignModalOpen(false)}
        >
          <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '12px' }}>Document Type</label>
                <select
                  className="form-control"
                  value={assignDocType}
                  onChange={(e) => {
                    setAssignDocType(e.target.value);
                    setSelectedDocId('');
                  }}
                  style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                >
                  <option value="BUR">BUR (Budget Utilization Request)</option>
                  <option value="DV">DV (Disbursement Voucher)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '12px' }}>Assign To Staff Officer</label>
                <select
                  className="form-control"
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  required
                  style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                >
                  {MOCK_USERS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.roleLabel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '12px' }}>Select Document to Assign</label>
              <select
                className="form-control"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                required
                style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
              >
                <option value="">-- Choose Document --</option>
                {availableDocs.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {assignDocType === 'BUR' ? doc.burNo : doc.dvNo} — {doc.payeeName} ({formatCurrency(doc.amount || doc.grossClaim)}) [{doc.status}]
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '12px' }}>Priority Level</label>
                <select
                  className="form-control"
                  value={priorityLevel}
                  onChange={(e) => setPriorityLevel(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                >
                  <option value="NORMAL">Normal Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">⚡ Urgent / Rush</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '12px' }}>Assignment Notes / Instructions</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Please process certification by Friday"
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setAssignModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #8C1515, #BFA046)', border: '1px solid #D4AF37' }}>
                Assign Document
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
