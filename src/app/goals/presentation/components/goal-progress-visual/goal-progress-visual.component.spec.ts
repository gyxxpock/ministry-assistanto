import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { GoalProgressVisualComponent } from './goal-progress-visual.component';
import { GoalStatusBadgeComponent } from '../goal-status-badge/goal-status-badge.component';
import { GoalProgress, GoalStatus } from '../../../domain/models';

function makeProgress(overrides: Partial<GoalProgress> = {}): GoalProgress {
  const targetHours = overrides.targetHours ?? 600;
  const activeMonthsElapsed = overrides.activeMonthsElapsed ?? 3;
  const totalActiveMonths = overrides.totalActiveMonths ?? 12;
  const targetToDate = (targetHours * activeMonthsElapsed) / totalActiveMonths;
  const accumulatedHours = overrides.accumulatedHours ?? 150;

  return {
    accumulatedHours,
    projectedHours: 600,
    targetHours,
    status: 'on-track',
    monthsElapsed: 3,
    activeMonthsElapsed,
    totalActiveMonths,
    targetToDate,
    hoursDifference: accumulatedHours - targetToDate,
    monthlyAccumulated: 15,
    monthlyTarget: 50,
    monthlyProgress: 30,
    ...overrides,
  };
}

describe('GoalProgressVisualComponent', () => {
  let component: GoalProgressVisualComponent;
  let fixture: ComponentFixture<GoalProgressVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        TranslateModule.forRoot(),
        GoalProgressVisualComponent,
        GoalStatusBadgeComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalProgressVisualComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display progress percentage', () => {
    component.goalProgress = makeProgress();

    fixture.detectChanges();

    const percentageText = fixture.nativeElement.textContent;
    expect(percentageText).toContain('25');
  });

  it('should display metric values', () => {
    component.goalProgress = makeProgress();
    component.goalConfig = { type: 'regular', serviceYear: 2027 };

    fixture.detectChanges();

    const metricsText = fixture.nativeElement.textContent;
    expect(metricsText).toContain('150');
    expect(metricsText).toContain('600');
  });

  it('should color SVG circle green for on-track status', () => {
    component.goalProgress = makeProgress({
      accumulatedHours: 450,
      monthsElapsed: 9,
      activeMonthsElapsed: 9,
      monthlyAccumulated: 45,
      monthlyProgress: 90,
    });

    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  describe('when goalProgress is absent', () => {
    it('vm() returns null when goalProgress is null', () => {
      component.goalProgress = null;
      expect(component.vm()).toBeNull();
    });

    it('vm() returns null when goalProgress is undefined', () => {
      component.goalProgress = undefined as unknown as GoalProgress | null;
      expect(component.vm()).toBeNull();
    });

    it('percentComplete is undefined when goalProgress is null', () => {
      component.goalProgress = null;
      expect(component.percentComplete).toBeUndefined();
    });

    it('circleColor falls back to the neutral gray when goalProgress is null', () => {
      component.goalProgress = null;
      expect(component.circleColor).toBe('#9CA3AF');
    });

    it('renders the empty-state template instead of the progress container', () => {
      component.goalProgress = null;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.progress-container')).toBeNull();
      expect(fixture.nativeElement.querySelector('.no-goal-message')).toBeTruthy();
    });
  });

  describe('when goalProgress is present', () => {
    it('vm() returns a populated view model', () => {
      component.goalProgress = makeProgress();
      const vm = component.vm();
      expect(vm).not.toBeNull();
      expect(vm?.accumulatedHours).toBe(150);
    });

    it('percentComplete is defined for a valid progress', () => {
      component.goalProgress = makeProgress();
      expect(component.percentComplete).toBe(25);
    });
  });

  describe('months-elapsed row (passthrough from domain)', () => {
    it('renders activeMonthsElapsed / totalActiveMonths from the domain, not a hardcoded 12', () => {
      component.goalProgress = makeProgress({ activeMonthsElapsed: 4, totalActiveMonths: 8 });
      fixture.detectChanges();

      const metricsText = fixture.nativeElement.textContent;
      expect(metricsText).toContain('4 / 8');
    });
  });

  describe('circleColor status switch', () => {
    const cases: Array<{ status: GoalStatus; expected: string }> = [
      { status: 'on-track', expected: '#22C55E' },
      { status: 'behind-in-margin', expected: '#F97316' },
      { status: 'out-of-margin', expected: '#EF4444' },
    ];

    cases.forEach(({ status, expected }) => {
      it(`returns ${expected} for status "${status}"`, () => {
        component.goalProgress = makeProgress({ status });
        expect(component.circleColor).toBe(expected);
      });
    });

    it('falls back to the neutral gray for an unrecognized status (default branch)', () => {
      component.goalProgress = makeProgress({ status: 'unknown' as unknown as GoalStatus });
      expect(component.circleColor).toBe('#9CA3AF');
    });
  });
});
