import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'i18nDate',
  pure: false, // Necesario para detectar cambios de idioma en tiempo real
  standalone: false
})
export class I18nDatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(
    value: Date | string | number | null | undefined,
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
  ): string {
    if (!value) return '';

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string') {
      // Solución al error de "un día menos":
      // Forzamos formato local reemplazando guiones por barras
      date = new Date(value.replace(/-/g, '/'));
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) return '';

    const lang = this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'es';

    return new Intl.DateTimeFormat(lang, options).format(date);
  }
}
