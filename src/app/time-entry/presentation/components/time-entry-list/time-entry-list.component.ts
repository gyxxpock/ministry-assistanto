import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { TimeEntryEditDialogComponent } from '../time-entry-edit/time-entry-edit-dialog.component';
import { TimeEntryVM } from '../../models/time-entry.vm';
import { FileUtilService } from '../../../domain/utils/file-util.service';
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
  today = new Date();

  // Dentro de tu clase:
  private fileUtil = inject(FileUtilService);
  private exporter = inject(TimeEntryExporter);

  async shareReport() {
    const text = this.facade.getFormattedMonthlyReport();

    if (navigator.share) {
      await navigator.share({
        text: text // iOS prefiere 'text' sobre 'title' para WhatsApp
      });
    }
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

  async handleImport(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    try {
      const rawContent = await this.fileUtil.readFile(file);
      const payload = JSON.parse(rawContent);

      if (payload.data) {
        const confirmImport = confirm('¿Deseas importar los datos? Se fusionarán con los existentes.');

        if (confirmImport) {
          // --- REHIDRATACIÓN DE FECHAS ---
          // Convertimos los strings de fecha de vuelta a objetos Date nativos
          const sanitizedData = {
            entries: (payload.data.entries || []).map((e: any) => ({
              ...e,
              date: new Date(e.date) // Conversión string -> Date
            })),
            visits: (payload.data.visits || []).map((v: any) => ({
              ...v,
              date: new Date(v.date) // Conversión string -> Date
            }))
          };

          await this.facade.importAll(sanitizedData);
          console.log('Importación completada con objetos Date nativos');
        }
      }
    } catch (error) {
      console.error('Error durante la importación:', error);
      alert('Error al procesar el archivo JSON');
    } finally {
      input.value = '';
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