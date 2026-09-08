import { Component, computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';
import { BackupReminderFrequency, BackupReminderService } from '../../../../core/services/backup-reminder.service';
import { PillOption } from '../shared/option-pill-group/option-pill-group.component';

@Component({
  selector: 'ma-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  readonly themeService: ThemeService = inject(ThemeService);
  readonly backupService: BackupReminderService = inject(BackupReminderService);
  private readonly translate = inject(TranslateService);

  readonly themeOptions: PillOption[] = [
    { value: 'light', label: 'theme.light', icon: 'light_mode' },
    { value: 'dark',  label: 'theme.dark',  icon: 'dark_mode' },
    { value: 'system', label: 'theme.system', icon: 'brightness_auto' },
  ];

  readonly frequencyOptions: PillOption[] = [
    { value: 'daily',    label: 'settings.backup.frequencies.daily' },
    { value: 'weekly',   label: 'settings.backup.frequencies.weekly' },
    { value: 'monthly',  label: 'settings.backup.frequencies.monthly' },
    { value: 'disabled', label: 'settings.backup.frequencies.disabled' },
  ];

  readonly lastBackupFormatted = computed(() => {
    const date = this.backupService.lastBackupDate();
    if (!date) return null;
    const locale = this.translate.currentLang || 'es';
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(date));
  });

  readonly nextReminderFormatted = computed(() => {
    const date = this.backupService.nextReminderDate();
    if (!date) return null;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const next = new Date(date); next.setHours(0, 0, 0, 0);
    const diffDays = Math.round((next.getTime() - now.getTime()) / 86_400_000);
    if (diffDays <= 0) return null;
    if (diffDays === 1) return this.translate.instant('settings.backup.tomorrow');
    const locale = this.translate.currentLang || 'es';
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
  });

  setTheme(value: string): void {
    this.themeService.setMode(value as ThemeMode);
  }

  setFrequency(value: string): void {
    this.backupService.setFrequency(value as BackupReminderFrequency);
  }
}
