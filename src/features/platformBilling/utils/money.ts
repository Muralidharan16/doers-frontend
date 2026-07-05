export function formatMinorCurrency(amountMinor: number, currency: string): string | null {
  try {
    const formatOptions = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).resolvedOptions();
    const fractionDigits = formatOptions.maximumFractionDigits ?? formatOptions.minimumFractionDigits;
    if (fractionDigits === undefined) return null;

    const amount = amountMinor / 10 ** fractionDigits;
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return null;
  }
}
