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

/** Meses transcurridos desde el inicio del año de servicio, inclusive, sin acotar (puede ser <=0 o >12). */
function rawMonthsElapsedInServiceYear(sy: ServiceYear, currentDate: Date): number {
  const cy = currentDate.getFullYear();
  const cm = currentDate.getMonth() + 1;
  return (cy * 12 + cm) - (sy.startYear * 12 + sy.startMonth) + 1;
}

/** Meses transcurridos desde el inicio del año de servicio, inclusive. Rango [0, 12]. */
function monthsElapsedInServiceYear(sy: ServiceYear, currentDate: Date): number {
  return Math.min(Math.max(rawMonthsElapsedInServiceYear(sy, currentDate), 0), 12);
}

/** Fracción del mes calendario en curso ya transcurrida (día actual / días del mes). */
function currentMonthDayFraction(currentDate: Date): number {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  return currentDate.getDate() / daysInMonth;
}

/** Convierte un índice 1-12 del año de servicio (1=sep) al mes calendario 1-12. */
function serviceYearCalendarMonth(startMonth: number, index: number): number {
  return ((startMonth - 1 + index - 1) % 12) + 1;
}

/** Determina si un mes calendario cae dentro de un rango [startMonth, endMonth], con wrap de año. */
function isMonthInRange(calendarMonth: number, startMonth: number, endMonth: number): boolean {
  if (startMonth <= endMonth) {
    return calendarMonth >= startMonth && calendarMonth <= endMonth;
  }
  // Periodo que cruza el límite de año (ej. nov→mar)
  return calendarMonth >= startMonth || calendarMonth <= endMonth;
}

/** Determina si un mes calendario pertenece al periodo activo de un auxiliar. */
export function isActiveMonth(calendarMonth: number, config: AuxiliaryGoalConfig): boolean {
  if (config.permanent) {
    return true;
  }
  if (config.startMonth === undefined || config.endMonth === undefined) {
    return true;
  }
  return isMonthInRange(calendarMonth, config.startMonth, config.endMonth);
}

/** Cuenta meses totales/activos/activos-transcurridos del año de servicio según un predicado de actividad. */
function countActiveMonths(
  sy: ServiceYear,
  currentDate: Date,
  isActive: (calendarMonth: number) => boolean,
): { totalElapsed: number; totalActiveMonths: number; activeMonthsElapsed: number } {
  const totalElapsed = monthsElapsedInServiceYear(sy, currentDate);
  const rawElapsed = rawMonthsElapsedInServiceYear(sy, currentDate);
  // El mes en curso (si cae dentro del año de servicio) se prorratea por día en vez de contar 100%.
  const inProgressIndex = rawElapsed >= 1 && rawElapsed <= 12 ? rawElapsed : null;
  const inProgressFraction = inProgressIndex !== null ? currentMonthDayFraction(currentDate) : 0;

  let totalActiveMonths = 0;
  let activeMonthsElapsed = 0;

  for (let i = 1; i <= 12; i++) {
    const calMonth = serviceYearCalendarMonth(sy.startMonth, i);
    if (isActive(calMonth)) {
      totalActiveMonths++;
    }
  }

  for (let i = 1; i <= totalElapsed; i++) {
    const calMonth = serviceYearCalendarMonth(sy.startMonth, i);
    if (isActive(calMonth)) {
      activeMonthsElapsed += i === inProgressIndex ? inProgressFraction : 1;
    }
  }

  return { totalElapsed, totalActiveMonths, activeMonthsElapsed };
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

/** Retorna el mes calendario actual (1-12). */
function currentCalendarMonth(date: Date): number {
  return date.getMonth() + 1;
}

/** Calcula la meta mensual para un objetivo regular: 600 / 12. */
function computeRegularMonthlyTarget(): number {
  return round2(REGULAR_GOAL_TARGET / 12);
}

/** Retorna la meta mensual para un objetivo auxiliar. */
export function computeMonthlyTarget(config: AuxiliaryGoalConfig): number {
  return config.monthlyTarget;
}

export function computeRegularGoalProgress(
  config: RegularGoalConfig,
  accumulated: number,
  currentDate: Date,
  monthlyAccumulated: number = 0,
): GoalProgress {
  const sy = buildServiceYearFromYear(config.serviceYear);
  const isActive = (calendarMonth: number): boolean =>
    config.startMonth === undefined ? true : isMonthInRange(calendarMonth, config.startMonth, 8);
  const { totalElapsed, totalActiveMonths, activeMonthsElapsed } = countActiveMonths(sy, currentDate, isActive);

  const monthlyTarget = computeRegularMonthlyTarget();
  const targetHours = round2(totalActiveMonths * monthlyTarget);
  const projection =
    activeMonthsElapsed === 0 ? 0 : (accumulated / activeMonthsElapsed) * totalActiveMonths;

  const monthlyProgress = monthlyTarget === 0 ? 0 : round2((monthlyAccumulated / monthlyTarget) * 100);

  const targetToDate = totalActiveMonths === 0 ? 0 : round2(targetHours * activeMonthsElapsed / totalActiveMonths);
  const hoursDifference = round2(accumulated - targetToDate);

  return {
    accumulatedHours: accumulated,
    projectedHours: round2(projection),
    targetHours,
    status: computeStatus(projection, targetHours),
    monthsElapsed: totalElapsed,
    activeMonthsElapsed: round2(activeMonthsElapsed),
    totalActiveMonths,
    targetToDate,
    hoursDifference,
    monthlyAccumulated,
    monthlyTarget,
    monthlyProgress,
  };
}

export function computeAuxiliaryGoalProgress(
  config: AuxiliaryGoalConfig,
  accumulated: number,
  currentDate: Date,
  monthlyAccumulated: number = 0,
): GoalProgress {
  const sy = buildServiceYearFromYear(config.serviceYear);
  const currentMonth = currentCalendarMonth(currentDate);

  const { totalElapsed, totalActiveMonths, activeMonthsElapsed } = countActiveMonths(
    sy,
    currentDate,
    (calMonth) => isActiveMonth(calMonth, config),
  );

  const target = totalActiveMonths * config.monthlyTarget;
  const projection =
    activeMonthsElapsed === 0 ? 0 : (accumulated / activeMonthsElapsed) * totalActiveMonths;

  // Monthly metrics: only if current month is active
  const monthlyTarget = isActiveMonth(currentMonth, config) ? config.monthlyTarget : 0;
  const monthlyProgress = monthlyTarget === 0 ? 0 : round2((monthlyAccumulated / monthlyTarget) * 100);

  const targetToDate = totalActiveMonths === 0 ? 0 : round2(target * activeMonthsElapsed / totalActiveMonths);
  const hoursDifference = round2(accumulated - targetToDate);

  return {
    accumulatedHours: accumulated,
    projectedHours: round2(projection),
    targetHours: target,
    status: computeStatus(projection, target),
    monthsElapsed: totalElapsed,
    activeMonthsElapsed: round2(activeMonthsElapsed),
    totalActiveMonths,
    targetToDate,
    hoursDifference,
    monthlyAccumulated,
    monthlyTarget,
    monthlyProgress,
  };
}

/** Despacha al calculador correcto según el tipo de configuración. */
export function computeGoalProgress(
  config: GoalConfig,
  hours: number,
  date: Date,
  monthlyAccumulated: number = 0,
): GoalProgress {
  if (config.type === 'regular') {
    return computeRegularGoalProgress(config, hours, date, monthlyAccumulated);
  }
  return computeAuxiliaryGoalProgress(config, hours, date, monthlyAccumulated);
}
