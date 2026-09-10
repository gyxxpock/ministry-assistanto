import { Injectable, Optional } from '@angular/core';
import { IPlanningRepository } from '../domain/i-planning.repository';
import { DayPlan, WeeklySchedule } from '../domain/models';
import { PlanningDB } from './planning.dexie';

@Injectable()
export class DexiePlanningRepository implements IPlanningRepository {
  private db: PlanningDB;

  constructor(@Optional() db?: PlanningDB) {
    this.db = db ?? new PlanningDB();
  }

  async getWeeklySchedule(): Promise<WeeklySchedule | null> {
    const record = await this.db.weeklySchedule.toCollection().first();
    if (!record) return null;
    const { id: _id, ...schedule } = record;
    return schedule as WeeklySchedule;
  }

  async saveWeeklySchedule(schedule: WeeklySchedule): Promise<void> {
    await this.db.transaction('rw', this.db.weeklySchedule, async () => {
      await this.db.weeklySchedule.clear();
      await this.db.weeklySchedule.add({ ...schedule });
    });
  }

  async getDayOverrides(from: string, to: string): Promise<DayPlan[]> {
    return this.db.dayOverrides.where('date').between(from, to, true, true).toArray();
  }

  async setDayOverride(plan: DayPlan): Promise<void> {
    await this.db.dayOverrides.put({ ...plan });
  }

  async clearDayOverride(date: string): Promise<void> {
    await this.db.dayOverrides.delete(date);
  }
}

export default DexiePlanningRepository;
