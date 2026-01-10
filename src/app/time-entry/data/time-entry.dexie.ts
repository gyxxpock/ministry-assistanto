import Dexie, { Table } from 'dexie';
import { ITimeEntryRepository } from './time-entry.repository';
import { TimeEntry, CourseVisit } from '../domain/models';
import { Injectable } from '@angular/core';
import { EntityTable } from 'dexie';

export class TimeEntryDB extends Dexie {
  entries!: EntityTable<TimeEntry, 'id'>;
  visits!: EntityTable<CourseVisit, 'id'>;

  constructor(dbName = 'ministry-assistanto-db') {
    super(dbName);
    this.version(1).stores({
      entries: 'id,date,type,createdAt',
      visits: 'id,date,personId,personName,createdAt'
    });

    // optional: request persistent storage when available
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).storage?.persist?.().then((granted: boolean) => {
        // no-op: presence of the call is the goal
        console.debug('storage.persist granted:', granted);
      }).catch(() => { });
    } catch (e) {
      // ignore in test or environments without navigator
    }
  }
}

@Injectable()
export class DexieTimeEntryRepository implements ITimeEntryRepository {
  private db: TimeEntryDB;

  constructor() {
    this.db = new TimeEntryDB();
  }

  async listEntriesByMonth(year: number, month: number): Promise<TimeEntry[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    return this.db.entries.where('date').between(start, end, true, true).toArray();
  }

  async listVisitsByMonth(year: number, month: number): Promise<CourseVisit[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    return this.db.visits.where('date').between(start, end, true, true).toArray();
  }

  async addEntry(entry: TimeEntry): Promise<void> {
    await this.db.entries.put(entry);
  }

  async updateEntry(entry: TimeEntry): Promise<void> {
    await this.db.entries.update(entry.id, entry);
  }

  async removeEntry(id: string): Promise<void> {
    await this.db.entries.delete(id);
  }

  async addVisit(visit: CourseVisit): Promise<void> {
    await this.db.visits.put(visit);
  }

  async updateVisit(visit: CourseVisit): Promise<void> {
    await this.db.visits.put(visit);
  }

  async removeVisit(id: string): Promise<void> {
    await this.db.visits.delete(id);
  }

  // helper for tests to clear DB
  async clearAll(): Promise<void> {
    await this.db.entries.clear();
    await this.db.visits.clear();
  }

  async exportAll(): Promise<{ entries: TimeEntry[]; visits: CourseVisit[] }> {
    const entries = await this.db.entries.toArray();
    const visits = await this.db.visits.toArray();
    return { entries, visits };
  }

  async importAll(payload: { entries?: TimeEntry[]; visits?: CourseVisit[] }): Promise<void> {
  const { entries = [], visits = [] } = payload;
  
  // Usamos una transacción para que si algo falla, no se corrompa la base de datos
  await this.db.transaction('rw', [this.db.entries, this.db.visits], async () => {
    if (entries.length) {
      await this.db.entries.bulkPut(entries); // Mucho más rápido que .put individual
    }
    if (visits.length) {
      await this.db.visits.bulkPut(visits);
    }
  });
}

}

export default DexieTimeEntryRepository;
