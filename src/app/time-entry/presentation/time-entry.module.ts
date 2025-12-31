import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';

import { TimeEntryListComponent } from './components/time-entry-list/time-entry-list.component';
import { TimeEntryFormComponent } from './components/time-entry-form/time-entry-form.component';
import { TimeEntryDayComponent } from './components/time-entry-day/time-entry-day.component';

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
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { I18nDatePipe } from '../../core/i18n/pipes/i18n-date.pipe';

const routes: Routes = [
  { path: 'list', component: TimeEntryListComponent },
  { path: 'day', component: TimeEntryDayComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    TimeEntryListComponent,
    TimeEntryFormComponent,
    TimeEntryDayComponent,
    TimeEntryEditDialogComponent,
    I18nDatePipe
  ],
  imports: [
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    TimeEntryFacade,
    {
      provide: TIME_ENTRY_REPOSITORY,
      useClass: DexieTimeEntryRepository
    }
  ]
})
export class TimeEntryModule { }