import { DexieTimeEntryRepository, TimeEntryDB } from './time-entry.dexie';
import { TimeEntry, CourseVisit } from '../domain/models';

describe('DexieTimeEntryRepository', () => {
  let repo: DexieTimeEntryRepository;
  let db: TimeEntryDB;

  beforeEach(async () => {
    // use a fresh in-memory DB name per test run
    db = new TimeEntryDB(`test-db-${Math.random().toString(36).slice(2)}`);
    repo = new DexieTimeEntryRepository(db);
    await repo.clearAll();
  });

  afterEach(async () => {
    try {
      await db.delete();
    } catch (e) {
      // ignore
    }
  });

  it('can add and list entries by month', async () => {
    const e1: TimeEntry = { id: 'e1', date: '2025-11-05', durationMinutes: 120, type: 'preaching' };
    const e2: TimeEntry = { id: 'e2', date: '2025-11-10', durationMinutes: 60, type: 'study' };

    await repo.addEntry(e1);
    await repo.addEntry(e2);

    const list = await repo.listEntriesByMonth(2025, 11);
    expect(list.length).toBe(2);
  });

  it('can add and list visits by month and remove them', async () => {
    const v1: CourseVisit = { id: 'v1', date: '2025-11-05', durationMinutes: 30, personId: 'p1' };
    const v2: CourseVisit = { id: 'v2', date: '2025-12-01', durationMinutes: 45, personId: 'p2' };

    await repo.addVisit(v1);
    await repo.addVisit(v2);

    const nov = await repo.listVisitsByMonth(2025, 11);
    expect(nov.length).toBe(1);

    await repo.removeVisit('v1');
    const novAfter = await repo.listVisitsByMonth(2025, 11);
    expect(novAfter.length).toBe(0);
  });

  it('updates entries and visits', async () => {
    const e: TimeEntry = { id: 'e3', date: '2025-11-11', durationMinutes: 45, type: 'other' };
    await repo.addEntry(e);
    e.durationMinutes = 90;
    await repo.updateEntry(e);
    const list = await repo.listEntriesByMonth(2025, 11);
    expect(list.find(x => x.id === 'e3')!.durationMinutes).toBe(90);

    const v: CourseVisit = { id: 'v3', date: '2025-11-12', durationMinutes: 15, personId: 'px' };
    await repo.addVisit(v);
    v.durationMinutes = 30;
    await repo.updateVisit(v);
    const visits = await repo.listVisitsByMonth(2025, 11);
    expect(visits.find(x => x.id === 'v3')!.durationMinutes).toBe(30);
  });

  it('removing non-existing id is no-op', async () => {
    await repo.removeEntry('does-not-exist');
    await repo.removeVisit('does-not-exist');
    // no throws
    expect(true).toBeTrue();
  });
});
