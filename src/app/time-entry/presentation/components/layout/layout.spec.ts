import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Layout } from './layout';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import TimeEntryExporter from '../../../facade/time-entry.exporter';
import { FileUtilService } from '../../../../core/services/file-util.service';
import { BackupReminderService } from '../../../../core/services/backup-reminder.service';
import { UpdateNotificationService } from '../../../../core/services/update-notification.service';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;
  let mockFacade: jasmine.SpyObj<TimeEntryFacade>;
  let mockBackupService: jasmine.SpyObj<BackupReminderService>;
  let mockUpdateService: jasmine.SpyObj<UpdateNotificationService>;
  let mockExporter: jasmine.SpyObj<TimeEntryExporter>;
  let mockFileUtil: jasmine.SpyObj<FileUtilService>;

  beforeEach(async () => {
    mockFacade = jasmine.createSpyObj('TimeEntryFacade', ['loadMonth', 'exportAll'], {
      currentMonth: signal(new Date()),
      entries: signal([]),
      isLoading: signal(false),
    });
    mockFacade.exportAll.and.returnValue(Promise.resolve({ entries: [], visits: [] }));

    mockBackupService = jasmine.createSpyObj('BackupReminderService', ['dismiss', 'recordBackup'], {
      isReminderDue: signal(false),
    });

    mockUpdateService = jasmine.createSpyObj('UpdateNotificationService', ['applyUpdate', 'dismiss'], {
      isUpdateAvailable: signal(false),
      changes: signal([]),
    });

    mockExporter = jasmine.createSpyObj('TimeEntryExporter', ['generateJSON']);
    mockExporter.generateJSON.and.returnValue('{"entries":[]}');

    mockFileUtil = jasmine.createSpyObj('FileUtilService', ['downloadFile']);

    await TestBed.configureTestingModule({
      declarations: [Layout],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TimeEntryFacade, useValue: mockFacade },
        { provide: BackupReminderService, useValue: mockBackupService },
        { provide: UpdateNotificationService, useValue: mockUpdateService },
        { provide: TimeEntryExporter, useValue: mockExporter },
        { provide: FileUtilService, useValue: mockFileUtil },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleUpdateApply()', () => {
    it('delegates to updateService.applyUpdate()', () => {
      component.handleUpdateApply();
      expect(mockUpdateService.applyUpdate).toHaveBeenCalled();
    });
  });

  describe('handleUpdateDismiss()', () => {
    it('delegates to updateService.dismiss()', () => {
      component.handleUpdateDismiss();
      expect(mockUpdateService.dismiss).toHaveBeenCalled();
    });
  });

  describe('handleBannerBackup()', () => {
    it('calls exportAll on the facade', async () => {
      await component.handleBannerBackup();
      expect(mockFacade.exportAll).toHaveBeenCalled();
    });

    it('generates JSON via the exporter', async () => {
      await component.handleBannerBackup();
      expect(mockExporter.generateJSON).toHaveBeenCalledWith([], []);
    });

    it('triggers file download with application/json content type', async () => {
      await component.handleBannerBackup();
      const [, , contentType] = mockFileUtil.downloadFile.calls.mostRecent().args;
      expect(contentType).toBe('application/json');
    });

    it('records the backup after a successful export', async () => {
      await component.handleBannerBackup();
      expect(mockBackupService.recordBackup).toHaveBeenCalled();
    });

    it('does not throw when exportAll rejects', async () => {
      mockFacade.exportAll.and.returnValue(Promise.reject(new Error('network error')));
      await expectAsync(component.handleBannerBackup()).toBeResolved();
    });

    it('does not record backup when export fails', async () => {
      mockFacade.exportAll.and.returnValue(Promise.reject(new Error('fail')));
      await component.handleBannerBackup();
      expect(mockBackupService.recordBackup).not.toHaveBeenCalled();
    });
  });

  describe('Plan navigation button', () => {
    it('links to /time-entry/plan via routerLink', () => {
      const planBtn: HTMLElement = fixture.nativeElement.querySelector('[routerLink="/time-entry/plan"]');
      expect(planBtn).not.toBeNull();
    });

    it('shows the "event_available" icon', () => {
      const planBtn: HTMLElement = fixture.nativeElement.querySelector('[routerLink="/time-entry/plan"]');
      expect(planBtn.querySelector('mat-icon')?.textContent?.trim()).toBe('event_available');
    });

    it('labels the button with the "planning.pages.plan.title" i18n key', () => {
      const planBtn: HTMLElement = fixture.nativeElement.querySelector('[routerLink="/time-entry/plan"]');
      expect(planBtn.querySelector('.label')?.textContent).toContain('planning.pages.plan.title');
    });
  });

  describe('onScroll()', () => {
    function makeScrollEvent(scrollTop: number): Event {
      const div = document.createElement('div');
      Object.defineProperty(div, 'scrollTop', { value: scrollTop, writable: true });
      return { target: div } as unknown as Event;
    }

    it('shows nav when scroll is at top', () => {
      component.onScroll(makeScrollEvent(0));
      expect(component.navVisible()).toBe(true);
    });

    it('hides nav when scrolling down past 50px', () => {
      component.onScroll(makeScrollEvent(60));
      component.onScroll(makeScrollEvent(100));
      expect(component.navVisible()).toBe(false);
    });

    it('shows nav when scrolling back up', () => {
      component.onScroll(makeScrollEvent(100));
      component.onScroll(makeScrollEvent(40));
      expect(component.navVisible()).toBe(true);
    });

    it('reduces headerOpacity proportionally as scroll increases', () => {
      component.onScroll(makeScrollEvent(50));
      expect(component.headerOpacity()).toBe(0.5);
    });

    it('clamps headerOpacity to 0 when scroll exceeds 100', () => {
      component.onScroll(makeScrollEvent(150));
      expect(component.headerOpacity()).toBe(0);
    });
  });
});
