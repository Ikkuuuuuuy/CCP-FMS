import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  ChevronDown, TrendingUp, BookOpen, ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatters';

// Sample data matching wireframe budget utilization trend line (FY 2026)
const TREND_DATA = [
  { date: 'Aug 1', amount: 30000000 },
  { date: 'Aug 3', amount: 110000000 },
  { date: 'Aug 6', amount: 65000000 },
  { date: 'Aug 10', amount: 165000000 },
  { date: 'Aug 12', amount: 115000000 },
  { date: 'Aug 18', amount: 220000000 },
  { date: 'Aug 21', amount: 140000000 },
  { date: 'Aug 24', amount: 175000000 },
  { date: 'Aug 25', amount: 235000000 },
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

// Audit log activity list matching FY 2026
const AUDIT_ACTIVITY = [
  { timestamp: '2026-08-01 10:43', user: 'Jose Reyes (Admin)', module: 'Ledger', action: 'Entry Posted', details: 'P-Entry #L1001' },
  { timestamp: '2026-08-02 13:53', user: 'Maria Santos (Budget Officer)', module: 'Disbursement Voucher', action: 'Voucher Approved', details: 'DV-#26-08-0001 (₱200,750)' },
  { timestamp: '2026-08-02 15:10', user: 'Lourdes S. Mendoza (FSD)', module: 'BUR', action: 'Request Certified', details: 'BUR-#26-01-0023 (₱11,498,489)' },
  { timestamp: '2026-08-03 09:15', user: 'Admin (System)', module: 'Report Generations', action: 'Financial Performance', details: 'Generated' },
];

// Items requiring action matching wireframe
const ACTION_ITEMS = [
  {
    title: 'BUR-#26-01-0023 | ₱11,498,489.52',
    subtitle: 'Payee: LSERV Corporation',
    actionText: 'Review',
    btnBg: '#FFFBEB',
    btnColor: '#D97706',
    btnBorder: '#FDE68A',
  },
  {
    title: 'DV-#07-0302-26 | ₱188,203.13',
    subtitle: 'Payee: Sophies IT Services',
    actionText: 'Process Payment',
    btnBg: '#FEF2F2',
    btnColor: '#DC2626',
    btnBorder: '#FECACA',
  },
  {
    title: 'General Ledger Balancing',
    subtitle: 'MDS Cash vs AP Journal Posting',
    actionText: 'Verify',
    btnBg: '#F5F3FF',
    btnColor: '#7C3AED',
    btnBorder: '#DDD6FE',
  },
  {
    title: 'GovPKI Digital Certificate',
    subtitle: 'Accountant role authorization',
    actionText: 'Approve User',
    btnBg: '#EFF6FF',
    btnColor: '#2563EB',
    btnBorder: '#BFDBFE',
  },
];

export default function Dashboard({ onNavigate }) {
  const { state } = useApp();
  const { burs = [], dvs = [], journalEntries = [], allotments = {}, auditLog = [], subsidiaryLedgers = [] } = state;
  const [selectedPeriod, setSelectedPeriod] = useState('FY 2026 (August 2026)');

  // Compute Live Allotment & Obligation Metrics
  const regMOOE = allotments['101']?.['MOOE'] || { total: 106600000, obligated: 98500000 };
  const totalAllotment = regMOOE.total;
  const totalObligated = regMOOE.obligated;
  const availableBudget = totalAllotment - totalObligated;
  const utilizationPct = Math.round((totalObligated / totalAllotment) * 100);

  // Compute Live Pending Counts
  const pendingBURCount = burs.filter((b) => b.status !== 'OBLIGATED').length;
  const pendingDVCount = dvs.filter((d) => d.status !== 'PAID').length;
  const totalJournalEntries = journalEntries.length;

  // =========================================================================
  // LIVE PROJECTED INCOME ENGINE (Auto-populated from Ledger Forecasting)
  // =========================================================================
  const ledgerForecast = useMemo(() => {
    let totalAnnualProjected = 0;
    let totalRealizedCollected = 0;
    let tenantForecasts = [];

    (subsidiaryLedgers || []).forEach((ledger) => {
      let monthlyRate = 0;
      const memoText = Array.isArray(ledger.memo) ? ledger.memo.join(' ') : (ledger.memo || '');
      
      // Parse total or monthly rate from memo
      const totalMatch = memoText.match(/TOTAL\s*([\d,]+\.?\d*)/i) || 
                         memoText.match(/Monthly Rate:\s*([\d,]+\.?\d*)/i) ||
                         memoText.match(/Rental\s*([\d,]+\.?\d*)/i);
      
      if (totalMatch) {
        monthlyRate = parseFloat(totalMatch[1].replace(/,/g, '')) || 0;
      } else {
        const debits = (ledger.entries || []).map(e => e.debit || 0).filter(d => d > 0);
        if (debits.length > 0) {
          monthlyRate = debits.reduce((a, b) => a + b, 0) / debits.length;
        }
      }

      const annualProjected = monthlyRate * 12;
      totalAnnualProjected += annualProjected;

      const realized = (ledger.entries || []).reduce((s, e) => s + (e.credit || 0), 0);
      totalRealizedCollected += realized;

      const latestBalance = (ledger.entries && ledger.entries.length > 0)
        ? ledger.entries[ledger.entries.length - 1].balance
        : 0;

      tenantForecasts.push({
        id: ledger.id,
        name: ledger.accountOf,
        accountSymbol: ledger.accountSymbol,
        monthlyRate,
        annualProjected,
        realized,
        balance: latestBalance,
        status: latestBalance > 0 ? 'Billing Pending' : 'Current & Paid'
      });
    });

    // Default baseline if subsidiary ledgers are empty
    if (totalAnnualProjected === 0) {
      totalAnnualProjected = 25766649.60;
    }

    const realizationPct = totalAnnualProjected > 0 
      ? Math.min(100, Math.round((totalRealizedCollected / totalAnnualProjected) * 100))
      : 94;

    return {
      totalAnnualProjected,
      totalRealizedCollected,
      monthlyRunRate: totalAnnualProjected / 12,
      realizationPct,
      tenantForecasts
    };
  }, [subsidiaryLedgers]);

  // Merge Live Audit Logs with Seed Feeds
  const liveAuditActivity = [
    ...(auditLog || []).slice(-4).reverse().map((a) => ({
      timestamp: a.timestamp ? new Date(a.timestamp).toLocaleString() : '2026-08-03 09:00',
      user: a.actor_name || 'System User',
      module: a.module || 'Audit',
      action: a.action_type || 'UPDATE',
      details: a.document_ref || 'Ref',
    })),
    ...AUDIT_ACTIVITY
  ].slice(0, 4);

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
                padding: '7px 32px 7px 12px', fontSize: '12px', fontWeight: 700, color: '#374151', cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="FY 2026 (August 2026)">This Period: FY 2026 (August 2026)</option>
              <option value="FY 2026 (Q3 July-Sept)">This Period: FY 2026 (Q3 July-Sept)</option>
              <option value="FY 2026 (Full Year)">This Period: FY 2026 (Full Year GAA)</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* === TOP KPI CARDS (5 Cards Grid - Connected to Live State & Ledger Forecast) === */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Available Budget */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563', marginBottom: '4px' }}>Available Budget (Current Year)</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#BFA046', letterSpacing: '-0.02em', marginBottom: '2px' }}>
            {formatCurrency(availableBudget)}
          </div>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#6B7280' }}>{utilizationPct}% Utilized</div>
        </div>

        {/* Card 2: Projected Income (Auto-populated from Ledger Forecasting) */}
        <div
          onClick={() => onNavigate?.('ledger')}
          style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D1D5DB',
            padding: '18px 20px', boxShadow: '0 2px 6px rgba(16,185,129,0.08)', cursor: 'pointer',
            position: 'relative', overflow: 'hidden'
          }}
          title="Click to view Credit & Collections Subsidiary Ledgers"
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#10B981' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> Projected Income (Ledger)
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>Annual Forecast</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#059669', letterSpacing: '-0.02em', marginBottom: '2px' }}>
            {formatCurrency(ledgerForecast.totalAnnualProjected)}
          </div>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#4B5563', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>~{formatCurrency(ledgerForecast.monthlyRunRate)} / mo</span>
            <span style={{ color: '#9CA3AF' }}>•</span>
            <span style={{ color: '#059669', fontWeight: 700 }}>{ledgerForecast.realizationPct}% Target</span>
          </div>
        </div>

        {/* Card 3: Pending BURs */}
        <div
          onClick={() => onNavigate?.('bur')}
          style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563' }}>Pending BURs</div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>Review Queued</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#D97706', letterSpacing: '-0.02em' }}>
            {pendingBURCount} <span style={{ fontSize: '16px', fontWeight: 700, opacity: 0.85 }}>BURs</span>
          </div>
        </div>

        {/* Card 4: Pending Disbursement Vouchers */}
        <div
          onClick={() => onNavigate?.('dv')}
          style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563' }}>Pending Vouchers</div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>(For Payment)</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#DC2626', letterSpacing: '-0.02em' }}>
            {pendingDVCount} <span style={{ fontSize: '16px', fontWeight: 700, opacity: 0.85 }}>Vouchers</span>
          </div>
        </div>

        {/* Card 5: Ledger Entries */}
        <div
          onClick={() => onNavigate?.('ledger')}
          style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563' }}>Ledger Entries</div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>Form 63 Active</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#7C3AED', letterSpacing: '-0.02em' }}>
            {totalJournalEntries} <span style={{ fontSize: '16px', fontWeight: 700, opacity: 0.85 }}>Entries</span>
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
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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

      {/* === DEDICATED LEDGER INCOME FORECASTING & RECEIVABLES PANEL === */}
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB',
        padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '18px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: '#059669' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>
                Projected Income & Revenue Forecasting (Credit & Collections)
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '3px 0 0 0' }}>
              Auto-calculated from Form 63 Customer/Tenant Subsidiary Ledgers, recurring lease schedules, and utility collections
            </p>
          </div>

          <button
            onClick={() => onNavigate?.('ledger')}
            style={{
              padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
              backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <span>Manage Ledgers</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Forecasting Metrics Strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px',
          padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Annual Projected Income</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#059669', marginTop: '2px' }}>
              {formatCurrency(ledgerForecast.totalAnnualProjected)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Expected Run-Rate</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
              {formatCurrency(ledgerForecast.monthlyRunRate)} <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>/ mo</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Realized Collections to Date</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>
              {formatCurrency(ledgerForecast.totalRealizedCollected)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Realization Efficiency</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#D97706', marginTop: '2px' }}>
              {ledgerForecast.realizationPct}% <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>Target Met</span>
            </div>
          </div>
        </div>

        {/* Tenant Forecasting Breakdown Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '10px 12px' }}>Tenant / Customer Account</th>
                <th style={{ padding: '10px 12px' }}>Sheet / Symbol</th>
                <th style={{ padding: '10px 12px' }}>Monthly Billing Rate</th>
                <th style={{ padding: '10px 12px' }}>Annual Projected</th>
                <th style={{ padding: '10px 12px' }}>Realized YTD</th>
                <th style={{ padding: '10px 12px' }}>Current Balance</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ledgerForecast.tenantForecasts.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#111827' }}>{t.name}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#6B7280' }}>Sheet #{t.accountSymbol}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#374151' }}>{formatCurrency(t.monthlyRate)}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#059669' }}>{formatCurrency(t.annualProjected)}</td>
                  <td style={{ padding: '10px 12px', color: '#2563EB', fontWeight: 600 }}>{formatCurrency(t.realized)}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600, color: t.balance > 0 ? '#DC2626' : '#059669' }}>
                    {formatCurrency(t.balance)}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      fontSize: '10.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px',
                      backgroundColor: t.balance === 0 ? '#ECFDF5' : '#FEF3C7',
                      color: t.balance === 0 ? '#047857' : '#B45309',
                      border: t.balance === 0 ? '1px solid #A7F3D0' : '1px solid #FDE68A'
                    }}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                {liveAuditActivity.map((row, index) => (
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
