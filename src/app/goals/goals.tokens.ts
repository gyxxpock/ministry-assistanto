import { InjectionToken } from '@angular/core';
import { IGoalRepository } from './domain/i-goal.repository';

export const GOAL_REPOSITORY_TOKEN =
  new InjectionToken<IGoalRepository>('GOAL_REPOSITORY_TOKEN');
