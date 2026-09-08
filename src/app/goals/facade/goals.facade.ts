import { Injectable, computed, inject, signal } from '@angular/core';
import { IGoalRepository } from '../domain/i-goal.repository';
import { Goal, GoalProgress } from '../domain/models';
import { computeGoalProgress, getServiceYear } from '../domain/goal.usecase';
import { GOAL_REPOSITORY_TOKEN } from '../goals.tokens';

@Injectable()
export class GoalsFacade {
  // Explicit type annotation required — avoids TS2571 inside computed()
  readonly repo: IGoalRepository = inject(GOAL_REPOSITORY_TOKEN);

  readonly currentServiceYear = signal(getServiceYear(new Date()));

  private readonly _activeGoal = signal<Goal | null>(null);
  private readonly _accumulatedHours = signal<number>(0);

  readonly activeGoal = this._activeGoal.asReadonly();
  readonly accumulatedHours = this._accumulatedHours.asReadonly();

  readonly goalProgress = computed((): GoalProgress | null => {
    const goal = this.activeGoal();
    if (!goal) return null;
    return computeGoalProgress(goal.config, this.accumulatedHours(), new Date());
  });

  /** Carga el objetivo activo del repositorio e inicializa los signals. */
  async loadGoal(): Promise<void> {
    const config = await this.repo.getActive();
    this._activeGoal.set(
      config ? { id: 'active', config, active: true } : null,
    );
  }

  async setGoal(goal: Goal): Promise<void> {
    await this.repo.setActive(goal.config);
    this._activeGoal.set(goal);
  }

  async clearGoal(): Promise<void> {
    await this.repo.clearActive();
    this._activeGoal.set(null);
  }

  setAccumulatedHours(hours: number): void {
    this._accumulatedHours.set(hours);
  }
}
