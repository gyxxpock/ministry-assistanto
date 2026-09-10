import { Injectable, computed, inject, signal } from '@angular/core';
import { IPlanningRepository } from '../domain/i-planning.repository';
import { PLANNING_REPOSITORY_TOKEN } from '../planning.tokens';
import { ITimeEntryRepository } from '../../time-entry/domain/i-time-entry.repository';
import { TIME_ENTRY_REPOSITORY } from '../../time-entry/presentation/tokens/time-entry.tokens';
import { IGoalRepository } from '../../goals/domain/i-goal.repository';
import { GOAL_REPOSITORY_TOKEN } from '../../goals/goals.tokens';
import { Goal, GoalConfig } from '../../goals/domain/models';
import { getServiceYear } from '../../goals/domain/goal.usecase';
import { TimeEntry } from '../../time-entry/domain/models';
import { WeekStartService } from '../../core/services/week-start.service';
import { DayPlan, PlanningProjection, WeeklySchedule } from '../domain/models';
import {
  computeDailyPlan,
  computePlanningProjection,
  sumWeeklyHours,
  toIsoDate,
} from '../domain/planning.usecase';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function firstAndLastOfMonth(year: number, month: number): { from: Date; to: Date } {
  return {
    from: new Date(year, month - 1, 1),
    to: new Date(year, month, 0, 23, 59, 59, 999),
  };
}

/** Agrupa horas reales por clave 'YYYY-MM', a partir de TimeEntry.date/durationMinutes. */
function buildActualByMonth(entries: TimeEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const entry of entries) {
    const d = entry.date instanceof Date ? entry.date : new Date(entry.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map.set(key, round2((map.get(key) ?? 0) + entry.durationMinutes / 60));
  }
  return map;
}

@Injectable()
export class PlanningFacade {
  private readonly repo: IPlanningRepository = inject(PLANNING_REPOSITORY_TOKEN);
  private readonly timeEntryRepo: ITimeEntryRepository = inject(TIME_ENTRY_REPOSITORY);
  private readonly goalRepo: IGoalRepository = inject(GOAL_REPOSITORY_TOKEN);
  private readonly weekStartService: WeekStartService = inject(WeekStartService);

  readonly weeklySchedule = signal<WeeklySchedule | null>(null);
  /** Overrides del MES VISIBLE (rango cargado por loadPlanForMonth) — usado por
   *  el calendario / getDailyPlan(). No representa los 12 meses del objetivo. */
  readonly dayOverrides = signal<DayPlan[]>([]);

  readonly weeklyTotal = computed((): number => {
    const schedule = this.weeklySchedule();
    return schedule ? sumWeeklyHours(schedule) : 0;
  });

  readonly planningProjection = computed((): PlanningProjection | null => {
    const schedule = this.weeklySchedule();
    const goal = this._activeGoal();
    if (!schedule || !goal) return null;
    return computePlanningProjection(
      schedule,
      this._periodOverrides(),
      goal,
      this._actualByMonth(),
      this._currentDate(),
      this.weekStartService.weekStart(),
    );
  });

  private readonly _activeGoal = signal<Goal | null>(null);
  private readonly _periodOverrides = signal<DayPlan[]>([]);
  private readonly _actualByMonth = signal<Map<string, number>>(new Map());
  private readonly _currentDate = signal<Date>(new Date());

  private _visibleFrom = '';
  private _visibleTo = '';
  private _periodFrom = '';
  private _periodTo = '';

  constructor() {
    const now = new Date();
    const visible = firstAndLastOfMonth(now.getFullYear(), now.getMonth() + 1);
    this._visibleFrom = toIsoDate(visible.from);
    this._visibleTo = toIsoDate(visible.to);
    const sy = getServiceYear(now);
    this._periodFrom = toIsoDate(new Date(sy.startYear, sy.startMonth - 1, 1));
    this._periodTo = toIsoDate(new Date(sy.endYear, sy.endMonth, 0));
  }

  async loadPlanForMonth(year: number, month: number): Promise<void> {
    const currentDate = new Date();
    this._currentDate.set(currentDate);

    const visible = firstAndLastOfMonth(year, month);
    this._visibleFrom = toIsoDate(visible.from);
    this._visibleTo = toIsoDate(visible.to);

    const sy = getServiceYear(currentDate);
    const periodFrom = new Date(sy.startYear, sy.startMonth - 1, 1);
    const periodTo = new Date(sy.endYear, sy.endMonth, 0, 23, 59, 59, 999);
    this._periodFrom = toIsoDate(periodFrom);
    this._periodTo = toIsoDate(periodTo);

    const [schedule, config] = await Promise.all([
      this.repo.getWeeklySchedule(),
      this.goalRepo.getActive(),
    ]);
    this.weeklySchedule.set(schedule);
    this._activeGoal.set(this._wrapGoal(config));

    await Promise.all([
      this._refreshOverrides(),
      this._refreshActualByMonth(periodFrom, periodTo),
    ]);
  }

  async saveWeeklySchedule(schedule: WeeklySchedule): Promise<void> {
    await this.repo.saveWeeklySchedule(schedule);
    this.weeklySchedule.set(schedule);
  }

  async setDayOverride(plan: DayPlan): Promise<void> {
    await this.repo.setDayOverride(plan);
    await this._refreshOverrides();
  }

  async clearDayOverride(date: string): Promise<void> {
    await this.repo.clearDayOverride(date);
    await this._refreshOverrides();
  }

  getDailyPlan(date: Date): number {
    const schedule = this.weeklySchedule();
    if (!schedule) return 0;
    return computeDailyPlan(schedule, this.dayOverrides(), date, this.weekStartService.weekStart());
  }

  private _wrapGoal(config: GoalConfig | null): Goal | null {
    return config ? { id: 'active', config, active: true } : null;
  }

  private async _refreshOverrides(): Promise<void> {
    const [visible, period] = await Promise.all([
      this.repo.getDayOverrides(this._visibleFrom, this._visibleTo),
      this.repo.getDayOverrides(this._periodFrom, this._periodTo),
    ]);
    this.dayOverrides.set(visible);
    this._periodOverrides.set(period);
  }

  private async _refreshActualByMonth(periodFrom: Date, periodTo: Date): Promise<void> {
    const entries = await this.timeEntryRepo.listEntriesByDateRange(periodFrom, periodTo);
    this._actualByMonth.set(buildActualByMonth(entries));
  }
}
