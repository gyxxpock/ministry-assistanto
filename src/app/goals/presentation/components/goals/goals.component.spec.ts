import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { signal, WritableSignal } from '@angular/core';
import { of } from 'rxjs';
import { GoalsComponent } from './goals.component';
import { GoalsFacade } from '../../../facade/goals.facade';
import { GoalProgressVisualComponent } from '../goal-progress-visual/goal-progress-visual.component';
import { GoalConfigComponent } from '../goal-config/goal-config.component';
import { Goal, GoalProgress } from '../../../domain/models';

describe('GoalsComponent', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;
  let mockFacade: jasmine.SpyObj<GoalsFacade>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<GoalConfigComponent>>;
  // jasmine.createSpyObj's property setters are no-ops (they don't persist
  // new values), so tests must mutate these signals via .set() instead of
  // reassigning `mockFacade.xxx = signal(...)`.
  let activeGoalSignal: WritableSignal<Goal | null>;
  let goalProgressSignal: WritableSignal<GoalProgress | null>;
  let accumulatedHoursSignal: WritableSignal<number>;

  beforeEach(async () => {
    activeGoalSignal = signal<Goal | null>(null);
    goalProgressSignal = signal<GoalProgress | null>(null);
    accumulatedHoursSignal = signal(0);

    mockFacade = jasmine.createSpyObj('GoalsFacade', ['loadGoal', 'setGoal', 'clearGoal'], {
      activeGoal: activeGoalSignal,
      goalProgress: goalProgressSignal,
      accumulatedHours: accumulatedHoursSignal,
    });

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(undefined));

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialog.open.and.returnValue(mockDialogRef);

    await TestBed.configureTestingModule({
      declarations: [GoalsComponent],
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        TranslateModule.forRoot(),
        GoalProgressVisualComponent,
      ],
      providers: [
        { provide: GoalsFacade, useValue: mockFacade },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadGoal on init', fakeAsync(() => {
    fixture.detectChanges();
    flushMicrotasks();
    expect(mockFacade.loadGoal).toHaveBeenCalledTimes(1);
  }));

  it('should display empty state when no active goal', fakeAsync(() => {
    activeGoalSignal.set(null);
    fixture.detectChanges();
    flushMicrotasks();
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  }));

  it('should display progress when goal is active', fakeAsync(() => {
    const mockGoal: Goal = {
      id: 'active',
      config: { type: 'regular', serviceYear: 2027 },
      active: true,
    };
    activeGoalSignal.set(mockGoal);
    goalProgressSignal.set({
      accumulatedHours: 100,
      projectedHours: 450,
      targetHours: 600,
      status: 'on-track',
      monthsElapsed: 3,
      monthlyAccumulated: 10,
      monthlyTarget: 50,
      monthlyProgress: 20,
    });

    fixture.detectChanges();
    flushMicrotasks();

    const progressContainer = fixture.nativeElement.querySelector('app-goal-progress-visual');
    expect(progressContainer).toBeTruthy();
  }));

  it('should open GoalConfigComponent dialog on openGoalConfig', fakeAsync(() => {
    component.openGoalConfig();
    flushMicrotasks();

    expect(mockDialog.open).toHaveBeenCalledWith(
      GoalConfigComponent,
      jasmine.objectContaining({
        width: '100%',
        maxWidth: '500px',
      })
    );
  }));

  it('should call setGoal when dialog returns a goal', fakeAsync(() => {
    const newGoal: Goal = {
      id: 'active',
      config: { type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: true },
      active: true,
    };

    mockDialogRef.afterClosed.and.returnValue(of(newGoal));

    component.openGoalConfig();
    flushMicrotasks();

    expect(mockFacade.setGoal).toHaveBeenCalledWith(newGoal);
  }));

  it('should display clear goal button when goal is active', fakeAsync(() => {
    const mockGoal: Goal = {
      id: 'active',
      config: { type: 'regular', serviceYear: 2027 },
      active: true,
    };
    activeGoalSignal.set(mockGoal);

    fixture.detectChanges();
    flushMicrotasks();

    const clearButton = fixture.nativeElement.querySelector('.clear-button');
    expect(clearButton?.textContent).toContain('goals.actions.clear');
  }));

  it('should call clearGoal when user confirms clear dialog', fakeAsync(() => {
    mockDialogRef.afterClosed.and.returnValue(of(true));

    component.clearActiveGoal();
    flushMicrotasks();

    expect(mockFacade.clearGoal).toHaveBeenCalledTimes(1);
  }));
});
