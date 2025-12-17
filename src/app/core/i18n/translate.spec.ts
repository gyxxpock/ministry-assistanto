import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('i18n: TranslateService', () => {
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    });
    translate = TestBed.inject(TranslateService);
  });

  it('should return configured translations via setTranslation/instant', () => {
    translate.setTranslation('en', {
      timeEntry: {
        monthlySummary: 'Monthly Summary'
      }
    }, true);

    translate.use('en');
    expect(translate.instant('timeEntry.monthlySummary')).toBe('Monthly Summary');
  });
});
