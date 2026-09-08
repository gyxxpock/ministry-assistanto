import {
  AuxiliaryGoalConfig,
  GoalConfig,
  GoalProgress,
  GoalStatus,
  REGULAR_GOAL_MARGIN,
  REGULAR_GOAL_TARGET,
  RegularGoalConfig,
  ServiceYear,
} from './models';

function buildServiceYearFromYear(year: number): ServiceYear {
  return {
    year,
    startMonth: 9,
    startYear: year - 1,
    endMonth: 8,
    endYear: year,
  };
}

/** Meses transcurridos desde el inicio del año de servicio, inclusive. Rango [0, 12]. */
function monthsElapsedInServiceYear(sy: ServiceYear, currentDate: Date): number {
  const cy = currentDate.getFullYear();
  const cm = currentDate.getMonth() + 1;
  const elapsed = (cy * 12 + cm) - (sy.startYear * 12 + sy.startMonth) + 1;
  return Math.min(Math.max(elapsed, 0), 12);
}

/** Convierte un índice 1-12 del año de servicio (1=sep) al mes calendario 1-12. */
function serviceYearCalendarMonth(startMonth: number, index: number): number {
  return ((startMonth - 1 + index - 1) % 12) + 1;
}

/** Determina si un mes calendario pertenece al periodo activo de un auxiliar. */
function isActiveMonth(calendarMonth: number, config: AuxiliaryGoalConfig): boolean {
  if (config.permanent) {
    return true;
  }
  if (config.startMonth === undefined || config.endMonth === undefined) {
    return true;
  }
  if (config.startMonth <= config.endMonth) {
    return calendarMonth >= config.startMonth && calendarMonth <= config.endMonth;
  }
  // Periodo que cruza el límite de año (ej. nov→mar)
  return calendarMonth >= config.startMonth || calendarMonth <= config.endMonth;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Determina el estado respecto al objetivo, usando el margen 560/600 como proporción. */
function computeStatus(projection: number, target: number): GoalStatus {
  const margin = target * (REGULAR_GOAL_MARGIN / REGULAR_GOAL_TARGET);
  if (projection >= target) {
    return 'on-track';
  }
  if (projection >= margin) {
    return 'behind-in-margin';
  }
  return 'out-of-margin';
}

export function getServiceYear(date: Date): ServiceYear {
  const month = date.getMonth() + 1;
  const startYear = month >= 9 ? date.getFullYear() : date.getFullYear() - 1;
  return {
    year: startYear + 1,
    startMonth: 9,
    startYear,
    endMonth: 8,
    endYear: startYear + 1,
  };
}

/** Retorna la meta mensual para un objetivo auxiliar. */
export function computeMonthlyTarget(config: AuxiliaryGoalConfig): number {
  return config.monthlyTarget;
}

export function computeRegularGoalProgress(
  config: RegularGoalConfig,
  accumulated: number,
  currentDate: Date,
): GoalProgress {
  const sy = buildServiceYearFromYear(config.serviceYear);
  const elapsed = monthsElapsedInServiceYear(sy, currentDate);
  const projection = elapsed === 0 ? 0 : (accumulated / elapsed) * 12;
  return {
    accumulatedHours: accumulated,
    projectedHours: round2(projection),
    targetHours: REGULAR_GOAL_TARGET,
    status: computeStatus(projection, REGULAR_GOAL_TARGET),
    monthsElapsed: elapsed,
  };
}

export function computeAuxiliaryGoalProgress(
  config: AuxiliaryGoalConfig,
  accumulated: number,
  currentDate: Date,
): GoalProgress {
  const sy = buildServiceYearFromYear(config.serviceYear);
  const totalElapsed = monthsElapsedInServiceYear(sy, currentDate);

  let totalActiveMonths = 0;
  let activeMonthsElapsed = 0;

  for (let i = 1; i <= 12; i++) {
    const calMonth = serviceYearCalendarMonth(sy.startMonth, i);
    if (isActiveMonth(calMonth, config)) {
      totalActiveMonths++;
    }
  }

  for (let i = 1; i <= totalElapsed; i++) {
    const calMonth = serviceYearCalendarMonth(sy.startMonth, i);
    if (isActiveMonth(calMonth, config)) {
      activeMonthsElapsed++;
    }
  }

  const target = totalActiveMonths * config.monthlyTarget;
  const projection =
    activeMonthsElapsed === 0 ? 0 : (accumulated / activeMonthsElapsed) * totalActiveMonths;

  return {
    accumulatedHours: accumulated,
    projectedHours: round2(projection),
    targetHours: target,
    status: computeStatus(projection, target),
    monthsElapsed: totalElapsed,
    activeMonthsElapsed,
  };
}

/** Despacha al calculador correcto según el tipo de configuración. */
export function computeGoalProgress(
  config: GoalConfig,
  hours: number,
  date: Date,
): GoalProgress {
  if (config.type === 'regular') {
    return computeRegularGoalProgress(config, hours, date);
  }
  return computeAuxiliaryGoalProgress(config, hours, date);
}
