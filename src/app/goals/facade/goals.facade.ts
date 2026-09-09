import { Injectable, computed, inject, signal } from '@angular/core';
import { IGoalRepository } from '../domain/i-goal.repository';
import { ITimeEntryRepository } from '../../time-entry/domain/i-time-entry.repository';
import { Goal, GoalConfig, GoalProgress } from '../domain/models';
import { computeGoalProgress, getServiceYear } from '../domain/goal.usecase';
import { GOAL_REPOSITORY_TOKEN } from '../goals.tokens';
import { TIME_ENTRY_REPOSITORY } from '../../time-entry/presentation/tokens/time-entry.tokens';

@Injectable()
export class GoalsFacade {
  readonly repo: IGoalRepository = inject(GOAL_REPOSITORY_TOKEN);
  private readonly timeEntryRepo: ITimeEntryRepository = inject(TIME_ENTRY_REPOSITORY);

  readonly currentServiceYear = signal(getServiceYear(new Date()));

  private readonly _activeGoal = signal<Goal | null>(null);
  private readonly _accumulatedHours = signal<number>(0);
  private readonly _monthlyAccumulated = signal<number>(0);

  readonly activeGoal = this._activeGoal.asReadonly();
  readonly accumulatedHours = this._accumulatedHours.asReadonly();

  readonly goalProgress = computed((): GoalProgress | null => {
    const goal = this.activeGoal();
    if (!goal) return null;
    return computeGoalProgress(goal.config, this.accumulatedHours(), new Date(), this._monthlyAccumulated());
  });

  /** Carga el objetivo activo y calcula las horas acumuladas del año de servicio. */
  async loadGoal(): Promise<void> {
    const config = await this.repo.getActive();
    const goal = config ? { id: 'active', config, active: true } : null;
    this._activeGoal.set(goal);
    await this._computeAccumulatedHours(goal?.config ?? null);
  }

  async setGoal(goal: Goal): Promise<void> {
    await this.repo.setActive(goal.config);
    this._activeGoal.set(goal);
    await this._computeAccumulatedHours(goal.config);
  }

  async clearGoal(): Promise<void> {
    await this.repo.clearActive();
    this._activeGoal.set(null);
    this._accumulatedHours.set(0);
  }

  /** Recalcula las horas acumuladas sin recargar el objetivo desde el repositorio. */
  async refreshProgress(): Promise<void> {
    const goal = this._activeGoal();
    await this._computeAccumulatedHours(goal?.config ?? null);
  }

  setAccumulatedHours(hours: number): void {
    this._accumulatedHours.set(hours);
  }

  private async _computeAccumulatedHours(config: GoalConfig | null): Promise<void> {
    if (!config) {
      this._accumulatedHours.set(0);
      return;
    }

    const serviceYear = config.serviceYear;
    const startYear = serviceYear - 1;
    const endYear = serviceYear;

    let startDate: Date;
    let endDate: Date;

    if (config.type === 'auxiliary' && !config.permanent &&
        config.startMonth !== undefined && config.endMonth !== undefined) {
      // Auxiliar con rango: sólo los meses activos dentro del año de servicio
      const smYear = config.startMonth >= 9 ? startYear : endYear;
      const emYear = config.endMonth >= 9 ? startYear : endYear;
      startDate = new Date(smYear, config.startMonth - 1, 1);
      endDate = new Date(emYear, config.endMonth, 0, 23, 59, 59, 999);
    } else {
      // Regular o auxiliar permanente: año de servicio completo (sep → ago)
      startDate = new Date(startYear, 8, 1);           // 1 sep startYear
      endDate   = new Date(endYear,   7, 31, 23, 59, 59, 999); // 31 ago endYear
    }

    const entries = await this.timeEntryRepo.listEntriesByDateRange(startDate, endDate);
    const hours = entries.reduce((sum, e) => sum + e.durationMinutes / 60, 0);
    this._accumulatedHours.set(Math.round(hours * 100) / 100);

    // Compute monthly accumulated for current calendar month
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    const monthStartTime = monthStart.getTime();
    const monthEndTime = monthEnd.getTime();

    const monthlyEntries = entries.filter(e => {
      const eTime = (e.date instanceof Date ? e.date : new Date(e.date)).getTime();
      return eTime >= monthStartTime && eTime <= monthEndTime;
    });
    const monthlyHours = monthlyEntries.reduce((sum, e) => sum + e.durationMinutes / 60, 0);
    this._monthlyAccumulated.set(Math.round(monthlyHours * 100) / 100);
  }
}
