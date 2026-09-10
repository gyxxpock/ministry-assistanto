import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { GoalSummaryCardComponent } from './goal-summary-card.component';
import { GoalConfig, GoalProgress, GoalStatus } from '../../../../goals/domain/models';

function makeRegularConfig(): GoalConfig {
  return { type: 'regular', serviceYear: 2027 };
}

function makeAuxiliaryConfig(): GoalConfig {
  return { type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: true };
}

function makeProgress(partial: Partial<GoalProgress> = {}): GoalProgress {
  return {
    accumulatedHours: 300,
    projectedHours: 550,
    targetHours: 600,
    status: 'on-track',
    monthsElapsed: 6,
    monthlyAccumulated: 40,
    monthlyTarget: 50,
    monthlyProgress: 80,
    ...partial,
  };
}

describe('GoalSummaryCardComponent', () => {
  let component: GoalSummaryCardComponent;
  let fixture: ComponentFixture<GoalSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // standalone component: goes in imports, not declarations.
      // RouterModule.forRoot([]) is required because the template uses
      // routerLink on the "configure" buttons.
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([]), GoalSummaryCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalSummaryCardComponent);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('empty state', () => {
    it('renders the empty CTA when there is no goalConfig', () => {
      component.goalConfig = null;
      component.goalProgress = null;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.goal-card__empty')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('.goal-card__donut')).toBeNull();
    });

    it('renders the empty CTA when there is a goalConfig but no goalProgress', () => {
      component.goalConfig = makeRegularConfig();
      component.goalProgress = null;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.goal-card__empty')).not.toBeNull();
    });
  });

  describe('donut rendering', () => {
    beforeEach(() => {
      component.goalConfig = makeRegularConfig();
      component.goalProgress = makeProgress();
      component.periodStart = new Date(2026, 8, 1);
      component.periodEnd = new Date(2027, 7, 1);
    });

    it('renders the donut and metrics when both goalConfig and goalProgress are present', () => {
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.goal-card__empty')).toBeNull();
      expect(fixture.nativeElement.querySelector('.goal-card__donut')).not.toBeNull();
    });

    it('shows the goal type via the "goals.types.<type>" i18n key', () => {
      fixture.detectChanges();
      const typeEl: HTMLElement = fixture.nativeElement.querySelector('.goal-card__type');
      expect(typeEl.textContent).toContain('goals.types.regular');
    });

    it('shows the auxiliary type key when goalConfig.type is "auxiliary"', () => {
      component.goalConfig = makeAuxiliaryConfig();
      fixture.detectChanges();
      const typeEl: HTMLElement = fixture.nativeElement.querySelector('.goal-card__type');
      expect(typeEl.textContent).toContain('goals.types.auxiliary');
    });

    it('renders the formatted period when periodStart/periodEnd are provided', () => {
      fixture.detectChanges();
      const periodEl: HTMLElement = fixture.nativeElement.querySelector('.goal-card__period');
      expect(periodEl).not.toBeNull();
    });

    it('does not render the period when periodStart/periodEnd are null', () => {
      component.periodStart = null;
      component.periodEnd = null;
      fixture.detectChanges();
      const periodEl: HTMLElement = fixture.nativeElement.querySelector('.goal-card__period');
      expect(periodEl).toBeNull();
    });
  });

  describe('percentComplete', () => {
    it('is 0 when goalProgress is null', () => {
      component.goalProgress = null;
      expect(component.percentComplete).toBe(0);
    });

    it('is 0 when targetHours is 0 or less', () => {
      component.goalProgress = makeProgress({ targetHours: 0 });
      expect(component.percentComplete).toBe(0);
    });

    it('rounds accumulated/target to the nearest integer percentage', () => {
      component.goalProgress = makeProgress({ accumulatedHours: 300, targetHours: 600 });
      expect(component.percentComplete).toBe(50);
    });

    it('clamps to 100 when accumulated exceeds target', () => {
      component.goalProgress = makeProgress({ accumulatedHours: 900, targetHours: 600 });
      expect(component.percentComplete).toBe(100);
    });

    it('clamps to 0 for negative percentages (should never happen but guards anyway)', () => {
      component.goalProgress = makeProgress({ accumulatedHours: -10, targetHours: 600 });
      expect(component.percentComplete).toBe(0);
    });
  });

  describe('dashArray / dashOffset', () => {
    it('computes a dashArray proportional to percentComplete over the full circumference', () => {
      component.goalProgress = makeProgress({ accumulatedHours: 300, targetHours: 600 }); // 50%
      const circumference = 2 * Math.PI * component.donutRadius;
      const [filled, total] = component.dashArray.split(' ').map(Number);

      expect(total).toBeCloseTo(circumference, 5);
      expect(filled).toBeCloseTo(circumference * 0.5, 5);
    });

    it('computes dashOffset as circumference minus the filled length', () => {
      component.goalProgress = makeProgress({ accumulatedHours: 300, targetHours: 600 }); // 50%
      const circumference = 2 * Math.PI * component.donutRadius;
      expect(component.dashOffset).toBeCloseTo(circumference * 0.5, 5);
    });

    it('dashOffset equals the full circumference at 0%', () => {
      component.goalProgress = makeProgress({ accumulatedHours: 0, targetHours: 600 });
      const circumference = 2 * Math.PI * component.donutRadius;
      expect(component.dashOffset).toBeCloseTo(circumference, 5);
    });
  });

  describe('circleColor by status', () => {
    const cases: Array<{ status: GoalStatus; expected: string }> = [
      { status: 'on-track', expected: 'var(--state-success)' },
      { status: 'behind-in-margin', expected: 'var(--state-warning)' },
      { status: 'out-of-margin', expected: 'var(--state-error)' },
    ];

    cases.forEach(({ status, expected }) => {
      it(`returns ${expected} for status "${status}"`, () => {
        component.goalProgress = makeProgress({ status });
        expect(component.circleColor).toBe(expected);
      });
    });

    it('falls back to the tertiary text token when there is no goalProgress', () => {
      component.goalProgress = null;
      expect(component.circleColor).toBe('var(--text-tertiary)');
    });
  });

  describe('circleBackgroundColor', () => {
    it('is always the neutral border-subtle token', () => {
      expect(component.circleBackgroundColor).toBe('var(--border-subtle)');
    });
  });
});
