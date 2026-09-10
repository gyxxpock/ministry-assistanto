/**
 * Horario semanal base: horas decimales planeadas para cada día de la semana.
 * Las claves son días ISO fijos (lunes..domingo) — NO dependen de qué día
 * se considera "inicio de semana" en la UI. 0 = sin plan ese día.
 */
export interface WeeklySchedule {
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

/**
 * Excepción/personalización del plan para una fecha ISO concreta (YYYY-MM-DD).
 * Si existe un DayPlan para una fecha, sus horas prevalecen sobre el valor
 * correspondiente en WeeklySchedule para ese día de semana.
 */
export interface DayPlan {
  date: string; // ISO 'YYYY-MM-DD'
  hours: number;
}

/** Dato agregado por mes calendario para el bar chart mensual (Plan UX 1). */
export interface MonthlyBar {
  year: number;   // año calendario del mes, p.ej. 2026
  month: number;  // mes calendario 1-12
  plannedHours: number;
  actualHours: number;
}

/**
 * Suficiencia de la planeación respecto al objetivo activo:
 * - 'sufficient': el total planeado alcanza o supera el target.
 * - 'within-margin': no alcanza el target pero sí el margen (560/600 proporcional).
 * - 'insufficient': ni siquiera alcanza el margen.
 */
export type PlanningProjectionStatus = 'sufficient' | 'within-margin' | 'insufficient';

/** Proyección de horas planeadas para el periodo del objetivo activo. */
export interface PlanningProjection {
  totalPlanned: number;
  monthlyBars: MonthlyBar[];
  status: PlanningProjectionStatus;
}
