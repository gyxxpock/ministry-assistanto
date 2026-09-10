import { InjectionToken } from '@angular/core';
import { IPlanningRepository } from './domain/i-planning.repository';

export const PLANNING_REPOSITORY_TOKEN =
  new InjectionToken<IPlanningRepository>('PLANNING_REPOSITORY_TOKEN');
