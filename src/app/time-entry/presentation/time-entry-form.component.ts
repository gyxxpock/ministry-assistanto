import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TimeEntryFacade } from '../facade/time-entry.facade';
import { TimeEntryTypeVM } from './models/time-entry.vm';

/**
 * Presentation component.
 * Uses View Models only (no domain entities).
 */
@Component({
  selector: 'ma-time-entry-form',
  templateUrl: './time-entry-form.component.html',
  styleUrls: ['./time-entry-form.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeEntryFormComponent {
  private readonly facade = inject(TimeEntryFacade);
  private readonly fb = inject(FormBuilder);

  /**
   * UX rule:
   * - One numeric field
   * - Fast presets
   * - Large touch targets
   */
  readonly presets = [5, 10, 15, 30, 45, 60];
  readonly types: TimeEntryTypeVM[] = [
    'preaching',
    'study',
    'visiting',
    'other'
  ];

  readonly form = this.fb.nonNullable.group({
    date: [this.today(), Validators.required],
    type: ['entry' as TimeEntryTypeVM, Validators.required],
    minutes: [15, [Validators.required, Validators.min(1)]]
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    const { date, type, minutes } = this.form.getRawValue();

    await this.facade.addEntry({
      date,
      minutes,
      type
    });

    // UX: keep date/type, reset minutes
    this.form.controls.minutes.setValue(15);
  }

  setPreset(minutes: number): void {
    this.form.controls.minutes.setValue(minutes);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}