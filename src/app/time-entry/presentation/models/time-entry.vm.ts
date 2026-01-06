import { TimeEntryType } from '../../domain/models';

export type TimeEntryTypeVM = TimeEntryType;

export interface TimeEntryVM {
  id: string;
  date: Date; // ISO date: yyyy-mm-dd
  durationMinutes: number;
  type: TimeEntryType;
  notes?: string;
  typeLabel: string; // This is a derived property for the view
}

export interface CreateTimeEntryVM {
  date: Date; // ISO date: yyyy-mm-dd
  durationMinutes: number;
  type: TimeEntryType;
  notes?: string;
}

export type UpdateTimeEntryVM = { id: string } & Partial<CreateTimeEntryVM>;