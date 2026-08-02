// =============================================================================
// Tax Deduction Engine — CCP FMS
// BIR-compliant withholding tax computations per Philippine tax rules
// =============================================================================

/**
 * Compute tax deductions for a DV payment.
 * @param {number} grossAmount - Gross claim amount
 * @param {string[]} taxTypes - Array of applicable tax codes: ['FINAL_VAT', 'EWT']
 * @returns {{ finalVat: number, ewt: number, totalDeductions: number, netAmount: number }}
 */
export function computeTaxDeductions(grossAmount, taxTypes = []) {
  let finalVat = 0;
  let ewt = 0;

  if (!grossAmount || grossAmount <= 0) {
    return { finalVat: 0, ewt: 0, totalDeductions: 0, netAmount: 0 };
  }

  // 5% Final VAT — Government entities withhold 5% VAT on supplier payments
  // Applied when supplier is VAT-registered
  if (taxTypes.includes('FINAL_VAT')) {
    finalVat = Math.round(grossAmount * 0.05 * 100) / 100;
  }

  // 1% Expanded Withholding Tax (EWT) — on professional/service fees
  if (taxTypes.includes('EWT_1PCT')) {
    ewt = Math.round(grossAmount * 0.01 * 100) / 100;
  }

  // 2% EWT — on goods
  if (taxTypes.includes('EWT_2PCT')) {
    ewt = Math.round(grossAmount * 0.02 * 100) / 100;
  }

  // 10% EWT — on professional fees
  if (taxTypes.includes('EWT_10PCT')) {
    ewt = Math.round(grossAmount * 0.10 * 100) / 100;
  }

  const totalDeductions = Math.round((finalVat + ewt) * 100) / 100;
  const netAmount = Math.round((grossAmount - totalDeductions) * 100) / 100;

  return { finalVat, ewt, totalDeductions, netAmount };
}

/**
 * Get journal entries for tax withholding
 * Returns the liability accounts to credit when recording tax deductions
 */
export function getTaxLiabilityEntries(finalVat, ewt) {
  const entries = [];
  if (finalVat > 0) {
    entries.push({
      account_code: '2-02-03',
      account_name: 'Due to BIR (Tax Withholding) — Final VAT',
      debit: 0,
      credit: finalVat,
    });
  }
  if (ewt > 0) {
    entries.push({
      account_code: '2-02-03',
      account_name: 'Due to BIR (Tax Withholding) — EWT',
      debit: 0,
      credit: ewt,
    });
  }
  return entries;
}

export const TAX_OPTIONS = [
  { code: 'FINAL_VAT', label: '5% Final VAT (VAT-registered supplier)', rate: 0.05 },
  { code: 'EWT_1PCT', label: '1% EWT (Goods, local purchases)', rate: 0.01 },
  { code: 'EWT_2PCT', label: '2% EWT (Services, rentals)', rate: 0.02 },
  { code: 'EWT_10PCT', label: '10% EWT (Professional/consultancy fees)', rate: 0.10 },
];
