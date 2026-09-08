import { toDateKey } from './date.utils';

describe('toDateKey', () => {
  it('converts a Date object to YYYY-MM-DD string', () => {
    expect(toDateKey(new Date(2025, 0, 5))).toBe('2025-01-05');
  });

  it('pads month with leading zero', () => {
    expect(toDateKey(new Date(2025, 0, 15))).toBe('2025-01-15');
  });

  it('pads day with leading zero', () => {
    expect(toDateKey(new Date(2025, 10, 6))).toBe('2025-11-06');
  });

  it('handles December correctly (month index 11)', () => {
    expect(toDateKey(new Date(2025, 11, 31))).toBe('2025-12-31');
  });

  it('is consistent when passed the string result of itself', () => {
    const d = new Date(2025, 5, 15);
    const key = toDateKey(d);
    expect(toDateKey(key)).toBe(key);
  });

  it('accepts a pre-formatted YYYY-MM-DD string via round-trip', () => {
    // Use local-time Date to avoid UTC-offset edge cases
    const d = new Date(2026, 8, 7); // Sep 7 2026 local midnight
    const key = toDateKey(d);
    expect(key).toBe('2026-09-07');
    expect(toDateKey(key)).toBe('2026-09-07');
  });
});
