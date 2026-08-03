// =============================================================================
// Formatters — CCP FMS
// =============================================================================

/**
 * Format a number as Philippine Peso currency
 */
export function formatCurrency(amount, showSign = false) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₱0.00';
  const formatted = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  if (showSign && amount < 0) return `-${formatted}`;
  return formatted;
}

/**
 * Convert number to words for cheque/DV printing
 */
export function numberToWords(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Zero Pesos Only';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertChunk(n) {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '') + ' ';
    return ones[Math.floor(n / 100)] + ' Hundred ' + (n % 100 !== 0 ? convertChunk(n % 100) : '');
  }

  const num = Math.abs(Number(amount));
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) return 'Zero Pesos Only';

  let result = '';
  let temp = integerPart;

  if (temp >= 1000000000) {
    result += convertChunk(Math.floor(temp / 1000000000)) + 'Billion ';
    temp %= 1000000000;
  }
  if (temp >= 1000000) {
    result += convertChunk(Math.floor(temp / 1000000)) + 'Million ';
    temp %= 1000000;
  }
  if (temp >= 1000) {
    result += convertChunk(Math.floor(temp / 1000)) + 'Thousand ';
    temp %= 1000;
  }
  if (temp > 0) {
    result += convertChunk(temp);
  }

  result = result.trim() + ' Pesos';

  if (decimalPart > 0) {
    result += ` And ${decimalPart} Centavos`;
  } else {
    result += ' Only';
  }

  return result;
}

/**
 * Format compact currency (millions/thousands)
 */
export function formatCurrencyCompact(amount) {
  if (Math.abs(amount) >= 1_000_000) {
    return `₱${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `₱${(amount / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

/**
 * Generate BUR number
 * Format: YY-MM-SSSS (e.g., 26-08-0001)
 */
export function generateBURNumber(year, month, sequence) {
  const yy = String(year).slice(-2);
  const mm = String(month).padStart(2, '0');
  return `${yy}-${mm}-${String(sequence).padStart(4, '0')}`;
}

/**
 * Generate DV number
 * Format: MM-SSSS-YY (e.g., 07-0302-26)
 */
export function generateDVNumber(year, month, sequence) {
  const yy = String(year).slice(-2);
  const mm = String(month).padStart(2, '0');
  return `${mm}-${String(sequence).padStart(4, '0')}-${yy}`;
}

/**
 * Generate Journal Entry number
 */
export function generateJENumber(year, sequence) {
  return `JE-${year}-${String(sequence).padStart(4, '0')}`;
}

/**
 * Generate Audit Log ID
 */
export function generateAuditLogId(sequence) {
  return `AUD-${String(sequence).padStart(5, '0')}`;
}

/**
 * Format date to Philippine standard
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...options,
  });
}

/**
 * Format datetime
 */
export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Get current year
 */
export function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Get current month (1-indexed)
 */
export function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

/**
 * Get ISO date string (YYYY-MM-DD)
 */
export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate utilization percentage
 */
export function calcUtilizationPct(used, total) {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.round((used / total) * 10000) / 100);
}

/**
 * BUR/DV status color mapping
 */
export const STATUS_CONFIG = {
  // BUR statuses
  DRAFT:                        { label: 'Draft',                color: '#6B7280', bg: '#F3F4F6' },
  PREPARED:                     { label: 'Prepared',             color: '#2563EB', bg: '#EFF6FF' },
  PENDING_BUDGET_CERTIFICATION: { label: 'Pending Certification',color: '#D97706', bg: '#FFFBEB' },
  OBLIGATED:                    { label: 'Obligated',            color: '#059669', bg: '#ECFDF5' },
  APPROVED:                     { label: 'Approved',             color: '#059669', bg: '#ECFDF5' },
  REJECTED:                     { label: 'Rejected',             color: '#DC2626', bg: '#FEF2F2' },
  // DV payment process statuses
  PENDING_ACCOUNTING:           { label: 'Pending Accounting',   color: '#2563EB', bg: '#EFF6FF' },
  APPROVED_FOR_PAYMENT:         { label: 'Approved for Payment', color: '#7C3AED', bg: '#F5F3FF' },
  FOR_CHECK_PREPARATION:        { label: 'For Check preparation',color: '#D97706', bg: '#FFFBEB' },
  FOR_RELEASE:                  { label: 'For Release',          color: '#0284C7', bg: '#E0F2FE' },
  PAID:                         { label: 'Paid',                 color: '#065F46', bg: '#D1FAE5' },
};
