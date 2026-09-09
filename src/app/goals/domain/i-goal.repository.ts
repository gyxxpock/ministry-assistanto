import { GoalConfig } from './models';

export interface IGoalRepository {
  getActive(): Promise<GoalConfig | null>;
  setActive(config: GoalConfig): Promise<void>;
  clearActive(): Promise<void>;
}
