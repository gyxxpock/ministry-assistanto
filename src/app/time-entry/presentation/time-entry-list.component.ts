import { Component, OnInit, computed } from '@angular/core';
import { TimeEntryFacade } from '../facade/time-entry.facade';
import { MatDialog } from '@angular/material/dialog';
import { TimeEntryEditDialogComponent } from './time-entry-edit-dialog.component';
import { TimeEntryVM } from './models/time-entry.vm';

@Component({
  selector: 'ma-time-entry-list',
  templateUrl: './time-entry-list.component.html',
  styleUrls: ['./time-entry-list.component.scss'],
  standalone: false
})
export class TimeEntryListComponent implements OnInit {

  /**
   * Agrupa las entradas por día para la vista
   */
  groupedEntries = computed(() => {
    const entries = this.facade.entries();

    const map = new Map<string, TimeEntryVM[]>();

    for (const entry of entries) {
      if (!map.has(entry.date)) {
        map.set(entry.date, []);
      }
      map.get(entry.date)!.push(entry);
    }

    return Array.from(map.entries()).map(([date, entries]) => ({
      date,
      entries
    }));
  });

  constructor(
    public facade: TimeEntryFacade,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.facade.loadMonth();
  }

  editEntry(entry: TimeEntryVM) {
    this.dialog.open(TimeEntryEditDialogComponent, {
      width: '400px',
      data: { entry }
    });
  }

  async downloadJson() { }
  async downloadCsv() { }
  async onImport(_: Event) { }
}