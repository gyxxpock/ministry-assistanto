import { Component, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ministry-assistanto');
  constructor(private translate: TranslateService) {
    // Idioma principal
    const defaultLang = 'es';

    // Detectar idioma del navegador
    const browserLang = navigator.language.split('-')[0]; // 'es-ES' -> 'es'
console.log(browserLang)
    // Usar el idioma del navegador si existe, si no usar el default
    translate.use(browserLang || defaultLang);
  }
}
