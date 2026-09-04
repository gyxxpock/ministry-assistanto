import { Injectable, Inject, signal, computed } from '@angular/core';
import { ITimeEntryRepository } from '../domain/i-time-entry.repository';
import { TIME_ENTRY_REPOSITORY } from '../presentation/tokens/time-entry.tokens';
import { TimeEntry, CourseVisit } from '../domain/models';
import computeMonthlyTotals, { MonthlyTotals, mergeTimeEntry, toDateKey } from '../domain/time-entry.usecase';
import { CreateTimeEntryVM, TimeEntryVM, UpdateTimeEntryVM } from '../presentation/models/time-entry.vm';

@Injectable()
export class TimeEntryFacade {

  // ============================
  // Internal domain state
  // ============================

  private readonly _entries = signal<TimeEntry[]>([]);
  private readonly _visits = signal<CourseVisit[]>([]);
  private readonly _manualCourseCounts = signal<number>(0);

  // ============================
  // View Models (UI-ready)
  // ============================

  readonly entries = computed<TimeEntryVM[]>(() =>
    this._entries().map(e => (
      {
        id: e.id,
        date: e.date,
        durationMinutes: e.durationMinutes,
        type: e.type,
        notes: e.notes,
        typeLabel: this.translateType(e.type)
      }))
  );

  readonly visits = computed(() =>
    this._visits().map(v => ({
      id: v.id,
      date: v.date,
      minutes: v.durationMinutes,
      person: v.personName || v.personId
    }))
  );

  readonly totals = computed<MonthlyTotals | null>(() =>
    computeMonthlyTotals(
      this._entries(),
      this._visits(),
      this.currentYear(),
      this.currentMonth(),
      this._manualCourseCounts()
    )
  );

  readonly currentYear = signal(new Date().getFullYear());
  readonly currentMonth = signal(new Date().getMonth() + 1);

  constructor(
    @Inject(TIME_ENTRY_REPOSITORY)
    private readonly repository: ITimeEntryRepository
  ) { }

  // ============================
  // Load
  // ============================

  async loadMonth(
    year: number = this.currentYear(),
    month: number = this.currentMonth()
  ): Promise<void> {

    this.currentYear.set(year);
    this.currentMonth.set(month);

    const [entries, visits, manualCount] = await Promise.all([
      this.repository.listEntriesByMonth(year, month),
      this.repository.listVisitsByMonth(year, month),
      this.repository.getCourseCount(year, month)
    ]);

    this._entries.set(entries);
    this._visits.set(visits);
    this._manualCourseCounts.set(manualCount);
  }

  // ============================
  // Commands (unchanged)
  // ============================

  async addEntry(vm: CreateTimeEntryVM): Promise<void> {
    const dateKey = toDateKey(vm.date);
    const existing = this._entries().find(
      e => toDateKey(e.date) === dateKey && e.type === vm.type
    );

    if (existing) {
      await this.repository.updateEntry(mergeTimeEntry(existing, vm));
    } else {
      const entry: TimeEntry = {
        id: crypto.randomUUID(),
        date: vm.date,
        durationMinutes: vm.durationMinutes,
        type: vm.type,
        notes: vm.notes,
        createdAt: new Date().toISOString(),
        source: 'local',
      };
      await this.repository.addEntry(entry);
    }

    await this.loadMonth();
  }

  async updateEntry(vm: UpdateTimeEntryVM): Promise<void> {
    await this.repository.updateEntry({
      ...vm,
      updatedAt: new Date().toISOString()
    } as TimeEntry);
    await this.loadMonth();
  }

  async removeEntry(id: string): Promise<void> {
    await this.repository.removeEntry(id);
    await this.loadMonth();
  }

  async addVisit(visit: CourseVisit): Promise<void> {
    await this.repository.addVisit(visit);
    await this.loadMonth();
  }

  async updateVisit(visit: CourseVisit): Promise<void> {
    await this.repository.updateVisit({
      ...visit,
      updatedAt: new Date().toISOString()
    });
    await this.loadMonth();
  }

  async removeVisit(id: string): Promise<void> {
    await this.repository.removeVisit(id);
    await this.loadMonth();
  }

  async exportAll(): Promise<{ entries: TimeEntry[]; visits: CourseVisit[] }> {
    return this.repository.exportAll();
  }

  async importAll(data: { entries?: TimeEntry[]; visits?: CourseVisit[] }): Promise<void> {
    await this.repository.importAll(data);
    await this.loadMonth();
  }

  // ============================
  // Course Manual Commands
  // ============================
  async updateManualCourseCount(count: number): Promise<void> {
    const year = this.currentYear();
    const month = this.currentMonth();
    await this.repository.setCourseCount(year, month, count);
    await this.loadMonth(year, month);
  }



  // ============================
  // UI helpers
  // ============================

  private translateType(type: string): string {
    switch (type) {
      case 'preaching': return 'Predicación';
      case 'study': return 'Estudio';
      case 'visiting': return 'Visita';
      case 'other': return 'Otro';
      default: return type;
    }
  }
}