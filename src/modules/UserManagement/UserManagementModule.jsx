import React, { useState } from 'react';
import { Users, UserPlus, Search, Shield, Key, CheckCircle, AlertCircle, Edit3, Trash2, Mail, Building } from 'lucide-react';
import { MOCK_USERS } from '../../data/seedData';

export default function UserManagementModule() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Budget Officer',
    department: 'Budget & Financial Planning',
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userObj = {
      id: `usr_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: 'Active',
      pkiCertified: true,
      lastActive: 'Just now'
    };

    setUsers([userObj, ...users]);
    setNewUser({ name: '', email: '', role: 'Budget Officer', department: 'Budget & Financial Planning' });
    setShowAddModal(false);
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>
            User Management & Access Control
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', margin: 0 }}>
            Manage administrative personnel, department roles, GovPKI digital certificate credentials, and system privileges.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: '#8C1515', color: '#FFFFFF', border: 'none',
            borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(140, 21, 21, 0.3)', transition: 'transform 100ms ease'
          }}
        >
          <UserPlus size={16} />
          <span>Add New Personnel</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Total Registered Users</span>
            <Users size={20} style={{ color: '#8C1515' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#111827', marginTop: '8px' }}>{users.length}</div>
          <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px', fontWeight: 600 }}>Active System Personnel</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Active Personnel</span>
            <CheckCircle size={20} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#111827', marginTop: '8px' }}>
            {users.filter(u => u.status !== 'Inactive').length}
          </div>
          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>Authorized Access Active</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Security Roles</span>
            <ShieldCheck size={20} style={{ color: '#D4AF37' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#111827', marginTop: '8px' }}>5</div>
          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>Role-Based Access (RBAC)</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Digital Certificates</span>
            <Key size={20} style={{ color: '#3B82F6' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#111827', marginTop: '8px' }}>{users.length}</div>
          <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '4px', fontWeight: 600 }}>Valid PKI Hardware Tokens</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', paddingLeft: '38px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px',
              border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563' }}>Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
          >
            <option value="ALL">All Roles</option>
            <option value="Budget Officer">Budget Officer</option>
            <option value="Accountant">Accountant</option>
            <option value="Internal Auditor">Internal Auditor</option>
            <option value="Executive / Management">Executive / Management</option>
            <option value="COA Resident Auditor">COA Resident Auditor</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>Personnel Name & Email</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>Department</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>System Role</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>Account Status</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Mail size={12} />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} style={{ color: '#9CA3AF' }} />
                    <span>{user.department || 'Financial Services Division'}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                    backgroundColor: user.role === 'Internal Auditor' ? '#FEF3C7' : user.role === 'Accountant' ? '#E0E7FF' : '#F3E8FF',
                    color: user.role === 'Internal Auditor' ? '#92400E' : user.role === 'Accountant' ? '#3730A3' : '#6B21A8'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '12px',
                    backgroundColor: user.status === 'Inactive' ? '#FEE2E2' : '#D1FAE5',
                    color: user.status === 'Inactive' ? '#991B1B' : '#065F46'
                  }}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => toggleStatus(user.id)}
                      style={{
                        padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '6px',
                        backgroundColor: '#FFFFFF', fontSize: '11px', fontWeight: 600, color: '#374151', cursor: 'pointer'
                      }}
                    >
                      {user.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New User Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', width: '460px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginTop: 0, marginBottom: '16px' }}>
              Add Authorized Personnel
            </h3>

            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maria.santos@culturalcenter.gov.ph"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Assigned System Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                >
                  <option value="Budget Officer">Budget Officer</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Internal Auditor">Internal Auditor</option>
                  <option value="Executive / Management">Executive / Management</option>
                  <option value="COA Resident Auditor">COA Resident Auditor</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Department / Division</label>
                <input
                  type="text"
                  placeholder="e.g. Budget & Financial Planning Division"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', backgroundColor: '#FFFFFF', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 18px', border: 'none', borderRadius: '8px', backgroundColor: '#8C1515', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
