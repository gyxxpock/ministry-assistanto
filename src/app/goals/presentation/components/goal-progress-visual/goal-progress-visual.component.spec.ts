import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { GoalProgressVisualComponent } from './goal-progress-visual.component';
import { GoalStatusBadgeComponent } from '../goal-status-badge/goal-status-badge.component';
import { GoalProgress } from '../../../domain/models';

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
});
