import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let setItemSpy: jasmine.Spy;
  let setAttrSpy: jasmine.Spy;
  let removeAttrSpy: jasmine.Spy;

  function configureTestBed(stored: string | null = null): void {
    spyOn(localStorage, 'getItem').and.callFake((key: string) =>
      key === 'ma-theme' ? stored : null
    );
    setItemSpy = spyOn(localStorage, 'setItem');
    setAttrSpy = spyOn(document.documentElement, 'setAttribute');
    removeAttrSpy = spyOn(document.documentElement, 'removeAttribute');
    TestBed.configureTestingModule({});
  }

  afterEach(() => TestBed.resetTestingModule());

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

  describe('DOM effect (_apply)', () => {
    it('sets data-theme attribute when mode is "light"', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      service.setMode('light');
      TestBed.flushEffects();
      expect(setAttrSpy).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('sets data-theme attribute when mode is "dark"', () => {
      configureTestBed(null);
      const service = TestBed.inject(ThemeService);
      service.setMode('dark');
      TestBed.flushEffects();
      expect(setAttrSpy).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('removes data-theme attribute when mode is "system"', () => {
      configureTestBed('dark');
      const service = TestBed.inject(ThemeService);
      service.setMode('system');
      TestBed.flushEffects();
      expect(removeAttrSpy).toHaveBeenCalledWith('data-theme');
    });
  });
});
