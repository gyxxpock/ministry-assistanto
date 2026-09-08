import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform, WritableSignal, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsComponent } from './settings.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { BackupReminderService } from '../../../../core/services/backup-reminder.service';
import { ChangelogService } from '../../../../core/services/changelog.service';

@Pipe({ name: 'translate', standalone: true })
class TranslateStub implements PipeTransform {
  transform(value: string): string { return value; }
}

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockTheme: jasmine.SpyObj<ThemeService>;
  let mockBackup: jasmine.SpyObj<BackupReminderService>;
  let mockTranslate: jasmine.SpyObj<TranslateService>;
  let lastBackupDateSignal: WritableSignal<string | null>;
  let nextReminderDateSignal: WritableSignal<Date | null>;

  beforeEach(async () => {
    lastBackupDateSignal = signal<string | null>(null);
    nextReminderDateSignal = signal<Date | null>(null);

    mockTheme = jasmine.createSpyObj('ThemeService', ['setMode'], {
      mode: signal<'light' | 'dark' | 'system'>('system'),
    });
    mockBackup = jasmine.createSpyObj(
      'BackupReminderService',
      ['setFrequency', 'recordBackup', 'dismiss'],
      {
        frequency: signal<'daily' | 'weekly' | 'monthly' | 'disabled'>('weekly'),
        isReminderDue: signal(false),
        lastBackupDate: lastBackupDateSignal,
        nextReminderDate: nextReminderDateSignal,
      }
    );
    mockTranslate = jasmine.createSpyObj('TranslateService', ['instant', 'get'], {
      currentLang: 'es',
    });
    mockTranslate.instant.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [TranslateStub],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ThemeService, useValue: mockTheme },
        { provide: BackupReminderService, useValue: mockBackup },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: ChangelogService, useValue: { entries: signal([]) } },
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

  describe('lastBackupFormatted', () => {
    it('returns null when no last backup date', () => {
      expect(component.lastBackupFormatted()).toBeNull();
    });

    it('returns a formatted date string when last backup date is set', () => {
      lastBackupDateSignal.set('2025-06-15');
      fixture.detectChanges();
      const result = component.lastBackupFormatted();
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('nextReminderFormatted', () => {
    it('returns null when nextReminderDate is null', () => {
      expect(component.nextReminderFormatted()).toBeNull();
    });

    it('returns null for a past date', () => {
      const past = new Date();
      past.setDate(past.getDate() - 2);
      nextReminderDateSignal.set(past);
      fixture.detectChanges();
      expect(component.nextReminderFormatted()).toBeNull();
    });

    it('returns "tomorrow" translation key when reminder is tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0);
      nextReminderDateSignal.set(tomorrow);
      fixture.detectChanges();
      expect(component.nextReminderFormatted()).toBe('settings.backup.tomorrow');
    });

    it('returns a formatted date string for a future date beyond tomorrow', () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);
      nextReminderDateSignal.set(future);
      fixture.detectChanges();
      const result = component.nextReminderFormatted();
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
