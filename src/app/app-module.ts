import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';

export function httpLoaderFactory() {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      fallbackLang: 'es'
    })
  ],
  providers: [
    provideHttpClient(),
    provideTranslateHttpLoader({
      prefix: '/assets/i18n/',
      suffix: '.json'
    })
  ],
  bootstrap: [App]
})
export class AppModule {}