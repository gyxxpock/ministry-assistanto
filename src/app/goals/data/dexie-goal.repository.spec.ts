import { AuxiliaryGoalConfig, GoalConfig, RegularGoalConfig } from '../domain/models';
import { DexieGoalRepository } from './dexie-goal.repository';
import { GoalsDB } from './goals.dexie';

describe('DexieGoalRepository', () => {
  let db: GoalsDB;
  let repo: DexieGoalRepository;

  const regularConfig: RegularGoalConfig = { type: 'regular', serviceYear: 2027 };

  const auxPermanent: AuxiliaryGoalConfig = {
    type: 'auxiliary', serviceYear: 2027, monthlyTarget: 30, permanent: true,
  };

  const auxTemporary: AuxiliaryGoalConfig = {
    type: 'auxiliary', serviceYear: 2027, monthlyTarget: 15, permanent: false,
    startMonth: 9, endMonth: 3,
  };

  beforeEach(async () => {
    db = new GoalsDB(`test-goals-db-${Math.random().toString(36).slice(2)}`);
    repo = new DexieGoalRepository(db);
    await repo.clearActive();
  });

  afterEach(async () => {
    try { await db.delete(); } catch { /* ignore */ }
  });

  it('returns null when no active goal exists', async () => {
    expect(await repo.getActive()).toBeNull();
  });

  it('returns a RegularGoalConfig after setActive', async () => {
    await repo.setActive(regularConfig);
    expect(await repo.getActive()).toEqual(regularConfig);
  });

  it('returns an AuxiliaryGoalConfig (permanent) after setActive', async () => {
    await repo.setActive(auxPermanent);
    expect(await repo.getActive()).toEqual(auxPermanent);
  });

  it('returns an AuxiliaryGoalConfig (temporary) after setActive', async () => {
    await repo.setActive(auxTemporary);
    expect(await repo.getActive()).toEqual(auxTemporary);
  });

  it('does not leak the internal Dexie id into the returned GoalConfig', async () => {
    await repo.setActive(regularConfig);
    const result = await repo.getActive() as GoalConfig & { id?: unknown };
    expect((result as { id?: unknown })['id']).toBeUndefined();
  });

  it('setActive replaces an existing config', async () => {
    await repo.setActive(regularConfig);
    await repo.setActive(auxPermanent);
    expect(await repo.getActive()).toEqual(auxPermanent);
    expect(await db.activeGoal.count()).toBe(1);
  });

  it('calling setActive three times leaves exactly one record', async () => {
    await repo.setActive(regularConfig);
    await repo.setActive(auxPermanent);
    await repo.setActive(auxTemporary);
    expect(await db.activeGoal.count()).toBe(1);
    expect(await repo.getActive()).toEqual(auxTemporary);
  });

  it('clearActive on an empty table does not throw', async () => {
    await expectAsync(repo.clearActive()).toBeResolved();
    expect(await repo.getActive()).toBeNull();
  });

  it('clearActive removes an existing active goal', async () => {
    await repo.setActive(regularConfig);
    await repo.clearActive();
    expect(await repo.getActive()).toBeNull();
  });

  it('clearActive leaves zero records in the table', async () => {
    await repo.setActive(regularConfig);
    await repo.clearActive();
    expect(await db.activeGoal.count()).toBe(0);
  });

  it('uses the injected GoalsDB instance', async () => {
    await repo.setActive(regularConfig);
    expect(await db.activeGoal.count()).toBe(1);
  });

  it('constructs without injection using default GoalsDB', async () => {
    const defaultRepo = new DexieGoalRepository();
    await defaultRepo.clearActive();
    expect(await defaultRepo.getActive()).toBeNull();
    const cleanup = new GoalsDB();
    await cleanup.delete();
  });
});
