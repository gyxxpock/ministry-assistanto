import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

import { I18nDatePipe } from '../../core/i18n/pipes/i18n-date.pipe';

@NgModule({
  declarations: [I18nDatePipe],
  imports: [CommonModule, TranslateModule, MatIconModule],
  exports: [
    I18nDatePipe,
    TranslateModule,
    MatIconModule,
  ],
})
export class SharedModule {}
