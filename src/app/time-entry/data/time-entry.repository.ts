import { InjectionToken } from '@angular/core';
import { TimeEntry, CourseVisit } from '../domain/models';

/**
 * Injection token for the TimeEntry repository.
 * This allows swapping implementations (Dexie, API, mocks, etc.)
 * without affecting the domain or presentation layers.
 */
export const TIME_ENTRY_REPOSITORY =
  new InjectionToken<ITimeEntryRepository>('TIME_ENTRY_REPOSITORY');

/**
 * Repository contract for TimeEntry persistence.
 * This is part of the DOMAIN boundary (port).
 */
export interface ITimeEntryRepository {
  listEntriesByMonth(year: number, month: number): Promise<TimeEntry[]>;
  listVisitsByMonth(year: number, month: number): Promise<CourseVisit[]>;
  addEntry(entry: TimeEntry): Promise<void>;
  updateEntry(entry: TimeEntry): Promise<void>;
  removeEntry(id: string): Promise<void>;
  addVisit(visit: CourseVisit): Promise<void>;
  updateVisit(visit: CourseVisit): Promise<void>;
  removeVisit(id: string): Promise<void>;
  exportAll(): Promise<{ entries: TimeEntry[]; visits: CourseVisit[] }>;
  importAll(payload: { entries?: TimeEntry[]; visits?: CourseVisit[] }): Promise<void>;
}