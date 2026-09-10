import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GoalConfigComponent } from './goal-config.component';
import { GoalsFacade } from '../../../facade/goals.facade';
import { Goal } from '../../../domain/models';

describe('GoalConfigComponent', () => {
  let component: GoalConfigComponent;
  let fixture: ComponentFixture<GoalConfigComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<GoalConfigComponent>>;
  let mockFacade: jasmine.SpyObj<GoalsFacade>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockFacade = jasmine.createSpyObj('GoalsFacade', [], {
      currentServiceYear: signal({
        year: 2027,
        startMonth: 9,
        startYear: 2026,
        endMonth: 8,
        endYear: 2027,
      }),
    });

    await TestBed.configureTestingModule({
      declarations: [GoalConfigComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatSelectModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatIconModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: GoalsFacade, useValue: mockFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with type=regular', () => {
    expect(component.configForm.get('type')?.value).toBe('regular');
  });

  it('should update validators when type changes to auxiliary', () => {
    (component as any).onTypeChange('auxiliary');

    expect(component.configForm.get('monthlyTarget')?.validator).toBeTruthy();
  });

  it('should validate regular goal type', () => {
    component.configForm.patchValue({
      type: 'regular',
      serviceYear: 2027,
      startMonth: 9,
    });

    expect(component.configForm.valid).toBe(true);
  });

  it('should validate auxiliary permanent goal', () => {
    component.configForm.patchValue({
      type: 'auxiliary',
      monthlyTarget: 30,
      permanent: true,
    });
    // Mirrors the (selectionChange) handler triggered when the user picks
    // the "auxiliary" radio option — clears the startMonth requirement
    // inherited from the regular-goal default.
    (component as any).onTypeChange('auxiliary');

    expect(component.configForm.valid).toBe(true);
  });

  it('should require month range for auxiliary non-permanent goals', () => {
    component.configForm.patchValue({
      type: 'auxiliary',
      monthlyTarget: 15,
      permanent: false,
    });

    (component as any).onPermanentToggle(false);

    expect(component.configForm.get('startMonth')?.hasError('required')).toBe(true);
  });

  it('should close dialog with regular goal config on submit', () => {
    component.configForm.patchValue({
      type: 'regular',
      serviceYear: 2027,
      startMonth: 9,
    });

    (component as any).onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 'active',
        config: jasmine.objectContaining({ type: 'regular', serviceYear: 2027 }),
      })
    );
  });

  it('should close dialog with auxiliary permanent goal config on submit', () => {
    component.configForm.patchValue({
      type: 'auxiliary',
      monthlyTarget: 30,
      permanent: true,
    });
    (component as any).onTypeChange('auxiliary');

    (component as any).onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith(
      jasmine.objectContaining({
        config: jasmine.objectContaining({
          type: 'auxiliary',
          monthlyTarget: 30,
          permanent: true,
        }),
      })
    );
  });

  it('should include month range in auxiliary non-permanent goal config', () => {
    component.configForm.patchValue({
      type: 'auxiliary',
      monthlyTarget: 15,
      permanent: false,
      startMonth: 9,
      endMonth: 3,
    });

    (component as any).onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith(
      jasmine.objectContaining({
        config: jasmine.objectContaining({
          type: 'auxiliary',
          startMonth: 9,
          endMonth: 3,
        }),
      })
    );
  });

  it('should close dialog without result on cancel', () => {
    (component as any).onCancel();

    expect(mockDialogRef.close).toHaveBeenCalledWith(undefined);
  });

  // --- onTypeChange: guard clause and 'regular' branch ---

  it('should no-op onTypeChange when the type control is missing', () => {
    component.configForm.removeControl('type');

    expect(() => (component as any).onTypeChange('regular')).not.toThrow();
  });

  it('should reset auxiliary fields and re-apply regular validators when switching back to regular', () => {
    component.configForm.patchValue({
      type: 'auxiliary',
      monthlyTarget: 30,
      permanent: false,
      startMonth: 5,
      endMonth: 8,
    });
    (component as any).onTypeChange('auxiliary');

    (component as any).onTypeChange('regular');

    expect(component.configForm.get('monthlyTarget')?.value).toBe(15);
    expect(component.configForm.get('permanent')?.value).toBe(true);
    expect(component.configForm.get('startMonth')?.value).toBeNull();
    expect(component.configForm.get('endMonth')?.value).toBeNull();
    expect(component.configForm.get('serviceYear')?.value).toBe(2027);
    expect(component.configForm.get('startMonth')?.hasError('required')).toBe(true);
  });

  // --- onPermanentToggle: guard clause (both sides of the OR) and 'permanent' branch ---

  it('should no-op onPermanentToggle when the startMonth control is missing', () => {
    component.configForm.removeControl('startMonth');

    expect(() => (component as any).onPermanentToggle(true)).not.toThrow();
  });

  it('should no-op onPermanentToggle when the endMonth control is missing', () => {
    component.configForm.removeControl('endMonth');

    expect(() => (component as any).onPermanentToggle(false)).not.toThrow();
  });

  it('should clear month range validators and values when toggled back to permanent', () => {
    component.configForm.patchValue({
      type: 'auxiliary',
      permanent: false,
      startMonth: 9,
      endMonth: 3,
    });
    (component as any).onPermanentToggle(false);

    (component as any).onPermanentToggle(true);

    expect(component.configForm.get('startMonth')?.value).toBeNull();
    expect(component.configForm.get('endMonth')?.value).toBeNull();
    expect(component.configForm.get('startMonth')?.hasError('required')).toBe(false);
    expect(component.configForm.get('endMonth')?.hasError('required')).toBe(false);
  });

  // --- showMonthRange getter ---

  it('should show month range for auxiliary non-permanent goals', () => {
    component.configForm.patchValue({ type: 'auxiliary', permanent: false });

    expect(component.showMonthRange).toBe(true);
  });

  it('should not show month range for auxiliary permanent goals', () => {
    component.configForm.patchValue({ type: 'auxiliary', permanent: true });

    expect(component.showMonthRange).toBe(false);
  });

  it('should not show month range for regular goals regardless of permanent flag', () => {
    component.configForm.patchValue({ type: 'regular', permanent: false });

    expect(component.showMonthRange).toBe(false);
  });

  // --- buildGoalConfig: fallback/ternary branches ---
  // Called directly (bypassing the form) because the form's own validators make some
  // of these raw combinations (e.g. a null startMonth on a "regular" goal) unreachable
  // through onSubmit(); this is the "necesidad" carve-out for touching internals.

  it('should fall back startMonth to undefined for a regular goal when the raw value is null', () => {
    const config = (component as any).buildGoalConfig({
      type: 'regular',
      serviceYear: 2027,
      startMonth: null,
    });

    expect(config.startMonth).toBeUndefined();
  });

  it('should default monthlyTarget to 15 and permanent to true, and null out month range, for a permanent auxiliary goal missing those raw values', () => {
    const config = (component as any).buildGoalConfig({
      type: 'auxiliary',
      serviceYear: 2027,
      monthlyTarget: undefined,
      permanent: undefined,
      startMonth: 5,
      endMonth: 8,
    });

    expect(config.monthlyTarget).toBe(15);
    expect(config.permanent).toBe(true);
    expect(config.startMonth).toBeUndefined();
    expect(config.endMonth).toBeUndefined();
  });

  it('should keep startMonth/endMonth for a non-permanent auxiliary goal when raw values are present', () => {
    const config = (component as any).buildGoalConfig({
      type: 'auxiliary',
      serviceYear: 2027,
      monthlyTarget: 15,
      permanent: false,
      startMonth: 9,
      endMonth: 3,
    });

    expect(config.startMonth).toBe(9);
    expect(config.endMonth).toBe(3);
  });

  it('should fall back startMonth/endMonth to undefined for a non-permanent auxiliary goal when raw values are missing', () => {
    const config = (component as any).buildGoalConfig({
      type: 'auxiliary',
      serviceYear: 2027,
      monthlyTarget: 15,
      permanent: false,
      startMonth: undefined,
      endMonth: undefined,
    });

    expect(config.startMonth).toBeUndefined();
    expect(config.endMonth).toBeUndefined();
  });
});

describe('GoalConfigComponent — populateFormWithExistingGoal (constructor)', () => {
  function setupWithDialogData(dialogData: { existingGoal?: Goal }) {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    const mockFacade = jasmine.createSpyObj('GoalsFacade', [], {
      currentServiceYear: signal({
        year: 2027,
        startMonth: 9,
        startYear: 2026,
        endMonth: 8,
        endYear: 2027,
      }),
    });

    TestBed.configureTestingModule({
      declarations: [GoalConfigComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatSelectModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatIconModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: GoalsFacade, useValue: mockFacade },
      ],
    });

    const fixture = TestBed.createComponent(GoalConfigComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { component, fixture };
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should populate the form from an existing regular goal', () => {
    const existingGoal: Goal = {
      id: 'active',
      active: true,
      config: { type: 'regular', serviceYear: 2026, startMonth: 3 },
    };

    const { component } = setupWithDialogData({ existingGoal });

    expect(component.configForm.get('type')?.value).toBe('regular');
    expect(component.configForm.get('serviceYear')?.value).toBe(2026);
    expect(component.configForm.get('startMonth')?.value).toBe(3);
  });

  it('should default startMonth to null for an existing regular goal without startMonth', () => {
    const existingGoal: Goal = {
      id: 'active',
      active: true,
      config: { type: 'regular', serviceYear: 2026 },
    };

    const { component } = setupWithDialogData({ existingGoal });

    expect(component.configForm.get('startMonth')?.value).toBeNull();
  });

  it('should populate the form from an existing auxiliary goal', () => {
    const existingGoal: Goal = {
      id: 'active',
      active: true,
      config: {
        type: 'auxiliary',
        serviceYear: 2026,
        monthlyTarget: 30,
        permanent: false,
        startMonth: 9,
        endMonth: 3,
      },
    };

    const { component } = setupWithDialogData({ existingGoal });

    expect(component.configForm.get('type')?.value).toBe('auxiliary');
    expect(component.configForm.get('serviceYear')?.value).toBe(2026);
    expect(component.configForm.get('monthlyTarget')?.value).toBe(30);
    expect(component.configForm.get('permanent')?.value).toBe(false);
    expect(component.configForm.get('startMonth')?.value).toBe(9);
    expect(component.configForm.get('endMonth')?.value).toBe(3);
  });

  it('should default startMonth/endMonth to null for an existing permanent auxiliary goal without month range', () => {
    const existingGoal: Goal = {
      id: 'active',
      active: true,
      config: {
        type: 'auxiliary',
        serviceYear: 2026,
        monthlyTarget: 15,
        permanent: true,
      },
    };

    const { component } = setupWithDialogData({ existingGoal });

    expect(component.configForm.get('startMonth')?.value).toBeNull();
    expect(component.configForm.get('endMonth')?.value).toBeNull();
  });

  it('should not pre-populate the form when no existing goal is provided', () => {
    const { component } = setupWithDialogData({});

    expect(component.configForm.get('type')?.value).toBe('regular');
    expect(component.configForm.get('startMonth')?.value).toBeNull();
  });
});
