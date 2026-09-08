import {
  Component,
  Inject,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoalsFacade } from '../../../facade/goals.facade';
import {
  Goal,
  GoalConfig,
  AuxiliaryGoalConfig,
  RegularGoalConfig,
} from '../../../domain/models';

interface DialogData {
  existingGoal?: Goal;
}

interface MonthOption {
  value: number;
  label: string;
}

@Component({
  selector: 'ma-goal-config',
  standalone: false,
  templateUrl: './goal-config.component.html',
  styleUrl: './goal-config.component.scss',
})
export class GoalConfigComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(GoalsFacade);
  protected readonly dialogRef = inject(MatDialogRef<GoalConfigComponent>);
  protected readonly dialogData = inject(MAT_DIALOG_DATA) as DialogData;

  // Month options for selectors
  readonly months: MonthOption[] = [
    { value: 1, label: 'common.months.january' },
    { value: 2, label: 'common.months.february' },
    { value: 3, label: 'common.months.march' },
    { value: 4, label: 'common.months.april' },
    { value: 5, label: 'common.months.may' },
    { value: 6, label: 'common.months.june' },
    { value: 7, label: 'common.months.july' },
    { value: 8, label: 'common.months.august' },
    { value: 9, label: 'common.months.september' },
    { value: 10, label: 'common.months.october' },
    { value: 11, label: 'common.months.november' },
    { value: 12, label: 'common.months.december' },
  ];

  // Available service years (current + next 2-3 years)
  readonly availableServiceYears = computed(() => {
    const currentServiceYear = this.facade.currentServiceYear();
    const current = currentServiceYear.year;
    return [current, current + 1, current + 2];
  });

  // Reactive form with form-level validation
  readonly configForm: FormGroup = this.fb.group(
    {
      type: new FormControl<'regular' | 'auxiliary'>('regular', [
        Validators.required,
      ]),
      serviceYear: new FormControl<number>(
        this.facade.currentServiceYear().year,
        [Validators.required, Validators.min(2026)],
      ),
      monthlyTarget: new FormControl<15 | 30>(15, Validators.required),
      permanent: new FormControl<boolean>(true, Validators.required),
      startMonth: new FormControl<number | null>(null),
      endMonth: new FormControl<number | null>(null),
    },
    {
      validators: this.monthRangeValidator.bind(this),
    },
  );

  constructor() {
    // Pre-populate with existing goal if provided
    if (this.dialogData.existingGoal) {
      this.populateFormWithExistingGoal(this.dialogData.existingGoal);
    }
  }

  /**
   * Populates the form with an existing goal's configuration.
   */
  private populateFormWithExistingGoal(goal: Goal): void {
    const config = goal.config;

    this.configForm.patchValue({
      type: config.type,
      serviceYear: config.serviceYear,
    });

    if (config.type === 'auxiliary') {
      this.configForm.patchValue({
        monthlyTarget: config.monthlyTarget,
        permanent: config.permanent,
        startMonth: config.startMonth ?? null,
        endMonth: config.endMonth ?? null,
      });
    }
  }

  /**
   * Handles goal type change:
   * - Regular: clears auxiliary-specific fields, enables serviceYear
   * - Auxiliary: disables serviceYear if it wasn't explicitly set
   */
  protected onTypeChange(type: string): void {
    const typeControl = this.configForm.get('type');
    if (!typeControl) return;

    if (type === 'regular') {
      // Regular goal: set default service year
      this.configForm.patchValue({
        serviceYear: this.facade.currentServiceYear().year,
      });
      // Ensure serviceYear is enabled and required
      const serviceYearControl = this.configForm.get('serviceYear');
      serviceYearControl?.setValidators([
        Validators.required,
        Validators.min(2026),
      ]);
      serviceYearControl?.updateValueAndValidity({ emitEvent: false });

      // Clear auxiliary fields
      this.configForm.patchValue({
        monthlyTarget: 15,
        permanent: true,
        startMonth: null,
        endMonth: null,
      });
    } else if (type === 'auxiliary') {
      // Auxiliary goal: serviceYear can be any year ≥ current
      const serviceYearControl = this.configForm.get('serviceYear');
      serviceYearControl?.setValidators([
        Validators.required,
        Validators.min(2026),
      ]);
      serviceYearControl?.updateValueAndValidity({ emitEvent: false });
    }

    this.configForm.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Handles permanent toggle for auxiliary goals:
   * - permanent=true: hides month range, clears validators
   * - permanent=false: shows month range, requires start/end month
   */
  protected onPermanentToggle(permanent: boolean): void {
    const startMonthControl = this.configForm.get('startMonth');
    const endMonthControl = this.configForm.get('endMonth');

    if (!startMonthControl || !endMonthControl) return;

    if (permanent) {
      // Permanent: no need for month range
      startMonthControl.clearValidators();
      endMonthControl.clearValidators();
      startMonthControl.patchValue(null, { emitEvent: false });
      endMonthControl.patchValue(null, { emitEvent: false });
    } else {
      // Date range: month fields are required
      startMonthControl.setValidators(Validators.required);
      endMonthControl.setValidators(Validators.required);
    }

    startMonthControl.updateValueAndValidity({ emitEvent: false });
    endMonthControl.updateValueAndValidity({ emitEvent: false });
    this.configForm.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Custom form-level validator for month range in auxiliary goals.
   * - If auxiliary + not permanent, validates that start and end months are present.
   * - Allows wrap-around (e.g., Nov → Feb) — the interval is valid.
   */
  private monthRangeValidator(
    group: AbstractControl,
  ): ValidationErrors | null {
    const type = group.get('type')?.value;
    const permanent = group.get('permanent')?.value;
    const startMonth = group.get('startMonth')?.value;
    const endMonth = group.get('endMonth')?.value;

    // Only applies to auxiliary goals with date range
    if (type !== 'auxiliary' || permanent) {
      return null;
    }

    // Both months must be present
    if (!startMonth || !endMonth) {
      return { monthRangeRequired: true };
    }

    // Valid month range (wrap-around is allowed)
    return null;
  }

  /**
   * Submits the form by extracting the form value and closing the dialog.
   * The component does NOT persist — the caller (GoalsComponent) will call setGoal().
   */
  protected onSubmit(): void {
    if (!this.configForm.invalid) {
      const formValue = this.configForm.getRawValue();
      const config: GoalConfig = this.buildGoalConfig(formValue);
      const goal: Goal = {
        id: 'active',
        config,
        active: true,
      };
      this.dialogRef.close(goal);
    }
  }

  /**
   * Builds the GoalConfig object based on the form's current type.
   */
  private buildGoalConfig(formValue: {
    type: 'regular' | 'auxiliary';
    serviceYear: number;
    monthlyTarget?: 15 | 30;
    permanent?: boolean;
    startMonth?: number | null;
    endMonth?: number | null;
  }): GoalConfig {
    if (formValue.type === 'regular') {
      const config: RegularGoalConfig = {
        type: 'regular',
        serviceYear: formValue.serviceYear,
      };
      return config;
    } else {
      const config: AuxiliaryGoalConfig = {
        type: 'auxiliary',
        serviceYear: formValue.serviceYear,
        monthlyTarget: formValue.monthlyTarget || 15,
        permanent: formValue.permanent ?? true,
        startMonth:
          formValue.permanent === false ? formValue.startMonth ?? undefined : undefined,
        endMonth:
          formValue.permanent === false ? formValue.endMonth ?? undefined : undefined,
      };
      return config;
    }
  }

  /**
   * Closes the dialog without persisting.
   */
  protected onCancel(): void {
    this.dialogRef.close(undefined);
  }

  get isAuxiliaryMode(): boolean {
    return this.configForm.get('type')?.value === 'auxiliary';
  }

  get showMonthRange(): boolean {
    return this.isAuxiliaryMode && this.configForm.get('permanent')?.value === false;
  }
}
