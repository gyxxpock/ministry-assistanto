import { Injectable, Inject, signal } from '@angular/core';
import { TIME_ENTRY_REPOSITORY } from '../presentation/tokens/time-entry.tokens';
import { ITimeEntryRepository } from '../data/time-entry.repository';
import { TimeEntry, CourseVisit } from '../domain/models';
import computeMonthlyTotals, { MonthlyTotals } from '../domain/time-entry.usecase';

@Injectable()
export class TimeEntryFacade {
  // Signals
  public entries = signal<TimeEntry[]>([]);
  public visits = signal<CourseVisit[]>([]);
  public totals = signal<MonthlyTotals | null>(null);
  public currentYear = signal<number>(new Date().getFullYear());
  public currentMonth = signal<number>(new Date().getMonth() + 1);

  constructor(
    @Inject(TIME_ENTRY_REPOSITORY)
    private readonly repo: ITimeEntryRepository
  ) {}

  async loadMonth(year = this.currentYear(), month = this.currentMonth()) {
    this.currentYear.set(year);
    this.currentMonth.set(month);

    const [entries, visits] = await Promise.all([
      this.repo.listEntriesByMonth(year, month),
      this.repo.listVisitsByMonth(year, month),
    ]);

    this.entries.set(entries);
    this.visits.set(visits);
    this.totals.set(
      computeMonthlyTotals(entries, visits, year, month)
    );
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
}