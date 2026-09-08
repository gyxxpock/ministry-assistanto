import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { GoalConfig, GoalProgress } from '../../domain/models';
import { GoalProgressVM } from '../../models/goal-progress.vm';
import { GoalStatusBadgeComponent } from '../goal-status-badge/goal-status-badge.component';

@Component({
  selector: 'app-goal-progress-visual',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    TranslateModule,
    GoalStatusBadgeComponent,
  ],
  templateUrl: './goal-progress-visual.component.html',
  styleUrls: ['./goal-progress-visual.component.scss'],
})
export class GoalProgressVisualComponent {
  @Input() goalProgress: GoalProgress | null = null;
  @Input() goalConfig: GoalConfig | null = null;

  readonly totalMonths = 12;

  readonly vm = computed(() => {
    const progress = this.goalProgress();
    if (!progress) return null;

    const vm: GoalProgressVM = {
      accumulatedHours: progress.accumulatedHours,
      projectedHours: progress.projectedHours,
      targetHours: progress.targetHours,
      targetToDate: this.computeTargetToDate(progress),
      hoursDifference: progress.accumulatedHours - this.computeTargetToDate(progress),
      statusLabel: progress.status,
      monthsElapsed: progress.monthsElapsed,
    };

    const config = this.goalConfig();
    if (config?.type === 'auxiliary') {
      vm.monthlyTarget = config.monthlyTarget;
    }

    return vm;
  });

  get percentComplete(): number | undefined {
    const progress = this.goalProgress();
    if (!progress) return undefined;
    const percent = (progress.accumulatedHours / progress.targetHours) * 100;
    return Math.min(Math.max(Math.round(percent), 0), 100);
  }

  get circleColor(): string {
    const progress = this.goalProgress();
    if (!progress) return '#9CA3AF';
    switch (progress.status) {
      case 'on-track':
        return '#22C55E';
      case 'behind-in-margin':
        return '#F97316';
      case 'out-of-margin':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  }

  get circleBackgroundColor(): string {
    return '#E5E7EB';
  }

  private computeTargetToDate(progress: GoalProgress): number {
    if (progress.monthsElapsed === 0) return 0;
    return (progress.targetHours * progress.monthsElapsed) / this.totalMonths;
  }
}
