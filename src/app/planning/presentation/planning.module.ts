import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanningComponent } from './components/planning/planning.component';
import { GoalSummaryCardComponent } from './components/goal-summary-card/goal-summary-card.component';
import { MonthlyBarChartComponent } from './components/monthly-bar-chart/monthly-bar-chart.component';
import { PlanningCalendarComponent } from './components/planning-calendar/planning-calendar.component';
import { WeeklyScheduleEditorComponent } from './components/weekly-schedule-editor/weekly-schedule-editor.component';
import { DayOverridePanelComponent } from './components/day-override-panel/day-override-panel.component';

import { SharedModule } from '../../shared/presentation/shared.module';
import { MaterialModule } from '../../time-entry/presentation/material/material.module';
import { OptionPillGroupComponent } from '../../time-entry/presentation/components/shared/option-pill-group/option-pill-group.component';

import { PlanningFacade } from '../facade/planning.facade';
import { DexiePlanningRepository } from '../data/dexie-planning.repository';
import { PLANNING_REPOSITORY_TOKEN } from '../planning.tokens';

import { GoalsFacade } from '../../goals/facade/goals.facade';
import { DexieGoalRepository } from '../../goals/data/dexie-goal.repository';
import { GOAL_REPOSITORY_TOKEN } from '../../goals/goals.tokens';

import { DexieTimeEntryRepository } from '../../time-entry/data/time-entry.dexie';
import { TIME_ENTRY_REPOSITORY } from '../../time-entry/presentation/tokens/time-entry.tokens';

const routes: Routes = [
  {
    path: '',
    component: PlanningComponent,
  },
];

/**
 * PlanningModule — lazy, hijo de TimeEntryModule (nunca top-level en
 * app-routing.module.ts, ver incidente de Goals documentado en ui-agent.md).
 * TimeEntryFacade NO se re-provee aquí: se hereda del injector padre
 * (TimeEntryModule ya está cargado cuando se navega a time-entry/plan, ya
 * que este módulo es su hijo lazy dentro de las mismas rutas).
 */
@NgModule({
  declarations: [PlanningComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    GoalSummaryCardComponent,
    MonthlyBarChartComponent,
    PlanningCalendarComponent,
    WeeklyScheduleEditorComponent,
    DayOverridePanelComponent,
    OptionPillGroupComponent,
  ],
  providers: [
    PlanningFacade,
    GoalsFacade,
    {
      provide: PLANNING_REPOSITORY_TOKEN,
      useClass: DexiePlanningRepository,
    },
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
export class PlanningModule {}
