import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { GoalStatusBadgeComponent } from './goal-status-badge.component';

describe('GoalStatusBadgeComponent', () => {
  let component: GoalStatusBadgeComponent;
  let fixture: ComponentFixture<GoalStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoalStatusBadgeComponent],
      imports: [CommonModule, MatIconModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display status with on-track style', () => {
    component.status = 'on-track';
    component.goalType = 'regular';
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.status-badge');
    expect(badge).toBeTruthy();
  });

  it('should display status with behind-in-margin style', () => {
    component.status = 'behind-in-margin';
    component.goalType = 'auxiliary';
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.status-badge');
    expect(badge).toBeTruthy();
  });

  it('should display status with out-of-margin style', () => {
    component.status = 'out-of-margin';
    component.goalType = 'regular';
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.status-badge');
    expect(badge).toBeTruthy();
  });
});
