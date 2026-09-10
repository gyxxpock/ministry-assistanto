import { DayPlan, WeeklySchedule } from './models';

export interface IPlanningRepository {
  getWeeklySchedule(): Promise<WeeklySchedule | null>;
  saveWeeklySchedule(schedule: WeeklySchedule): Promise<void>;
  getDayOverrides(from: string, to: string): Promise<DayPlan[]>;
  setDayOverride(plan: DayPlan): Promise<void>;
  clearDayOverride(date: string): Promise<void>;
}
