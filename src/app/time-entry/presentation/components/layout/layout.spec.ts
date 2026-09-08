import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EMPTY } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { Layout } from './layout';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import TimeEntryExporter from '../../../facade/time-entry.exporter';
import { FileUtilService } from '../../../data/utils/file-util.service';
import { BackupReminderService } from '../../../../core/services/backup-reminder.service';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    const mockFacade = jasmine.createSpyObj('TimeEntryFacade', ['loadMonth', 'exportAll'], {
      currentMonth: signal(new Date()),
      entries: signal([]),
      isLoading: signal(false),
    });
    mockFacade.exportAll.and.returnValue(Promise.resolve({ entries: [], visits: [] }));

    const mockBackupService = jasmine.createSpyObj('BackupReminderService', ['dismiss', 'recordBackup'], {
      isReminderDue: signal(false),
    });

    const mockExporter = jasmine.createSpyObj('TimeEntryExporter', ['generateJSON']);
    const mockFileUtil = jasmine.createSpyObj('FileUtilService', ['downloadFile']);

    const mockSwUpdate = {
      versionUpdates: EMPTY,
      activateUpdate: () => Promise.resolve(),
    };

    await TestBed.configureTestingModule({
      declarations: [Layout],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TimeEntryFacade, useValue: mockFacade },
        { provide: BackupReminderService, useValue: mockBackupService },
        { provide: TimeEntryExporter, useValue: mockExporter },
        { provide: FileUtilService, useValue: mockFileUtil },
        { provide: SwUpdate, useValue: mockSwUpdate },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
