import { Component, OnInit } from '@angular/core';
import TimeEntryFacade from '../facade/time-entry.facade';

@Component({
  selector: 'ma-time-entry-list',
  templateUrl: './time-entry-list.component.html',
  styleUrls: ['./time-entry-list.component.scss'],
  standalone: false
})
export class TimeEntryListComponent implements OnInit {
  constructor(public facade: TimeEntryFacade) {}

  ngOnInit(): void {
    this.facade.loadMonth();
  }

  async downloadJson() {
    const json = await this.facade.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ministry-assistanto-data-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async downloadCsv() {
    const csv = await this.facade.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ministry-assistanto-data-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async onImport(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    const file = input.files[0];
    const text = await file.text();
    await this.facade.importJSON(text);
    // clear input
    input.value = '';
  }
}
