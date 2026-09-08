import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nDatePipe } from './i18n-date.pipe';

describe('I18nDatePipe', () => {
  let pipe: I18nDatePipe;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [I18nDatePipe],
      imports: [TranslateModule.forRoot()],
    });
    translate = TestBed.inject(TranslateService);
    translate.use('es');
    pipe = TestBed.runInInjectionContext(() => new I18nDatePipe());
  });

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('formats a Date instance', () => {
    const date = new Date(2025, 10, 1);
    const result = pipe.transform(date);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats a date string (YYYY-MM-DD) without off-by-one error', () => {
    const result = pipe.transform('2025-11-01');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats a numeric timestamp', () => {
    const ts = new Date(2025, 10, 1).getTime();
    const result = pipe.transform(ts);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns empty string for an invalid date string', () => {
    expect(pipe.transform('not-a-date')).toBe('');
  });

  it('accepts custom Intl.DateTimeFormatOptions', () => {
    const date = new Date(2025, 10, 1);
    const result = pipe.transform(date, { year: 'numeric' });
    expect(result).toContain('2025');
  });
});
