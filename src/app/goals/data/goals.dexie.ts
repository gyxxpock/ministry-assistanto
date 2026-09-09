import Dexie, { Table } from 'dexie';
import { GoalConfig } from '../domain/models';

export type ActiveGoalRecord = GoalConfig & { id?: number };

export class GoalsDB extends Dexie {
  activeGoal!: Table<ActiveGoalRecord>;

  constructor(dbName = 'ministry-assistanto-goals-db') {
    super(dbName);
    this.version(1).stores({
      activeGoal: '++id',
    });
  }
}
