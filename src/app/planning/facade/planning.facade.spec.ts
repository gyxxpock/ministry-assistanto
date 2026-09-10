import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { signal } from '@angular/core';
import { PlanningFacade } from './planning.facade';
import { PLANNING_REPOSITORY_TOKEN } from '../planning.tokens';
import { IPlanningRepository } from '../domain/i-planning.repository';
import { DayPlan, WeeklySchedule } from '../domain/models';
import { sumWeeklyHours } from '../domain/planning.usecase';
import { GOAL_REPOSITORY_TOKEN } from '../../goals/goals.tokens';
import { IGoalRepository } from '../../goals/domain/i-goal.repository';
import { AuxiliaryGoalConfig, RegularGoalConfig } from '../../goals/domain/models';
import { TIME_ENTRY_REPOSITORY } from '../../time-entry/presentation/tokens/time-entry.tokens';
import { ITimeEntryRepository } from '../../time-entry/domain/i-time-entry.repository';
import { TimeEntry } from '../../time-entry/domain/models';
import { WeekStartService } from '../../core/services/week-start.service';
import { WeekDay } from '../../shared/domain/week-day.model';

// Facade spec — TestBed with the repositories mocked as spies (per FacadeAgent strategy).
// PlanningFacade injects IPlanningRepository, IGoalRepository and ITimeEntryRepository
// directly via tokens — it does NOT inject GoalsFacade. The issue #53 AC that mentioned
// "mock spy de GoalsFacade" is superseded by this design decision (approved in a prior
// Plan session): we mock IGoalRepository instead.

function makeSchedule(partial: Partial<WeeklySchedule> = {}): WeeklySchedule {
  return { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7, ...partial };
}

function makeUniformSchedule(hours: number): WeeklySchedule {
  return { mon: hours, tue: hours, wed: hours, thu: hours, fri: hours, sat: hours, sun: hours };
}

function makeDayPlan(date: string, hours: number): DayPlan {
  return { date, hours };
}

function makeRegularConfig(serviceYear = 2027): RegularGoalConfig {
  return { type: 'regular', serviceYear };
}

function makeAuxiliaryConfig(serviceYear = 2027): AuxiliaryGoalConfig {
  return { type: 'auxiliary', serviceYear, monthlyTarget: 30, permanent: true };
}

function makeEntry(date: Date | string, durationMinutes: number): TimeEntry {
  return {
    id: `e-${Math.random().toString(36).slice(2)}`,
    date: date as unknown as Date,
    durationMinutes,
    type: 'preaching',
  };
}

describe('PlanningFacade', () => {
  let facade: PlanningFacade;
  let planningRepo: jasmine.SpyObj<IPlanningRepository>;
  let goalRepo: jasmine.SpyObj<IGoalRepository>;
  let timeEntryRepo: jasmine.SpyObj<ITimeEntryRepository>;

  // WeekStartService is providedIn:'root' and reads localStorage in its constructor.
  // Following the established pattern (time-entry-calendar.spec.ts) we provide a
  // minimal mock instead of the real service, to keep the weekStart deterministic
  // and independent from whatever a previous spec left in localStorage.
  const weekStartSignal = signal<WeekDay>('monday');
  const mockWeekStartService: Pick<WeekStartService, 'weekStart'> = {
    weekStart: weekStartSignal.asReadonly(),
  };

  beforeEach(() => {
    weekStartSignal.set('monday');

    planningRepo = jasmine.createSpyObj<IPlanningRepository>('IPlanningRepository', [
      'getWeeklySchedule',
      'saveWeeklySchedule',
      'getDayOverrides',
      'setDayOverride',
      'clearDayOverride',
    ]);
    planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(null));
    planningRepo.saveWeeklySchedule.and.returnValue(Promise.resolve());
    planningRepo.getDayOverrides.and.returnValue(Promise.resolve([]));
    planningRepo.setDayOverride.and.returnValue(Promise.resolve());
    planningRepo.clearDayOverride.and.returnValue(Promise.resolve());

    goalRepo = jasmine.createSpyObj<IGoalRepository>('IGoalRepository', [
      'getActive',
      'setActive',
      'clearActive',
    ]);
    goalRepo.getActive.and.returnValue(Promise.resolve(null));

    timeEntryRepo = jasmine.createSpyObj<ITimeEntryRepository>('ITimeEntryRepository', [
      'listEntriesByMonth',
      'listEntriesByDateRange',
      'listVisitsByMonth',
      'addEntry',
      'updateEntry',
      'removeEntry',
      'addVisit',
      'updateVisit',
      'removeVisit',
      'exportAll',
      'importAll',
      'getCourseCount',
      'setCourseCount',
    ]);
    timeEntryRepo.listEntriesByDateRange.and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      providers: [
        PlanningFacade,
        { provide: PLANNING_REPOSITORY_TOKEN, useValue: planningRepo },
        { provide: GOAL_REPOSITORY_TOKEN, useValue: goalRepo },
        { provide: TIME_ENTRY_REPOSITORY, useValue: timeEntryRepo },
        { provide: WeekStartService, useValue: mockWeekStartService },
      ],
    });

    // Constructor only computes the visible/period date ranges synchronously
    // (no Promise, no subscription) — safe to inject outside fakeAsync, same
    // rationale documented in goals.facade.spec.ts.
    facade = TestBed.inject(PlanningFacade);
  });

  describe('initial state', () => {
    it('weeklySchedule is null before any load', () => {
      expect(facade.weeklySchedule()).toBeNull();
    });

    it('dayOverrides is empty before any load', () => {
      expect(facade.dayOverrides()).toEqual([]);
    });

    it('weeklyTotal is 0 when there is no weeklySchedule', () => {
      expect(facade.weeklyTotal()).toBe(0);
    });

    it('planningProjection is null when there is neither a weeklySchedule nor an active goal', () => {
      expect(facade.planningProjection()).toBeNull();
    });
  });

  describe('loadPlanForMonth()', () => {
    it('calls repo.getWeeklySchedule() and goalRepo.getActive(), and updates weeklySchedule', fakeAsync(() => {
      const schedule = makeSchedule();
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(schedule));
      goalRepo.getActive.and.returnValue(Promise.resolve(null));

      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      expect(planningRepo.getWeeklySchedule).toHaveBeenCalledTimes(1);
      expect(goalRepo.getActive).toHaveBeenCalledTimes(1);
      expect(facade.weeklySchedule()).toEqual(schedule);
    }));

    it('sets weeklySchedule to null when repo.getWeeklySchedule() resolves null', fakeAsync(() => {
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(null));

      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      expect(facade.weeklySchedule()).toBeNull();
    }));

    it('refreshes dayOverrides from repo.getDayOverrides() for the visible month', fakeAsync(() => {
      const visibleOverride = makeDayPlan('2026-09-07', 3);
      planningRepo.getDayOverrides.and.returnValues(
        Promise.resolve([visibleOverride]), // visible-month call
        Promise.resolve([]), // goal-period call
      );

      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      expect(planningRepo.getDayOverrides).toHaveBeenCalledTimes(2);
      expect(facade.dayOverrides()).toEqual([visibleOverride]);
    }));

    it('calls timeEntryRepo.listEntriesByDateRange() to refresh the actual hours by month', fakeAsync(() => {
      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      expect(timeEntryRepo.listEntriesByDateRange).toHaveBeenCalledTimes(1);
    }));
  });

  describe('weeklyTotal', () => {
    it('recomputes automatically when weeklySchedule changes (computed reactivity)', fakeAsync(() => {
      expect(facade.weeklyTotal()).toBe(0);

      const schedule = makeSchedule(); // mon..sun 1..7 → sum 28
      facade.saveWeeklySchedule(schedule);
      flushMicrotasks();
      expect(facade.weeklyTotal()).toBe(sumWeeklyHours(schedule));

      const schedule2 = makeUniformSchedule(2); // sum 14
      facade.saveWeeklySchedule(schedule2);
      flushMicrotasks();
      expect(facade.weeklyTotal()).toBe(14);
    }));
  });

  describe('planningProjection', () => {
    it('is null when there is a weeklySchedule but no active goal (getActive() resolves null)', fakeAsync(() => {
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(makeSchedule()));
      goalRepo.getActive.and.returnValue(Promise.resolve(null));

      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      expect(facade.weeklySchedule()).not.toBeNull();
      expect(facade.planningProjection()).toBeNull();
    }));

    it('is null when there is an active goal but no weeklySchedule (getWeeklySchedule() resolves null)', fakeAsync(() => {
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(null));
      goalRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig()));

      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      expect(facade.planningProjection()).toBeNull();
    }));

    it('wraps a regular GoalConfig into a Goal (via _wrapGoal) and produces 12 monthlyBars with a valid status', fakeAsync(() => {
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(makeSchedule()));
      goalRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig()));

      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      const projection = facade.planningProjection();
      expect(projection).not.toBeNull();
      expect(projection!.monthlyBars.length).toBe(12);
      expect(['sufficient', 'within-margin', 'insufficient']).toContain(projection!.status);
    }));

    it('wraps an auxiliary GoalConfig into a Goal (via _wrapGoal) and produces 12 monthlyBars', fakeAsync(() => {
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(makeSchedule()));
      goalRepo.getActive.and.returnValue(Promise.resolve(makeAuxiliaryConfig()));

      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      const projection = facade.planningProjection();
      expect(projection).not.toBeNull();
      expect(projection!.monthlyBars.length).toBe(12);
    }));

    it('populates monthlyBars.actualHours for the current month from the entries returned by timeEntryRepo', fakeAsync(() => {
      const now = new Date();
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(makeSchedule()));
      goalRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig()));
      timeEntryRepo.listEntriesByDateRange.and.returnValue(Promise.resolve([makeEntry(now, 120)])); // 2h

      facade.loadPlanForMonth(now.getFullYear(), now.getMonth() + 1);
      flushMicrotasks();

      const projection = facade.planningProjection();
      const currentBar = projection!.monthlyBars.find(
        b => b.year === now.getFullYear() && b.month === now.getMonth() + 1,
      );
      expect(currentBar?.actualHours).toBe(2);
    }));

    it('also accumulates entries whose date is an ISO string (not a Date instance) into actualByMonth', fakeAsync(() => {
      const now = new Date();
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(makeSchedule()));
      goalRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig()));
      // ISO string branch of `entry.date instanceof Date ? entry.date : new Date(entry.date)`.
      timeEntryRepo.listEntriesByDateRange.and.returnValue(
        Promise.resolve([makeEntry(now.toISOString(), 90)]), // 1.5h
      );

      facade.loadPlanForMonth(now.getFullYear(), now.getMonth() + 1);
      flushMicrotasks();

      const projection = facade.planningProjection();
      const currentBar = projection!.monthlyBars.find(
        b => b.year === now.getFullYear() && b.month === now.getMonth() + 1,
      );
      expect(currentBar?.actualHours).toBe(1.5);
    }));
  });

  describe('getDailyPlan()', () => {
    it('returns 0 when there is no weeklySchedule loaded yet', () => {
      expect(facade.getDailyPlan(new Date(2026, 8, 7))).toBe(0);
    });

    it('returns the WeeklySchedule value for the matching weekday when there is no override', fakeAsync(() => {
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(makeSchedule({ mon: 4 })));

      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      // Sep 7, 2026 is a Monday.
      expect(facade.getDailyPlan(new Date(2026, 8, 7))).toBe(4);
    }));

    it('returns the override hours when one exists for the exact date (via dayOverrides)', fakeAsync(() => {
      planningRepo.getWeeklySchedule.and.returnValue(Promise.resolve(makeSchedule({ mon: 4 })));
      planningRepo.getDayOverrides.and.returnValues(
        Promise.resolve([makeDayPlan('2026-09-07', 9.5)]), // visible-month call
        Promise.resolve([]), // goal-period call
      );

      facade.loadPlanForMonth(2026, 9);
      flushMicrotasks();

      expect(facade.getDailyPlan(new Date(2026, 8, 7))).toBe(9.5);
    }));
  });

  describe('setDayOverride()', () => {
    it('calls repo.setDayOverride() with the given plan and refreshes dayOverrides', fakeAsync(() => {
      const plan = makeDayPlan('2026-09-07', 5);
      planningRepo.getDayOverrides.and.returnValues(
        Promise.resolve([plan]), // visible-month call
        Promise.resolve([]), // goal-period call
      );

      facade.setDayOverride(plan);
      flushMicrotasks();

      expect(planningRepo.setDayOverride).toHaveBeenCalledWith(plan);
      expect(facade.dayOverrides()).toEqual([plan]);
    }));
  });

  describe('clearDayOverride()', () => {
    it('calls repo.clearDayOverride() with the given date and refreshes dayOverrides', fakeAsync(() => {
      planningRepo.getDayOverrides.and.returnValue(Promise.resolve([]));

      facade.clearDayOverride('2026-09-07');
      flushMicrotasks();

      expect(planningRepo.clearDayOverride).toHaveBeenCalledWith('2026-09-07');
      expect(facade.dayOverrides()).toEqual([]);
    }));
  });

  describe('saveWeeklySchedule()', () => {
    it('calls repo.saveWeeklySchedule() with the given schedule and updates the weeklySchedule signal', fakeAsync(() => {
      const schedule = makeSchedule();

      facade.saveWeeklySchedule(schedule);
      flushMicrotasks();

      expect(planningRepo.saveWeeklySchedule).toHaveBeenCalledWith(schedule);
      expect(facade.weeklySchedule()).toEqual(schedule);
    }));
  });
});
