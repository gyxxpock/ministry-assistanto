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
    // Oct 31 = last day of Oct → current month fully elapsed (fraction=1), same as pre-prorate math.
    // elapsed=2 (Oct 2026), accumulated=100 → projection=(100/2)*12=600
    const result = computeRegularGoalProgress(config, 100, d(2026, 10, 31));
    expect(result.status).toBe('on-track');
    expect(result.projectedHours).toBe(600);
    expect(result.monthsElapsed).toBe(2);
  });

  it('returns behind-in-margin when 560 <= projection < 600', () => {
    // Oct 31 → current month fully elapsed. elapsed=2, accumulated=94 → projection=564
    const result = computeRegularGoalProgress(config, 94, d(2026, 10, 31));
    expect(result.status).toBe('behind-in-margin');
    expect(result.projectedHours).toBe(564);
  });

  it('returns out-of-margin when projection < 560', () => {
    // Oct 31 → current month fully elapsed. elapsed=2, accumulated=92 → projection=552
    const result = computeRegularGoalProgress(config, 92, d(2026, 10, 31));
    expect(result.status).toBe('out-of-margin');
    expect(result.projectedHours).toBe(552);
  });

  it('computes correctly in first month', () => {
    // Sep 15: current (only) month is in-progress, prorated 15/30 → activeMonthsElapsed=0.5.
    // projection=(50/0.5)*12=1200 (still clearly on-track); monthsElapsed (raw elapsed count) stays 1.
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

  it('activeMonthsElapsed equals monthsElapsed at month-end (current month fully elapsed) without startMonth', () => {
    const result = computeRegularGoalProgress(config, 100, d(2026, 10, 31));
    expect(result.accumulatedHours).toBe(100);
    expect(result.targetHours).toBe(600);
    expect(result.projectedHours).toBeDefined();
    expect(result.monthsElapsed).toBeDefined();
    expect(result.activeMonthsElapsed).toBe(result.monthsElapsed);
    expect(result.totalActiveMonths).toBe(12);
  });

  it('activeMonthsElapsed is fractional mid-month (day-prorated current month, issue #70)', () => {
    // Sep 17: current-year's only elapsed month (Sep) is in-progress → activeMonthsElapsed = 17/30.
    const result = computeRegularGoalProgress(config, 33, d(2026, 9, 17));
    expect(result.activeMonthsElapsed).toBe(0.57);
    expect(result.monthsElapsed).toBe(1);
  });
});

describe('computeRegularGoalProgress with startMonth (mid-year enrollment)', () => {
  it('non-wrap: started in January, computes 8 active months (Jan-Aug), April prorated by day', () => {
    // startMonth=1, endMonth is always 8 (Aug) for regular goals.
    // Apr 15 (30-day month) is the in-progress month → activeMonthsElapsed = 3 full (Jan-Mar) + 15/30 = 3.5.
    // targetHours=400 (8*50, unaffected by the in-progress fraction).
    // projection=(200/3.5)*8=457.14; targetToDate=round2(400*3.5/8)=175; hoursDifference=200-175=25.
    const config: RegularGoalConfig = { type: 'regular', serviceYear: 2027, startMonth: 1 };
    const result = computeRegularGoalProgress(config, 200, d(2027, 4, 15));
    expect(result.totalActiveMonths).toBe(8);
    expect(result.activeMonthsElapsed).toBe(3.5);
    expect(result.targetHours).toBe(400);
    expect(result.projectedHours).toBe(457.14);
    expect(result.status).toBe('on-track');
    expect(result.targetToDate).toBe(175);
    expect(result.hoursDifference).toBe(25);
  });

  it('wrap: started in October, active period crosses the service-year boundary (11 active months)', () => {
    // startMonth=10 > endMonth=8 → wraps: active months Oct..Aug = 11
    const config: RegularGoalConfig = { type: 'regular', serviceYear: 2027, startMonth: 10 };
    const result = computeRegularGoalProgress(config, 0, d(2026, 10, 15));
    expect(result.totalActiveMonths).toBe(11);
  });

  it('current month has not reached startMonth yet: activeMonthsElapsed and projection are 0', () => {
    // startMonth=6 (June); currentDate is October, before June has arrived in this service year
    const config: RegularGoalConfig = { type: 'regular', serviceYear: 2027, startMonth: 6 };
    const result = computeRegularGoalProgress(config, 0, d(2026, 10, 15));
    expect(result.activeMonthsElapsed).toBe(0);
    expect(result.projectedHours).toBe(0);
  });
});

describe('issue #70: prorateo diario del mes en curso', () => {
  const config: RegularGoalConfig = { type: 'regular', serviceYear: 2027 };

  it('reproduces the reported bug scenario: Sep 17, 33h accumulated → ahead of pace, not out-of-margin', () => {
    // Sep has 30 days; day 17 → activeMonthsElapsed = 17/30 = 0.5666... → rounds to 0.57.
    // targetToDate = round2(600 * (17/30) / 12) = 28.33; hoursDifference = 33 - 28.33 = 4.67 (ahead).
    // projection = (33 / (17/30)) * 12 ≈ 698.82 → status on-track (previously falsely 'out-of-margin').
    const result = computeRegularGoalProgress(config, 33, d(2026, 9, 17));
    expect(result.activeMonthsElapsed).toBe(0.57);
    expect(result.targetHours).toBe(600);
    expect(result.targetToDate).toBe(28.33);
    expect(result.hoursDifference).toBe(4.67);
    expect(result.projectedHours).toBe(698.82);
    expect(result.status).toBe('on-track');
  });

  it('day 1 of a fresh service year no longer produces a huge false negative', () => {
    // Sep 1: activeMonthsElapsed = 1/30 ≈ 0.03. targetToDate ≈ round2(600*(1/30)/12) = 1.67.
    // With 2h logged so early, hoursDifference is small (+0.33) instead of the old -48.
    const result = computeRegularGoalProgress(config, 2, d(2026, 9, 1));
    expect(result.activeMonthsElapsed).toBe(0.03);
    expect(result.targetToDate).toBe(1.67);
    expect(result.hoursDifference).toBe(0.33);
    expect(result.status).toBe('on-track');
  });

  it('applies the same daily prorating to auxiliary goals', () => {
    // Permanent auxiliary, monthlyTarget=30. Sep 17: activeMonthsElapsed=17/30 (rounds to 0.57).
    // target=12*30=360; targetToDate=target/totalActiveMonths*activeMonthsElapsed=30*(17/30)=17 exactly.
    // accumulated=20 → hoursDifference=3 (ahead); projection=(20/(17/30))*12≈423.53 → on-track.
    const auxConfig: AuxiliaryGoalConfig = { type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: true };
    const result = computeAuxiliaryGoalProgress(auxConfig, 20, d(2026, 9, 17));
    expect(result.activeMonthsElapsed).toBe(0.57);
    expect(result.targetHours).toBe(360);
    expect(result.targetToDate).toBe(17);
    expect(result.hoursDifference).toBe(3);
    expect(result.status).toBe('on-track');
  });
});

describe('computeAuxiliaryGoalProgress', () => {
  describe('permanent goal, monthlyTarget 30', () => {
    const config: AuxiliaryGoalConfig = { type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: true };

    it('returns on-track when projection equals target', () => {
      // Oct 31 = last day of Oct → current month fully elapsed (fraction=1), same as pre-prorate math.
      // elapsed=2, activeElapsed=2, totalActive=12, target=360, accumulated=60 → projection=360
      const result = computeAuxiliaryGoalProgress(config, 60, d(2026, 10, 31));
      expect(result.status).toBe('on-track');
      expect(result.targetHours).toBe(360);
      expect(result.projectedHours).toBe(360);
      expect(result.activeMonthsElapsed).toBe(2);
      // totalActiveMonths=12, targetToDate=round2(360*2/12)=60, hoursDifference=round2(60-60)=0
      expect(result.totalActiveMonths).toBe(12);
      expect(result.targetToDate).toBe(60);
      expect(result.hoursDifference).toBe(0);
    });

    it('returns behind-in-margin at exact margin boundary', () => {
      // Oct 31 → current month fully elapsed. margin = 360*(560/600)=336, accumulated=56 → projection=(56/2)*12=336
      const result = computeAuxiliaryGoalProgress(config, 56, d(2026, 10, 31));
      expect(result.status).toBe('behind-in-margin');
      expect(result.projectedHours).toBe(336);
    });

    it('returns out-of-margin below margin', () => {
      // Oct 31 → current month fully elapsed. accumulated=55 → projection=(55/2)*12=330 < 336
      const result = computeAuxiliaryGoalProgress(config, 55, d(2026, 10, 31));
      expect(result.status).toBe('out-of-margin');
    });
  });

  describe('permanent goal, monthlyTarget 15', () => {
    const config: AuxiliaryGoalConfig = { type: 'auxiliary', serviceYear: 2027, monthlyTarget: 15, permanent: true };

    it('uses targetHours 180', () => {
      // Oct 31 → current month fully elapsed, same as pre-prorate math.
      const result = computeAuxiliaryGoalProgress(config, 30, d(2026, 10, 31));
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
      // Oct 31 → current month fully elapsed. same as permanent: targetHours=360
      const result = computeAuxiliaryGoalProgress(config, 60, d(2026, 10, 31));
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
      // Apr 2027 (30-day month), day 15: elapsed=8 (Sep..Apr); active in those: Mar (full) + Apr (in-progress, 15/30=0.5) = 1.5
      const result = computeAuxiliaryGoalProgress(config, 60, d(2027, 4, 15));
      expect(result.activeMonthsElapsed).toBe(1.5);
      // projection=(60/1.5)*4=160 → on-track
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

    it('activeMonthsElapsed=0.5 in first active month (Nov), in-progress and day-prorated', () => {
      // elapsed=3 (Sep,Oct,Nov); active in [Sep,Oct,Nov] = only Nov, and it's the in-progress month
      // (30-day month, day 15) → activeElapsed = 15/30 = 0.5
      const result = computeAuxiliaryGoalProgress(config, 30, d(2026, 11, 15));
      expect(result.activeMonthsElapsed).toBe(0.5);
      // projection=(30/0.5)*5=300 → on-track
      expect(result.status).toBe('on-track');
    });

    it('activeMonthsElapsed=2.48 after Jan (Nov+Dec full, Jan in-progress and day-prorated)', () => {
      // elapsed=5 (Sep,Oct,Nov,Dec,Jan); active: Nov,Dec (full) + Jan (in-progress, 31-day month, day 15 → 15/31)
      // = 1 + 1 + 15/31 ≈ 2.4839 → rounds to 2.48
      const result = computeAuxiliaryGoalProgress(config, 90, d(2027, 1, 15));
      expect(result.activeMonthsElapsed).toBe(2.48);
      // projection=(90/(2+15/31))*5 ≈ 181.17 → on-track
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
