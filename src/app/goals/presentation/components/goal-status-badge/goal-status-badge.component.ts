import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { GoalStatus, GoalType } from '../../domain/models';

@Component({
  selector: 'app-goal-status-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './goal-status-badge.component.html',
  styleUrls: ['./goal-status-badge.component.scss'],
})
export class GoalStatusBadgeComponent {
  @Input() status: GoalStatus = 'on-track';
  @Input() goalType: GoalType = 'regular';

  get statusClass(): string {
    const base = 'status-badge';
    const statusMap: Record<GoalStatus, string> = {
      'on-track': 'status-badge--on-track',
      'behind-in-margin': 'status-badge--behind',
      'out-of-margin': 'status-badge--out',
    };
    return `${base} ${statusMap[this.status]}`;
  }

  get statusIcon(): string {
    const iconMap: Record<GoalStatus, string> = {
      'on-track': 'check_circle',
      'behind-in-margin': 'info',
      'out-of-margin': 'error',
    };
    return iconMap[this.status];
  }

  get statusLabel(): string {
    const labelMap: Record<GoalStatus, string> = {
      'on-track': 'goals.status.on-track',
      'behind-in-margin': 'goals.status.behind-in-margin',
      'out-of-margin': 'goals.status.out-of-margin',
    };
    return labelMap[this.status];
  }
}
