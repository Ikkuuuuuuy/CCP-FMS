import React from 'react';
import { formatCurrency, numberToWords } from '../../utils/formatters';

export default function DVPrintTemplate({ dv }) {
  const data = dv || {
    dvNo: '07-0302-26',
    modeOfPayment: 'Check',
    payeeName: 'SOPHIES INFORMATION TECHNOLOGY SERVICES',
    payeeTIN: '229-298-600-000',
    burNo: '26-03-0517',
    address: 'Unit 6 Ink Center Building, General Luna St., Brgy. 10 Lipa City Batangas',
    department: 'CCD',
    expenseAccountCode: '13',
    description: 'SECOND TRANCHE PAYMENT for services rendered as Website & App Manager and Technical Support for the One (1) Year Hosting and Maintenance of the CCP Channel. (01 April - 30 June 2026)',
    grossClaim: 200750.00,
    taxDeductions: {
      totalDeductions: 12546.87,
      ewt: 3584.82,
      finalVat: 8962.05
    },
    netAmount: 188203.13,
    certifiedByName: 'LOURDES S. MENDOZA',
    approvedByName: 'KAYE C. TINGA',
    checkNo: '527225',
    checkDate: 'July 28, 2026',
    bankName: 'LANDBANK',
    receivedByName: 'REYMART P. CASTILO',
    receivedDate: 'July 29, 2026'
  };

  const grossClaim = data.grossClaim || 0;
  const totalDeductions = data.taxDeductions?.totalDeductions || 0;
  const netAmount = data.netAmount || (grossClaim - totalDeductions);
  const mode = data.modeOfPayment || 'Check';

  return (
    <div className="print-only" style={{
      width: '100%',
      maxWidth: '850px',
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
        <div style={{ display: 'flex', borderBottom: '1px solid #000', minHeight: '75px', alignItems: 'center' }}>
          {/* Logo & Agency Info */}
          <div style={{ width: '70%', display: 'flex', alignItems: 'center', padding: '8px 12px' }}>
            <img 
              src="/ccp-official-logo.png" 
              alt="CCP Logo" 
              style={{ width: '55px', height: '55px', marginRight: '15px', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '10px' }}>Republic of the Philippines</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>CULTURAL CENTER OF THE PHILIPPINES</div>
              <div style={{ fontSize: '10px' }}>Roxas Boulevard, Pasay City</div>
            </div>
          </div>

          {/* Right Header Info (DV No) */}
          <div style={{ width: '30%', borderLeft: '1px solid #000', padding: '10px', textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>DV No.</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', marginTop: '4px' }}>
              {data.dvNo ? data.dvNo.replace(/^DV-/, '') : '08-0001-26'}
            </div>
          </div>
        </div>

        {/* Title Row */}
        <div style={{
          borderBottom: '1px solid #000',
          textAlign: 'center',
          padding: '8px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          backgroundColor: '#f8f8f8'
        }}>
          DISBURSEMENT VOUCHER
        </div>

        {/* Mode of Payment Row */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '6px 12px', alignItems: 'center' }}>
          <div style={{ width: '18%', fontWeight: 'bold' }}>Mode of Payment</div>
          <div style={{ width: '82%', display: 'flex', gap: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <span style={{ border: '1px solid #000', width: '13px', height: '13px', display: 'inline-block', textAlign: 'center', lineHeight: '11px', fontSize: '11px', fontWeight: 'bold' }}>
                {mode === 'Check' ? '✓' : ''}
              </span>
              Check
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <span style={{ border: '1px solid #000', width: '13px', height: '13px', display: 'inline-block', textAlign: 'center', lineHeight: '11px', fontSize: '11px', fontWeight: 'bold' }}>
                {mode === 'Cash' ? '✓' : ''}
              </span>
              Cash
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <span style={{ border: '1px solid #000', width: '13px', height: '13px', display: 'inline-block', textAlign: 'center', lineHeight: '11px', fontSize: '11px', fontWeight: 'bold' }}>
                {mode !== 'Check' && mode !== 'Cash' ? '✓' : ''}
              </span>
              Others
            </label>
          </div>
        </div>

        {/* Payee / TIN / BUR Row */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
          <div style={{ width: '60%', borderRight: '1px solid #000', padding: '6px 8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#444' }}>Payee</div>
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginTop: '2px', textTransform: 'uppercase' }}>{data.payeeName || 'N/A'}</div>
          </div>
          <div style={{ width: '20%', borderRight: '1px solid #000', padding: '6px 8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#444' }}>TIN Number</div>
            <div style={{ marginTop: '2px', fontFamily: 'monospace', fontWeight: 'bold' }}>{data.payeeTIN || 'N/A'}</div>
          </div>
          <div style={{ width: '20%', padding: '6px 8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#444' }}>BUR Number</div>
            <div style={{ marginTop: '2px', fontFamily: 'monospace', fontWeight: 'bold' }}>{data.burNo || data.burRef || 'N/A'}</div>
          </div>
        </div>

        {/* Address / Dept / Code Row */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
          <div style={{ width: '60%', borderRight: '1px solid #000', padding: '6px 8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#444' }}>Address</div>
            <div style={{ marginTop: '2px' }}>{data.address || 'N/A'}</div>
          </div>
          <div style={{ width: '20%', borderRight: '1px solid #000', padding: '6px 8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#444' }}>Department</div>
            <div style={{ marginTop: '2px', fontWeight: 'bold' }}>{data.department || 'CCD'}</div>
          </div>
          <div style={{ width: '20%', padding: '6px 8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#444' }}>Code</div>
            <div style={{ marginTop: '2px' }}>{data.expenseAccountCode || '13'}</div>
          </div>
        </div>

        {/* Particulars & Amount Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000', backgroundColor: '#f8f8f8', fontWeight: 'bold', textAlign: 'center' }}>
          <div style={{ width: '80%', borderRight: '1px solid #000', padding: '6px' }}>Particulars</div>
          <div style={{ width: '20%', padding: '6px' }}>AMOUNT</div>
        </div>

        {/* Particulars Content & Amount Table */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000', minHeight: '220px' }}>
          <div style={{ width: '80%', borderRight: '1px solid #000', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>{data.description || 'Payment for services rendered'}</div>
              <div style={{ fontSize: '10px', fontStyle: 'italic', marginBottom: '15px' }}>See attached checklist of requirements.</div>
            </div>
            
            {/* Tax Computation breakdown inside Particulars */}
            <div style={{ fontSize: '10px', borderTop: '1px dashed #ccc', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px' }}>
                <span>Gross:</span> <span>{formatCurrency(grossClaim).replace('₱', '')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px' }}>
                <span>Tax withheld:</span> <span>{formatCurrency(totalDeductions).replace('₱', '')}</span>
              </div>
              {data.taxDeductions?.finalVat > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '280px', color: '#555', paddingLeft: '10px' }}>
                  <span>Due to BIR - Value Added Tax 5%:</span> <span>{formatCurrency(data.taxDeductions.finalVat).replace('₱', '')}</span>
                </div>
              )}
              {data.taxDeductions?.ewt > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '280px', color: '#555', paddingLeft: '10px' }}>
                  <span>Due to BIR - Expanded Tax 2%:</span> <span>{formatCurrency(data.taxDeductions.ewt).replace('₱', '')}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ width: '20%', padding: '12px 8px', textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>
            {formatCurrency(netAmount).replace('₱', '')}
          </div>
        </div>

        {/* Total Row */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000', fontWeight: 'bold', backgroundColor: '#f8f8f8' }}>
          <div style={{ width: '80%', borderRight: '1px solid #000', padding: '6px 12px', textAlign: 'right' }}>
            TOTAL
          </div>
          <div style={{ width: '20%', padding: '6px 8px', textAlign: 'right', fontSize: '13px' }}>
            {formatCurrency(netAmount).replace('₱', '')}
          </div>
        </div>

        {/* Sections A & B Box */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
          {/* Section A */}
          <div style={{ width: '50%', borderRight: '1px solid #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ padding: '6px 8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>A. Certified</div>
              <div style={{ textAlign: 'center', marginTop: '12px', fontStyle: 'italic', fontSize: '10px' }}>
                Supporting documents complete and proper
              </div>
            </div>

            <div style={{ borderTop: '1px solid #000' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', minHeight: '35px', alignItems: 'flex-end' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Signature</span>
                <span style={{ width: '70%', textAlign: 'center', borderBottom: '1px solid #888' }}></span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Printed Name</span>
                <span style={{ width: '70%', textAlign: 'center', fontWeight: 'bold' }}>{data.certifiedByName || 'LOURDES S. MENDOZA'}</span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Position</span>
                <span style={{ width: '70%', textAlign: 'center', fontSize: '9px' }}>Department Manager III, FSD<br/>Head, Accounting Unit/Authorized Representative</span>
              </div>
              <div style={{ display: 'flex', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Date</span>
                <span style={{ width: '70%', textAlign: 'center' }}></span>
              </div>
            </div>
          </div>

          {/* Section B */}
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ padding: '6px 8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>B. Approved for Payment</div>
              <div style={{ textAlign: 'center', marginTop: '8px', fontWeight: 'bold', fontSize: '11px', textTransform: 'capitalize' }}>
                {numberToWords(netAmount)}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #000' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', minHeight: '35px', alignItems: 'flex-end' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Signature</span>
                <span style={{ width: '70%', textAlign: 'center', borderBottom: '1px solid #888' }}></span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Printed Name</span>
                <span style={{ width: '70%', textAlign: 'center', fontWeight: 'bold' }}>{data.approvedByName || 'KAYE C. TINGA'}</span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Position</span>
                <span style={{ width: '70%', textAlign: 'center', fontSize: '9px' }}>President<br/>Agency Head/Authorized Representative</span>
              </div>
              <div style={{ display: 'flex', padding: '4px 8px', alignItems: 'center' }}>
                <span style={{ width: '30%', fontWeight: 'bold' }}>Date</span>
                <span style={{ width: '70%', textAlign: 'center' }}></span>
              </div>
            </div>
          </div>
        </div>

        {/* Section C: Received Payment */}
        <div>
          <div style={{ padding: '4px 8px', fontWeight: 'bold', borderBottom: '1px solid #000', backgroundColor: '#f8f8f8' }}>
            C. Received Payment
          </div>
          <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
            <div style={{ width: '40%', borderRight: '1px solid #000', padding: '4px 8px' }}>
              <strong>Check No.:</strong> {data.checkNo || '527225'}
            </div>
            <div style={{ width: '20%', borderRight: '1px solid #000', padding: '4px 8px' }}>
              <strong>Date:</strong> {data.checkDate || 'July 28, 2026'}
            </div>
            <div style={{ width: '20%', borderRight: '1px solid #000', padding: '4px 8px' }}>
              <strong>Bank Name:</strong> {data.bankName || 'LANDBANK'}
            </div>
            <div style={{ width: '20%', padding: '4px 8px' }}>
              <strong>JEV No.:</strong> {data.jevNo || ''}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '40%', borderRight: '1px solid #000', padding: '4px 8px' }}>
              <strong>Signature:</strong>
            </div>
            <div style={{ width: '20%', borderRight: '1px solid #000', padding: '4px 8px' }}>
              <strong>Date:</strong> {data.receivedDate || 'July 29, 2026'}
            </div>
            <div style={{ width: '20%', borderRight: '1px solid #000', padding: '4px 8px' }}>
              <strong>Printed Name:</strong> {data.receivedByName || 'REYMART P. CASTILO'}
            </div>
            <div style={{ width: '20%', padding: '4px 8px' }}>
              <strong>Date:</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
