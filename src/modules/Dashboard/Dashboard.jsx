import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  FileText, Plus, ChevronDown
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

// Sample data matching wireframe budget utilization trend line
const TREND_DATA = [
  { date: 'Oct 1', amount: 30000000 },
  { date: 'Oct 3', amount: 110000000 },
  { date: 'Oct 6', amount: 65000000 },
  { date: 'Oct 10', amount: 165000000 },
  { date: 'Oct 12', amount: 115000000 },
  { date: 'Oct 18', amount: 220000000 },
  { date: 'Oct 21', amount: 140000000 },
  { date: 'Oct 24', amount: 175000000 },
  { date: 'Oct 25', amount: 235000000 },
];

// Donut chart spending category breakdown matching wireframe percentages & colors
const SPENDING_DATA = [
  { name: 'Program Production', value: 28, color: '#2563EB' },
  { name: 'Facilities Maintenance', value: 25, color: '#D97706' },
  { name: 'Payroll', value: 20, color: '#059669' },
  { name: 'Utilities', value: 15, color: '#0284C7' },
  { name: 'Program Maintenance', value: 12, color: '#7C3AED' },
  { name: 'Others', value: 5, color: '#EC4899' },
];

// Audit log activity list matching wireframe
const AUDIT_ACTIVITY = [
  { timestamp: '2023-12-23 10:43', user: 'Jose Reyes (Admin)', module: 'Ledger', action: 'Entry Posted', details: 'P-Entry #L1001' },
  { timestamp: '2023-12-23 13:53', user: 'Maria Dela Cruz (Accountant)', module: 'Disbursement Voucher', action: 'Voucher Approved', details: 'DV-#DV5001 (₱250,000)' },
  { timestamp: '2023-12-23 10:53', user: 'Benigno Santos (Clerk)', module: 'BUR', action: 'Request Created', details: 'BUR-#B7001 (₱1,200,000)' },
  { timestamp: '2023-12-23 20:53', user: 'Admin (System)', module: 'Report Generations', action: 'Annual Report', details: 'E-Generated' },
];

// Items requiring action matching wireframe
const ACTION_ITEMS = [
  {
    title: 'BUR-#B7001 | ₱1,200,000',
    subtitle: 'Program: CCP Dance Series',
    actionText: 'Review',
    btnBg: '#FFFBEB',
    btnColor: '#D97706',
    btnBorder: '#FDE68A',
  },
  {
    title: 'DV-#DV5002 | ₱250,000',
    subtitle: 'Payee: Local Printer Co.',
    actionText: 'Process Payment',
    btnBg: '#FEF2F2',
    btnColor: '#DC2626',
    btnBorder: '#FECACA',
  },
  {
    title: 'Ledger Adjustment',
    subtitle: 'Unposted: Journal Entry #J3002',
    actionText: 'Verify',
    btnBg: '#F5F3FF',
    btnColor: '#7C3AED',
    btnBorder: '#DDD6FE',
  },
  {
    title: 'User Creation',
    subtitle: 'Accountant role',
    actionText: 'Approve User',
    btnBg: '#EFF6FF',
    btnColor: '#2563EB',
    btnBorder: '#BFDBFE',
  },
];

export default function Dashboard() {
  const { dispatch } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('October 2023');

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* === TOP ACTION BAR === */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Date Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                appearance: 'none', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px',
                padding: '7px 32px 7px 12px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="October 2023">This Period: October 2023</option>
              <option value="November 2023">This Period: November 2023</option>
              <option value="December 2023">This Period: December 2023</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          </div>

          {/* Quick Action Dropdown */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB',
            borderRadius: '6px', padding: '7px 12px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer'
          }}>
            <span>Quick Action</span>
            <ChevronDown size={14} style={{ color: '#9CA3AF' }} />
          </button>
        </div>
      </div>

      {/* === TOP KPI CARDS (4 Cards Grid) === */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {/* Card 1: Available Budget */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563', marginBottom: '4px' }}>Available Budget (Current Year)</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#BFA046', letterSpacing: '-0.02em', marginBottom: '2px' }}>₱125,500,000</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>85% Utilized</div>
        </div>

        {/* Card 2: Pending BURs */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563' }}>Pending BURs</div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>Review Queued</div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#D97706', letterSpacing: '-0.02em' }}>
            18 <span style={{ fontSize: '18px', fontWeight: 700, opacity: 0.85 }}>BURs</span>
          </div>
        </div>

        {/* Card 3: Pending Disbursement Vouchers */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563' }}>Pending Disbursement Vouchers</div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>(For Payment)</div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#DC2626', letterSpacing: '-0.02em' }}>
            25 <span style={{ fontSize: '18px', fontWeight: 700, opacity: 0.85 }}>Vouchers</span>
          </div>
        </div>

        {/* Card 4: Ledger Entries */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563' }}>Ledger Entries</div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>Verification Needed</div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#7C3AED', letterSpacing: '-0.02em' }}>
            55 <span style={{ fontSize: '18px', fontWeight: 700, opacity: 0.85 }}>Entries</span>
          </div>
        </div>
      </div>

      {/* === MIDDLE ROW: TREND CHART (2/3) + SPENDING BREAKDOWN (1/3) === */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Budget Utilization Trend Line Chart */}
        <div style={{ gridColumn: 'span 2', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937', margin: 0 }}>CCP Budget Utilization Trend (Last 6 Months)</h3>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB',
              borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: '#4B5563', cursor: 'pointer'
            }}>
              <span>Last Month</span>
              <ChevronDown size={12} />
            </button>
          </div>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} stroke="#9CA3AF" />
                <YAxis
                  tickFormatter={(val) => `${val / 1000000}M`}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  stroke="#9CA3AF"
                />
                <Tooltip
                  formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Obligated']}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Category Breakdown Donut Chart */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937', margin: '0 0 12px 0' }}>Spending Category Breakdown ({selectedPeriod})</h3>
          <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SPENDING_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {SPENDING_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val}%`, 'Allocation']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
            {SPENDING_DATA.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                <span style={{ color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                <span style={{ fontWeight: 700, color: '#111827', marginLeft: 'auto' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === BOTTOM ROW: RECENT AUDIT LOG (2/3) + ACTION ITEMS (1/3) === */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Recent Audit Log Activity Table */}
        <div style={{ gridColumn: 'span 2', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937', margin: '0 0 16px 0' }}>Recent Audit Log Activity</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '10px 12px' }}>Timestamp</th>
                  <th style={{ padding: '10px 12px' }}>User</th>
                  <th style={{ padding: '10px 12px' }}>Module</th>
                  <th style={{ padding: '10px 12px' }}>Action</th>
                  <th style={{ padding: '10px 12px' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {AUDIT_ACTIVITY.map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#4B5563', whiteSpace: 'nowrap' }}>{row.timestamp}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{row.user}</td>
                    <td style={{ padding: '10px 12px', color: '#374151', whiteSpace: 'nowrap' }}>{row.module}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1F2937', whiteSpace: 'nowrap' }}>{row.action}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#4B5563', whiteSpace: 'nowrap' }}>{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Items Requiring Action (CCP) Widget */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937', margin: '0 0 16px 0' }}>Items Requiring Action (CCP)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ACTION_ITEMS.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', border: '1px solid #F3F4F6', backgroundColor: '#FAFAFA' }}>
                <div style={{ minWidth: 0, paddingRight: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subtitle}</div>
                </div>
                <button style={{
                  padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: `1px solid ${item.btnBorder}`,
                  backgroundColor: item.btnBg, color: item.btnColor, cursor: 'pointer', flexShrink: 0
                }}>
                  {item.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
