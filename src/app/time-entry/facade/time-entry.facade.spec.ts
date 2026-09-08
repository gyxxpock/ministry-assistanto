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
    await repo.addEntry({ id: 'e1', date: new Date('2025-11-05'), durationMinutes: 180, type: 'preaching' });
    await repo.addVisit({ id: 'v1', date: new Date('2025-11-06'), durationMinutes: 60, personId: 'p1' });

    await facade.loadMonth(2025, 11);

    expect(facade.entries().length).toBe(1);
    expect(facade.visits().length).toBe(1);
    expect(facade.totals()!.totalHours).toBe(4);
    expect(facade.totals()!.totalCourses).toBe(1);
  });

  it('updates and removes entries via facade', async () => {
    await repo.addEntry({ id: 'e10', date: new Date('2025-11-05'), durationMinutes: 60, type: 'study' });
    await facade.loadMonth(2025, 11);
    const e = facade.entries()[0];
    e.durationMinutes = 120;
    await facade.updateEntry(e);
    expect(facade.entries()[0].durationMinutes).toBe(120);

    await facade.removeEntry(e.id);
    expect(facade.entries().length).toBe(0);
  });

  describe('addEntry — accumulation', () => {
    it('accumulates durationMinutes when same date and type is submitted twice', async () => {
      await facade.loadMonth(2025, 11);
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 60, type: 'preaching' });
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 90, type: 'preaching' });

      expect(facade.entries().length).toBe(1);
      expect(facade.entries()[0].durationMinutes).toBe(150);
    });

    it('keeps separate records for different types on the same date', async () => {
      await facade.loadMonth(2025, 11);
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 60, type: 'preaching' });
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 45, type: 'study' });

      expect(facade.entries().length).toBe(2);
    });

    it('keeps separate records for the same type on different dates', async () => {
      await facade.loadMonth(2025, 11);
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 60, type: 'preaching' });
      await facade.addEntry({ date: new Date('2025-11-06'), durationMinutes: 90, type: 'preaching' });

      expect(facade.entries().length).toBe(2);
    });

    it('updates notes with the latest non-blank value', async () => {
      await facade.loadMonth(2025, 11);
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 60, type: 'preaching', notes: 'morning' });
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 30, type: 'preaching', notes: 'afternoon' });

      expect(facade.entries()[0].notes).toBe('afternoon');
    });

    it('preserves existing notes when incoming notes is blank', async () => {
      await facade.loadMonth(2025, 11);
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 60, type: 'preaching', notes: 'morning' });
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 30, type: 'preaching', notes: '' });

      expect(facade.entries()[0].notes).toBe('morning');
    });
  });

  describe('visits CRUD', () => {
    it('addVisit stores visit and reloads month', async () => {
      await facade.loadMonth(2025, 11);
      await facade.addVisit({ id: 'v1', date: new Date('2025-11-05'), durationMinutes: 60, personId: 'p1' });
      expect(facade.visits().length).toBe(1);
    });

    it('updateVisit modifies durationMinutes', async () => {
      await repo.addVisit({ id: 'v1', date: new Date('2025-11-05'), durationMinutes: 60, personId: 'p1' });
      await facade.loadMonth(2025, 11);
      await facade.updateVisit({ id: 'v1', date: new Date('2025-11-05'), durationMinutes: 90, personId: 'p1' });
      expect(facade.visits()[0].minutes).toBe(90);
    });

    it('removeVisit deletes the visit', async () => {
      await repo.addVisit({ id: 'v1', date: new Date('2025-11-05'), durationMinutes: 60, personId: 'p1' });
      await facade.loadMonth(2025, 11);
      await facade.removeVisit('v1');
      expect(facade.visits().length).toBe(0);
    });

    it('visits() uses personName when present', async () => {
      await facade.loadMonth(2025, 11);
      await facade.addVisit({ id: 'v2', date: new Date('2025-11-05'), durationMinutes: 30, personId: 'p2', personName: 'Alice' });
      expect(facade.visits()[0].person).toBe('Alice');
    });
  });

  describe('export and import', () => {
    it('exportAll returns all stored entries and visits', async () => {
      await repo.addEntry({ id: 'e1', date: new Date('2025-11-05'), durationMinutes: 60, type: 'preaching' });
      await repo.addVisit({ id: 'v1', date: new Date('2025-11-05'), durationMinutes: 30, personId: 'p1' });
      const result = await facade.exportAll();
      expect(result.entries.length).toBe(1);
      expect(result.visits.length).toBe(1);
    });

    it('importAll adds entries and reloads month', async () => {
      await facade.loadMonth(2025, 11);
      await facade.importAll({
        entries: [{ id: 'e2', date: new Date('2025-11-10'), durationMinutes: 45, type: 'visiting', createdAt: new Date().toISOString(), source: 'local' }]
      });
      expect(facade.entries().length).toBe(1);
    });

    it('importAll with empty payload does not throw', async () => {
      await facade.loadMonth(2025, 11);
      await expectAsync(facade.importAll({})).toBeResolved();
    });
  });

  describe('updateManualCourseCount', () => {
    it('persists the count in the repository', async () => {
      await facade.loadMonth(2025, 11);
      await facade.updateManualCourseCount(5);
      const stored = await repo.getCourseCount(2025, 11);
      expect(stored).toBe(5);
    });
  });

  describe('translateType — all switch branches', () => {
    beforeEach(async () => { await facade.loadMonth(2025, 11); });

    it('translates visiting type', async () => {
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 60, type: 'visiting' });
      expect(facade.entries().find(e => e.type === 'visiting')?.typeLabel).toBe('Visita');
    });

    it('translates other type', async () => {
      await facade.addEntry({ date: new Date('2025-11-05'), durationMinutes: 60, type: 'other' });
      expect(facade.entries().find(e => e.type === 'other')?.typeLabel).toBe('Otro');
    });

    it('returns type string as-is for unknown types (default branch)', async () => {
      await repo.addEntry({ id: 'ex', date: new Date('2025-11-05'), durationMinutes: 60, type: 'unknown' as any });
      await facade.loadMonth(2025, 11);
      expect(facade.entries().find(e => (e.type as any) === 'unknown')?.typeLabel).toBe('unknown');
    });
  });
});
