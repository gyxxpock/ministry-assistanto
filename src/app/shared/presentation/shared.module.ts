import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { I18nDatePipe } from '../../core/i18n/pipes/i18n-date.pipe';

@NgModule({
  declarations: [I18nDatePipe],
  imports: [CommonModule, TranslateModule],
  exports: [
    I18nDatePipe,
    TranslateModule,
  ],
})
export class SharedModule {}
