import Dexie, { Table } from 'dexie';
import { DayPlan, WeeklySchedule } from '../domain/models';

/** Fila Dexie de weeklySchedule: un único registro activo (patrón GoalsDB). */
export type WeeklyScheduleRecord = WeeklySchedule & { id?: number };

/** Fila Dexie de dayOverrides: clave primaria = fecha ISO ('YYYY-MM-DD'). */
export type DayPlanRecord = DayPlan;

/**
 * Base de datos Dexie propia de Planning — separada de TimeEntryDB/GoalsDB
 * para no complicar migraciones entre features.
 */
export class PlanningDB extends Dexie {
  weeklySchedule!: Table<WeeklyScheduleRecord>;
  dayOverrides!: Table<DayPlanRecord>;

  constructor(dbName = 'PlanningDB') {
    super(dbName);
    this.version(1).stores({
      weeklySchedule: '++id',
      dayOverrides: 'date',
    });
  }
}
