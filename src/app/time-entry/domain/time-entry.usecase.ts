import { TimeEntry, CourseVisit } from './models';

function normalizeName(name?: string): string | undefined {
  if (!name) return undefined;
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function toKey(date: Date | string): string {
    const d = new Date(date);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

function inMonth(dateStr: string, year: number, month: number): boolean {
  // Handle date-only strings (YYYY-MM-DD) without causing timezone shifts
  const dateOnlyMatch = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(dateStr);
  if (dateOnlyMatch) {
    const y = Number(dateOnlyMatch[1]);
    const m = Number(dateOnlyMatch[2]);
    return y === year && m === month;
  }

  const d = new Date(dateStr);
  return d.getFullYear() === year && d.getMonth() + 1 === month;
}

export interface MonthlyTotals {
  totalMinutes: number;
  totalHours: number; // decimal hours
  totalCourses: number; // unique persons visited in the month
}

/**
 * Compute monthly totals for time entries and course visits.
 * - totalMinutes = sum of positive durations from TimeEntry + CourseVisit in the month
 * - totalCourses = count of unique persons visited in the month (by personId, or normalized personName)
 */
export function computeMonthlyTotals(
  entries: TimeEntry[],
  visits: CourseVisit[],
  year: number,
  month: number,
  manualCourseCount: number = 0
): MonthlyTotals {
  let totalMinutes = 0;

  for (const e of entries) {
    if (!inMonth(toKey(e.date), year, month)) continue;
    if (typeof e.durationMinutes !== 'number' || e.durationMinutes <= 0) continue;
    totalMinutes += Math.floor(e.durationMinutes);
  }

  const personKeys = new Set<string>();

  for (const v of visits) {
    if (!inMonth(toKey(v.date), year, month)) continue;
    if (typeof v.durationMinutes === 'number' && v.durationMinutes > 0) {
      totalMinutes += Math.floor(v.durationMinutes);
    }

    // deduplicate persons: prefer personId, else normalized name, else unique visit id
    const key = v.personId ?? normalizeName(v.personName) ?? `visit:${v.id}`;
    personKeys.add(key);
  }

  const totalVisits = personKeys.size;
  const totalHours = Math.round((totalMinutes / 60) * 100) / 100; // round to 2 decimals

  return { totalMinutes, totalHours, totalCourses: manualCourseCount };
}

export default computeMonthlyTotals;
