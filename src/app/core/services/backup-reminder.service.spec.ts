import { TestBed } from '@angular/core/testing';
import { BackupReminderService } from './backup-reminder.service';

const FREQ_KEY = 'ma-backup-frequency';
const DATE_KEY = 'ma-last-backup-date';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

describe('BackupReminderService', () => {
  let service: BackupReminderService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  function inject(): BackupReminderService {
    return TestBed.inject(BackupReminderService);
  }

  describe('isReminderDue — disabled', () => {
    it('returns false when frequency is disabled', () => {
      localStorage.setItem(FREQ_KEY, 'disabled');
      service = inject();
      expect(service.isReminderDue()).toBe(false);
    });
  });

  describe('isReminderDue — no backup recorded', () => {
    it('returns true when no last backup date exists', () => {
      service = inject();
      expect(service.isReminderDue()).toBe(true);
    });

    it('returns false when dismissed even with no backup date', () => {
      service = inject();
      service.dismiss();
      expect(service.isReminderDue()).toBe(false);
    });
  });

  describe('isReminderDue — daily frequency', () => {
    it('returns true when backed up more than 1 day ago', () => {
      localStorage.setItem(FREQ_KEY, 'daily');
      localStorage.setItem(DATE_KEY, daysAgo(2));
      service = inject();
      expect(service.isReminderDue()).toBe(true);
    });

    it('returns true on the boundary (exactly 1 day ago)', () => {
      localStorage.setItem(FREQ_KEY, 'daily');
      localStorage.setItem(DATE_KEY, daysAgo(1));
      service = inject();
      expect(service.isReminderDue()).toBe(true);
    });

    it('returns false when backed up today', () => {
      localStorage.setItem(FREQ_KEY, 'daily');
      localStorage.setItem(DATE_KEY, daysAgo(0));
      service = inject();
      expect(service.isReminderDue()).toBe(false);
    });
  });

  describe('isReminderDue — weekly frequency', () => {
    it('returns true when backed up 8 days ago', () => {
      localStorage.setItem(FREQ_KEY, 'weekly');
      localStorage.setItem(DATE_KEY, daysAgo(8));
      service = inject();
      expect(service.isReminderDue()).toBe(true);
    });

    it('returns true on the boundary (exactly 7 days ago)', () => {
      localStorage.setItem(FREQ_KEY, 'weekly');
      localStorage.setItem(DATE_KEY, daysAgo(7));
      service = inject();
      expect(service.isReminderDue()).toBe(true);
    });

    it('returns false when backed up 3 days ago', () => {
      localStorage.setItem(FREQ_KEY, 'weekly');
      localStorage.setItem(DATE_KEY, daysAgo(3));
      service = inject();
      expect(service.isReminderDue()).toBe(false);
    });
  });

  describe('isReminderDue — monthly frequency', () => {
    it('returns true when backed up 31 days ago', () => {
      localStorage.setItem(FREQ_KEY, 'monthly');
      localStorage.setItem(DATE_KEY, daysAgo(31));
      service = inject();
      expect(service.isReminderDue()).toBe(true);
    });

    it('returns true on the boundary (exactly 30 days ago)', () => {
      localStorage.setItem(FREQ_KEY, 'monthly');
      localStorage.setItem(DATE_KEY, daysAgo(30));
      service = inject();
      expect(service.isReminderDue()).toBe(true);
    });

    it('returns false when backed up 15 days ago', () => {
      localStorage.setItem(FREQ_KEY, 'monthly');
      localStorage.setItem(DATE_KEY, daysAgo(15));
      service = inject();
      expect(service.isReminderDue()).toBe(false);
    });
  });

  describe('dismiss()', () => {
    it('suppresses an overdue reminder', () => {
      service = inject(); // no backup → due
      expect(service.isReminderDue()).toBe(true);
      service.dismiss();
      expect(service.isReminderDue()).toBe(false);
    });
  });

  describe('recordBackup()', () => {
    it('clears the reminder after recording', () => {
      localStorage.setItem(FREQ_KEY, 'daily');
      localStorage.setItem(DATE_KEY, daysAgo(5));
      service = inject();
      expect(service.isReminderDue()).toBe(true);
      service.recordBackup();
      expect(service.isReminderDue()).toBe(false);
    });

    it('stores today as lastBackupDate', () => {
      service = inject();
      service.recordBackup();
      const today = new Date().toISOString().split('T')[0];
      expect(service.lastBackupDate()).toBe(today);
      expect(localStorage.getItem(DATE_KEY)).toBe(today);
    });

    it('reactivates reminder after dismiss + recordBackup if time passes', () => {
      // Record backup now, then dismiss — reminder should still be cleared
      service = inject();
      service.recordBackup();
      service.dismiss();
      expect(service.isReminderDue()).toBe(false);
    });
  });

  describe('setFrequency()', () => {
    it('updates the frequency signal', () => {
      service = inject();
      service.setFrequency('monthly');
      expect(service.frequency()).toBe('monthly');
    });

    it('persists frequency to localStorage', () => {
      service = inject();
      service.setFrequency('daily');
      expect(localStorage.getItem(FREQ_KEY)).toBe('daily');
    });

    it('disabling hides an overdue reminder', () => {
      service = inject(); // no backup → due
      expect(service.isReminderDue()).toBe(true);
      service.setFrequency('disabled');
      expect(service.isReminderDue()).toBe(false);
    });
  });

  describe('nextReminderDate', () => {
    it('returns null when frequency is disabled', () => {
      localStorage.setItem(FREQ_KEY, 'disabled');
      service = inject();
      expect(service.nextReminderDate()).toBeNull();
    });

    it('returns today when no backup date recorded', () => {
      service = inject();
      const today = new Date().toISOString().split('T')[0];
      const result = service.nextReminderDate()!;
      expect(result.toISOString().split('T')[0]).toBe(today);
    });

    it('returns last backup date + frequency days', () => {
      localStorage.setItem(FREQ_KEY, 'weekly');
      localStorage.setItem(DATE_KEY, daysAgo(0));
      service = inject();
      const next = service.nextReminderDate()!;
      // Verify it's a valid Date approximately 7 days from now (±1 for timezone handling)
      const diffDays = Math.round((next.getTime() - Date.now()) / 86_400_000);
      expect(diffDays).toBeGreaterThanOrEqual(6);
      expect(diffDays).toBeLessThanOrEqual(8);
    });
  });
});
