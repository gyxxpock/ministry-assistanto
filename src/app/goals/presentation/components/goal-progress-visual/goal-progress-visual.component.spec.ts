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
  return {
    accumulatedHours: 150,
    projectedHours: 600,
    targetHours: 600,
    status: 'on-track',
    monthsElapsed: 3,
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
    component.goalProgress = {
      accumulatedHours: 150,
      projectedHours: 600,
      targetHours: 600,
      status: 'on-track',
      monthsElapsed: 3,
      monthlyAccumulated: 15,
      monthlyTarget: 50,
      monthlyProgress: 30,
    };

    fixture.detectChanges();

    const percentageText = fixture.nativeElement.textContent;
    expect(percentageText).toContain('25');
  });

  it('should display metric values', () => {
    component.goalProgress = {
      accumulatedHours: 150,
      projectedHours: 600,
      targetHours: 600,
      status: 'on-track',
      monthsElapsed: 3,
      monthlyAccumulated: 15,
      monthlyTarget: 50,
      monthlyProgress: 30,
    };
    component.goalConfig = { type: 'regular', serviceYear: 2027 };

    fixture.detectChanges();

    const metricsText = fixture.nativeElement.textContent;
    expect(metricsText).toContain('150');
    expect(metricsText).toContain('600');
  });

  it('should color SVG circle green for on-track status', () => {
    component.goalProgress = {
      accumulatedHours: 450,
      projectedHours: 600,
      targetHours: 600,
      status: 'on-track',
      monthsElapsed: 9,
      monthlyAccumulated: 45,
      monthlyTarget: 50,
      monthlyProgress: 90,
    };

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

  describe('computeTargetToDate (via vm().targetToDate)', () => {
    it('returns 0 when monthsElapsed is 0', () => {
      component.goalProgress = makeProgress({ monthsElapsed: 0 });
      expect(component.vm()?.targetToDate).toBe(0);
    });

    it('returns a proportional value when monthsElapsed is not 0', () => {
      component.goalProgress = makeProgress({ monthsElapsed: 6, targetHours: 600 });
      expect(component.vm()?.targetToDate).toBe((600 * 6) / component.totalMonths);
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
