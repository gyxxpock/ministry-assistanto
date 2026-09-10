import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let setItemSpy: jasmine.Spy;
  let setAttrSpy: jasmine.Spy;
  let changeListener: (e: MediaQueryListEvent) => void;

  /** Builds a fake MediaQueryList with a configurable `matches` and a
   *  captured `addEventListener` callback so tests can simulate OS changes. */
  function makeMockMql(systemDark: boolean): MediaQueryList {
    const mql = {
      matches: systemDark,
      media: '(prefers-color-scheme: dark)',
      addEventListener: jasmine
        .createSpy('addEventListener')
        .and.callFake((_type: string, cb: (e: MediaQueryListEvent) => void) => {
          changeListener = cb;
        }),
      removeEventListener: jasmine.createSpy('removeEventListener'),
    };
    return mql as unknown as MediaQueryList;
  }

  function configureTestBed(stored: string | null = null, systemDark = false): void {
    spyOn(localStorage, 'getItem').and.callFake((key: string) =>
      key === 'ma-theme' ? stored : null
    );
    setItemSpy = spyOn(localStorage, 'setItem');
    setAttrSpy = spyOn(document.documentElement, 'setAttribute').and.callThrough();
    spyOn(window, 'matchMedia').and.returnValue(makeMockMql(systemDark));
    TestBed.configureTestingModule({});
  }

  afterEach(() => {
    TestBed.resetTestingModule();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('initialization', () => {
    it('defaults to "system" when localStorage returns null', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      expect(service.mode()).toBe('system');
    });

    it('reads stored mode from localStorage on startup', () => {
      configureTestBed('dark');
      const service = TestBed.inject(ThemeService);
      expect(service.mode()).toBe('dark');
    });

    it('reads "light" mode from localStorage', () => {
      configureTestBed('light');
      const service = TestBed.inject(ThemeService);
      expect(service.mode()).toBe('light');
    });

    it('subscribes to matchMedia change events on construction', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      expect(service).toBeTruthy();
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });
  });

  describe('setMode()', () => {
    it('updates the mode signal', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      service.setMode('light');
      expect(service.mode()).toBe('light');
    });

    it('persists the new mode to localStorage', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      service.setMode('dark');
      expect(setItemSpy).toHaveBeenCalledWith('ma-theme', 'dark');
    });

    it('persists "system" mode to localStorage', () => {
      configureTestBed('light');
      const service = TestBed.inject(ThemeService);
      service.setMode('system');
      expect(setItemSpy).toHaveBeenCalledWith('ma-theme', 'system');
    });
  });

  describe('toggle()', () => {
    it('cycles system → light', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      service.toggle();
      expect(service.mode()).toBe('light');
    });

    it('cycles light → dark', () => {
      configureTestBed('light');
      const service = TestBed.inject(ThemeService);
      service.toggle();
      expect(service.mode()).toBe('dark');
    });

    it('cycles dark → system', () => {
      configureTestBed('dark');
      const service = TestBed.inject(ThemeService);
      service.toggle();
      expect(service.mode()).toBe('system');
    });

    it('persists the toggled mode to localStorage', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      service.toggle();
      expect(setItemSpy).toHaveBeenCalledWith('ma-theme', 'light');
    });
  });

  describe('resolvedTheme() and DOM effect (_apply)', () => {
    it('resolves to "light" and sets data-theme="light" on <html> when mode is "light"', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      service.setMode('light');
      TestBed.flushEffects();
      expect(service.resolvedTheme()).toBe('light');
      expect(setAttrSpy).toHaveBeenCalledWith('data-theme', 'light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('resolves to "dark" and sets data-theme="dark" on <html> when mode is "dark"', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      service.setMode('dark');
      TestBed.flushEffects();
      expect(service.resolvedTheme()).toBe('dark');
      expect(setAttrSpy).toHaveBeenCalledWith('data-theme', 'dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('resolves "system" to "light" when the OS preference is light', () => {
      configureTestBed('system', false);
      const service = TestBed.inject(ThemeService);
      TestBed.flushEffects();
      expect(service.resolvedTheme()).toBe('light');
      expect(setAttrSpy).toHaveBeenCalledWith('data-theme', 'light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('resolves "system" to "dark" when the OS preference is dark', () => {
      configureTestBed('system', true);
      const service = TestBed.inject(ThemeService);
      TestBed.flushEffects();
      expect(service.resolvedTheme()).toBe('dark');
      expect(setAttrSpy).toHaveBeenCalledWith('data-theme', 'dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('reacts live to OS preference changes while in "system" mode', () => {
      configureTestBed('system', false);
      const service = TestBed.inject(ThemeService);
      TestBed.flushEffects();
      expect(service.resolvedTheme()).toBe('light');

      changeListener({ matches: true } as MediaQueryListEvent);
      TestBed.flushEffects();

      expect(service.resolvedTheme()).toBe('dark');
      expect(setAttrSpy).toHaveBeenCalledWith('data-theme', 'dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('does not react to OS preference changes when mode is not "system"', () => {
      configureTestBed('light', false);
      const service = TestBed.inject(ThemeService);
      TestBed.flushEffects();
      expect(service.resolvedTheme()).toBe('light');

      changeListener({ matches: true } as MediaQueryListEvent);
      TestBed.flushEffects();

      expect(service.resolvedTheme()).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });
});
