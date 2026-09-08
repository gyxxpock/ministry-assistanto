import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { GoalsFacade } from '../../facade/goals.facade';
import { Goal } from '../../domain/models';
import { GoalProgressVisualComponent } from '../goal-progress-visual/goal-progress-visual.component';
import { GoalConfigComponent } from '../goal-config/goal-config.component';

@Component({
  selector: 'app-goals',
  standalone: false,
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent implements OnInit {
  readonly facade = inject(GoalsFacade);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.facade.loadGoal();
  }

  openGoalConfig(): void {
    this.dialog
      .open(GoalConfigComponent, {
        width: '100%',
        maxWidth: '500px',
        data: { existingGoal: this.facade.activeGoal() },
      })
      .afterClosed()
      .subscribe((goal: Goal | undefined) => {
        if (goal) {
          this.facade.setGoal(goal);
        }
      });
  }

  clearActiveGoal(): void {
    this.dialog
      .open(ConfirmClearDialog, {
        width: '100%',
        maxWidth: '400px',
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.facade.clearGoal();
        }
      });
  }
}

@Component({
  selector: 'app-confirm-clear-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  template: `
    <div mat-dialog-title>{{ 'goals.confirm.clear-title' | translate }}</div>
    <div mat-dialog-content>{{ 'goals.confirm.clear-message' | translate }}</div>
    <div mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">
        {{ 'common.cancel' | translate }}
      </button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        {{ 'common.delete' | translate }}
      </button>
    </div>
  `,
})
export class ConfirmClearDialog {}
