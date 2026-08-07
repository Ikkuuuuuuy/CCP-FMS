import React from 'react';

export default function SubsidiaryLedgerPrintTemplate({ ledger }) {
  const data = ledger || {
    accountSymbol: '63',
    accountOf: 'PHILIPPINE SAILING ASSOCIATION',
    address: 'CCP Complex, Pasay City',
    sheetNo: '63',
    period: 'Jan. 1, 2025 to Dec. 31, 2025',
    memo: [
      'Rental 895,540.80',
      'garbage 1,680.-',
      'TOTAL 897,220.80',
      'due every 5th of the month'
    ],
    entries: []
  };

  const formatPesos = (val) => {
    if (!val || val === 0) return '';
    const parts = val.toFixed(2).split('.');
    return Number(parts[0]).toLocaleString('en-US');
  };

  const formatCents = (val) => {
    if (val === undefined || val === null) return '';
    if (val === 0) return '—';
    const parts = val.toFixed(2).split('.');
    return parts[1];
  };

  return (
    <div className="print-only" style={{
      width: '100%',
      maxWidth: '850px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#fff',
      color: '#000',
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '11px',
      lineHeight: '1.2',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.5px', fontFamily: '"Times New Roman", serif', textTransform: 'uppercase' }}>
          CULTURAL CENTER OF THE PHILIPPINES COMPLEX
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '3px', marginTop: '4px', textTransform: 'uppercase' }}>
          SUBSIDIARY LEDGER
        </div>
      </div>

      {/* Account Info Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px', fontSize: '11px', textTransform: 'uppercase' }}>
        <div style={{ width: '65%' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <span style={{ fontWeight: 'bold', marginRight: '6px', whiteSpace: 'nowrap' }}>ACCOUNT OF:</span>
            <span style={{ borderBottom: '1px dotted #000', flex: 1, paddingLeft: '8px', fontWeight: 'bold', fontSize: '14px', fontFamily: 'Courier New, monospace' }}>
              {data.accountOf}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 'bold', marginRight: '6px', whiteSpace: 'nowrap' }}>ADDRESS:</span>
            <span style={{ borderBottom: '1px dotted #000', flex: 1, paddingLeft: '8px' }}>
              {data.address || '—'}
            </span>
          </div>
        </div>

        <div style={{ width: '30%', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', marginBottom: '4px' }}>
            <span style={{ fontWeight: 'bold', marginRight: '6px' }}>ACCOUNT SYMBOL:</span>
            <span style={{ borderBottom: '1px dotted #000', width: '80px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', fontFamily: 'Courier New, monospace' }}>
              {data.accountSymbol}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end' }}>
            <span style={{ fontWeight: 'bold', marginRight: '6px' }}>SHEET NO.:</span>
            <span style={{ borderBottom: '1px dotted #000', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>
              {data.sheetNo || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Ledger Table with Left Memo Box */}
      <div style={{ display: 'flex', border: '1px solid #000' }}>
        
        {/* Left Side Memo Annotation Box */}
        <div style={{ width: '130px', borderRight: '1px solid #000', padding: '8px', fontSize: '10px', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '4px', fontWeight: 'bold' }}>
            {data.period || 'Jan. 1, 2025 to Dec. 31, 2025'}
          </div>
          <div style={{ fontSize: '9px', lineHeight: '1.4' }}>
            {(data.memo || []).map((m, idx) => (
              <div key={idx}>{m}</div>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div style={{ flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', textTransform: 'uppercase' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>
                <th style={{ width: '90px', borderRight: '1px solid #000', padding: '4px' }}>
                  Date
                </th>
                <th style={{ width: '90px', borderRight: '1px solid #000', padding: '4px' }}>
                  Reference
                </th>
                <th style={{ borderRight: '1px solid #000', padding: '4px', textAlign: 'center', letterSpacing: '1px' }}>
                  P A R T I C U L A R S
                </th>
                <th style={{ width: '25px', borderRight: '1px solid #000', padding: '4px' }}>
                  F
                </th>
                <th style={{ width: '85px', borderRight: '1px solid #000', padding: '4px' }}>
                  Debit
                </th>
                <th style={{ width: '85px', borderRight: '1px solid #000', padding: '4px' }}>
                  Credit
                </th>
                <th style={{ width: '90px', padding: '4px' }}>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {(data.entries || []).map((entry, index) => {
                const isZeroBal = entry.balance === 0 && entry.particulars !== 'Forwarded Balance';
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd', minHeight: '22px' }}>
                    {/* Date */}
                    <td style={{ borderRight: '1px solid #000', padding: '3px 4px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{entry.month}</span>
                        <span>{entry.day}</span>
                      </div>
                    </td>

                    {/* Reference */}
                    <td style={{ borderRight: '1px solid #000', padding: '3px 4px', fontFamily: 'Courier New, monospace', fontSize: '10px', verticalAlign: 'top' }}>
                      {entry.reference}
                    </td>

                    {/* Particulars */}
                    <td style={{ borderRight: '1px solid #000', padding: '3px 6px', verticalAlign: 'top', textTransform: 'none' }}>
                      {entry.particulars}
                    </td>

                    {/* Folio */}
                    <td style={{ borderRight: '1px solid #000', padding: '3px 2px', textAlign: 'center', verticalAlign: 'top', fontSize: '9px' }}>
                      {entry.folio}
                    </td>

                    {/* Debit Split (Pesos | Cents) */}
                    <td style={{ borderRight: '1px solid #000', padding: '3px 4px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Courier New, monospace' }}>
                        <span>{formatPesos(entry.debit)}</span>
                        {entry.debit > 0 && <span style={{ marginLeft: '4px', borderLeft: '1px solid #ccc', paddingLeft: '3px' }}>{formatCents(entry.debit)}</span>}
                      </div>
                    </td>

                    {/* Credit Split (Pesos | Cents) */}
                    <td style={{ borderRight: '1px solid #000', padding: '3px 4px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Courier New, monospace' }}>
                        <span>{formatPesos(entry.credit)}</span>
                        {entry.credit > 0 && <span style={{ marginLeft: '4px', borderLeft: '1px solid #ccc', paddingLeft: '3px' }}>{formatCents(entry.credit)}</span>}
                      </div>
                    </td>

                    {/* Balance Split */}
                    <td style={{ padding: '3px 4px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}>
                        {isZeroBal ? (
                          <span style={{ width: '100%', textAlign: 'center' }}>— 0 —</span>
                        ) : (
                          <>
                            <span>{entry.balance > 0 ? formatPesos(entry.balance) : ''}</span>
                            {entry.balance > 0 && <span style={{ marginLeft: '4px', borderLeft: '1px solid #ccc', paddingLeft: '3px' }}>{formatCents(entry.balance)}</span>}
                          </>
                        )}
                      </div>
                      {entry.dateMarker && (
                        <div style={{ textAlign: 'right', fontSize: '8px', borderTop: '1px solid #000', marginTop: '2px', textTransform: 'none' }}>
                          {entry.dateMarker}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Blank filler rows to match physical paper sheet look */}
              {Array.from({ length: Math.max(0, 18 - (data.entries?.length || 0)) }).map((_, idx) => (
                <tr key={`blank-${idx}`} style={{ height: '22px', borderBottom: '1px solid #eee' }}>
                  <td style={{ borderRight: '1px solid #000' }}></td>
                  <td style={{ borderRight: '1px solid #000' }}></td>
                  <td style={{ borderRight: '1px solid #000' }}></td>
                  <td style={{ borderRight: '1px solid #000' }}></td>
                  <td style={{ borderRight: '1px solid #000' }}></td>
                  <td style={{ borderRight: '1px solid #000' }}></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
