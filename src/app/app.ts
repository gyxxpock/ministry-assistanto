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
    const supportedLangs = ['es', 'en'];

    const browserLang = navigator.language?.split('-')[0];
    const langToUse = supportedLangs.includes(browserLang)
      ? browserLang
      : 'es';

    this.translate.use(langToUse);
  }
}
