import { Component, Input } from '@angular/core';
import { TimeEntry } from '../domain/models';

@Component({
  selector: 'ma-time-entry-day',
  styleUrls: ['./time-entry-day.component.scss'],
  template: `
    <mat-card class="day-card">
      <mat-card-title>{{ date }}</mat-card-title>

      <mat-list>
        <mat-list-item *ngFor="let e of entries">
          {{ e.durationMinutes }} min — {{ e.type }}
        </mat-list-item>
      </mat-list>
    </mat-card>
  `,
  standalone: false
})
export class TimeEntryDayComponent {
  @Input() date = '';
  @Input() entries: TimeEntry[] = [];
}