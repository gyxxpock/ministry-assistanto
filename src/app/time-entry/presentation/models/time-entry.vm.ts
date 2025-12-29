import { TimeEntryType } from "../../domain/models";

export type TimeEntryTypeVM = TimeEntryType;

export interface TimeEntryVM {
    id: string;
    date: string;
    minutes: number;
    typeLabel: string;
}

export interface CreateTimeEntryVM {
    date: string;
    minutes: number;
    type: 'preaching' | 'study' | 'visiting' | 'other';
}