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
});
