import { describe, expect, it } from 'vitest';
import { formatMinorCurrency } from '../utils/money';

describe('formatMinorCurrency', () => {
  it('formats INR, USD and JPY using currency fraction metadata', () => {
    expect(formatMinorCurrency(99900, 'INR')).toContain('999.00');
    expect(formatMinorCurrency(12345, 'USD')).toContain('123.45');
    expect(formatMinorCurrency(999, 'JPY')).toContain('999');
    expect(formatMinorCurrency(999, 'JPY')).not.toContain('.');
  });

  it('does not mutate amount_minor or convert currencies', () => {
    const amountMinor = 12345;
    const formatted = formatMinorCurrency(amountMinor, 'USD');
    expect(amountMinor).toBe(12345);
    expect(formatted).toContain('123.45');
    expect(formatted).not.toContain('999');
  });

  it('fails safely for invalid currency metadata', () => {
    expect(formatMinorCurrency(999, 'INVALID')).toBeNull();
  });
});
