import { Injectable } from '@angular/core';
import { TimeEntry, CourseVisit } from '../domain/models';

export function toCSV(entries: TimeEntry[], visits: CourseVisit[]): string {
  const rows: string[] = [];
  const header = ['entity', 'id', 'date', 'durationMinutes', 'type_or_person', 'notes'];
  rows.push(header.join(','));

  for (const e of entries) {
    rows.push([
      'entry',
      e.id,
      e.date,
      String(e.durationMinutes),
      e.type,
      JSON.stringify(e.notes || '')
    ].join(','));
  }

  for (const v of visits) {
    rows.push([
      'visit',
      v.id,
      v.date,
      String(v.durationMinutes),
      v.personId ?? v.personName ?? '',
      JSON.stringify(v.notes || '')
    ].join(','));
  }

  return rows.join('\n');
}

@Injectable({ providedIn: 'root' })
export class TimeEntryExporter {
  toCSV(entries: TimeEntry[], visits: CourseVisit[]) {
    return toCSV(entries, visits);
  }
}

export default TimeEntryExporter;
