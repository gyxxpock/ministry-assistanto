import { computed, Injectable, signal } from '@angular/core';

export type BackupReminderFrequency = 'daily' | 'weekly' | 'monthly' | 'disabled';

const FREQ_KEY = 'ma-backup-frequency';
const DATE_KEY = 'ma-last-backup-date';

const DAYS: Record<Exclude<BackupReminderFrequency, 'disabled'>, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

@Injectable({ providedIn: 'root' })
export class BackupReminderService {
  private readonly _frequency = signal<BackupReminderFrequency>(
    (localStorage.getItem(FREQ_KEY) as BackupReminderFrequency | null) ?? 'weekly'
  );
  private readonly _lastBackupDate = signal<string | null>(
    localStorage.getItem(DATE_KEY)
  );
  private readonly _dismissed = signal(false);

  readonly frequency = this._frequency.asReadonly();
  readonly lastBackupDate = this._lastBackupDate.asReadonly();

  readonly isReminderDue = computed(() => {
    const freq = this._frequency();
    if (freq === 'disabled' || this._dismissed()) return false;

    const last = this._lastBackupDate();
    if (!last) return true;

    const diffDays = Math.floor((Date.now() - new Date(last).getTime()) / 86_400_000);
    return diffDays >= DAYS[freq];
  });

  readonly nextReminderDate = computed<Date | null>(() => {
    const freq = this._frequency();
    if (freq === 'disabled') return null;

    const last = this._lastBackupDate();
    if (!last) return new Date();

    const next = new Date(last);
    next.setDate(next.getDate() + DAYS[freq]);
    return next;
  });

  setFrequency(frequency: BackupReminderFrequency): void {
    this._frequency.set(frequency);
    localStorage.setItem(FREQ_KEY, frequency);
  }

  recordBackup(): void {
    const today = new Date().toISOString().split('T')[0];
    this._lastBackupDate.set(today);
    localStorage.setItem(DATE_KEY, today);
    this._dismissed.set(false);
  }

  dismiss(): void {
    this._dismissed.set(true);
  }
}
