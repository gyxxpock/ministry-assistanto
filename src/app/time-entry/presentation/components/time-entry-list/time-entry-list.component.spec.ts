import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeEntryListComponent } from './time-entry-list.component';
import { TimeEntryModule } from '../../time-entry.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { ITimeEntryRepository } from '../../../domain/i-time-entry.repository';
import { TIME_ENTRY_REPOSITORY } from '../../tokens/time-entry.tokens';
import { TimeEntry, CourseVisit, MonthlyCourseCount } from '../../../domain/models';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

class InMemoryRepository implements ITimeEntryRepository {
  private entries: TimeEntry[] = [];
  private visits: CourseVisit[] = [];
  private counts = new Map<string, number>();

  async listEntriesByMonth(year: number, month: number): Promise<TimeEntry[]> {
    return this.entries.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }
  async listVisitsByMonth(year: number, month: number): Promise<CourseVisit[]> {
    return this.visits.filter(v => {
      const d = new Date(v.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }
  async addEntry(entry: TimeEntry): Promise<void> { this.entries.push(entry); }
  async updateEntry(entry: TimeEntry): Promise<void> {
    const i = this.entries.findIndex(e => e.id === entry.id);
    if (i >= 0) this.entries[i] = entry;
  }
  async removeEntry(id: string): Promise<void> { this.entries = this.entries.filter(e => e.id !== id); }
  async addVisit(visit: CourseVisit): Promise<void> { this.visits.push(visit); }
  async updateVisit(visit: CourseVisit): Promise<void> {
    const i = this.visits.findIndex(v => v.id === visit.id);
    if (i >= 0) this.visits[i] = visit;
  }
  async removeVisit(id: string): Promise<void> { this.visits = this.visits.filter(v => v.id !== id); }
  async exportAll(): Promise<{ entries: TimeEntry[]; visits: CourseVisit[]; courseCounts: MonthlyCourseCount[] }> {
    return { entries: this.entries, visits: this.visits, courseCounts: [] };
  }
  async importAll(payload: { entries?: TimeEntry[]; visits?: CourseVisit[] }): Promise<void> {
    if (payload.entries) this.entries.push(...payload.entries);
    if (payload.visits) this.visits.push(...payload.visits);
  }
  async getCourseCount(year: number, month: number): Promise<number> {
    return this.counts.get(`${year}-${month}`) ?? 0;
  }
  async setCourseCount(year: number, month: number, count: number): Promise<void> {
    this.counts.set(`${year}-${month}`, count);
  }
}

describe('TimeEntryListComponent', () => {
  let fixture: ComponentFixture<TimeEntryListComponent>;
  let facade: TimeEntryFacade;
  let repo: InMemoryRepository;

  beforeEach(async () => {
    repo = new InMemoryRepository();

    await TestBed.configureTestingModule({
      imports: [TimeEntryModule, FormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: TIME_ENTRY_REPOSITORY, useValue: repo },
        TimeEntryFacade,
      ]
    }).compileComponents();

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
    await facade.loadMonth(2025, 11);

    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.debugElement.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Total hours');
    expect(el.textContent).toContain('Total courses');

    const totals = fixture.debugElement.nativeElement.querySelector('.totals');
    expect(totals.getAttribute('aria-live')).toBe('polite');
    expect(totals.getAttribute('aria-label')).toContain('Monthly totals');

    const exportJsonBtn = fixture.debugElement.nativeElement.querySelector('.exports button');
    expect(exportJsonBtn.getAttribute('aria-label')).toContain('Export entries');
    const fileInput = fixture.debugElement.nativeElement.querySelector('.exports input[type=file]');
    expect(fileInput.getAttribute('aria-label')).toContain('Import entries');

    const entries = fixture.debugElement.queryAll(By.css('ul li'));
    expect(entries.length).toBeGreaterThan(0);
  });
});
