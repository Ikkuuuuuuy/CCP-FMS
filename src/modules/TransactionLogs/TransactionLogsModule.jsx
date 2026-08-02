import React, { useState } from 'react';
import { History, Filter, Search, Download, FileText, CreditCard, BookOpen, Layers, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function TransactionLogsModule() {
  const { state } = useApp();
  const { burs, dvs, journalEntries } = state;
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('DATE_DESC');

  // Dynamically generated live transaction feed
  const liveTransactions = [
    ...(burs || []).map(b => ({
      id: b.burNo || `BUR-${b.id}`,
      type: 'BUR',
      payee: b.payeeName || b.office || 'BUR Request',
      date: b.createdAt ? new Date(b.createdAt).toLocaleString() : '2026-08-02',
      rawDate: b.createdAt || '2026-08-02',
      status: b.status || 'OBLIGATED',
      amount: b.amount || 0,
      fundCluster: b.fundCluster || '101'
    })),
    ...(dvs || []).map(d => ({
      id: d.dvNo || `DV-${d.id}`,
      type: 'DV',
      payee: d.payeeName || 'Disbursement Voucher',
      date: d.createdAt ? new Date(d.createdAt).toLocaleString() : '2026-08-02',
      rawDate: d.createdAt || '2026-08-02',
      status: d.status || 'PAID',
      amount: d.netAmount || d.grossClaim || 0,
      fundCluster: '101'
    })),
    ...(journalEntries || []).flatMap((je, idx) => 
      (je.lines || []).map((l, lIdx) => ({
        id: `SL-${je.je_id || idx}-${lIdx + 1}`,
        type: 'SL',
        payee: `${l.account_name || 'Subsidiary Ledger Entry'} (${l.account_code})`,
        date: je.date ? new Date(je.date).toLocaleString() : '2026-08-02',
        rawDate: je.date || '2026-08-02',
        status: 'POSTED',
        amount: l.debit > 0 ? l.debit : l.credit,
        fundCluster: '101',
        accountCode: l.account_code
      }))
    )
  ];

  const allLogs = liveTransactions;

  // Filter
  const filteredLogs = allLogs.filter(t => {
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesSearch = searchQuery === '' ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.payee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.accountCode && t.accountCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Sort
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    switch (sortBy) {
      case 'DATE_DESC':
        return new Date(b.rawDate || 0) - new Date(a.rawDate || 0);
      case 'DATE_ASC':
        return new Date(a.rawDate || 0) - new Date(b.rawDate || 0);
      case 'AMOUNT_DESC':
        return Number(b.amount || 0) - Number(a.amount || 0);
      case 'AMOUNT_ASC':
        return Number(a.amount || 0) - Number(b.amount || 0);
      case 'PAYEE_ASC':
        return String(a.payee || '').localeCompare(String(b.payee || ''));
      default:
        return 0;
    }
  });

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF', padding: '20px 24px', borderRadius: '12px',
        border: '1px solid #E8E2D9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1A1209', margin: 0 }}>Transaction Logs</h2>
          <p style={{ fontSize: '13px', color: '#6B6355', marginTop: '2px' }}>
            Real-time audit stream of BUR obligations, Disbursement Vouchers, General Ledger, and Subsidiary Ledger entries
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '6px', backgroundColor: '#FFFFFF',
            color: '#1A1209', border: '1px solid #E8E2D9', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
          }}>
            <Download size={14} /> Export CSV Log
          </button>
        </div>
      </div>

      {/* Filter, Sort and Search Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
        backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '12px',
        border: '1px solid #E8E2D9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        {/* Module / Ledger Type Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} style={{ color: '#8C1515' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#3D3020', whiteSpace: 'nowrap' }}>Filter Category:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '8px 14px', borderRadius: '6px', border: '1px solid #8C1515',
              fontSize: '12px', fontWeight: 700, color: '#8C1515', backgroundColor: '#FFFDF9',
              outline: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <option value="ALL">All Activity</option>
            <option value="BUR">BUR Obligations</option>
            <option value="DV">Disbursement Vouchers</option>
            <option value="LEDGER">Journal Entries</option>
            <option value="SL">Subsidiary Ledger</option>
          </select>
        </div>

        {/* Right Section: Sort Dropdown & Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Sorting Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} style={{ color: '#6B6355' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#3D3020', whiteSpace: 'nowrap' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '7px 10px', borderRadius: '6px', border: '1px solid #E5E7EB',
                fontSize: '12px', fontWeight: 600, color: '#1A1209', backgroundColor: '#FFFFFF',
                outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="DATE_DESC">Date: Newest First</option>
              <option value="DATE_ASC">Date: Oldest First</option>
              <option value="AMOUNT_DESC">Amount: High to Low</option>
              <option value="AMOUNT_ASC">Amount: Low to High</option>
              <option value="PAYEE_ASC">Payee / Account: A-Z</option>
            </select>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search ref no, payee, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '7px 12px 7px 36px', borderRadius: '6px',
                border: '1px solid #E5E7EB', outline: 'none', fontSize: '12px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 18px', fontWeight: 700 }}>Transaction Ref</th>
              <th style={{ padding: '12px 18px', fontWeight: 700 }}>Type</th>
              <th style={{ padding: '12px 18px', fontWeight: 700 }}>Payee / Office / Account</th>
              <th style={{ padding: '12px 18px', fontWeight: 700 }}>Date & Time</th>
              <th style={{ padding: '12px 18px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                  No transaction logs found for the selected filter or search query.
                </td>
              </tr>
            ) : (
              sortedLogs.map((log, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid #F3F4F6', transition: 'background 120ms',
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                  }}
                >
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 700, color: '#8C1515' }}>
                    {log.id}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800,
                      backgroundColor: log.type === 'BUR' ? '#FEF3C7' : log.type === 'DV' ? '#FEE2E2' : log.type === 'SL' ? '#ECFDF5' : '#E0F2FE',
                      color: log.type === 'BUR' ? '#92400E' : log.type === 'DV' ? '#991B1B' : log.type === 'SL' ? '#047857' : '#075985',
                      border: log.type === 'BUR' ? '1px solid #FDE68A' : log.type === 'DV' ? '1px solid #FCA5A5' : log.type === 'SL' ? '1px solid #A7F3D0' : '1px solid #BAE6FD'
                    }}>
                      {log.type === 'BUR' ? <FileText size={11} /> : log.type === 'DV' ? <CreditCard size={11} /> : log.type === 'SL' ? <Layers size={11} /> : <BookOpen size={11} />}
                      {log.type === 'SL' ? 'SUBSIDIARY' : log.type}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: '#111827' }}>
                    {log.payee}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#6B7280', fontSize: '12px' }}>
                    {log.date}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 800,
                      backgroundColor: log.status.includes('OBLIGATED') || log.status.includes('PAID') || log.status.includes('POSTED') || log.status.includes('RECORDED') || log.status.includes('RECONCILED') ? '#ECFDF5' : '#FEF3C7',
                      color: log.status.includes('OBLIGATED') || log.status.includes('PAID') || log.status.includes('POSTED') || log.status.includes('RECORDED') || log.status.includes('RECONCILED') ? '#047857' : '#B45309'
                    }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#111827' }}>
                    ₱{Number(log.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
