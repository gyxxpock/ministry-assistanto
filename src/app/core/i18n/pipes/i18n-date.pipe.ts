import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'i18nDate',
  pure: false, // importante: reacciona a cambios de idioma
  standalone: false
})
export class I18nDatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(
    value: Date | string | null | undefined,
    options?: Intl.DateTimeFormatOptions
  ): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);

    const lang =
      this.translate.currentLang ||
      this.translate.defaultLang ||
      'es';

    return new Intl.DateTimeFormat(lang, {
      dateStyle: 'medium',
      ...options
    }).format(date);
  }
}