import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { TimeEntryEditDialogComponent } from '../time-entry-edit/time-entry-edit-dialog.component';
import { TimeEntryVM } from '../../models/time-entry.vm';
import { FileUtilService } from '../../../data/utils/file-util.service';
import TimeEntryExporter from '../../../facade/time-entry.exporter';

@Component({
  selector: 'ma-time-entry-list',
  templateUrl: './time-entry-list.component.html',
  styleUrls: ['./time-entry-list.component.scss'],
  standalone: false,
})
export class TimeEntryListComponent implements OnInit {
  currentDate = signal(new Date());
  readonly isExporting = signal(false);
  showRestoreConfirm = false;
  today = new Date();

  // Dentro de tu clase:
  private fileUtil = inject(FileUtilService);
  private exporter = inject(TimeEntryExporter);

  async shareReport() {
    if (navigator.share) {
      await navigator.share({ text: this.getFormattedMonthlyReport() });
    }
  }

  private getFormattedMonthlyReport(): string {
    const totals = this.facade.totals();
    const year = this.facade.currentYear();
    const month = this.facade.currentMonth();
    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(year, month - 1));
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    let report = `📋 *INFORME DE ACTIVIDAD*\n`;
    report += `${capitalizedMonth} de ${year}\n\n`;
    report += `⏱️ *Tiempo total:* ${totals?.totalHours || 0}h\n`;
    report += `📚 *Cursos:* ${totals?.totalCourses || 0}\n`;
    return report;
  }



  async handleExport() {
    this.isExporting.set(true);
    try {
      const { entries, visits } = await this.facade.exportAll();
      const jsonContent = this.exporter.generateJSON(entries, visits);

      const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`;
      this.fileUtil.downloadFile(jsonContent, fileName, 'application/json');
    } finally {
      this.isExporting.set(false);
    }
  }

  onRestoreRequest() {
    this.showRestoreConfirm = true;
  }

  onRestoreCancel() {
    this.showRestoreConfirm = false;
  }

  async handleImport(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    try {
      const rawContent = await this.fileUtil.readFile(file);
      const payload = JSON.parse(rawContent);

      if (payload.data) {
        const sanitizedData = {
          entries: (payload.data.entries || []).map((e: any) => ({
            ...e,
            date: new Date(e.date)
          })),
          visits: (payload.data.visits || []).map((v: any) => ({
            ...v,
            date: new Date(v.date)
          }))
        };
        await this.facade.importAll(sanitizedData);
      }
    } catch (error) {
      console.error('Error durante la importación:', error);
    } finally {
      input.value = '';
      this.showRestoreConfirm = false;
    }
  }

  private toKey(date: Date | string): string {
    const d = new Date(date);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  /**
   * Groups entries by day for the view.
   */
  groupedEntries = computed(() => {
    const entries = this.facade.entries();
    const map = new Map<string, TimeEntryVM[]>();

    for (const entry of entries) {
      if (!map.has(this.toKey(entry.date))) {
        map.set(this.toKey(entry.date), []);
      }
      map.get(this.toKey(entry.date))!.push(entry);
    }

    return Array.from(map.entries()).map(([date, entries]) => ({
      date,
      entries,
    }));
  });

  isCurrentMonth = computed(() => {
    const currentDate = this.currentDate();
    return (
      currentDate.getFullYear() === this.today.getFullYear() &&
      currentDate.getMonth() === this.today.getMonth()
    );
  });

  constructor(public facade: TimeEntryFacade, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.facade.loadMonth(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1);
  }

  prevMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    this.loadData();
  }

  nextMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    this.loadData();
  }

  goToToday(): void {
    this.currentDate.set(new Date());
    this.loadData();
  }

  addEntry(): void {
    this.dialog.open(TimeEntryEditDialogComponent, {
      width: '450px',
    });
  }

  editEntry(entry: TimeEntryVM): void {
    this.dialog.open(TimeEntryEditDialogComponent, {
      width: '450px',
      data: { entry },
    });
  }

  incrementCourse() {
    const current = this.facade.totals()?.totalCourses ?? 0;
    this.facade.updateManualCourseCount(current + 1);
  }

  decrementCourse() {
    const current = this.facade.totals()?.totalCourses ?? 0;
    if (current > 0) {
      this.facade.updateManualCourseCount(current - 1);
    }
  }
}