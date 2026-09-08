import {
  computeAuxiliaryGoalProgress,
  computeGoalProgress,
  computeMonthlyTarget,
  computeRegularGoalProgress,
  getServiceYear,
} from './goal.usecase';
import { AuxiliaryGoalConfig, RegularGoalConfig } from './models';

function d(y: number, m: number, day: number): Date {
  return new Date(y, m - 1, day);
}

describe('getServiceYear', () => {
  it('returns year 2027 for Sep 1 2026', () => {
    const sy = getServiceYear(d(2026, 9, 1));
    expect(sy.year).toBe(2027);
    expect(sy.startYear).toBe(2026);
  });

  it('returns year 2027 for Aug 31 2027', () => {
    const sy = getServiceYear(d(2027, 8, 31));
    expect(sy.year).toBe(2027);
    expect(sy.startYear).toBe(2026);
  });

  it('returns year 2027 for Jan 15 2027', () => {
    const sy = getServiceYear(d(2027, 1, 15));
    expect(sy.year).toBe(2027);
  });

  it('returns year 2027 for Dec 31 2026', () => {
    const sy = getServiceYear(d(2026, 12, 31));
    expect(sy.year).toBe(2027);
  });

  it('has correct boundary months', () => {
    const sy = getServiceYear(d(2026, 9, 1));
    expect(sy.startMonth).toBe(9);
    expect(sy.endMonth).toBe(8);
    expect(sy.endYear).toBe(2027);
  });

  it('Sep and Aug belong to the same service year 2027', () => {
    const sep = getServiceYear(d(2026, 9, 1));
    const aug = getServiceYear(d(2027, 8, 1));
    expect(sep.year).toBe(aug.year);
  });
});

describe('computeMonthlyTarget', () => {
  it('returns 15 for monthlyTarget 15', () => {
    const config: AuxiliaryGoalConfig = { type: 'auxiliary', serviceYear: 2027, monthlyTarget: 15, permanent: true };
    expect(computeMonthlyTarget(config)).toBe(15);
  });

  it('returns 30 for monthlyTarget 30', () => {
    const config: AuxiliaryGoalConfig = { type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: true };
    expect(computeMonthlyTarget(config)).toBe(30);
  });
});

describe('computeRegularGoalProgress', () => {
  const config: RegularGoalConfig = { type: 'regular', serviceYear: 2027 };

  it('returns on-track when projection equals target', () => {
    // elapsed=2 (Oct 2026), accumulated=100 → projection=(100/2)*12=600
    const result = computeRegularGoalProgress(config, 100, d(2026, 10, 15));
    expect(result.status).toBe('on-track');
    expect(result.projectedHours).toBe(600);
    expect(result.monthsElapsed).toBe(2);
  });

  it('returns behind-in-margin when 560 <= projection < 600', () => {
    // elapsed=2, accumulated=94 → projection=564
    const result = computeRegularGoalProgress(config, 94, d(2026, 10, 15));
    expect(result.status).toBe('behind-in-margin');
    expect(result.projectedHours).toBe(564);
  });

  it('returns out-of-margin when projection < 560', () => {
    // elapsed=2, accumulated=92 → projection=552
    const result = computeRegularGoalProgress(config, 92, d(2026, 10, 15));
    expect(result.status).toBe('out-of-margin');
    expect(result.projectedHours).toBe(552);
  });

  it('computes correctly in first month', () => {
    // elapsed=1 (Sep 2026), accumulated=50 → projection=600
    const result = computeRegularGoalProgress(config, 50, d(2026, 9, 15));
    expect(result.status).toBe('on-track');
    expect(result.monthsElapsed).toBe(1);
  });

  it('computes correctly in last month', () => {
    // elapsed=12 (Aug 2027)
    const result = computeRegularGoalProgress(config, 600, d(2027, 8, 31));
    expect(result.monthsElapsed).toBe(12);
    expect(result.status).toBe('on-track');
  });

  it('returns projection 0 and monthsElapsed 0 before service year', () => {
    // Aug 2026 is before Sep 2026 start
    const result = computeRegularGoalProgress(config, 0, d(2026, 8, 31));
    expect(result.projectedHours).toBe(0);
    expect(result.monthsElapsed).toBe(0);
  });

  it('clamps monthsElapsed to 12 after service year ends', () => {
    const result = computeRegularGoalProgress(config, 600, d(2027, 10, 1));
    expect(result.monthsElapsed).toBe(12);
  });

  it('returns correct shape without activeMonthsElapsed', () => {
    const result = computeRegularGoalProgress(config, 100, d(2026, 10, 15));
    expect(result.accumulatedHours).toBe(100);
    expect(result.targetHours).toBe(600);
    expect(result.projectedHours).toBeDefined();
    expect(result.monthsElapsed).toBeDefined();
    expect(result.activeMonthsElapsed).toBeUndefined();
  });
});

describe('computeAuxiliaryGoalProgress', () => {
  describe('permanent goal, monthlyTarget 30', () => {
    const config: AuxiliaryGoalConfig = { type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: true };

    it('returns on-track when projection equals target', () => {
      // elapsed=2, activeElapsed=2, totalActive=12, target=360, accumulated=60 → projection=360
      const result = computeAuxiliaryGoalProgress(config, 60, d(2026, 10, 15));
      expect(result.status).toBe('on-track');
      expect(result.targetHours).toBe(360);
      expect(result.projectedHours).toBe(360);
      expect(result.activeMonthsElapsed).toBe(2);
    });

    it('returns behind-in-margin at exact margin boundary', () => {
      // margin = 360*(560/600)=336, accumulated=56 → projection=(56/2)*12=336
      const result = computeAuxiliaryGoalProgress(config, 56, d(2026, 10, 15));
      expect(result.status).toBe('behind-in-margin');
      expect(result.projectedHours).toBe(336);
    });

    it('returns out-of-margin below margin', () => {
      // accumulated=55 → projection=(55/2)*12=330 < 336
      const result = computeAuxiliaryGoalProgress(config, 55, d(2026, 10, 15));
      expect(result.status).toBe('out-of-margin');
    });
  });

  describe('permanent goal, monthlyTarget 15', () => {
    const config: AuxiliaryGoalConfig = { type: 'auxiliary', serviceYear: 2027, monthlyTarget: 15, permanent: true };

    it('uses targetHours 180', () => {
      const result = computeAuxiliaryGoalProgress(config, 30, d(2026, 10, 15));
      expect(result.targetHours).toBe(180);
      // projection=(30/2)*12=180 → on-track
      expect(result.status).toBe('on-track');
    });
  });

  describe('non-permanent without month bounds (permanent=false, no startMonth/endMonth)', () => {
    const config: AuxiliaryGoalConfig = {
      type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: false,
    };

    it('treats all 12 months as active when startMonth/endMonth are absent', () => {
      // same as permanent: targetHours=360
      const result = computeAuxiliaryGoalProgress(config, 60, d(2026, 10, 15));
      expect(result.targetHours).toBe(360);
      expect(result.activeMonthsElapsed).toBe(2);
    });
  });

  describe('non-permanent Mar–Jun goal (non-wrapping consecutive months)', () => {
    // startMonth=3, endMonth=6 → startMonth <= endMonth: active months Mar, Apr, May, Jun = 4
    const config: AuxiliaryGoalConfig = {
      type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: false,
      startMonth: 3, endMonth: 6,
    };

    it('counts 4 active months, targetHours=120', () => {
      const result = computeAuxiliaryGoalProgress(config, 0, d(2027, 3, 15));
      expect(result.targetHours).toBe(120);
    });

    it('inactive months before startMonth have activeMonthsElapsed=0', () => {
      // Jan 2027: elapsed=5 (Sep,Oct,Nov,Dec,Jan); active months in those: none (Mar-Jun)
      const result = computeAuxiliaryGoalProgress(config, 0, d(2027, 1, 15));
      expect(result.activeMonthsElapsed).toBe(0);
    });

    it('active month inside range counts correctly', () => {
      // Apr 2027: elapsed=8 (Sep..Apr); active in those: Mar, Apr = 2
      const result = computeAuxiliaryGoalProgress(config, 60, d(2027, 4, 15));
      expect(result.activeMonthsElapsed).toBe(2);
      // projection=(60/2)*4=120 → on-track
      expect(result.status).toBe('on-track');
    });
  });

  describe('non-permanent Nov–Mar goal (wrapping year boundary)', () => {
    // startMonth=11, endMonth=3 → wraps: active months Nov, Dec, Jan, Feb, Mar = 5
    const config: AuxiliaryGoalConfig = {
      type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: false,
      startMonth: 11, endMonth: 3,
    };

    it('counts 5 active months in total, targetHours=150', () => {
      const result = computeAuxiliaryGoalProgress(config, 30, d(2026, 11, 15));
      expect(result.targetHours).toBe(150);
    });

    it('activeMonthsElapsed=0 in inactive month (Oct)', () => {
      const result = computeAuxiliaryGoalProgress(config, 0, d(2026, 10, 15));
      expect(result.activeMonthsElapsed).toBe(0);
      expect(result.projectedHours).toBe(0);
    });

    it('activeMonthsElapsed=1 in first active month (Nov)', () => {
      // elapsed=3 (Sep,Oct,Nov); active in [Sep,Oct,Nov] = only Nov active → activeElapsed=1
      const result = computeAuxiliaryGoalProgress(config, 30, d(2026, 11, 15));
      expect(result.activeMonthsElapsed).toBe(1);
      // projection=(30/1)*5=150 → on-track
      expect(result.status).toBe('on-track');
    });

    it('activeMonthsElapsed=3 after Jan (Nov+Dec+Jan)', () => {
      // elapsed=5 (Sep,Oct,Nov,Dec,Jan); active: Nov,Dec,Jan → 3
      const result = computeAuxiliaryGoalProgress(config, 90, d(2027, 1, 15));
      expect(result.activeMonthsElapsed).toBe(3);
      // projection=(90/3)*5=150 → on-track
      expect(result.status).toBe('on-track');
    });

    it('monthsElapsed and activeMonthsElapsed differ in inactive period', () => {
      // Oct 2026: monthsElapsed=2, activeMonthsElapsed=0
      const result = computeAuxiliaryGoalProgress(config, 0, d(2026, 10, 15));
      expect(result.monthsElapsed).toBe(2);
      expect(result.activeMonthsElapsed).toBe(0);
    });
  });
});

describe('computeGoalProgress dispatcher', () => {
  it('delegates to computeRegularGoalProgress for regular config', () => {
    const config: RegularGoalConfig = { type: 'regular', serviceYear: 2027 };
    const direct = computeRegularGoalProgress(config, 100, d(2026, 10, 15));
    const dispatched = computeGoalProgress(config, 100, d(2026, 10, 15));
    expect(dispatched).toEqual(direct);
  });

  it('delegates to computeAuxiliaryGoalProgress for auxiliary config', () => {
    const config: AuxiliaryGoalConfig = {
      type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: true,
    };
    const direct = computeAuxiliaryGoalProgress(config, 60, d(2026, 10, 15));
    const dispatched = computeGoalProgress(config, 60, d(2026, 10, 15));
    expect(dispatched).toEqual(direct);
  });
});
