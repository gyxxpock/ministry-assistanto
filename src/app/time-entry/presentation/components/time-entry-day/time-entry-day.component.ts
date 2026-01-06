import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeEntryVM } from '../../models/time-entry.vm';

@Component({
  selector: 'ma-time-entry-day',
  templateUrl: './time-entry-day.component.html',
  standalone: false
})
export class TimeEntryDayComponent {
  @Input() date = '';
  @Input() entries: TimeEntryVM[] = [];

  @Output() edit = new EventEmitter<TimeEntryVM>();

  onEdit(entry: TimeEntryVM) {
    this.edit.emit(entry);
  }
}