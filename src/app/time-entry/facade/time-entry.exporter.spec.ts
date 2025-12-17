import { TimeEntryExporter, toCSV } from './time-entry.exporter';

describe('TimeEntryExporter', () => {
  it('generates CSV with entries and visits', () => {
    const entries = [ { id: 'e1', date: '2025-11-01', durationMinutes: 60, type: 'preaching' } ] as any;
    const visits = [ { id: 'v1', date: '2025-11-02', durationMinutes: 30, personName: 'Ana' } ] as any;
    const csv = toCSV(entries, visits);
    expect(csv).toContain('entity,id,date,durationMinutes');
    expect(csv).toContain('entry,e1,2025-11-01,60');
    expect(csv).toContain('visit,v1,2025-11-02,30');
  });
});
