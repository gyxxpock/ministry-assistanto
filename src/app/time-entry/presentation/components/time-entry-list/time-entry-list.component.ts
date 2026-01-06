import { Component, computed, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { TimeEntryEditDialogComponent } from '../time-entry-edit/time-entry-edit-dialog.component';
import { TimeEntryVM } from '../../models/time-entry.vm';

@Component({
  selector: 'ma-time-entry-list',
  templateUrl: './time-entry-list.component.html',
  styleUrls: ['./time-entry-list.component.scss'],
  standalone: false,
})
export class TimeEntryListComponent implements OnInit {
  currentDate = signal(new Date());
  today = new Date();

  private toKey(date: Date | string): string {
    const d = new Date(date);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  /**
   * Groups entries by day for the view.
   */
  groupedEntries = computed(() => {
    const entries = this.facade.entries();
    const map = new Map<string, TimeEntryVM[]>();
    
    for (const entry of entries) {
      if (!map.has(this.toKey(entry.date))) {
        map.set(this.toKey(entry.date), []);
      }
      map.get(this.toKey(entry.date))!.push(entry);
    }

    return Array.from(map.entries()).map(([date, entries]) => ({
      date,
      entries,
    }));
  });

  isCurrentMonth = computed(() => {
    const currentDate = this.currentDate();
    return (
      currentDate.getFullYear() === this.today.getFullYear() &&
      currentDate.getMonth() === this.today.getMonth()
    );
  });

  constructor(public facade: TimeEntryFacade, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.facade.loadMonth(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1);
  }

  prevMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    this.loadData();
  }

  nextMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    this.loadData();
  }

  goToToday(): void {
    this.currentDate.set(new Date());
    this.loadData();
  }

  addEntry(): void {
    this.dialog.open(TimeEntryEditDialogComponent, {
      width: '450px',
    });
  }

  editEntry(entry: TimeEntryVM): void {
    this.dialog.open(TimeEntryEditDialogComponent, {
      width: '450px',
      data: { entry },
    });
  }
}