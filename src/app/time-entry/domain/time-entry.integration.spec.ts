import { DexieTimeEntryRepository, TimeEntryDB } from '../data/time-entry.dexie';
import { computeMonthlyTotals } from './time-entry.usecase';

describe('Integration: Dexie repository + computeMonthlyTotals', () => {
  let db: TimeEntryDB;
  let repo: DexieTimeEntryRepository;

  beforeEach(async () => {
    db = new TimeEntryDB(`int-db-${Math.random().toString(36).slice(2)}`);
    repo = new DexieTimeEntryRepository(db);
    await repo.clearAll();
  });

  afterEach(async () => {
    try {
      await db.delete();
    } catch (e) {}
  });

  it('computes totals from persisted entries and visits', async () => {
    await repo.addEntry({ id: 'e1', date: '2025-11-05', durationMinutes: 180, type: 'preaching' });
    await repo.addEntry({ id: 'e2', date: '2025-11-10', durationMinutes: 180, type: 'study' });

    await repo.addVisit({ id: 'v1', date: '2025-11-12', durationMinutes: 60, personId: 'p1' });
    await repo.addVisit({ id: 'v2', date: '2025-11-13', durationMinutes: 60, personId: 'p2' });

    const entries = await repo.listEntriesByMonth(2025, 11);
    const visits = await repo.listVisitsByMonth(2025, 11);

    const res = computeMonthlyTotals(entries, visits, 2025, 11);

    expect(res.totalHours).toBe(8);
    expect(res.totalCourses).toBe(2);
  });
});
