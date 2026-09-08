import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform, signal } from '@angular/core';
import { BackupReminderBannerComponent } from './backup-reminder-banner.component';
import { BackupReminderService } from '../../../../core/services/backup-reminder.service';

@Pipe({ name: 'translate', standalone: true })
class TranslateStub implements PipeTransform {
  transform(value: string): string { return value; }
}

describe('BackupReminderBannerComponent', () => {
  let component: BackupReminderBannerComponent;
  let fixture: ComponentFixture<BackupReminderBannerComponent>;
  let mockBackupService: jasmine.SpyObj<BackupReminderService>;

  beforeEach(async () => {
    mockBackupService = jasmine.createSpyObj('BackupReminderService', ['dismiss'], {
      isReminderDue: signal(true),
      frequency: signal<'daily' | 'weekly' | 'monthly' | 'disabled'>('weekly'),
    });

    await TestBed.configureTestingModule({
      declarations: [BackupReminderBannerComponent],
      imports: [TranslateStub],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: BackupReminderService, useValue: mockBackupService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BackupReminderBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('onDoBackup() emits doBackup event', () => {
    let emitted = false;
    component.doBackup.subscribe(() => (emitted = true));
    component.onDoBackup();
    expect(emitted).toBe(true);
  });

  it('onDismiss() delegates to backupService.dismiss()', () => {
    component.onDismiss();
    expect(mockBackupService.dismiss).toHaveBeenCalled();
  });
});
