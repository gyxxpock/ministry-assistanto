import { Injectable, Optional } from '@angular/core';
import { IGoalRepository } from '../domain/i-goal.repository';
import { GoalConfig } from '../domain/models';
import { GoalsDB } from './goals.dexie';

@Injectable()
export class DexieGoalRepository implements IGoalRepository {
  private db: GoalsDB;

  constructor(@Optional() db?: GoalsDB) {
    this.db = db ?? new GoalsDB();
  }

  async getActive(): Promise<GoalConfig | null> {
    const record = await this.db.activeGoal.toCollection().first();
    if (!record) return null;
    const { id: _id, ...config } = record;
    return config as GoalConfig;
  }

  async setActive(config: GoalConfig): Promise<void> {
    await this.db.transaction('rw', this.db.activeGoal, async () => {
      await this.db.activeGoal.clear();
      await this.db.activeGoal.add({ ...config });
    });
  }

  async clearActive(): Promise<void> {
    await this.db.activeGoal.clear();
  }
}
