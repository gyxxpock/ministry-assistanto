import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import {
  AuxiliaryGoalConfig,
  Goal,
  GoalConfig,
  RegularGoalConfig,
} from '../domain/models';
import { IGoalRepository } from '../domain/i-goal.repository';
import { GOAL_REPOSITORY_TOKEN } from '../goals.tokens';
import { GoalsFacade } from './goals.facade';
import { ITimeEntryRepository } from '../../time-entry/domain/i-time-entry.repository';
import { TIME_ENTRY_REPOSITORY } from '../../time-entry/presentation/tokens/time-entry.tokens';
import { TimeEntry, CourseVisit, MonthlyCourseCount } from '../../time-entry/domain/models';

/**
 * In-memory double for ITimeEntryRepository — same pattern as
 * time-entry-list.component.spec.ts's InMemoryRepository, trimmed to what
 * GoalsFacade actually consumes (listEntriesByDateRange). `entries` is public
 * so tests can seed concrete data when they need to assert on computed hours.
 */
class InMemoryTimeEntryRepository implements ITimeEntryRepository {
  entries: TimeEntry[] = [];

  async listEntriesByMonth(year: number, month: number): Promise<TimeEntry[]> {
    return this.entries.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }
  async listEntriesByDateRange(startDate: Date, endDate: Date): Promise<TimeEntry[]> {
    return this.entries.filter(e => {
      const d = new Date(e.date);
      return d >= startDate && d <= endDate;
    });
  }
  async listVisitsByMonth(): Promise<CourseVisit[]> {
    return [];
  }
  async addEntry(entry: TimeEntry): Promise<void> {
    this.entries.push(entry);
  }
  async updateEntry(entry: TimeEntry): Promise<void> {
    const i = this.entries.findIndex(e => e.id === entry.id);
    if (i >= 0) this.entries[i] = entry;
  }
  async removeEntry(id: string): Promise<void> {
    this.entries = this.entries.filter(e => e.id !== id);
  }
  async addVisit(): Promise<void> {}
  async updateVisit(): Promise<void> {}
  async removeVisit(): Promise<void> {}
  async exportAll(): Promise<{ entries: TimeEntry[]; visits: CourseVisit[]; courseCounts: MonthlyCourseCount[] }> {
    return { entries: this.entries, visits: [], courseCounts: [] };
  }
  async importAll(payload: { entries?: TimeEntry[]; visits?: CourseVisit[] }): Promise<void> {
    if (payload.entries) this.entries.push(...payload.entries);
  }
  async getCourseCount(): Promise<number> {
    return 0;
  }
  async setCourseCount(): Promise<void> {}
}

function makeRegularConfig(serviceYear = 2027): RegularGoalConfig {
  return { type: 'regular', serviceYear };
}

function makeAuxConfig(serviceYear = 2027, monthlyTarget: 15 | 30 = 30): AuxiliaryGoalConfig {
  return { type: 'auxiliary', serviceYear, monthlyTarget, permanent: true };
}

function makeGoal(config: GoalConfig = makeRegularConfig()): Goal {
  return { id: 'test-goal', config, active: true };
}

/**
 * TimeEntry factory for branch coverage on `_computeAccumulatedHours()`.
 * Accepts a Date or an ISO string for `date` to exercise both sides of the
 * `e.date instanceof Date ? e.date : new Date(e.date)` ternary in the
 * monthly-filter callback.
 */
function makeEntry(date: Date | string, durationMinutes: number): TimeEntry {
  return {
    id: `e-${Math.random().toString(36).slice(2)}`,
    date: date as unknown as Date,
    durationMinutes,
    type: 'preaching',
  };
}

describe('GoalsFacade', () => {
  let facade: GoalsFacade;
  let mockRepo: jasmine.SpyObj<IGoalRepository>;
  let timeEntryRepo: InMemoryTimeEntryRepository;

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj<IGoalRepository>('IGoalRepository', [
      'getActive',
      'setActive',
      'clearActive',
    ]);
    mockRepo.getActive.and.returnValue(Promise.resolve(null));
    mockRepo.setActive.and.returnValue(Promise.resolve());
    mockRepo.clearActive.and.returnValue(Promise.resolve());

    // No entries by default → accumulatedHours computed from the repo is 0,
    // matching the pre-existing expectations below (they set hours manually
    // via setAccumulatedHours() when they need a non-zero value).
    timeEntryRepo = new InMemoryTimeEntryRepository();

    TestBed.configureTestingModule({
      providers: [
        GoalsFacade,
        { provide: GOAL_REPOSITORY_TOKEN, useValue: mockRepo },
        { provide: TIME_ENTRY_REPOSITORY, useValue: timeEntryRepo },
      ],
    });

    // Constructor does NOT call loadGoal() — safe to inject outside fakeAsync.
    // If loadGoal() is ever added to the constructor, move injection inside fakeAsync per
    // feedback-fakeAsync-constructor-inject memory.
    facade = TestBed.inject(GoalsFacade);
  });

  describe('initial state', () => {
    it('activeGoal is null before any load', () => {
      expect(facade.activeGoal()).toBeNull();
    });

    it('accumulatedHours starts at 0', () => {
      expect(facade.accumulatedHours()).toBe(0);
    });

    it('goalProgress is null when no active goal', () => {
      expect(facade.goalProgress()).toBeNull();
    });
  });

  describe('loadGoal()', () => {
    it('sets activeGoal when repository returns a RegularGoalConfig', fakeAsync(() => {
      const config = makeRegularConfig();
      mockRepo.getActive.and.returnValue(Promise.resolve(config));

      facade.loadGoal();
      flushMicrotasks();

      const goal = facade.activeGoal();
      expect(goal).not.toBeNull();
      expect(goal!.config).toEqual(config);
      expect(goal!.active).toBeTrue();
    }));

    it('sets activeGoal when repository returns an AuxiliaryGoalConfig', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeAuxConfig()));

      facade.loadGoal();
      flushMicrotasks();

      expect(facade.activeGoal()!.config.type).toBe('auxiliary');
    }));

    it('sets activeGoal to null when repository is empty', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(null));

      facade.loadGoal();
      flushMicrotasks();

      expect(facade.activeGoal()).toBeNull();
    }));

    it('replaces a previously loaded goal on second call', fakeAsync(() => {
      mockRepo.getActive.and.returnValues(
        Promise.resolve(makeRegularConfig()),
        Promise.resolve(makeAuxConfig()),
      );

      facade.loadGoal();
      flushMicrotasks();
      expect(facade.activeGoal()!.config.type).toBe('regular');

      facade.loadGoal();
      flushMicrotasks();
      expect(facade.activeGoal()!.config.type).toBe('auxiliary');
    }));
  });

  describe('setGoal()', () => {
    it('calls repo.setActive with the goal config', fakeAsync(() => {
      const goal = makeGoal();

      facade.setGoal(goal);
      flushMicrotasks();

      expect(mockRepo.setActive).toHaveBeenCalledWith(goal.config);
      expect(mockRepo.setActive).toHaveBeenCalledTimes(1);
    }));

    it('updates activeGoal signal to the provided goal', fakeAsync(() => {
      const goal = makeGoal();

      facade.setGoal(goal);
      flushMicrotasks();

      expect(facade.activeGoal()).toEqual(goal);
    }));
  });

  describe('clearGoal()', () => {
    it('calls repo.clearActive', fakeAsync(() => {
      facade.clearGoal();
      flushMicrotasks();

      expect(mockRepo.clearActive).toHaveBeenCalledTimes(1);
    }));

    it('sets activeGoal to null', fakeAsync(() => {
      facade.setGoal(makeGoal());
      flushMicrotasks();

      facade.clearGoal();
      flushMicrotasks();

      expect(facade.activeGoal()).toBeNull();
    }));

    it('goalProgress becomes null after clear', fakeAsync(() => {
      facade.setGoal(makeGoal());
      flushMicrotasks();
      facade.setAccumulatedHours(100);
      expect(facade.goalProgress()).not.toBeNull();

      facade.clearGoal();
      flushMicrotasks();

      expect(facade.goalProgress()).toBeNull();
    }));
  });

  describe('setAccumulatedHours()', () => {
    it('updates accumulatedHours signal synchronously', () => {
      facade.setAccumulatedHours(150);
      expect(facade.accumulatedHours()).toBe(150);
    });

    it('overwriting with 0 resets the signal', () => {
      facade.setAccumulatedHours(200);
      facade.setAccumulatedHours(0);
      expect(facade.accumulatedHours()).toBe(0);
    });
  });

  describe('goalProgress computed', () => {
    it('remains null when activeGoal is null regardless of accumulatedHours', () => {
      facade.setAccumulatedHours(300);
      expect(facade.goalProgress()).toBeNull();
    });

    it('recomputes when accumulatedHours changes', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig()));
      facade.loadGoal();
      flushMicrotasks();

      facade.setAccumulatedHours(100);
      expect(facade.goalProgress()!.accumulatedHours).toBe(100);

      facade.setAccumulatedHours(300);
      expect(facade.goalProgress()!.accumulatedHours).toBe(300);
    }));

    it('computes targetHours=600 for a regular goal', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig()));
      facade.loadGoal();
      flushMicrotasks();

      expect(facade.goalProgress()!.targetHours).toBe(600);
    }));

    it('computes targetHours=360 for permanent auxiliary monthlyTarget=30', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeAuxConfig(2027, 30)));
      facade.loadGoal();
      flushMicrotasks();

      expect(facade.goalProgress()!.targetHours).toBe(360);
    }));

    it('computes targetHours=180 for permanent auxiliary monthlyTarget=15', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeAuxConfig(2027, 15)));
      facade.loadGoal();
      flushMicrotasks();

      expect(facade.goalProgress()!.targetHours).toBe(180);
    }));

    it('updates goalProgress when activeGoal changes via setGoal', fakeAsync(() => {
      facade.setGoal(makeGoal(makeRegularConfig()));
      flushMicrotasks();
      expect(facade.goalProgress()!.targetHours).toBe(600);

      facade.setGoal(makeGoal(makeAuxConfig(2027, 30)));
      flushMicrotasks();
      expect(facade.goalProgress()!.targetHours).toBe(360);
    }));
  });

  describe('refreshProgress()', () => {
    it('recalculates accumulatedHours from repo entries without reloading the active goal', fakeAsync(() => {
      const serviceYear = facade.currentServiceYear().year;
      mockRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig(serviceYear)));

      facade.loadGoal();
      flushMicrotasks();
      expect(facade.accumulatedHours()).toBe(0);
      expect(mockRepo.getActive).toHaveBeenCalledTimes(1);

      // New entry added after the goal was loaded — refreshProgress() must
      // pick it up by re-querying the time-entry repo, not the goal repo.
      timeEntryRepo.entries.push(makeEntry(new Date(serviceYear, 0, 10), 60));

      facade.refreshProgress();
      flushMicrotasks();

      expect(facade.accumulatedHours()).toBe(1);
      expect(mockRepo.getActive).toHaveBeenCalledTimes(1);
    }));

    it('is a no-op on accumulatedHours when there is no active goal', fakeAsync(() => {
      facade.refreshProgress();
      flushMicrotasks();

      expect(facade.activeGoal()).toBeNull();
      expect(facade.accumulatedHours()).toBe(0);
    }));
  });

  describe('_computeAccumulatedHours — monthly filter & reduce callbacks with non-empty data', () => {
    it('sums accumulatedHours and monthlyAccumulated across entries with mixed date types (Date vs ISO string)', fakeAsync(() => {
      const serviceYear = facade.currentServiceYear().year;
      const today = new Date();

      // Same calendar month as "today" — Date instance — must land in monthlyAccumulated.
      const currentMonthEntry = makeEntry(today, 90);

      // A different calendar month (offset by 6, always distinct mod 12) — ISO string —
      // still inside the service-year range but excluded from monthlyAccumulated.
      const otherMonthIdx = (today.getMonth() + 6) % 12;
      const otherYear = otherMonthIdx >= 8 ? serviceYear - 1 : serviceYear;
      const otherMonthEntry = makeEntry(new Date(otherYear, otherMonthIdx, 15).toISOString(), 60);

      timeEntryRepo.entries = [currentMonthEntry, otherMonthEntry];

      mockRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig(serviceYear)));
      facade.loadGoal();
      flushMicrotasks();

      // reduce() over both entries: (90 + 60) / 60 = 2.5h
      expect(facade.accumulatedHours()).toBe(2.5);
      // filter() keeps only currentMonthEntry, reduce() over it: 90 / 60 = 1.5h
      expect(facade.goalProgress()!.monthlyAccumulated).toBe(1.5);
    }));
  });

  describe('_computeAccumulatedHours — auxiliary date-range branch (L72-73)', () => {
    function seedJanAndJulEntries(endYear: number): void {
      // Jan (calendar month 1) and Jul (calendar month 7) — both inside the
      // full service-year range (Sep startYear → Aug endYear), but only Jul
      // falls inside a narrow June-August auxiliary window.
      timeEntryRepo.entries = [
        makeEntry(new Date(endYear, 0, 15), 60), // Jan, 1h
        makeEntry(new Date(endYear, 6, 15), 120), // Jul, 2h
      ];
    }

    it('true branch: auxiliary + !permanent + startMonth/endMonth defined narrows the range to active months', fakeAsync(() => {
      const serviceYear = facade.currentServiceYear().year;
      seedJanAndJulEntries(serviceYear);

      const config: GoalConfig = {
        type: 'auxiliary',
        serviceYear,
        monthlyTarget: 30,
        permanent: false,
        startMonth: 6,
        endMonth: 8,
      };
      mockRepo.getActive.and.returnValue(Promise.resolve(config));
      facade.loadGoal();
      flushMicrotasks();

      // Only the July entry (inside June-August) is counted: 120min / 60 = 2h.
      expect(facade.accumulatedHours()).toBe(2);
    }));

    it('false branch (type !== "auxiliary"): regular goal uses the full service-year range', fakeAsync(() => {
      const serviceYear = facade.currentServiceYear().year;
      seedJanAndJulEntries(serviceYear);

      mockRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig(serviceYear)));
      facade.loadGoal();
      flushMicrotasks();

      // Both entries counted: (60 + 120) / 60 = 3h.
      expect(facade.accumulatedHours()).toBe(3);
    }));

    it('false branch (permanent === true): permanent auxiliary uses the full service-year range', fakeAsync(() => {
      const serviceYear = facade.currentServiceYear().year;
      seedJanAndJulEntries(serviceYear);

      const config: GoalConfig = {
        type: 'auxiliary',
        serviceYear,
        monthlyTarget: 30,
        permanent: true,
        startMonth: 6,
        endMonth: 8,
      };
      mockRepo.getActive.and.returnValue(Promise.resolve(config));
      facade.loadGoal();
      flushMicrotasks();

      expect(facade.accumulatedHours()).toBe(3);
    }));

    it('false branch (startMonth === undefined): non-permanent auxiliary without startMonth falls back to the full range', fakeAsync(() => {
      const serviceYear = facade.currentServiceYear().year;
      seedJanAndJulEntries(serviceYear);

      const config: GoalConfig = {
        type: 'auxiliary',
        serviceYear,
        monthlyTarget: 30,
        permanent: false,
        endMonth: 8,
      };
      mockRepo.getActive.and.returnValue(Promise.resolve(config));
      facade.loadGoal();
      flushMicrotasks();

      expect(facade.accumulatedHours()).toBe(3);
    }));

    it('false branch (endMonth === undefined): non-permanent auxiliary without endMonth falls back to the full range', fakeAsync(() => {
      const serviceYear = facade.currentServiceYear().year;
      seedJanAndJulEntries(serviceYear);

      const config: GoalConfig = {
        type: 'auxiliary',
        serviceYear,
        monthlyTarget: 30,
        permanent: false,
        startMonth: 6,
      };
      mockRepo.getActive.and.returnValue(Promise.resolve(config));
      facade.loadGoal();
      flushMicrotasks();

      expect(facade.accumulatedHours()).toBe(3);
    }));
  });
});
