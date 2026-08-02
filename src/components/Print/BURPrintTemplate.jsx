import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function BURPrintTemplate({ bur }) {
  const data = bur || {
    burNo: '26-01-0023',
    fundCluster: '101',
    fundClusterName: 'REGULAR',
    payeeName: 'LSERV CORPORATION',
    office: 'Administrative Services',
    address: '21ST Floor, Petron Megaplaza Bldg. No. 358 Sen. Gil Puyat Avenue, Makati City',
    responsibilityCenter: '08',
    particulars: 'Contract of Service of LSERV CORPORATION (indoor janitorial) for the period January 1, 2026 to November 15, 2026 (with 13th month pay and 5 days incentive leave)',
    reference: 'CONTRACT OF SERVICE',
    accountCode: '5021202000',
    amount: 11498489.52,
    createdAt: '2025-10-03T00:00:00.000Z',
    certifiedByName: 'KAYE C. TINGA',
    certifiedByPosition: 'President',
    approvedByName: 'LOURDES S. MENDOZA',
    approvedByPosition: 'Department Manager III, FSD'
  };

  return (
    <div className="print-only" style={{
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      color: '#000',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '11px',
      lineHeight: '1.3',
      boxSizing: 'border-box'
    }}>
      {/* Outer Border Box */}
      <div style={{ border: '2px solid #000', padding: '2px' }}>
        
        {/* Header Block */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000', minHeight: '80px', alignItems: 'center' }}>
          {/* Logo & Agency Info */}
          <div style={{ width: '65%', display: 'flex', alignItems: 'center', padding: '10px' }}>
            <img 
              src="/ccp-official-logo.png" 
              alt="CCP Logo" 
              style={{ width: '60px', height: '60px', marginRight: '15px', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '10px' }}>Republic of the Philippines</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>CULTURAL CENTER OF THE PHILIPPINES</div>
              <div style={{ fontSize: '10px' }}>Roxas Boulevard, Pasay City</div>
            </div>
          </div>

          {/* Right Header Info (Date & BUR Number) */}
          <div style={{ width: '35%', borderLeft: '1px solid #000', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' }}>
              {data.fundClusterName || 'REGULAR'}
            </div>
            <div>
              <div style={{ fontSize: '10px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span><strong>Date:</strong></span>
                <span>{new Date(data.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div style={{ fontSize: '10px' }}>
                <strong>BUR Number:</strong>
                <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'right', letterSpacing: '1px', marginTop: '2px' }}>
                  {data.burNo}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title Row */}
        <div style={{
          borderBottom: '1px solid #000',
          textAlign: 'center',
          padding: '8px 0',
          fontSize: '16px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          backgroundColor: '#f8f8f8'
        }}>
          BUDGET UTILIZATION REQUEST
        </div>

        {/* Payee Info Table */}
        <div style={{ borderBottom: '1px solid #000' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #000', minHeight: '26px', alignItems: 'center' }}>
            <div style={{ width: '15%', padding: '4px 8px', fontWeight: 'bold', borderRight: '1px solid #000' }}>Payee</div>
            <div style={{ width: '85%', padding: '4px 8px', fontWeight: 'bold', textTransform: 'uppercase' }}>{data.payeeName || data.payee || 'N/A'}</div>
          </div>
          <div style={{ display: 'flex', borderBottom: '1px solid #000', minHeight: '26px', alignItems: 'center' }}>
            <div style={{ width: '15%', padding: '4px 8px', fontWeight: 'bold', borderRight: '1px solid #000' }}>Office</div>
            <div style={{ width: '85%', padding: '4px 8px' }}>{data.office || data.responsibilityCenter || 'Administrative Services'}</div>
          </div>
          <div style={{ display: 'flex', minHeight: '26px', alignItems: 'center' }}>
            <div style={{ width: '15%', padding: '4px 8px', fontWeight: 'bold', borderRight: '1px solid #000' }}>Address</div>
            <div style={{ width: '85%', padding: '4px 8px' }}>{data.address || 'N/A'}</div>
          </div>
        </div>

        {/* Particulars & Amount Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', borderBottom: '1px solid #000' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #000', backgroundColor: '#f8f8f8', fontSize: '10px' }}>
              <th style={{ width: '15%', borderRight: '1px solid #000', padding: '6px', textAlign: 'center' }}>Responsibility Center</th>
              <th style={{ width: '50%', borderRight: '1px solid #000', padding: '6px', textAlign: 'center' }}>Particulars</th>
              <th style={{ width: '15%', borderRight: '1px solid #000', padding: '6px', textAlign: 'center' }}>Account Code</th>
              <th style={{ width: '20%', padding: '6px', textAlign: 'center' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ minHeight: '220px' }}>
              <td style={{ borderRight: '1px solid #000', padding: '12px 8px', textAlign: 'center', verticalAlign: 'top' }}>
                {data.responsibilityCenter || '08'}
              </td>
              <td style={{ borderRight: '1px solid #000', padding: '12px 8px', verticalAlign: 'top', minHeight: '200px' }}>
                <div style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>{data.particulars || 'Budget Utilization Request'}</div>
                {data.reference && (
                  <div style={{ marginTop: '40px', fontSize: '10px', fontStyle: 'italic' }}>
                    Ref: {data.reference}
                  </div>
                )}
              </td>
              <td style={{ borderRight: '1px solid #000', padding: '12px 8px', textAlign: 'center', verticalAlign: 'top', fontFamily: 'monospace' }}>
                {data.accountCode || '5021202000'}
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'right', verticalAlign: 'top', fontWeight: 'bold' }}>
                {formatCurrency(data.amount).replace('₱', '')}
              </td>
            </tr>
            {/* Total Row */}
            <tr style={{ borderTop: '1px solid #000', fontWeight: 'bold' }}>
              <td colSpan="3" style={{ borderRight: '1px solid #000', padding: '6px 12px', textAlign: 'right' }}>
                Total
              </td>
              <td style={{ padding: '6px 8px', textAlign: 'right', fontSize: '12px' }}>
                {formatCurrency(data.amount).replace('₱', '')}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section A and B Approval Boxes */}
        <div style={{ display: 'flex' }}>
          {/* Section A */}
          <div style={{ width: '50%', borderRight: '1px solid #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ padding: '4px 8px', fontWeight: 'bold', borderBottom: '1px solid #000', backgroundColor: '#f8f8f8' }}>
                A. Certified
              </div>
              <div style={{ padding: '10px 8px 15px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ border: '1px solid #000', width: '12px', height: '12px', display: 'inline-block', marginRight: '6px', marginTop: '1px', textAlign: 'center', lineHeight: '10px', fontSize: '10px' }}>✓</span>
                  <span>Charges to budget necessary, lawful and under my direct supervision</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ border: '1px solid #000', width: '12px', height: '12px', display: 'inline-block', marginRight: '6px', marginTop: '1px', textAlign: 'center', lineHeight: '10px', fontSize: '10px' }}>✓</span>
                  <span>Supporting documents valid, proper and legal</span>
                </div>
              </div>
            </div>

            {/* Signature Box A */}
            <div style={{ borderTop: '1px solid #000' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', minHeight: '40px', alignItems: 'flex-end' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Signature</span>
                <span style={{ width: '70%', textAlign: 'center', borderBottom: '1px solid #888' }}></span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Printed Name</span>
                <span style={{ width: '70%', textAlign: 'center', fontWeight: 'bold' }}>{data.certifiedByName || 'KAYE C. TINGA'}</span>
              </div>
              <div style={{ display: 'flex', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Position</span>
                <span style={{ width: '70%', textAlign: 'center' }}>{data.certifiedByPosition || 'President'}</span>
              </div>
            </div>
          </div>

          {/* Section B */}
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ padding: '4px 8px', fontWeight: 'bold', borderBottom: '1px solid #000', backgroundColor: '#f8f8f8' }}>
                B. Certified
              </div>
              <div style={{ padding: '10px 8px 15px 8px' }}>
                <div>Budget available and earmarked/utilized for the purpose as indicated above</div>
              </div>
            </div>

            {/* Signature Box B */}
            <div style={{ borderTop: '1px solid #000' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', minHeight: '40px', alignItems: 'flex-end' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Signature</span>
                <span style={{ width: '70%', textAlign: 'center', borderBottom: '1px solid #888' }}></span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Printed Name</span>
                <span style={{ width: '70%', textAlign: 'center', fontWeight: 'bold' }}>{data.approvedByName || 'LOURDES S. MENDOZA'}</span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Position</span>
                <span style={{ width: '70%', textAlign: 'center' }}>{data.approvedByPosition || 'Department Manager III, FSD'}</span>
              </div>
              <div style={{ display: 'flex', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Date</span>
                <span style={{ width: '70%', textAlign: 'center' }}></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
