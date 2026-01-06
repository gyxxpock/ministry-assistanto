import {
  Component,
  ChangeDetectionStrategy,
  inject,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  CreateTimeEntryVM,
  TimeEntryTypeVM,
  TimeEntryVM,
  UpdateTimeEntryVM,
} from '../../models/time-entry.vm';

@Component({
  selector: 'ma-time-entry-form',
  templateUrl: './time-entry-form.component.html',
  styleUrls: ['./time-entry-form.component.scss'],
  standalone: false, // This will be part of a module
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeEntryFormComponent implements OnInit {
  @Input() entry: TimeEntryVM | undefined;
  @Output() save = new EventEmitter<CreateTimeEntryVM | UpdateTimeEntryVM>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  isEditMode = false;

  readonly presets = [60, 90, 120, 150, 180, 240];
  readonly types: TimeEntryTypeVM[] = ['preaching', 'study', 'visiting', 'other'];

  readonly form = this.fb.nonNullable.group({
    date: [new Date(), Validators.required],
    type: ['preaching' as TimeEntryTypeVM, Validators.required],
    durationMinutes: [15, [Validators.required, Validators.min(1)]],
    notes: [''],
  });

  ngOnInit(): void {
    if (this.entry) {
      this.isEditMode = true;
      this.form.patchValue(this.entry);
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    if (this.isEditMode && this.entry) {
      this.emitUpdateChanges();
    } else {
      this.emitCreate();
    }
  }

  private emitCreate() {
    this.save.emit(this.form.getRawValue() as CreateTimeEntryVM);
  }

  private emitUpdateChanges() {
    const changes: Partial<CreateTimeEntryVM> = {};
    const controls = this.form.controls;

    for (const key in controls) {
      const control = controls[key as keyof typeof controls];
      if (control.dirty) {
        (changes as any)[key] = control.value;
      }
    }

    if (Object.keys(changes).length > 0) {
      this.save.emit({ id: this.entry!.id, ...changes });
    } else {
      // Nothing to save, can just close
      this.cancel.emit();
    }
  }

  setPreset(minutes: number): void {
    this.form.controls.durationMinutes.setValue(minutes);
    this.form.controls.durationMinutes.markAsDirty();
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}