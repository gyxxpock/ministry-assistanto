import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeEntryFacade } from '../facade/time-entry.facade';
import { TimeEntry } from '../domain/models';

@Component({
  selector: 'ma-time-entry-edit-dialog',
  templateUrl: './time-entry-edit-dialog.component.html',
  standalone: false
})

export class TimeEntryEditDialogComponent {

  entry: TimeEntry;

  constructor(
    private facade: TimeEntryFacade,
    private dialogRef: MatDialogRef<TimeEntryEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { entry: TimeEntry }
  ) {
    // clonamos para no mutar hasta guardar
    this.entry = { ...data.entry };
  }

  async save() {
    await this.facade.updateEntry(this.entry);
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }
}