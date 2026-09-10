import { Injectable, signal } from '@angular/core';
import { WeekDay } from '../../shared/domain/week-day.model';

const STORAGE_KEY = 'week-start';
const DEFAULT_WEEK_DAY: WeekDay = 'monday';
const VALID_WEEK_DAYS: readonly WeekDay[] = ['monday', 'sunday', 'saturday'];

/**
 * Mapea cada WeekDay al índice usado por `Date.prototype.getDay()`
 * (0 = domingo ... 6 = sábado). Se exporta para que los calendarios
 * consumidores (TimeEntryCalendarComponent, futuro PlanningComponent)
 * reordenen sus columnas sin duplicar esta tabla.
 */
export const WEEK_DAY_INDEX: Readonly<Record<WeekDay, number>> = {
  sunday: 0,
  monday: 1,
  saturday: 6,
};

function isWeekDay(value: string | null): value is WeekDay {
  return value !== null && (VALID_WEEK_DAYS as readonly string[]).includes(value);
}

@Injectable({ providedIn: 'root' })
export class WeekStartService {
  private readonly _weekStart = signal<WeekDay>(DEFAULT_WEEK_DAY);

  readonly weekStart = this._weekStart.asReadonly();

  constructor() {
    this._load();
  }

  setWeekStart(day: WeekDay): void {
    this._weekStart.set(day);
    localStorage.setItem(STORAGE_KEY, day);
  }

  private _load(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    this._weekStart.set(isWeekDay(stored) ? stored : DEFAULT_WEEK_DAY);
  }
}
