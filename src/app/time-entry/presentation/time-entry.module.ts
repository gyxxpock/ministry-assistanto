import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';

import { TimeEntryListComponent } from './components/time-entry-list/time-entry-list.component';
import { TimeEntryFormComponent } from './components/time-entry-form/time-entry-form.component';
import { TimeEntryDayComponent } from './components/time-entry-day/time-entry-day.component';
import { TimeEntryCalendarComponent } from './components/time-entry-calendar/time-entry-calendar';
import { Layout } from './components/layout/layout';
import { SettingsComponent } from './components/settings/settings.component';
import { MonthPaginatorComponent } from './components/shared/month-paginator/month-paginator.component';
import { OptionPillGroupComponent } from './components/shared/option-pill-group/option-pill-group.component';
import { BackupReminderBannerComponent } from './components/backup-reminder-banner/backup-reminder-banner.component';
import { UpdateBannerComponent } from './components/update-banner/update-banner.component';
import { VersionHistoryComponent } from './components/version-history/version-history.component';

import { TIME_ENTRY_REPOSITORY } from './tokens/time-entry.tokens';
import { DexieTimeEntryRepository } from '../data/time-entry.dexie';
import { TimeEntryFacade } from '../facade/time-entry.facade';
import { MaterialModule } from './material/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TimeEntryEditDialogComponent } from './components/time-entry-edit/time-entry-edit-dialog.component';
import { DurationWheelPickerComponent } from './components/duration-wheel-picker/duration-wheel-picker.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbar } from '@angular/material/toolbar';
import { FileUtilService } from '../../core/services/file-util.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/presentation/shared.module';

const routes: Routes = [
  {
    path: '', // Este es el path base 'time-entry/'
    component: Layout, // Se carga siempre que estemos en time-entry
    children: [
      { 
        path: 'list', 
        component: TimeEntryListComponent // URL: time-entry/list
      },
      {
        path: 'calendar',
        component: TimeEntryCalendarComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  declarations: [
    TimeEntryListComponent,
    TimeEntryFormComponent,
    DurationWheelPickerComponent,
    TimeEntryDayComponent,
    TimeEntryEditDialogComponent,
    TimeEntryCalendarComponent,
    Layout,
    SettingsComponent,
    BackupReminderBannerComponent,
    MonthPaginatorComponent,
    OptionPillGroupComponent,
    UpdateBannerComponent,
    VersionHistoryComponent,
  ],
  imports: [
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatToolbar,
    MatTooltipModule,
    MatExpansionModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    FileUtilService,
    TimeEntryFacade,
    {
      provide: TIME_ENTRY_REPOSITORY,
      useClass: DexieTimeEntryRepository
    }
  ]
})
export class TimeEntryModule { }