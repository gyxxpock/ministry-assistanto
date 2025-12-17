import { Component, Input } from '@angular/core';
import { TimeEntry } from '../domain/models';

@Component({
  selector: 'ma-time-entry-day',
  template: `
    <div class="day">
      <h4>{{ date }}</h4>
      <ul>
        <li *ngFor="let e of entries">{{ e.durationMinutes }} min — {{ e.type }}</li>
      </ul>
    </div>
  `,
  standalone: false
})
export class TimeEntryDayComponent {
  @Input() date = '';
  @Input() entries: TimeEntry[] = [];
}
