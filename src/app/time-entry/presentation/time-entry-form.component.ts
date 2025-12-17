import { Component } from '@angular/core';
import TimeEntryFacade from '../facade/time-entry.facade';

@Component({
  selector: 'ma-time-entry-form',
  templateUrl: './time-entry-form.component.html',
  styleUrls: ['./time-entry-form.component.scss'],
  standalone: false
})
export class TimeEntryFormComponent {
  date = '';
  duration = 60;
  type: 'preaching' | 'study' | 'visiting' | 'other' = 'preaching';

  constructor(private facade: TimeEntryFacade) {}

  async submit() {
    if (!this.date) return;
    const id = Math.random().toString(36).slice(2);
    await this.facade.addEntry({ id, date: this.date, durationMinutes: this.duration, type: this.type });
    this.date = '';
  }
}
