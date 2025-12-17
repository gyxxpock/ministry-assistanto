import { TimeEntryFacade } from './time-entry.facade';
import { TimeEntryDB, DexieTimeEntryRepository } from '../data/time-entry.dexie';

describe('TimeEntryFacade', () => {
  let facade: TimeEntryFacade;
  let repo: DexieTimeEntryRepository;

  beforeEach(async () => {
    const db = new TimeEntryDB(`facade-test-${Math.random().toString(36).slice(2)}`);
    repo = new DexieTimeEntryRepository(db);
    await repo.clearAll();
    facade = new TimeEntryFacade(repo);
  });

  afterEach(async () => {
    try {
      await (repo as any).db.delete();
    } catch (e) {}
  });

  it('loads month and computes totals', async () => {
    await repo.addEntry({ id: 'e1', date: '2025-11-05', durationMinutes: 180, type: 'preaching' });
    await repo.addVisit({ id: 'v1', date: '2025-11-06', durationMinutes: 60, personId: 'p1' });

    await facade.loadMonth(2025, 11);

    expect(facade.entries().length).toBe(1);
    expect(facade.visits().length).toBe(1);
    expect(facade.totals()!.totalHours).toBe(4);
    expect(facade.totals()!.totalCourses).toBe(1);
  });

  it('updates and removes entries via facade', async () => {
    await repo.addEntry({ id: 'e10', date: '2025-11-05', durationMinutes: 60, type: 'study' });
    await facade.loadMonth(2025, 11);
    const e = facade.entries()[0];
    e.durationMinutes = 120;
    await facade.updateEntry(e);
    expect(facade.entries()[0].durationMinutes).toBe(120);

    await facade.removeEntry(e.id);
    expect(facade.entries().length).toBe(0);
  });
});
