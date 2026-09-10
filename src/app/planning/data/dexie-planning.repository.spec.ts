import { DayPlan, WeeklySchedule } from '../domain/models';
import { DexiePlanningRepository } from './dexie-planning.repository';
import { PlanningDB } from './planning.dexie';

describe('DexiePlanningRepository', () => {
  let db: PlanningDB;
  let repo: DexiePlanningRepository;

  const schedule: WeeklySchedule = {
    mon: 1, tue: 0, wed: 1, thu: 0, fri: 1, sat: 2, sun: 0,
  };

  const otherSchedule: WeeklySchedule = {
    mon: 2, tue: 2, wed: 0, thu: 0, fri: 0, sat: 0, sun: 3,
  };

  beforeEach(async () => {
    db = new PlanningDB(`test-planning-db-${Math.random().toString(36).slice(2)}`);
    repo = new DexiePlanningRepository(db);
  });

  afterEach(async () => {
    try { await db.delete(); } catch { /* ignore */ }
  });

  describe('weeklySchedule', () => {
    it('returns null when no schedule has been saved', async () => {
      expect(await repo.getWeeklySchedule()).toBeNull();
    });

    it('returns the same schedule after saveWeeklySchedule', async () => {
      await repo.saveWeeklySchedule(schedule);
      expect(await repo.getWeeklySchedule()).toEqual(schedule);
    });

    it('does not leak the internal Dexie id into the returned WeeklySchedule', async () => {
      await repo.saveWeeklySchedule(schedule);
      const result = await repo.getWeeklySchedule() as WeeklySchedule & { id?: unknown };
      expect((result as { id?: unknown })['id']).toBeUndefined();
    });

    it('saveWeeklySchedule called twice leaves exactly one record', async () => {
      await repo.saveWeeklySchedule(schedule);
      await repo.saveWeeklySchedule(otherSchedule);
      expect(await db.weeklySchedule.count()).toBe(1);
      expect(await repo.getWeeklySchedule()).toEqual(otherSchedule);
    });

    it('saveWeeklySchedule called three times leaves exactly one record', async () => {
      await repo.saveWeeklySchedule(schedule);
      await repo.saveWeeklySchedule(otherSchedule);
      await repo.saveWeeklySchedule(schedule);
      expect(await db.weeklySchedule.count()).toBe(1);
      expect(await repo.getWeeklySchedule()).toEqual(schedule);
    });
  });

  describe('dayOverrides', () => {
    const inRangeLower: DayPlan = { date: '2026-03-01', hours: 1.5 };
    const inRangeMid: DayPlan = { date: '2026-03-15', hours: 2 };
    const inRangeUpper: DayPlan = { date: '2026-03-31', hours: 0.5 };
    const beforeRange: DayPlan = { date: '2026-02-28', hours: 3 };
    const afterRange: DayPlan = { date: '2026-04-01', hours: 3 };

    beforeEach(async () => {
      for (const plan of [inRangeLower, inRangeMid, inRangeUpper, beforeRange, afterRange]) {
        await repo.setDayOverride(plan);
      }
    });

    it('returns only overrides within the [from, to] range, inclusive of both boundaries', async () => {
      const result = await repo.getDayOverrides('2026-03-01', '2026-03-31');
      const dates = result.map(p => p.date).sort();
      expect(dates).toEqual(['2026-03-01', '2026-03-15', '2026-03-31']);
    });

    it('excludes overrides strictly before the range', async () => {
      const result = await repo.getDayOverrides('2026-03-01', '2026-03-31');
      expect(result.some(p => p.date === '2026-02-28')).toBeFalse();
    });

    it('excludes overrides strictly after the range', async () => {
      const result = await repo.getDayOverrides('2026-03-01', '2026-03-31');
      expect(result.some(p => p.date === '2026-04-01')).toBeFalse();
    });

    it('returns an empty array when nothing falls within the range', async () => {
      const result = await repo.getDayOverrides('2026-06-01', '2026-06-30');
      expect(result).toEqual([]);
    });

    it('setDayOverride creates a new override for a date that did not exist', async () => {
      const created: DayPlan = { date: '2026-05-01', hours: 4 };
      await repo.setDayOverride(created);
      const result = await repo.getDayOverrides('2026-05-01', '2026-05-01');
      expect(result).toEqual([created]);
    });

    it('setDayOverride upserts an existing date without creating a duplicate row', async () => {
      const updated: DayPlan = { date: inRangeMid.date, hours: 9 };
      await repo.setDayOverride(updated);
      const result = await repo.getDayOverrides(inRangeMid.date, inRangeMid.date);
      expect(result).toEqual([updated]);
      expect(await db.dayOverrides.count()).toBe(5);
    });

    it('clearDayOverride removes the override so it no longer appears in range queries', async () => {
      await repo.clearDayOverride(inRangeMid.date);
      const result = await repo.getDayOverrides('2026-03-01', '2026-03-31');
      expect(result.some(p => p.date === inRangeMid.date)).toBeFalse();
    });

    it('clearDayOverride on a non-existing date does not throw', async () => {
      await expectAsync(repo.clearDayOverride('1999-01-01')).toBeResolved();
    });
  });

  it('constructs without injection using a default PlanningDB', async () => {
    const defaultRepo = new DexiePlanningRepository();
    expect(await defaultRepo.getWeeklySchedule()).toBeNull();
    const cleanup = new PlanningDB();
    await cleanup.delete();
  });
});
