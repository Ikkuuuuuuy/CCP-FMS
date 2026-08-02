// =============================================================================
// Ledger Engine — CCP FMS
// Double-Entry Bookkeeping integrity enforcement per GAM guidelines
// =============================================================================

/**
 * Validate that a journal entry is balanced.
 * HARD RULE: sum(debits) === sum(credits)
 * Throws an error if not balanced.
 */
export function validateJournalEntry(lines) {
  if (!lines || lines.length < 2) {
    throw new Error('A journal entry must have at least 2 lines.');
  }

  const totalDebits = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalCredits = lines.reduce((sum, l) => sum + (l.credit || 0), 0);

  // Use epsilon comparison for floating point safety
  const diff = Math.abs(totalDebits - totalCredits);
  if (diff > 0.001) {
    throw new Error(
      `LEDGER INTEGRITY VIOLATION: Debits (${totalDebits.toFixed(2)}) ≠ Credits (${totalCredits.toFixed(2)}). Difference: ${diff.toFixed(2)}`
    );
  }

  // Each line must be either debit or credit, not both
  for (const line of lines) {
    if (line.debit > 0 && line.credit > 0) {
      throw new Error(`Line ${line.account_code}: A single line cannot have both debit and credit amounts.`);
    }
    if (line.debit < 0 || line.credit < 0) {
      throw new Error(`Line ${line.account_code}: Negative amounts are not permitted.`);
    }
  }

  return { totalDebits, totalCredits, balanced: true };
}

/**
 * Build journal entry lines for a DV payment (PAID transition)
 * Standard government DV payment posting per GAM
 */
export function buildDVPaymentJournalEntry(dv) {
  const { grossClaim, taxDeductions, netAmount, expenseAccountCode, expenseAccountName } = dv;
  const { finalVat = 0, ewt = 0 } = taxDeductions || {};

  const lines = [];

  // DEBIT: Expense account (gross amount)
  lines.push({
    account_code: expenseAccountCode || '5029999000',
    account_name: expenseAccountName || 'Other MOOE',
    debit: grossClaim,
    credit: 0,
  });

  // CREDIT: Cash - MDS (net payment actually disbursed)
  if (netAmount > 0) {
    lines.push({
      account_code: '1010101000',
      account_name: 'Cash - MDS, Regular',
      debit: 0,
      credit: netAmount,
    });
  }

  // CREDIT: Due to BIR — Final VAT
  if (finalVat > 0) {
    lines.push({
      account_code: '202010005',
      account_name: 'Due to BIR — Value Added Tax 5%',
      debit: 0,
      credit: finalVat,
    });
  }

  // CREDIT: Due to BIR — EWT
  if (ewt > 0) {
    lines.push({
      account_code: '2020101002',
      account_name: 'Due to BIR — Expanded Tax 2%',
      debit: 0,
      credit: ewt,
    });
  }

  return lines;
}

/**
 * Compute running account balances from a list of journal entry lines.
 * Returns a map of { account_code: { debit, credit, balance } }
 */
export function computeAccountBalances(allEntryLines) {
  const balances = {};

  for (const line of allEntryLines) {
    if (!balances[line.account_code]) {
      balances[line.account_code] = {
        account_code: line.account_code,
        account_name: line.account_name,
        totalDebit: 0,
        totalCredit: 0,
      };
    }
    balances[line.account_code].totalDebit += line.debit || 0;
    balances[line.account_code].totalCredit += line.credit || 0;
  }

  return Object.values(balances).map((b) => ({
    ...b,
    balance: b.totalDebit - b.totalCredit,
  }));
}

/**
 * Verify overall ledger health — total debits should equal total credits
 * across all journal entries.
 */
export function verifyLedgerHealth(journalEntries) {
  let totalDebits = 0;
  let totalCredits = 0;
  const errors = [];

  for (const je of journalEntries) {
    const jeDebits = je.lines.reduce((s, l) => s + (l.debit || 0), 0);
    const jeCredits = je.lines.reduce((s, l) => s + (l.credit || 0), 0);
    totalDebits += jeDebits;
    totalCredits += jeCredits;

    const diff = Math.abs(jeDebits - jeCredits);
    if (diff > 0.001) {
      errors.push(`${je.je_id}: Unbalanced by ₱${diff.toFixed(2)}`);
    }
  }

  const overallDiff = Math.abs(totalDebits - totalCredits);
  return {
    healthy: errors.length === 0 && overallDiff <= 0.001,
    totalDebits,
    totalCredits,
    errors,
    journalCount: journalEntries.length,
  };
}
