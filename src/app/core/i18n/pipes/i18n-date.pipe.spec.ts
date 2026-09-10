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

  describe('language resolution (getCurrentLang() || getFallbackLang() || "es")', () => {
    // In-memory double: controls what the i18n service reports for current/fallback
    // language without touching TranslateService's real (HTTP-backed) resources.
    const date = new Date(2025, 0, 15);

    it('uses getCurrentLang() when it is truthy', () => {
      spyOn(translate, 'getCurrentLang').and.returnValue('en-US');
      spyOn(translate, 'getFallbackLang').and.returnValue('fr');

      const result = pipe.transform(date);

      expect(result).toBe(
        new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
      );
    });

    it('falls back to getFallbackLang() when getCurrentLang() is falsy', () => {
      spyOn(translate, 'getCurrentLang').and.returnValue('');
      spyOn(translate, 'getFallbackLang').and.returnValue('fr');

      const result = pipe.transform(date);

      expect(result).toBe(new Intl.DateTimeFormat('fr', { dateStyle: 'medium' }).format(date));
    });

    it('falls back to "es" when both getCurrentLang() and getFallbackLang() are falsy', () => {
      spyOn(translate, 'getCurrentLang').and.returnValue('');
      spyOn(translate, 'getFallbackLang').and.returnValue('');

      const result = pipe.transform(date);

      expect(result).toBe(new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(date));
    });
  });
});
