import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { CreateTimeEntryVM, TimeEntryVM, UpdateTimeEntryVM } from '../../models/time-entry.vm';

@Component({
  selector: 'ma-time-entry-edit-dialog',
  templateUrl: './time-entry-edit-dialog.component.html',
  standalone: false,
})
export class TimeEntryEditDialogComponent implements OnInit {
  entry: TimeEntryVM | undefined;
  isEditMode = false;

  constructor(
    private facade: TimeEntryFacade,
    private dialogRef: MatDialogRef<TimeEntryEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data?: { entry: TimeEntryVM }
  ) {
    if (data?.entry) {
      this.isEditMode = true;
      this.entry = data.entry;
    }
  }

  ngOnInit(): void {}

  async onSave(vm: CreateTimeEntryVM | UpdateTimeEntryVM) {
    if (this.isEditMode) {
      await this.facade.updateEntry(vm as UpdateTimeEntryVM);
    } else {
      await this.facade.addEntry(vm as CreateTimeEntryVM);
    }
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}