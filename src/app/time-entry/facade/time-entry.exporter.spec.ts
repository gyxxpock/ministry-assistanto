import { TimeEntryExporter, toCSV } from './time-entry.exporter';

describe('toCSV', () => {
  it('generates header and entry/visit rows', () => {
    const entries = [{ id: 'e1', date: new Date(2025, 10, 1), durationMinutes: 60, type: 'preaching' }] as any;
    const visits = [{ id: 'v1', date: new Date(2025, 10, 2), durationMinutes: 30, personName: 'Ana' }] as any;
    const csv = toCSV(entries, visits);
    expect(csv).toContain('entity,id,date,durationMinutes');
    expect(csv).toContain('entry,e1,2025-11-01,60');
    expect(csv).toContain('visit,v1,2025-11-02,30');
  });

  it('uses personId over personName when both are present', () => {
    const visits = [{ id: 'v2', date: new Date(2025, 0, 15), durationMinutes: 45, personId: 'p99', personName: 'Ignored' }] as any;
    const csv = toCSV([], visits);
    expect(csv).toContain('p99');
    expect(csv).not.toContain('Ignored');
  });

  it('falls back to empty string when neither personId nor personName is set', () => {
    const visits = [{ id: 'v3', date: new Date(2025, 0, 1), durationMinutes: 10 }] as any;
    const csv = toCSV([], visits);
    const lines = csv.split('\n');
    expect(lines[1]).toContain('visit,v3');
  });

  it('serialises entry notes', () => {
    const entries = [{ id: 'e2', date: new Date(2025, 0, 1), durationMinutes: 30, type: 'study', notes: 'hello' }] as any;
    const csv = toCSV(entries, []);
    expect(csv).toContain('"hello"');
  });

  it('handles empty arrays', () => {
    const csv = toCSV([], []);
    expect(csv).toBe('entity,id,date,durationMinutes,type_or_person,notes');
  });
});

describe('TimeEntryExporter', () => {
  let exporter: TimeEntryExporter;

  beforeEach(() => { exporter = new TimeEntryExporter(); });

  it('toCSV delegates to standalone toCSV function', () => {
    const entries = [{ id: 'e1', date: new Date(2025, 10, 1), durationMinutes: 60, type: 'preaching' }] as any;
    const csv = exporter.toCSV(entries, []);
    expect(csv).toContain('entry,e1');
  });

  it('generateJSON returns valid JSON with version and data keys', () => {
    const entries = [{ id: 'e1', date: new Date(2025, 0, 1), durationMinutes: 30, type: 'study' }] as any;
    const visits = [{ id: 'v1', date: new Date(2025, 0, 2), durationMinutes: 20, personId: 'p1' }] as any;
    const json = JSON.parse(exporter.generateJSON(entries, visits));
    expect(json.version).toBe('1.0');
    expect(json.data.entries.length).toBe(1);
    expect(json.data.visits.length).toBe(1);
    expect(typeof json.timestamp).toBe('string');
  });

  it('generateJSON handles empty arrays', () => {
    const json = JSON.parse(exporter.generateJSON([], []));
    expect(json.data.entries).toEqual([]);
    expect(json.data.visits).toEqual([]);
  });
});
