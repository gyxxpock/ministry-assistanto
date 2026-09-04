import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { CreateTimeEntryVM, TimeEntryVM, UpdateTimeEntryVM } from '../../models/time-entry.vm';

@Component({
  selector: 'ma-time-entry-edit-dialog',
  templateUrl: './time-entry-edit-dialog.component.html',
  styleUrls: ['./time-entry-edit-dialog.component.scss'],
  standalone: false,
})
export class TimeEntryEditDialogComponent implements OnInit {
  entry: TimeEntryVM | undefined;
  initialDate: Date | undefined;
  isEditMode = false;
  showDeleteConfirm = false;

  constructor(
    private facade: TimeEntryFacade,
    private dialogRef: MatDialogRef<TimeEntryEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data?: { entry?: TimeEntryVM; initialDate?: Date }
  ) {
    if (data?.entry) {
      this.isEditMode = true;
      this.entry = data.entry;
    }
    this.initialDate = data?.initialDate;
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

  onDeleteRequest() {
    this.showDeleteConfirm = true;
  }

  onDeleteCancel() {
    this.showDeleteConfirm = false;
  }

  async onDeleteConfirm() {
    await this.facade.removeEntry(this.entry!.id);
    this.dialogRef.close();
  }
}