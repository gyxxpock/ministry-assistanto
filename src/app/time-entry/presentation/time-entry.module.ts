import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TimeEntryListComponent } from './time-entry-list.component';
import { TimeEntryFormComponent } from './time-entry-form.component';
import { TimeEntryDayComponent } from './time-entry-day.component';

@NgModule({
  declarations: [
    TimeEntryListComponent,
    TimeEntryFormComponent,
    TimeEntryDayComponent
  ],
  imports: [CommonModule, FormsModule, TranslateModule],
  exports: [TimeEntryListComponent]
})
export class TimeEntryModule {}
