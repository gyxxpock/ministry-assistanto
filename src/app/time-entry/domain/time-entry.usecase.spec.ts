import { computeMonthlyTotals } from './time-entry.usecase';
import { TimeEntry, CourseVisit } from './models';

describe('computeMonthlyTotals', () => {
  it('sums time entries and course visits and counts unique course persons', () => {
    const entries: TimeEntry[] = [
      { id: 'e1', date: '2025-11-05', durationMinutes: 180, type: 'preaching' },
      { id: 'e2', date: '2025-11-10', durationMinutes: 180, type: 'study' }
    ];

    const visits: CourseVisit[] = [
      { id: 'v1', date: '2025-11-12', durationMinutes: 60, personId: 'p1' },
      { id: 'v2', date: '2025-11-13', durationMinutes: 60, personId: 'p2' }
    ];

    const res = computeMonthlyTotals(entries, visits, 2025, 11);

    expect(res.totalMinutes).toBe(480); // 180+180+60+60
    expect(res.totalHours).toBe(8);
    expect(res.totalCourses).toBe(2);
  });

  it('deduplicates visits to same person (same personId)', () => {
    const entries: TimeEntry[] = [];
    const visits: CourseVisit[] = [
      { id: 'v1', date: '2025-11-01', durationMinutes: 60, personId: 'p1' },
      { id: 'v2', date: '2025-11-02', durationMinutes: 45, personId: 'p1' },
      { id: 'v3', date: '2025-11-03', durationMinutes: 30, personId: 'p2' }
    ];

    const res = computeMonthlyTotals(entries, visits, 2025, 11);

    expect(res.totalMinutes).toBe(135); // 60+45+30
    expect(res.totalCourses).toBe(2); // p1 and p2
  });

  it('deduplicates visits by normalized personName when personId missing', () => {
    const entries: TimeEntry[] = [];
    const visits: CourseVisit[] = [
      { id: 'v1', date: '2025-11-01', durationMinutes: 30, personName: 'Juan Perez' },
      { id: 'v2', date: '2025-11-02', durationMinutes: 30, personName: '  juan  perez ' },
      { id: 'v3', date: '2025-11-03', durationMinutes: 30, personName: 'María' }
    ];

    const res = computeMonthlyTotals(entries, visits, 2025, 11);

    expect(res.totalMinutes).toBe(90);
    expect(res.totalCourses).toBe(2); // Juan Perez + María
  });

  it('ignores entries and visits outside the month', () => {
    const entries: TimeEntry[] = [
      { id: 'e1', date: '2025-10-31', durationMinutes: 120, type: 'preaching' },
      { id: 'e2', date: '2025-11-01', durationMinutes: 60, type: 'preaching' }
    ];

    const visits: CourseVisit[] = [
      { id: 'v1', date: '2025-11-05', durationMinutes: 30, personId: 'p1' },
      { id: 'v2', date: '2025-12-01', durationMinutes: 30, personId: 'p2' }
    ];

    const res = computeMonthlyTotals(entries, visits, 2025, 11);

    expect(res.totalMinutes).toBe(90); // 60 + 30
    expect(res.totalCourses).toBe(1);
  });

  it('skips non-positive durations', () => {
    const entries: TimeEntry[] = [
      { id: 'e1', date: '2025-11-05', durationMinutes: 0, type: 'preaching' },
      { id: 'e2', date: '2025-11-10', durationMinutes: -30, type: 'study' }
    ];

    const visits: CourseVisit[] = [
      { id: 'v1', date: '2025-11-12', durationMinutes: 0, personId: 'p1' }
    ];

    const res = computeMonthlyTotals(entries, visits, 2025, 11);

    expect(res.totalMinutes).toBe(0);
    expect(res.totalCourses).toBe(1); // person counted even if duration is 0 (business decision)
  });

  it('floors fractional durations and rounds hours to 2 decimals', () => {
    const entries = [
      { id: 'e1', date: '2025-11-05', durationMinutes: 30.9, type: 'preaching' },
    ] as any as TimeEntry[];

    const visits = [
      { id: 'v1', date: '2025-11-06', durationMinutes: 30.9, personId: 'p1' },
    ] as any as CourseVisit[];

    const res = computeMonthlyTotals(entries, visits, 2025, 11);

    // durations floored -> 30 + 30 = 60 minutes -> 1 hour
    expect(res.totalMinutes).toBe(60);
    expect(res.totalHours).toBe(1);
  });

  it('counts visits with no personId or personName as unique visits', () => {
    const entries: TimeEntry[] = [];
    const visits: CourseVisit[] = [
      { id: 'v1', date: '2025-11-01', durationMinutes: 15 },
      { id: 'v2', date: '2025-11-02', durationMinutes: 20 }
    ];

    const res = computeMonthlyTotals(entries, visits, 2025, 11);

    expect(res.totalCourses).toBe(2);
  });
});
