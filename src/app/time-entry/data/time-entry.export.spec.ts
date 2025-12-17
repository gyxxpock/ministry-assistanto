import { DexieTimeEntryRepository, TimeEntryDB } from './time-entry.dexie';

describe('Dexie export/import', () => {
  let db: TimeEntryDB;
  let repo: DexieTimeEntryRepository;

  beforeEach(async () => {
    db = new TimeEntryDB(`exp-db-${Math.random().toString(36).slice(2)}`);
    repo = new DexieTimeEntryRepository(db);
    await repo.clearAll();
  });

  afterEach(async () => {
    try { await db.delete(); } catch (e) {}
  });

  it('exports and imports data', async () => {
    await repo.addEntry({ id: 'e1', date: '2025-11-05', durationMinutes: 60, type: 'preaching' });
    await repo.addVisit({ id: 'v1', date: '2025-11-06', durationMinutes: 30, personName: 'Ana' });

    const exported = await repo.exportAll();
    expect(exported.entries.length).toBe(1);
    expect(exported.visits.length).toBe(1);

    // clear and import
    await repo.clearAll();
    await repo.importAll(exported);

    const entries = await repo.listEntriesByMonth(2025, 11);
    const visits = await repo.listVisitsByMonth(2025, 11);
    expect(entries.length).toBe(1);
    expect(visits.length).toBe(1);
  });
});
