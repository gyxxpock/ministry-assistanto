import { GoalStatus } from '../../domain/models';

export interface GoalProgressVM {
  accumulatedHours: number;
  projectedHours: number;
  targetHours: number;
  targetToDate: number;
  hoursDifference: number;
  statusLabel: GoalStatus;
  monthsElapsed: number;
  monthlyTarget: number;
  monthlyAccumulated: number;
  monthlyProgress: number;
}
