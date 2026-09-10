import {
  computeDailyPlan,
  computeMonthlyPlanned,
  computePlanningProjection,
  isPlanSufficient,
  sumWeeklyHours,
  toIsoDate,
} from './planning.usecase';
import { DayPlan, PlanningProjection, WeeklySchedule } from './models';
import { AuxiliaryGoalConfig, Goal, RegularGoalConfig } from '../../goals/domain/models';
import { getServiceYear } from '../../goals/domain/goal.usecase';
import { WeekDay } from '../../shared/domain/week-day.model';

// NO TestBed — domain spec, pure TypeScript.

function d(y: number, m: number, day: number): Date {
  return new Date(y, m - 1, day);
}

/** Horario con un valor distinto por día ISO (mon=1..sun=7), fácil de verificar a mano. */
function makeSchedule(partial: Partial<WeeklySchedule> = {}): WeeklySchedule {
  return { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7, ...partial };
}

/** Horario con la misma cantidad de horas todos los días — útil para calcular totales a mano. */
function makeUniformSchedule(hours: number): WeeklySchedule {
  return { mon: hours, tue: hours, wed: hours, thu: hours, fri: hours, sat: hours, sun: hours };
}

function makeOverride(date: string, hours: number): DayPlan {
  return { date, hours };
}

function makeRegularGoal(configOverrides: Partial<RegularGoalConfig> = {}): Goal {
  return {
    id: 'goal-regular',
    active: true,
    config: { type: 'regular', serviceYear: 2027, ...configOverrides },
  };
}

function makeAuxiliaryGoal(configOverrides: Partial<AuxiliaryGoalConfig> = {}): Goal {
  return {
    id: 'goal-auxiliary',
    active: true,
    config: {
      type: 'auxiliary',
      serviceYear: 2027,
      monthlyTarget: 30,
      permanent: true,
      ...configOverrides,
    },
  };
}

describe('computeDailyPlan', () => {
  const schedule = makeSchedule(); // mon:1, tue:2, wed:3, thu:4, fri:5, sat:6, sun:7

  it('returns the WeeklySchedule hours for the correct ISO weekday, for each of the 7 days', () => {
    // Sep 7..13, 2026 is a full Monday..Sunday week.
    expect(computeDailyPlan(schedule, [], d(2026, 9, 7), 'monday')).toBe(1);  // mon
    expect(computeDailyPlan(schedule, [], d(2026, 9, 8), 'monday')).toBe(2);  // tue
    expect(computeDailyPlan(schedule, [], d(2026, 9, 9), 'monday')).toBe(3);  // wed
    expect(computeDailyPlan(schedule, [], d(2026, 9, 10), 'monday')).toBe(4); // thu
    expect(computeDailyPlan(schedule, [], d(2026, 9, 11), 'monday')).toBe(5); // fri
    expect(computeDailyPlan(schedule, [], d(2026, 9, 12), 'monday')).toBe(6); // sat
    expect(computeDailyPlan(schedule, [], d(2026, 9, 13), 'monday')).toBe(7); // sun
  });

  it('prefers a DayPlan override that matches the exact date over the WeeklySchedule', () => {
    const overrides = [makeOverride('2026-09-07', 9.5)]; // Sep 7 is a Monday (schedule.mon=1)
    expect(computeDailyPlan(schedule, overrides, d(2026, 9, 7), 'monday')).toBe(9.5);
  });

  it('ignores every override when none matches the exact date and falls back to the schedule', () => {
    const overrides = [
      makeOverride('2026-09-08', 99),
      makeOverride('2026-10-01', 99),
    ];
    expect(computeDailyPlan(schedule, overrides, d(2026, 9, 7), 'monday')).toBe(1); // schedule.mon
  });

  it('INVARIANCE: the date-to-weekday mapping never depends on weekStart', () => {
    const date = d(2026, 9, 9); // Wednesday → schedule.wed = 3
    const weekStarts: WeekDay[] = ['monday', 'sunday', 'saturday'];
    const results = weekStarts.map(ws => computeDailyPlan(schedule, [], date, ws));
    expect(results).toEqual([3, 3, 3]);
  });
});

describe('computeMonthlyPlanned', () => {
  it('sums the scheduled hours of every day of a known month (Feb 2027: 28 days = exactly 4 of each weekday)', () => {
    const schedule = makeSchedule(); // weekly sum = 1+2+3+4+5+6+7 = 28
    const total = computeMonthlyPlanned(schedule, [], 2027, 2, 'monday');
    expect(total).toBe(112); // 4 weeks * 28
  });

  it('applies an override inside the month, replacing that day\'s scheduled contribution', () => {
    const schedule = makeSchedule();
    // Feb 1, 2027 is a Monday (scheduled contribution = 1); override sets it to 100.
    const overrides = [makeOverride('2027-02-01', 100)];
    const total = computeMonthlyPlanned(schedule, overrides, 2027, 2, 'monday');
    expect(total).toBe(211); // 112 - 1 (removed monday) + 100 (override)
  });

  it('rounds to 2 decimals when floating-point summation drifts (July 2027, 31 days of 0.1h)', () => {
    // Naive JS addition of 0.1 thirty-one times drifts to 3.1000000000000014 — round2 must fix it.
    const schedule = makeUniformSchedule(0.1);
    const total = computeMonthlyPlanned(schedule, [], 2027, 7, 'monday');
    expect(total).toBe(3.1);
  });
});

describe('computePlanningProjection', () => {
  describe('regular goal (REGULAR_GOAL_TARGET=600, REGULAR_GOAL_MARGIN=560)', () => {
    const goal = makeRegularGoal();

    it('is "sufficient" when totalPlanned >= 600', () => {
      const schedule = makeUniformSchedule(2); // 2h/day * 365 days in the period = 730
      const result = computePlanningProjection(schedule, [], goal, new Map(), d(2026, 9, 1), 'monday');
      expect(result.totalPlanned).toBe(730);
      expect(result.status).toBe('sufficient');
    });

    it('is "within-margin" when 560 <= totalPlanned < 600', () => {
      const schedule = makeUniformSchedule(1.6); // 1.6h/day * 365 = 584
      const result = computePlanningProjection(schedule, [], goal, new Map(), d(2026, 9, 1), 'monday');
      expect(result.totalPlanned).toBe(584);
      expect(result.status).toBe('within-margin');
    });

    it('is "insufficient" when totalPlanned < 560', () => {
      const schedule = makeUniformSchedule(1); // 1h/day * 365 = 365
      const result = computePlanningProjection(schedule, [], goal, new Map(), d(2026, 9, 1), 'monday');
      expect(result.totalPlanned).toBe(365);
      expect(result.status).toBe('insufficient');
    });

    it('EDGE: totalPlanned === margin (560) is still "within-margin", not "insufficient"', () => {
      const schedule = makeUniformSchedule(560 / 365);
      const result = computePlanningProjection(schedule, [], goal, new Map(), d(2026, 9, 1), 'monday');
      expect(result.totalPlanned).toBe(560);
      expect(result.status).toBe('within-margin');
    });

    it('EDGE: totalPlanned === target (600) is "sufficient"', () => {
      const schedule = makeUniformSchedule(1); // baseline 365
      const overrides = [makeOverride('2026-09-01', 236)]; // 365 - 1 + 236 = 600
      const result = computePlanningProjection(schedule, overrides, goal, new Map(), d(2026, 9, 1), 'monday');
      expect(result.totalPlanned).toBe(600);
      expect(result.status).toBe('sufficient');
    });
  });

  describe('auxiliary goal', () => {
    it('computes the target from monthlyTarget * activeMonths, considering ONLY the active months of the period', () => {
      // Mar-Jun (non-wrapping) → within Sep2026..Aug2027, only Mar,Apr,May,Jun are active = 4 months.
      // target = 30 * 4 = 120 (margin = 112). If it wrongly used all 12 months, target would be 360 (margin 336).
      const goal = makeAuxiliaryGoal({ monthlyTarget: 30, permanent: false, startMonth: 3, endMonth: 6 });
      const schedule = makeUniformSchedule(0);
      const overrides = [makeOverride('2026-10-05', 150)]; // totalPlanned = 150
      const result = computePlanningProjection(schedule, overrides, goal, new Map(), d(2026, 9, 1), 'monday');
      expect(result.totalPlanned).toBe(150);
      // 150 >= 120 (4 active months) → sufficient. Under a wrong 12-month target (360) it would be insufficient.
      expect(result.status).toBe('sufficient');
    });

    it('a permanent auxiliary goal treats all 12 months as active (target = monthlyTarget * 12)', () => {
      const goal = makeAuxiliaryGoal({ monthlyTarget: 30, permanent: true });
      const schedule = makeUniformSchedule(0);
      const overrides = [makeOverride('2026-10-05', 360)]; // exactly 30 * 12
      const result = computePlanningProjection(schedule, overrides, goal, new Map(), d(2026, 9, 1), 'monday');
      expect(result.totalPlanned).toBe(360);
      expect(result.status).toBe('sufficient');
    });
  });

  describe('monthlyBars', () => {
    it('has exactly 12 entries whose year/month pairs match the ServiceYear computed from currentDate', () => {
      const currentDate = d(2026, 9, 1);
      const sy = getServiceYear(currentDate);
      const expectedPairs: { year: number; month: number }[] = [];
      for (let m = sy.startMonth; m <= 12; m++) expectedPairs.push({ year: sy.startYear, month: m });
      for (let m = 1; m <= sy.endMonth; m++) expectedPairs.push({ year: sy.endYear, month: m });

      const schedule = makeSchedule();
      const result = computePlanningProjection(
        schedule, [], makeRegularGoal(), new Map(), currentDate, 'monday',
      );

      expect(result.monthlyBars.length).toBe(12);
      expect(result.monthlyBars.map(b => ({ year: b.year, month: b.month }))).toEqual(expectedPairs);
    });

    it('takes actualHours from the actualByMonth map keyed by "YYYY-MM", and defaults to 0 when the month is absent', () => {
      const schedule = makeSchedule();
      const actualByMonth = new Map<string, number>([['2026-10', 45.5]]);
      const result = computePlanningProjection(
        schedule, [], makeRegularGoal(), actualByMonth, d(2026, 9, 1), 'monday',
      );

      const octBar = result.monthlyBars.find(b => b.year === 2026 && b.month === 10);
      const novBar = result.monthlyBars.find(b => b.year === 2026 && b.month === 11);
      expect(octBar?.actualHours).toBe(45.5); // present in the map
      expect(novBar?.actualHours).toBe(0);    // absent from the map
    });

    it('totalPlanned equals the rounded sum of plannedHours across all monthlyBars', () => {
      const schedule = makeSchedule();
      const result = computePlanningProjection(
        schedule, [], makeRegularGoal(), new Map(), d(2026, 9, 1), 'monday',
      );
      const manualSum = Math.round(result.monthlyBars.reduce((sum, b) => sum + b.plannedHours, 0) * 100) / 100;
      expect(result.totalPlanned).toBe(manualSum);
      expect(result.totalPlanned).toBe(1458); // schedule 1..7 across the full 365-day period
    });
  });
});

describe('sumWeeklyHours', () => {
  it('sums 7x the daily value for a uniform WeeklySchedule', () => {
    const schedule = makeUniformSchedule(2.5);
    expect(sumWeeklyHours(schedule)).toBe(17.5); // 7 * 2.5
  });

  it('sums the exact per-day values of a heterogeneous WeeklySchedule, including a day at 0', () => {
    const schedule: WeeklySchedule = { mon: 1, tue: 0, wed: 3, thu: 0, fri: 5, sat: 6, sun: 2 };
    expect(sumWeeklyHours(schedule)).toBe(17); // 1+0+3+0+5+6+2
  });

  it('rounds to 2 decimals when floating-point summation drifts (7 days of 1.1h)', () => {
    // Naive JS addition of 1.1 seven times drifts to 7.699999999999999 — round2 must fix it.
    const schedule = makeUniformSchedule(1.1);
    expect(sumWeeklyHours(schedule)).toBe(7.7);
  });
});

describe('toIsoDate', () => {
  it('pads single-digit month and day with a leading zero', () => {
    expect(toIsoDate(d(2026, 1, 5))).toBe('2026-01-05');
  });

  it('keeps two-digit month and day as-is', () => {
    expect(toIsoDate(d(2026, 12, 25))).toBe('2026-12-25');
  });
});

describe('isPlanSufficient', () => {
  function makeProjection(status: PlanningProjection['status']): PlanningProjection {
    return { totalPlanned: 0, monthlyBars: [], status };
  }

  it('returns exactly the status of the given projection, for each possible value', () => {
    expect(isPlanSufficient(makeProjection('sufficient'))).toBe('sufficient');
    expect(isPlanSufficient(makeProjection('within-margin'))).toBe('within-margin');
    expect(isPlanSufficient(makeProjection('insufficient'))).toBe('insufficient');
  });
});
