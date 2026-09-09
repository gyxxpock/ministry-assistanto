export const REGULAR_GOAL_TARGET = 600;
export const REGULAR_GOAL_MARGIN = 560;

export interface ServiceYear {
  year: number;       // ending calendar year, e.g. 2027
  startMonth: number; // always 9 (September)
  startYear: number;  // e.g. 2026
  endMonth: number;   // always 8 (August)
  endYear: number;    // e.g. 2027
}

export type GoalType = 'regular' | 'auxiliary';

export interface RegularGoalConfig {
  type: 'regular';
  serviceYear: number;
  startMonth?: number; // calendar month 1-12; the month the pioneer started
}

export interface AuxiliaryGoalConfig {
  type: 'auxiliary';
  serviceYear: number;
  monthlyTarget: 15 | 30;
  permanent: boolean;
  startMonth?: number; // calendar month 1-12, only when permanent=false
  endMonth?: number;   // calendar month 1-12, only when permanent=false
}

export type GoalConfig = RegularGoalConfig | AuxiliaryGoalConfig;

export interface Goal {
  id: string;
  config: GoalConfig;
  active: boolean;
}

export type GoalStatus = 'on-track' | 'behind-in-margin' | 'out-of-margin';

export interface GoalProgress {
  accumulatedHours: number;
  projectedHours: number;
  targetHours: number;
  status: GoalStatus;
  monthsElapsed: number;
  activeMonthsElapsed?: number; // auxiliary goals only
  // Monthly metrics — for current calendar month visibility
  monthlyAccumulated: number;
  monthlyTarget: number;
  monthlyProgress: number; // percentage 0-100
  monthlyPlanned?: number; // for future Planning feature override
}
