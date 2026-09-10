import { WeeklySchedule, DayPlan, MonthlyBar, PlanningProjection } from './models';

describe('Planning models', () => {
  it('should accept a WeeklySchedule with all 7 weekdays', () => {
    const schedule: WeeklySchedule = { mon: 1, tue: 1, wed: 1, thu: 1, fri: 1, sat: 0, sun: 0 };

    expect(Object.keys(schedule).length).toBe(7);
  });

  it('should accept a DayPlan for a given ISO date', () => {
    const plan: DayPlan = { date: '2026-09-10', hours: 2 };

    expect(plan.date).toBe('2026-09-10');
  });

  it('should accept a MonthlyBar with planned and actual hours', () => {
    const bar: MonthlyBar = { year: 2026, month: 9, plannedHours: 10, actualHours: 8 };

    expect(bar.month).toBe(9);
  });

  it('should accept a PlanningProjection with a valid status', () => {
    const projection: PlanningProjection = {
      totalPlanned: 600,
      monthlyBars: [],
      status: 'sufficient',
    };

    expect(projection.status).toBe('sufficient');
  });
});
