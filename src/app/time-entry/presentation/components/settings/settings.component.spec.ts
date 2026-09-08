import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsComponent } from './settings.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { BackupReminderService } from '../../../../core/services/backup-reminder.service';

@Pipe({ name: 'translate' })
class TranslateStub implements PipeTransform {
  transform(value: string): string { return value; }
}

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockTheme: jasmine.SpyObj<ThemeService>;
  let mockBackup: jasmine.SpyObj<BackupReminderService>;
  let mockTranslate: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    mockTheme = jasmine.createSpyObj('ThemeService', ['setMode'], {
      mode: signal<'light' | 'dark' | 'system'>('system'),
    });
    mockBackup = jasmine.createSpyObj(
      'BackupReminderService',
      ['setFrequency', 'recordBackup', 'dismiss'],
      {
        frequency: signal<'daily' | 'weekly' | 'monthly' | 'disabled'>('weekly'),
        isReminderDue: signal(false),
        lastBackupDate: signal<string | null>(null),
        nextReminderDate: signal<Date | null>(null),
      }
    );
    mockTranslate = jasmine.createSpyObj('TranslateService', ['instant', 'get'], {
      currentLang: 'es',
    });
    mockTranslate.instant.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent, TranslateStub],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ThemeService, useValue: mockTheme },
        { provide: BackupReminderService, useValue: mockBackup },
        { provide: TranslateService, useValue: mockTranslate },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('exposes themeOptions with 3 entries', () => {
    expect(component.themeOptions.length).toBe(3);
  });

  it('exposes frequencyOptions with 4 entries', () => {
    expect(component.frequencyOptions.length).toBe(4);
  });

  it('setTheme() delegates to themeService.setMode()', () => {
    component.setTheme('dark');
    expect(mockTheme.setMode).toHaveBeenCalledWith('dark');
  });

  it('setFrequency() delegates to backupService.setFrequency()', () => {
    component.setFrequency('monthly');
    expect(mockBackup.setFrequency).toHaveBeenCalledWith('monthly');
  });

  it('lastBackupFormatted returns null when no last backup date', () => {
    expect(component.lastBackupFormatted()).toBeNull();
  });

  it('nextReminderFormatted returns null when nextReminderDate is null', () => {
    expect(component.nextReminderFormatted()).toBeNull();
  });
});
