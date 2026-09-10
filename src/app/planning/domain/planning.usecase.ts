import {
  Goal,
  REGULAR_GOAL_MARGIN,
  REGULAR_GOAL_TARGET,
  ServiceYear,
} from '../../goals/domain/models';
import { getServiceYear, isActiveMonth } from '../../goals/domain/goal.usecase';
import {
  DayPlan,
  MonthlyBar,
  PlanningProjection,
  PlanningProjectionStatus,
  WeeklySchedule,
} from './models';
import { WeekDay } from '../../shared/domain/week-day.model';

/** Convierte una Date a 'YYYY-MM-DD'. Duplicado intencional: domain no puede
 *  importar de presentation/ (donde vive toDateKey en time-entry). */
export function toIsoDate(date: Date): string {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

const WEEKDAY_KEYS: (keyof WeeklySchedule)[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** Suma las horas planeadas de las 7 claves ISO del horario semanal.
 *  Usado por PlanningFacade.weeklyTotal (el formateo "HH:MM" vive en presentation/). */
export function sumWeeklyHours(schedule: WeeklySchedule): number {
  return round2(WEEKDAY_KEYS.reduce((sum, key) => sum + schedule[key], 0));
}

/**
 * Determina a qué clave de WeeklySchedule pertenece una fecha.
 * Los nombres mon..sun son días ISO absolutos (el lunes siempre es lunes):
 * el mapeo fecha->día NO cambia según weekStart. weekStart se recibe por
 * contrato de la firma (consistencia con WeekStartService), pero esta
 * función es matemáticamente invariante respecto a él — se documenta y se
 * verifica con un test de invariancia explícito.
 */
function weekdayKeyOf(date: Date, _weekStart: WeekDay): keyof WeeklySchedule {
  const jsIndex = date.getDay();       // 0=domingo..6=sábado (nativo de Date)
  const isoIndex = (jsIndex + 6) % 7;  // 0=lunes..6=domingo
  return WEEKDAY_KEYS[isoIndex];
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate(); // month es 1-12
}

/** Enumera los 12 pares (year, month) del periodo, a partir de los límites
 *  YA calculados por getServiceYear() — no reimplementa la regla sep→ago. */
function monthsOfServiceYear(sy: ServiceYear): { year: number; month: number }[] {
  const result: { year: number; month: number }[] = [];
  for (let m = sy.startMonth; m <= 12; m++) result.push({ year: sy.startYear, month: m }); // sep-dic
  for (let m = 1; m <= sy.endMonth; m++) result.push({ year: sy.endYear, month: m });       // ene-ago
  return result;
}

export function computeDailyPlan(
  schedule: WeeklySchedule,
  overrides: DayPlan[],
  date: Date,
  weekStart: WeekDay,
): number {
  const iso = toIsoDate(date);
  const override = overrides.find(o => o.date === iso);
  if (override) return override.hours;
  const key = weekdayKeyOf(date, weekStart);
  return schedule[key];
}

export function computeMonthlyPlanned(
  schedule: WeeklySchedule,
  overrides: DayPlan[],
  year: number,
  month: number, // 1-12
  weekStart: WeekDay,
): number {
  const total = Array.from({ length: daysInMonth(year, month) }, (_, i) => {
    const date = new Date(year, month - 1, i + 1);
    return computeDailyPlan(schedule, overrides, date, weekStart);
  }).reduce((sum, hours) => sum + hours, 0);
  return round2(total);
}

export function computePlanningProjection(
  schedule: WeeklySchedule,
  overrides: DayPlan[],
  goal: Goal,
  actualByMonth: Map<string, number>,
  currentDate: Date,
  weekStart: WeekDay,
): PlanningProjection {
  const sy = getServiceYear(currentDate);
  const months = monthsOfServiceYear(sy);

  const monthlyBars: MonthlyBar[] = months.map(({ year, month }) => {
    const plannedHours = computeMonthlyPlanned(schedule, overrides, year, month, weekStart);
    const key = `${year}-${String(month).padStart(2, '0')}`; // 'YYYY-MM'
    const actualHours = actualByMonth.get(key) ?? 0;
    return { year, month, plannedHours, actualHours };
  });

  const totalPlanned = round2(monthlyBars.reduce((sum, b) => sum + b.plannedHours, 0));

  let target: number;
  if (goal.config.type === 'regular') {
    target = REGULAR_GOAL_TARGET;
  } else {
    const auxiliaryConfig = goal.config;
    const activeMonths = months.filter(({ month }) => isActiveMonth(month, auxiliaryConfig)).length;
    target = auxiliaryConfig.monthlyTarget * activeMonths;
  }
  const margin = target * (REGULAR_GOAL_MARGIN / REGULAR_GOAL_TARGET);

  const status: PlanningProjectionStatus =
    totalPlanned >= target ? 'sufficient' :
    totalPlanned >= margin ? 'within-margin' :
    'insufficient';

  return { totalPlanned, monthlyBars, status };
}

export function isPlanSufficient(projection: PlanningProjection): PlanningProjectionStatus {
  return projection.status;
}
