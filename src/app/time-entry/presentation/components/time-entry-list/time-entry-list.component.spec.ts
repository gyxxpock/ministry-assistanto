import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TimeEntryListComponent } from './time-entry-list.component';
import { TimeEntryModule } from '../../time-entry.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { ITimeEntryRepository } from '../../../domain/i-time-entry.repository';
import { TIME_ENTRY_REPOSITORY } from '../../tokens/time-entry.tokens';
import { TimeEntry, CourseVisit, MonthlyCourseCount } from '../../../domain/models';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TimeEntryEditDialogComponent } from '../time-entry-edit/time-entry-edit-dialog.component';
import { FileUtilService } from '../../../../core/services/file-util.service';
import { BackupReminderService } from '../../../../core/services/backup-reminder.service';

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
  async listEntriesByDateRange(startDate: Date, endDate: Date): Promise<TimeEntry[]> {
    return this.entries.filter(e => {
      const d = new Date(e.date);
      return d >= startDate && d <= endDate;
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
  let component: TimeEntryListComponent;
  let facade: TimeEntryFacade;
  let repo: InMemoryRepository;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    repo = new InMemoryRepository();

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TimeEntryModule, FormsModule, TranslateModule.forRoot()],
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

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TimeEntryListComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(TimeEntryFacade);
  });

  afterEach(() => {
    httpMock.match(() => true).forEach(req => req.flush([]));
    httpMock.verify();
  });

  it('renders totals and lists', async () => {
    await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 120, type: 'preaching' });
    await facade.addVisit({ id: 'v1', date: new Date('2025-11-06'), durationMinutes: 60, personId: 'p1' });
    await facade.loadMonth(2025, 11);

    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.debugElement.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Total hours');
    expect(el.textContent).toContain('Total courses');

    const totals = fixture.debugElement.nativeElement.querySelector('.totals-dashboard');
    expect(totals).not.toBeNull();

    const fileInput = fixture.debugElement.nativeElement.querySelector('input[type=file]');
    expect(fileInput).not.toBeNull();

    const dayGroups = fixture.debugElement.queryAll(By.css('ma-time-entry-day'));
    expect(dayGroups.length).toBeGreaterThan(0);
  });

  it('onRestoreRequest sets showRestoreConfirm to true', () => {
    fixture.detectChanges();
    expect(component.showRestoreConfirm).toBeFalse();
    component.onRestoreRequest();
    expect(component.showRestoreConfirm).toBeTrue();
  });

  it('onRestoreCancel sets showRestoreConfirm to false', () => {
    fixture.detectChanges();
    component.showRestoreConfirm = true;
    component.onRestoreCancel();
    expect(component.showRestoreConfirm).toBeFalse();
  });

  it('isCurrentMonth returns true when currentDate is this month', () => {
    fixture.detectChanges();
    component.currentDate.set(new Date());
    expect(component.isCurrentMonth()).toBeTrue();
  });

  it('isCurrentMonth returns false when currentDate is a past month', () => {
    fixture.detectChanges();
    component.currentDate.set(new Date(2020, 0, 1));
    expect(component.isCurrentMonth()).toBeFalse();
  });

  it('prevMonth moves currentDate one month back', async () => {
    fixture.detectChanges();
    component.currentDate.set(new Date(2025, 10, 1)); // Nov 2025
    spyOn(facade, 'loadMonth').and.returnValue(Promise.resolve());

    component.prevMonth();

    const date = component.currentDate();
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(9); // October
  });

  it('nextMonth moves currentDate one month forward', async () => {
    fixture.detectChanges();
    component.currentDate.set(new Date(2025, 10, 1)); // Nov 2025
    spyOn(facade, 'loadMonth').and.returnValue(Promise.resolve());

    component.nextMonth();

    const date = component.currentDate();
    expect(date.getMonth()).toBe(11); // December
  });

  it('goToToday resets currentDate to today', () => {
    fixture.detectChanges();
    component.currentDate.set(new Date(2020, 0, 1));
    spyOn(facade, 'loadMonth').and.returnValue(Promise.resolve());

    component.goToToday();

    const date = component.currentDate();
    const now = new Date();
    expect(date.getFullYear()).toBe(now.getFullYear());
    expect(date.getMonth()).toBe(now.getMonth());
  });

  it('loadData calls facade.loadMonth with year and month from currentDate', () => {
    fixture.detectChanges();
    component.currentDate.set(new Date(2025, 10, 1)); // Nov 2025
    spyOn(facade, 'loadMonth').and.returnValue(Promise.resolve());

    component.loadData();

    expect(facade.loadMonth).toHaveBeenCalledWith(2025, 11);
  });

  it('incrementCourse calls updateManualCourseCount with 0+1 when no data loaded', () => {
    fixture.detectChanges();
    spyOn(facade, 'updateManualCourseCount').and.returnValue(Promise.resolve());

    component.incrementCourse();

    expect(facade.updateManualCourseCount).toHaveBeenCalledWith(1);
  });

  it('decrementCourse does not call updateManualCourseCount when count is 0', () => {
    fixture.detectChanges();
    spyOn(facade, 'updateManualCourseCount').and.returnValue(Promise.resolve());

    component.decrementCourse();

    expect(facade.updateManualCourseCount).not.toHaveBeenCalled();
  });

  it('decrementCourse decrements totalCourses when visits exist', async () => {
    await repo.addVisit({ id: 'v1', date: new Date(2025, 10, 5), durationMinutes: 30, personId: 'p1' });
    await repo.addVisit({ id: 'v2', date: new Date(2025, 10, 5), durationMinutes: 30, personId: 'p2' });
    await facade.loadMonth(2025, 11);
    component.currentDate.set(new Date(2025, 10, 1));
    fixture.detectChanges();

    spyOn(facade, 'updateManualCourseCount').and.returnValue(Promise.resolve());
    component.decrementCourse(); // totalCourses = 2 unique persons → calls with 1

    expect(facade.updateManualCourseCount).toHaveBeenCalledWith(1);
  });

  it('groupedEntries groups entries by date key', async () => {
    // Use local midnight dates (not UTC string) to avoid timezone offset changing the date key
    await facade.addEntry({ date: new Date(2025, 10, 5), durationMinutes: 60, type: 'preaching' });
    await facade.addEntry({ date: new Date(2025, 10, 5), durationMinutes: 30, type: 'study' });
    await facade.addEntry({ date: new Date(2025, 10, 6), durationMinutes: 45, type: 'visiting' });
    await facade.loadMonth(2025, 11);
    component.currentDate.set(new Date(2025, 10, 1));
    fixture.detectChanges();

    const groups = component.groupedEntries();
    expect(groups.length).toBe(2);
    const entries5 = groups.find((g: { date: string; entries: unknown[] }) => g.date.endsWith('-05'))?.entries;
    expect(entries5?.length).toBe(2);
  });

  describe('getFormattedMonthlyReport', () => {
    it('formats totals into a report string', async () => {
      await facade.addEntry({ date: new Date(2025, 10, 5), durationMinutes: 120, type: 'preaching' });
      await facade.loadMonth(2025, 11);
      // Set currentDate before the first detectChanges() so ngOnInit's loadData()
      // (which reads component.currentDate) does not overwrite the year/month we just loaded.
      component.currentDate.set(new Date(2025, 10, 1));
      fixture.detectChanges();

      const report = (component as any).getFormattedMonthlyReport();

      expect(report).toContain('INFORME DE ACTIVIDAD');
      expect(report).toContain('Noviembre de 2025');
      expect(report).toContain('Tiempo total');
      expect(report).toContain('Cursos');
    });

    it('falls back to 0h when there are no totals for the month', async () => {
      await facade.loadMonth(2025, 11);
      component.currentDate.set(new Date(2025, 10, 1));
      fixture.detectChanges();

      const report = (component as any).getFormattedMonthlyReport();

      expect(report).toContain('Tiempo total:* 0h');
    });
  });

  describe('shareReport', () => {
    let originalShare: unknown;

    beforeEach(() => {
      originalShare = (navigator as any).share;
    });

    afterEach(() => {
      if (originalShare === undefined) {
        delete (navigator as any).share;
      } else {
        Object.defineProperty(navigator, 'share', { value: originalShare, configurable: true });
      }
    });

    it('calls navigator.share with the formatted report when available', async () => {
      await facade.addEntry({ date: new Date(2025, 10, 5), durationMinutes: 60, type: 'preaching' });
      await facade.loadMonth(2025, 11);
      component.currentDate.set(new Date(2025, 10, 1));
      fixture.detectChanges();

      const shareSpy = jasmine.createSpy('share').and.returnValue(Promise.resolve());
      Object.defineProperty(navigator, 'share', { value: shareSpy, configurable: true });

      await component.shareReport();

      expect(shareSpy).toHaveBeenCalledTimes(1);
      const arg = shareSpy.calls.mostRecent().args[0];
      expect(arg.text).toContain('INFORME DE ACTIVIDAD');
    });

    it('does nothing (fallback) when navigator.share is not available', async () => {
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
      fixture.detectChanges();

      await expectAsync(component.shareReport()).toBeResolved();
    });
  });

  describe('handleExport', () => {
    it('generates JSON, downloads the file, records backup and resets isExporting', async () => {
      await facade.addEntry({ date: new Date(2025, 10, 5), durationMinutes: 60, type: 'preaching' });
      await facade.loadMonth(2025, 11);
      fixture.detectChanges();

      const fileUtil = TestBed.inject(FileUtilService);
      const backupService = TestBed.inject(BackupReminderService);
      const downloadSpy = spyOn(fileUtil, 'downloadFile');
      const recordSpy = spyOn(backupService, 'recordBackup');

      await component.handleExport();

      expect(downloadSpy).toHaveBeenCalledTimes(1);
      const [content, fileName, contentType] = downloadSpy.calls.mostRecent().args;
      expect(fileName).toMatch(/^backup_\d{4}-\d{2}-\d{2}\.json$/);
      expect(contentType).toBe('application/json');
      expect(JSON.parse(content).data.entries.length).toBe(1);
      expect(recordSpy).toHaveBeenCalledTimes(1);
      expect(component.isExporting()).toBeFalse();
    });
  });

  describe('handleImport', () => {
    it('returns early when no files are selected (undefined or empty)', async () => {
      fixture.detectChanges();
      const importSpy = spyOn(facade, 'importAll').and.returnValue(Promise.resolve());

      const inputElNull = { files: null, value: '' } as unknown as HTMLInputElement;
      await component.handleImport({ target: inputElNull } as unknown as Event);

      const inputElEmpty = { files: [], value: '' } as unknown as HTMLInputElement;
      await component.handleImport({ target: inputElEmpty } as unknown as Event);

      expect(importSpy).not.toHaveBeenCalled();
    });

    it('parses payload.data and calls facade.importAll with sanitized dates when a file is selected', async () => {
      fixture.detectChanges();
      const fileUtil = TestBed.inject(FileUtilService);
      const importSpy = spyOn(facade, 'importAll').and.returnValue(Promise.resolve());
      const rawContent = JSON.stringify({
        version: '1.0',
        data: {
          entries: [{ id: 'e1', date: '2025-11-05', durationMinutes: 30, type: 'preaching' }],
          visits: [{ id: 'v1', date: '2025-11-06', durationMinutes: 15, personId: 'p1' }],
        },
      });
      spyOn(fileUtil, 'readFile').and.returnValue(Promise.resolve(rawContent));

      const fakeFile = new File(['x'], 'backup.json');
      const inputEl = { files: [fakeFile], value: 'something' } as unknown as HTMLInputElement;

      await component.handleImport({ target: inputEl } as unknown as Event);

      expect(importSpy).toHaveBeenCalledTimes(1);
      const arg = importSpy.calls.mostRecent().args[0] as { entries: TimeEntry[]; visits: CourseVisit[] };
      expect(arg.entries[0].date).toEqual(new Date('2025-11-05'));
      expect(arg.visits[0].date).toEqual(new Date('2025-11-06'));
      expect(inputEl.value).toBe('');
      expect(component.showRestoreConfirm).toBeFalse();
    });

    it('defaults entries/visits to empty arrays when payload.data lacks them', async () => {
      fixture.detectChanges();
      const fileUtil = TestBed.inject(FileUtilService);
      const importSpy = spyOn(facade, 'importAll').and.returnValue(Promise.resolve());
      spyOn(fileUtil, 'readFile').and.returnValue(Promise.resolve(JSON.stringify({ data: {} })));

      const fakeFile = new File(['x'], 'backup.json');
      const inputEl = { files: [fakeFile], value: 'x' } as unknown as HTMLInputElement;

      await component.handleImport({ target: inputEl } as unknown as Event);

      expect(importSpy).toHaveBeenCalledWith({ entries: [], visits: [] });
    });

    it('does not call facade.importAll when payload has no data field', async () => {
      fixture.detectChanges();
      const fileUtil = TestBed.inject(FileUtilService);
      const importSpy = spyOn(facade, 'importAll').and.returnValue(Promise.resolve());
      spyOn(fileUtil, 'readFile').and.returnValue(Promise.resolve(JSON.stringify({ version: '1.0' })));

      const fakeFile = new File(['x'], 'backup.json');
      const inputEl = { files: [fakeFile], value: 'x' } as unknown as HTMLInputElement;

      await component.handleImport({ target: inputEl } as unknown as Event);

      expect(importSpy).not.toHaveBeenCalled();
      expect(inputEl.value).toBe('');
      expect(component.showRestoreConfirm).toBeFalse();
    });
  });

  describe('dialog interactions', () => {
    let dialog: MatDialog;

    beforeEach(() => {
      dialog = TestBed.inject(MatDialog);
      fixture.detectChanges();
    });

    it('addEntry opens TimeEntryEditDialogComponent without data', () => {
      const fakeRef = { afterClosed: () => of(undefined) } as any;
      const openSpy = spyOn(dialog, 'open').and.returnValue(fakeRef);

      component.addEntry();

      expect(openSpy).toHaveBeenCalledWith(TimeEntryEditDialogComponent, { width: '450px' });
    });

    it('editEntry opens TimeEntryEditDialogComponent with the entry as data', () => {
      const fakeRef = { afterClosed: () => of(undefined) } as any;
      const openSpy = spyOn(dialog, 'open').and.returnValue(fakeRef);
      const entry = {
        id: 'e1',
        date: new Date(2025, 10, 5),
        durationMinutes: 30,
        type: 'preaching',
        typeLabel: 'Predicación',
      } as any;

      component.editEntry(entry);

      expect(openSpy).toHaveBeenCalledWith(TimeEntryEditDialogComponent, {
        width: '450px',
        data: { entry },
      });
    });
  });

  describe('incrementCourse / decrementCourse nullish fallback', () => {
    it('incrementCourse falls back to 0 when facade.totals() is null', () => {
      fixture.detectChanges();
      spyOn(facade, 'totals').and.returnValue(null as any);
      const updateSpy = spyOn(facade, 'updateManualCourseCount').and.returnValue(Promise.resolve());

      component.incrementCourse();

      expect(updateSpy).toHaveBeenCalledWith(1);
    });

    it('decrementCourse falls back to 0 when facade.totals() is null and skips the update', () => {
      fixture.detectChanges();
      spyOn(facade, 'totals').and.returnValue(null as any);
      const updateSpy = spyOn(facade, 'updateManualCourseCount').and.returnValue(Promise.resolve());

      component.decrementCourse();

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
});
