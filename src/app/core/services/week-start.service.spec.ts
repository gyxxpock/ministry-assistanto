import { TestBed } from '@angular/core/testing';
import { WeekStartService, WEEK_DAY_INDEX } from './week-start.service';

const STORAGE_KEY = 'week-start';

describe('WeekStartService', () => {
  function configureTestBed(stored: string | null | undefined): {
    getItemSpy: jasmine.Spy;
    setItemSpy: jasmine.Spy;
  } {
    const getItemSpy = spyOn(localStorage, 'getItem').and.callFake((key: string) =>
      key === STORAGE_KEY ? (stored ?? null) : null
    );
    const setItemSpy = spyOn(localStorage, 'setItem');
    TestBed.configureTestingModule({});
    return { getItemSpy, setItemSpy };
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('initialization', () => {
    it('defaults to "monday" when localStorage returns null', () => {
      configureTestBed(null);
      const service = TestBed.inject(WeekStartService);
      expect(service.weekStart()).toBe('monday');
    });

    it('reads "sunday" from localStorage on startup', () => {
      configureTestBed('sunday');
      const service = TestBed.inject(WeekStartService);
      expect(service.weekStart()).toBe('sunday');
    });

    it('reads "saturday" from localStorage on startup', () => {
      configureTestBed('saturday');
      const service = TestBed.inject(WeekStartService);
      expect(service.weekStart()).toBe('saturday');
    });

    it('reads "monday" from localStorage on startup', () => {
      configureTestBed('monday');
      const service = TestBed.inject(WeekStartService);
      expect(service.weekStart()).toBe('monday');
    });

    it('falls back to "monday" when the stored value is an invalid/corrupted string', () => {
      configureTestBed('not-a-real-day');
      const service = TestBed.inject(WeekStartService);
      expect(service.weekStart()).toBe('monday');
    });

    it('falls back to "monday" when the stored value is an empty string', () => {
      configureTestBed('');
      const service = TestBed.inject(WeekStartService);
      expect(service.weekStart()).toBe('monday');
    });

    it('does not throw and falls back to "monday" when localStorage.getItem returns null explicitly', () => {
      configureTestBed(undefined);
      expect(() => TestBed.inject(WeekStartService)).not.toThrow();
      const service = TestBed.inject(WeekStartService);
      expect(service.weekStart()).toBe('monday');
    });
  });

  describe('setWeekStart()', () => {
    it('updates the weekStart signal', () => {
      configureTestBed(null);
      const service = TestBed.inject(WeekStartService);
      service.setWeekStart('sunday');
      expect(service.weekStart()).toBe('sunday');
    });

    it('persists the new value to localStorage under the correct key', () => {
      const { setItemSpy } = configureTestBed(null);
      const service = TestBed.inject(WeekStartService);
      service.setWeekStart('saturday');
      expect(setItemSpy).toHaveBeenCalledWith(STORAGE_KEY, 'saturday');
    });

    it('overwrites a previously stored value', () => {
      const { setItemSpy } = configureTestBed('sunday');
      const service = TestBed.inject(WeekStartService);
      expect(service.weekStart()).toBe('sunday');
      service.setWeekStart('monday');
      expect(service.weekStart()).toBe('monday');
      expect(setItemSpy).toHaveBeenCalledWith(STORAGE_KEY, 'monday');
    });
  });

  describe('weekStart signal', () => {
    it('is exposed as read-only and does not have a public set()/update() method', () => {
      configureTestBed(null);
      const service = TestBed.inject(WeekStartService);
      expect((service.weekStart as unknown as { set?: unknown }).set).toBeUndefined();
      expect((service.weekStart as unknown as { update?: unknown }).update).toBeUndefined();
    });
  });

  describe('WEEK_DAY_INDEX', () => {
    it('exposes the correct Date.getDay() index for each week day', () => {
      expect(WEEK_DAY_INDEX).toEqual({ sunday: 0, monday: 1, saturday: 6 });
    });
  });
});
