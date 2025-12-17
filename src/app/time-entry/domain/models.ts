export type TimeEntryType = 'preaching' | 'study' | 'visiting' | 'other';

export interface TimeEntry {
  id: string;
  date: string; // ISO date: yyyy-mm-dd or full ISO string
  durationMinutes: number; // positive integer minutes
  type: TimeEntryType;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  deviceId?: string; // for sync provenance
  source?: 'local' | 'sync';
}

export interface CourseVisit {
  id: string;
  date: string; // ISO date
  durationMinutes: number; // positive integer minutes
  personId?: string; // optional unique person identifier
  personName?: string; // fallback for dedup when personId is not available
  courseId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  deviceId?: string;
  source?: 'local' | 'sync';
}

export interface Person {
  id: string;
  name: string;
  contact?: string;
}
