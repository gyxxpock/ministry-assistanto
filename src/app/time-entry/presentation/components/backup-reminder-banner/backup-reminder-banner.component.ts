import { Component, EventEmitter, inject, Output } from '@angular/core';
import { BackupReminderService } from '../../../../core/services/backup-reminder.service';

@Component({
  selector: 'ma-backup-reminder-banner',
  standalone: false,
  templateUrl: './backup-reminder-banner.component.html',
  styleUrl: './backup-reminder-banner.component.scss',
})
export class BackupReminderBannerComponent {
  @Output() doBackup = new EventEmitter<void>();

  readonly backupService = inject(BackupReminderService);

  onDoBackup(): void {
    this.doBackup.emit();
  }

  onDismiss(): void {
    this.backupService.dismiss();
  }
}
