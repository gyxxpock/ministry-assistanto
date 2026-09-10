import { toDateKey } from './date-key.util';

describe('toDateKey', () => {
  it('should format a date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 8, 10))).toBe('2026-09-10');
  });

  it('should pad single-digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('should handle the last day of December', () => {
    expect(toDateKey(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});
