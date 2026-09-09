import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';

import { GoalsComponent, ConfirmClearDialog } from './components/goals/goals.component';
import { GoalConfigComponent } from './components/goal-config/goal-config.component';
import { GoalProgressVisualComponent } from './components/goal-progress-visual/goal-progress-visual.component';
import { GoalStatusBadgeComponent } from './components/goal-status-badge/goal-status-badge.component';

import { SharedModule } from '../../shared/presentation/shared.module';
import { MaterialModule } from '../../time-entry/presentation/material/material.module';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';

import { GoalsFacade } from '../facade/goals.facade';
import { DexieGoalRepository } from '../data/dexie-goal.repository';
import { GOAL_REPOSITORY_TOKEN } from '../goals.tokens';
import { DexieTimeEntryRepository } from '../../time-entry/data/time-entry.dexie';
import { TIME_ENTRY_REPOSITORY } from '../../time-entry/presentation/tokens/time-entry.tokens';

const routes: Routes = [
  {
    path: '',
    component: GoalsComponent,
  },
];

@NgModule({
  declarations: [
    GoalsComponent,
    GoalConfigComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatRippleModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    GoalProgressVisualComponent,
    GoalStatusBadgeComponent,
    ConfirmClearDialog,
  ],
  providers: [
    GoalsFacade,
    {
      provide: GOAL_REPOSITORY_TOKEN,
      useClass: DexieGoalRepository,
    },
    {
      provide: TIME_ENTRY_REPOSITORY,
      useClass: DexieTimeEntryRepository,
    },
  ],
})
export class GoalsModule {}
