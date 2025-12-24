import { TimeEntry, CourseVisit } from '../domain/models';

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