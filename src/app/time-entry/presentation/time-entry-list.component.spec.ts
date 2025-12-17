import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeEntryListComponent } from './time-entry-list.component';
import { TimeEntryModule } from './time-entry.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TimeEntryFacade } from '../facade/time-entry.facade';
import { TimeEntryDB, DexieTimeEntryRepository } from '../data/time-entry.dexie';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('TimeEntryListComponent', () => {
  let fixture: ComponentFixture<TimeEntryListComponent>;
  let facade: TimeEntryFacade;

  beforeEach(async () => {
    const db = new TimeEntryDB(`comp-test-${Math.random().toString(36).slice(2)}`);
    const repo = new DexieTimeEntryRepository(db);
    await repo.clearAll();

    await TestBed.configureTestingModule({
      imports: [TimeEntryModule, FormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: TimeEntryFacade, useFactory: () => new TimeEntryFacade(repo) }
      ]
    }).compileComponents();

    // Provide basic translations for tests
    const translate = TestBed.inject<any>(TranslateService);
    translate.setTranslation('en', {
      timeEntry: {
        monthlySummary: 'Monthly Summary',
        totalHours: 'Total hours:',
        totalCourses: 'Total courses:',
        entriesTitle: 'Entries',
        courseVisitsTitle: 'Course Visits',
        exportJson: 'Export JSON',
        exportCsv: 'Export CSV',
        form: {
          date: 'Date',
          durationMinutes: 'Duration (minutes)',
          type: 'Type',
          typeOptions: {
            preaching: 'Preaching',
            study: 'Study',
            visiting: 'Visiting',
            other: 'Other'
          },
          add: 'Add',
          addAria: 'Add entry'
        },
        accessibility: {
          exportJsonAria: 'Export entries as JSON file',
          exportCsvAria: 'Export entries as CSV file',
          importAria: 'Import entries from JSON file',
          totalsRegionLabel: 'Monthly totals'
        }
      }
    }, true);
    translate.use('en');

    fixture = TestBed.createComponent(TimeEntryListComponent);
    facade = TestBed.inject(TimeEntryFacade);
  });

  it('renders totals and lists', async () => {
    await facade.addEntry({ id: 'e1', date: '2025-11-05', durationMinutes: 120, type: 'preaching' });
    await facade.addVisit({ id: 'v1', date: '2025-11-06', durationMinutes: 60, personId: 'p1' });

    // load explicitly for the month used by test
    await facade.loadMonth(2025, 11);

    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.debugElement.nativeElement as HTMLElement;
    // Translated labels should be present
    expect(el.textContent).toContain('Total hours');
    expect(el.textContent).toContain('Total courses');

    // Accessibility: totals region should have polite aria-live
    const totals = fixture.debugElement.nativeElement.querySelector('.totals');
    expect(totals.getAttribute('aria-live')).toBe('polite');
    expect(totals.getAttribute('aria-label')).toContain('Monthly totals');

    // Buttons and file input should have aria-labels
    const exportJsonBtn = fixture.debugElement.nativeElement.querySelector('.exports button');
    expect(exportJsonBtn.getAttribute('aria-label')).toContain('Export entries');
    const fileInput = fixture.debugElement.nativeElement.querySelector('.exports input[type=file]');
    expect(fileInput.getAttribute('aria-label')).toContain('Import entries');

    const entries = fixture.debugElement.queryAll(By.css('ul li'));
    expect(entries.length).toBeGreaterThan(0);
  });
});
