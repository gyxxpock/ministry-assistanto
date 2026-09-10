import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GoalConfig, GoalProgress, GoalStatus } from '../../../../goals/domain/models';
import { SharedModule } from '../../../../shared/presentation/shared.module';

const DONUT_RADIUS = 42;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

/**
 * Tarjeta compacta de resumen del objetivo activo, pensada para vivir dentro
 * de PlanningComponent. Reutiliza SOLO la fórmula del donut de
 * GoalProgressVisualComponent (goals/presentation) — no importa ese componente
 * ni ningún otro símbolo de goals/presentation/, tal como exige el diseño.
 *
 * No importa domain/ más allá de tipos (GoalConfig/GoalProgress/GoalStatus):
 * el período del objetivo (periodStart/periodEnd) se calcula en el shell
 * (PlanningComponent) vía getServiceYear() y se recibe aquí como Date llana.
 */
@Component({
  selector: 'app-goal-summary-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, SharedModule],
  templateUrl: './goal-summary-card.component.html',
  styleUrls: ['./goal-summary-card.component.scss'],
})
export class GoalSummaryCardComponent {
  @Input() goalConfig: GoalConfig | null = null;
  @Input() goalProgress: GoalProgress | null = null;
  @Input() periodStart: Date | null = null;
  @Input() periodEnd: Date | null = null;

  readonly donutRadius = DONUT_RADIUS;

  get percentComplete(): number {
    const progress = this.goalProgress;
    if (!progress || progress.targetHours <= 0) return 0;
    const percent = (progress.accumulatedHours / progress.targetHours) * 100;
    return Math.min(Math.max(Math.round(percent), 0), 100);
  }

  get dashArray(): string {
    const filled = (this.percentComplete / 100) * DONUT_CIRCUMFERENCE;
    return `${filled} ${DONUT_CIRCUMFERENCE}`;
  }

  get dashOffset(): number {
    const filled = (this.percentComplete / 100) * DONUT_CIRCUMFERENCE;
    return DONUT_CIRCUMFERENCE - filled;
  }

  get circleColor(): string {
    const status: GoalStatus | undefined = this.goalProgress?.status;
    switch (status) {
      case 'on-track':
        return 'var(--state-success)';
      case 'behind-in-margin':
        return 'var(--state-warning)';
      case 'out-of-margin':
        return 'var(--state-error)';
      default:
        return 'var(--text-tertiary)';
    }
  }

  get circleBackgroundColor(): string {
    return 'var(--border-subtle)';
  }
}
