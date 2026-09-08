import { Component, computed, inject, signal } from '@angular/core';
import { BackupReminderService } from '../../../../core/services/backup-reminder.service';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import TimeEntryExporter from '../../../facade/time-entry.exporter';
import { FileUtilService } from '../../../data/utils/file-util.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private readonly backupService = inject(BackupReminderService);
  private readonly facade = inject(TimeEntryFacade);
  private readonly exporter = inject(TimeEntryExporter);
  private readonly fileUtil = inject(FileUtilService);

  navVisible = signal(true);
  headerOpacity = signal(1);
  readonly showBanner = computed(() => this.backupService.isReminderDue());
  private lastScrollTop = 0;

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const currentScroll = element.scrollTop;

    const newOpacity = 1 - (currentScroll / 100);
    this.headerOpacity.set(newOpacity < 0 ? 0 : newOpacity);

    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      this.navVisible.set(false);
    } else {
      this.navVisible.set(true);
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  async handleBannerBackup(): Promise<void> {
    try {
      const { entries, visits } = await this.facade.exportAll();
      const json = this.exporter.generateJSON(entries, visits);
      const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`;
      this.fileUtil.downloadFile(json, fileName, 'application/json');
      this.backupService.recordBackup();
    } catch {
      // export error is handled silently; user can retry from the list view
    }
  }
}
