import { Injectable, signal } from '@angular/core';
import { DexieTimeEntryRepository } from '../data/time-entry.dexie';
import { TimeEntry, CourseVisit } from '../domain/models';
import computeMonthlyTotals, { MonthlyTotals } from '../domain/time-entry.usecase';

@Injectable({ providedIn: 'root' })
export class TimeEntryFacade {
  private repo: DexieTimeEntryRepository;

  // Signals
  public entries = signal<TimeEntry[]>([]);
  public visits = signal<CourseVisit[]>([]);
  public totals = signal<MonthlyTotals | null>(null);
  public currentYear = signal<number>(new Date().getFullYear());
  public currentMonth = signal<number>(new Date().getMonth() + 1);

  constructor(repo?: DexieTimeEntryRepository) {
    this.repo = repo ?? new DexieTimeEntryRepository();
  }

  async loadMonth(year = this.currentYear(), month = this.currentMonth()) {
    this.currentYear.set(year);
    this.currentMonth.set(month);
    const [entries, visits] = await Promise.all([
      this.repo.listEntriesByMonth(year, month),
      this.repo.listVisitsByMonth(year, month),
    ]);
    this.entries.set(entries);
    this.visits.set(visits);
    this.totals.set(computeMonthlyTotals(entries, visits, year, month));
  }

  async addEntry(entry: TimeEntry) {
    await this.repo.addEntry(entry);
    await this.loadMonth();
  }

  async updateEntry(entry: TimeEntry) {
    await this.repo.updateEntry(entry);
    await this.loadMonth();
  }

  async removeEntry(id: string) {
    await this.repo.removeEntry(id);
    await this.loadMonth();
  }

  async addVisit(visit: CourseVisit) {
    await this.repo.addVisit(visit);
    await this.loadMonth();
  }

  async updateVisit(visit: CourseVisit) {
    await this.repo.updateVisit(visit);
    await this.loadMonth();
  }

  async removeVisit(id: string) {
    await this.repo.removeVisit(id);
    await this.loadMonth();
  }

  // Export / Import wrappers
  async exportJSON(): Promise<string> {
    const payload = await this.repo.exportAll();
    return JSON.stringify(payload, null, 2);
  }

  async exportCSV(): Promise<string> {
    const { entries, visits } = await this.repo.exportAll();
    // lazy import exporter to avoid cyclic deps in tests
    const { toCSV } = await import('./time-entry.exporter');
    return toCSV(entries, visits);
  }

  async importJSON(json: string) {
    const payload = JSON.parse(json);
    await this.repo.importAll(payload);
    // reload current month
    await this.loadMonth();
  }
}


export default TimeEntryFacade;
