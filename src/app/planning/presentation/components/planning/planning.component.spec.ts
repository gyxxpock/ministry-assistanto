import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { PlanningComponent } from './planning.component';
import { PlanningFacade } from '../../../facade/planning.facade';
import { GoalsFacade } from '../../../../goals/facade/goals.facade';
import { TimeEntryFacade } from '../../../../time-entry/facade/time-entry.facade';
import { WeekStartService } from '../../../../core/services/week-start.service';
import { DayPlan, PlanningProjection, WeeklySchedule } from '../../../domain/models';
import { Goal, GoalConfig, GoalProgress } from '../../../../goals/domain/models';
import { TimeEntryVM } from '../../../../time-entry/presentation/models/time-entry.vm';
import { WeekDay } from '../../../../shared/domain/week-day.model';
import { getServiceYear } from '../../../../goals/domain/goal.usecase';
import { toDateKey } from '../../utils/date-key.util';

import { GoalSummaryCardComponent } from '../goal-summary-card/goal-summary-card.component';
import { MonthlyBarChartComponent } from '../monthly-bar-chart/monthly-bar-chart.component';
import { PlanningCalendarComponent } from '../planning-calendar/planning-calendar.component';
import { WeeklyScheduleEditorComponent } from '../weekly-schedule-editor/weekly-schedule-editor.component';
import { DayOverridePanelComponent } from '../day-override-panel/day-override-panel.component';
import { OptionPillGroupComponent } from '../../../../time-entry/presentation/components/shared/option-pill-group/option-pill-group.component';

// Shell spec — mocks the three Facades PlanningComponent injects directly
// (PlanningFacade, GoalsFacade, TimeEntryFacade) plus WeekStartService, and
// imports the real "dumb" child components (standalone) so template wiring
// of Inputs/Outputs can be verified through actual event dispatch instead of
// only calling the shell's public methods.

function makeSchedule(partial: Partial<WeeklySchedule> = {}): WeeklySchedule {
  return { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7, ...partial };
}

function makeDayPlan(date: string, hours: number): DayPlan {
  return { date, hours };
}

function makeRegularGoal(): Goal {
  return { id: 'active', config: { type: 'regular', serviceYear: 2027 } as GoalConfig, active: true };
}

function makeGoalProgress(partial: Partial<GoalProgress> = {}): GoalProgress {
  return {
    accumulatedHours: 100,
    projectedHours: 450,
    targetHours: 600,
    status: 'on-track',
    monthsElapsed: 3,
    monthlyAccumulated: 10,
    monthlyTarget: 50,
    monthlyProgress: 20,
    ...partial,
  };
}

function makeEntryVM(date: Date, durationMinutes: number): TimeEntryVM {
  return {
    id: `e-${Math.random().toString(36).slice(2)}`,
    date,
    durationMinutes,
    type: 'preaching',
    typeLabel: 'Predicación',
  };
}

function makeProjection(monthlyBars: PlanningProjection['monthlyBars']): PlanningProjection {
  return { totalPlanned: 0, monthlyBars, status: 'sufficient' };
}

describe('PlanningComponent', () => {
  let component: PlanningComponent;
  let fixture: ComponentFixture<PlanningComponent>;

  let mockPlanningFacade: jasmine.SpyObj<PlanningFacade>;
  let mockGoalsFacade: jasmine.SpyObj<GoalsFacade>;
  let mockTimeEntryFacade: jasmine.SpyObj<TimeEntryFacade>;

  let weeklyScheduleSignal: WritableSignal<WeeklySchedule | null>;
  let dayOverridesSignal: WritableSignal<DayPlan[]>;
  let weeklyTotalSignal: WritableSignal<number>;
  let planningProjectionSignal: WritableSignal<PlanningProjection | null>;
  let activeGoalSignal: WritableSignal<Goal | null>;
  let goalProgressSignal: WritableSignal<GoalProgress | null>;
  let entriesSignal: WritableSignal<TimeEntryVM[]>;
  let weekStartSignal: WritableSignal<WeekDay>;

  beforeEach(async () => {
    weeklyScheduleSignal = signal<WeeklySchedule | null>(null);
    dayOverridesSignal = signal<DayPlan[]>([]);
    weeklyTotalSignal = signal(0);
    planningProjectionSignal = signal<PlanningProjection | null>(null);
    activeGoalSignal = signal<Goal | null>(null);
    goalProgressSignal = signal<GoalProgress | null>(null);
    entriesSignal = signal<TimeEntryVM[]>([]);
    weekStartSignal = signal<WeekDay>('monday');

    mockPlanningFacade = jasmine.createSpyObj(
      'PlanningFacade',
      ['loadPlanForMonth', 'saveWeeklySchedule', 'setDayOverride', 'clearDayOverride'],
      {
        weeklySchedule: weeklyScheduleSignal,
        dayOverrides: dayOverridesSignal,
        weeklyTotal: weeklyTotalSignal,
        planningProjection: planningProjectionSignal,
      },
    );

    mockGoalsFacade = jasmine.createSpyObj('GoalsFacade', ['loadGoal'], {
      activeGoal: activeGoalSignal,
      goalProgress: goalProgressSignal,
    });

    mockTimeEntryFacade = jasmine.createSpyObj('TimeEntryFacade', ['loadMonth'], {
      entries: entriesSignal,
    });

    const mockWeekStartService: Pick<WeekStartService, 'weekStart'> = {
      weekStart: weekStartSignal.asReadonly(),
    };

    await TestBed.configureTestingModule({
      declarations: [PlanningComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterModule.forRoot([]), // required by GoalSummaryCardComponent's routerLink
        MatIconModule, // <mat-icon> used directly in planning.component.html
        GoalSummaryCardComponent,
        MonthlyBarChartComponent,
        PlanningCalendarComponent,
        WeeklyScheduleEditorComponent,
        DayOverridePanelComponent,
        OptionPillGroupComponent,
      ],
      providers: [
        { provide: PlanningFacade, useValue: mockPlanningFacade },
        { provide: GoalsFacade, useValue: mockGoalsFacade },
        { provide: TimeEntryFacade, useValue: mockTimeEntryFacade },
        { provide: WeekStartService, useValue: mockWeekStartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('loads the active goal, the plan and the time entries for the initial visible month', () => {
      fixture.detectChanges();
      const now = component.visibleMonth();

      expect(mockGoalsFacade.loadGoal).toHaveBeenCalledTimes(1);
      expect(mockPlanningFacade.loadPlanForMonth).toHaveBeenCalledWith(now.getFullYear(), now.getMonth() + 1);
      expect(mockTimeEntryFacade.loadMonth).toHaveBeenCalledWith(now.getFullYear(), now.getMonth() + 1);
    });
  });

  describe('goalPeriod / periodStartDate / periodEndDate', () => {
    it('derives the service-year period from getServiceYear(new Date())', () => {
      fixture.detectChanges();
      const sy = getServiceYear(new Date());

      expect(component.periodStartDate()).toEqual(new Date(sy.startYear, sy.startMonth - 1, 1));
      expect(component.periodEndDate()).toEqual(new Date(sy.endYear, sy.endMonth - 1, 1));
    });
  });

  describe('plannedByDate', () => {
    it('builds an entry per day of the visible month whose computed plan hours are > 0', () => {
      fixture.detectChanges();
      component.onMonthSelected({ year: 2026, month: 9 }); // September 2026 has 30 days
      weeklyScheduleSignal.set(makeSchedule({ mon: 4, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }));
      fixture.detectChanges();

      // Sep 7, 2026 is a Monday -> should carry 4h; days that fall on other
      // weekdays with 0 scheduled hours must NOT appear in the map.
      expect(component.plannedByDate().get('2026-09-07')).toBe(4);
      expect(component.plannedByDate().has('2026-09-08')).toBe(false); // Tuesday, 0h
    });

    it('is empty when there is no weeklySchedule loaded yet', () => {
      fixture.detectChanges();
      expect(component.plannedByDate().size).toBe(0);
    });

    it('overrides the weekday value with a DayPlan override for the exact date', () => {
      fixture.detectChanges();
      component.onMonthSelected({ year: 2026, month: 9 });
      weeklyScheduleSignal.set(makeSchedule({ mon: 4 }));
      dayOverridesSignal.set([makeDayPlan('2026-09-07', 9.5)]);
      fixture.detectChanges();

      expect(component.plannedByDate().get('2026-09-07')).toBe(9.5);
    });
  });

  describe('actualByDate', () => {
    it('accumulates entries.durationMinutes (in hours) grouped by toDateKey(entry.date)', () => {
      fixture.detectChanges();
      const day = new Date(2026, 8, 7);
      entriesSignal.set([makeEntryVM(day, 60), makeEntryVM(day, 30)]);
      fixture.detectChanges();

      expect(component.actualByDate().get(toDateKey(day))).toBe(1.5);
    });

    it('is empty when there are no entries', () => {
      fixture.detectChanges();
      expect(component.actualByDate().size).toBe(0);
    });

    it('coerces a non-Date entry.date (e.g. a serialized string) via new Date(...)', () => {
      fixture.detectChanges();
      const day = new Date(2026, 8, 7);
      // A timezone-less ISO string is parsed by `new Date(...)` as local time,
      // so it must land on the same local date key as the equivalent Date object.
      const entryWithStringDate = { ...makeEntryVM(day, 60), date: '2026-09-07T00:00:00' } as unknown as TimeEntryVM;
      entriesSignal.set([entryWithStringDate]);
      fixture.detectChanges();

      expect(component.actualByDate().get(toDateKey(day))).toBe(1);
    });
  });

  describe('overrideDates', () => {
    it('is built from the ISO dates of dayOverrides()', () => {
      fixture.detectChanges();
      dayOverridesSignal.set([makeDayPlan('2026-09-07', 5), makeDayPlan('2026-09-20', 2)]);
      fixture.detectChanges();

      expect(component.overrideDates()).toEqual(new Set(['2026-09-07', '2026-09-20']));
    });
  });

  describe('onDaySelected', () => {
    it('updates selectedDate with the given date', () => {
      fixture.detectChanges();
      const date = new Date(2026, 8, 7);
      component.onDaySelected(date);
      expect(component.selectedDate()).toBe(date);
    });
  });

  describe('month navigation — bar-chart click and pill tabs converge on the same navigation', () => {
    it('onMonthSelected (bar-chart output) sets visibleMonth, clears selectedDate and reloads plan+entries', () => {
      fixture.detectChanges();
      component.onDaySelected(new Date(2026, 8, 7));

      component.onMonthSelected({ year: 2026, month: 10 });

      expect(component.visibleMonth()).toEqual(new Date(2026, 9, 1));
      expect(component.selectedDate()).toBeNull();
      expect(mockPlanningFacade.loadPlanForMonth).toHaveBeenCalledWith(2026, 10);
      expect(mockTimeEntryFacade.loadMonth).toHaveBeenCalledWith(2026, 10);
    });

    it('onMonthPillSelected (pill-tabs output) parses "YYYY-MM" and navigates to the same month as onMonthSelected', () => {
      fixture.detectChanges();
      component.onMonthPillSelected('2026-10');

      expect(component.visibleMonth()).toEqual(new Date(2026, 9, 1));
      expect(mockPlanningFacade.loadPlanForMonth).toHaveBeenCalledWith(2026, 10);
      expect(mockTimeEntryFacade.loadMonth).toHaveBeenCalledWith(2026, 10);
    });

    it('wires the monthly-bar-chart monthSelected output through the template to navigateToMonth', () => {
      planningProjectionSignal.set(
        makeProjection([{ year: 2026, month: 11, plannedHours: 10, actualHours: 5 }]),
      );
      fixture.detectChanges();

      const barChart = fixture.debugElement.query(By.directive(MonthlyBarChartComponent));
      barChart.triggerEventHandler('monthSelected', { year: 2026, month: 11 });

      expect(component.visibleMonth()).toEqual(new Date(2026, 10, 1));
      expect(mockPlanningFacade.loadPlanForMonth).toHaveBeenCalledWith(2026, 11);
    });

    it('wires the option-pill-group valueChange output through the template to navigateToMonth', () => {
      planningProjectionSignal.set(
        makeProjection([{ year: 2026, month: 12, plannedHours: 10, actualHours: 5 }]),
      );
      fixture.detectChanges();

      const pillGroup = fixture.debugElement.query(By.directive(OptionPillGroupComponent));
      pillGroup.triggerEventHandler('valueChange', '2026-12');

      expect(component.visibleMonth()).toEqual(new Date(2026, 11, 1));
      expect(mockPlanningFacade.loadPlanForMonth).toHaveBeenCalledWith(2026, 12);
    });
  });

  describe('monthPillOptions', () => {
    it('maps each monthlyBar to a PillOption with value "YYYY-MM" and a capitalized short month label', () => {
      planningProjectionSignal.set(
        makeProjection([
          { year: 2026, month: 9, plannedHours: 0, actualHours: 0 },
          { year: 2026, month: 10, plannedHours: 0, actualHours: 0 },
        ]),
      );
      fixture.detectChanges();

      const options = component.monthPillOptions;
      const expectedFormatter = new Intl.DateTimeFormat('es', { month: 'short' });
      const expectedLabel = expectedFormatter.format(new Date(2026, 8, 1));

      expect(options.length).toBe(2);
      expect(options[0].value).toBe('2026-09');
      expect(options[0].label).toBe(expectedLabel.charAt(0).toUpperCase() + expectedLabel.slice(1));
    });

    it('is an empty array when there is no planningProjection', () => {
      fixture.detectChanges();
      expect(component.monthPillOptions).toEqual([]);
    });
  });

  describe('selectedMonthPillValue', () => {
    it('reflects the current visibleMonth as "YYYY-MM"', () => {
      fixture.detectChanges();
      component.onMonthSelected({ year: 2027, month: 1 });
      expect(component.selectedMonthPillValue()).toBe('2027-01');
    });
  });

  describe('weekPlanLabel', () => {
    it('formats weeklyTotal() as "H:MM"', () => {
      fixture.detectChanges();
      weeklyTotalSignal.set(6.5);
      expect(component.weekPlanLabel()).toBe('6:30');
    });

    it('formats a whole number of hours with ":00"', () => {
      fixture.detectChanges();
      weeklyTotalSignal.set(3);
      expect(component.weekPlanLabel()).toBe('3:00');
    });

    it('is rendered inside the week-chip value element', () => {
      weeklyTotalSignal.set(6.5);
      fixture.detectChanges();

      const value: HTMLElement = fixture.nativeElement.querySelector('.week-chip__value');
      expect(value.textContent?.trim()).toBe('6:30');
    });
  });

  describe('weekly-schedule editor toggling', () => {
    it('toggleEditor() flips isEditorOpen on each call', () => {
      fixture.detectChanges();
      expect(component.isEditorOpen()).toBe(false);
      component.toggleEditor();
      expect(component.isEditorOpen()).toBe(true);
      component.toggleEditor();
      expect(component.isEditorOpen()).toBe(false);
    });

    it('clicking the edit button in the template calls toggleEditor()', () => {
      fixture.detectChanges();
      const btn: HTMLElement = fixture.nativeElement.querySelector('.week-chip__edit-btn');
      btn.click();
      expect(component.isEditorOpen()).toBe(true);
    });

    it('propagates isEditorOpen to the weekly-schedule-editor isOpen Input', () => {
      fixture.detectChanges();
      component.toggleEditor();
      fixture.detectChanges();

      const editor = fixture.debugElement.query(By.directive(WeeklyScheduleEditorComponent));
      expect((editor.componentInstance as WeeklyScheduleEditorComponent).isOpen).toBe(true);
    });

    it('wires scheduleChange to PlanningFacade.saveWeeklySchedule', () => {
      fixture.detectChanges();
      const schedule = makeSchedule({ mon: 5 });

      const editor = fixture.debugElement.query(By.directive(WeeklyScheduleEditorComponent));
      editor.triggerEventHandler('scheduleChange', schedule);

      expect(mockPlanningFacade.saveWeeklySchedule).toHaveBeenCalledWith(schedule);
    });

    it('wires resetRequested to PlanningFacade.saveWeeklySchedule with an all-zero schedule', () => {
      fixture.detectChanges();

      const editor = fixture.debugElement.query(By.directive(WeeklyScheduleEditorComponent));
      editor.triggerEventHandler('resetRequested', undefined);

      expect(mockPlanningFacade.saveWeeklySchedule).toHaveBeenCalledWith({
        mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0,
      });
    });

    it('wires closeRequested to isEditorOpen.set(false)', () => {
      fixture.detectChanges();
      component.toggleEditor(); // open it first
      fixture.detectChanges();

      const editor = fixture.debugElement.query(By.directive(WeeklyScheduleEditorComponent));
      editor.triggerEventHandler('closeRequested', undefined);

      expect(component.isEditorOpen()).toBe(false);
    });
  });

  describe('day-override-panel wiring', () => {
    it('is not rendered when no day is selected', () => {
      fixture.detectChanges();
      const panel = fixture.debugElement.query(By.directive(DayOverridePanelComponent));
      expect(panel).toBeNull();
    });

    it('is rendered once a day is selected, receiving templateHours/overrideHours from selectedDayInfo', () => {
      fixture.detectChanges();
      weeklyScheduleSignal.set(makeSchedule({ mon: 4 }));
      component.onDaySelected(new Date(2026, 8, 7)); // Monday
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.directive(DayOverridePanelComponent));
      expect(panel).not.toBeNull();
      expect((panel.componentInstance as DayOverridePanelComponent).templateHours).toBe(4);
      expect((panel.componentInstance as DayOverridePanelComponent).overrideHours).toBeNull();
    });

    it('passes overrideHours from the matching DayPlan override when one exists for the selected date', () => {
      fixture.detectChanges();
      weeklyScheduleSignal.set(makeSchedule({ mon: 4 }));
      dayOverridesSignal.set([makeDayPlan('2026-09-07', 9.5), makeDayPlan('2026-09-20', 2)]);
      component.onDaySelected(new Date(2026, 8, 7)); // Monday, matches the first override
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.directive(DayOverridePanelComponent));
      expect((panel.componentInstance as DayOverridePanelComponent).overrideHours).toBe(9.5);
    });

    it('wires confirm to PlanningFacade.setDayOverride with the selected date and given hours', () => {
      fixture.detectChanges();
      const date = new Date(2026, 8, 7);
      component.onDaySelected(date);
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.directive(DayOverridePanelComponent));
      panel.triggerEventHandler('confirm', 5);

      expect(mockPlanningFacade.setDayOverride).toHaveBeenCalledWith({ date: toDateKey(date), hours: 5 });
    });

    it('wires clear to PlanningFacade.clearDayOverride with the selected date', () => {
      fixture.detectChanges();
      const date = new Date(2026, 8, 7);
      component.onDaySelected(date);
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.directive(DayOverridePanelComponent));
      panel.triggerEventHandler('clear', undefined);

      expect(mockPlanningFacade.clearDayOverride).toHaveBeenCalledWith(toDateKey(date));
    });

    it('onDayConfirm does nothing when there is no selected date', () => {
      fixture.detectChanges();
      component.onDayConfirm(5);
      expect(mockPlanningFacade.setDayOverride).not.toHaveBeenCalled();
    });

    it('onDayClear does nothing when there is no selected date', () => {
      fixture.detectChanges();
      component.onDayClear();
      expect(mockPlanningFacade.clearDayOverride).not.toHaveBeenCalled();
    });
  });

  describe('planning-calendar wiring', () => {
    it('wires daySelected to onDaySelected via the template', () => {
      fixture.detectChanges();
      const date = new Date(2026, 8, 7);

      const calendar = fixture.debugElement.query(By.directive(PlanningCalendarComponent));
      calendar.triggerEventHandler('daySelected', date);

      expect(component.selectedDate()).toBe(date);
    });
  });

  describe('empty state when there is no active goal', () => {
    it('passes goalConfig=null to app-goal-summary-card and renders its empty state', () => {
      activeGoalSignal.set(null);
      fixture.detectChanges();

      const card = fixture.debugElement.query(By.directive(GoalSummaryCardComponent));
      expect((card.componentInstance as GoalSummaryCardComponent).goalConfig).toBeNull();

      const emptyState: HTMLElement = fixture.nativeElement.querySelector('.goal-card__empty');
      expect(emptyState).not.toBeNull();
    });

    it('passes the active goal config and progress once a goal exists', () => {
      const goal = makeRegularGoal();
      const progress = makeGoalProgress();
      activeGoalSignal.set(goal);
      goalProgressSignal.set(progress);
      fixture.detectChanges();

      const card = fixture.debugElement.query(By.directive(GoalSummaryCardComponent));
      expect((card.componentInstance as GoalSummaryCardComponent).goalConfig).toBe(goal.config);
      expect((card.componentInstance as GoalSummaryCardComponent).goalProgress).toBe(progress);
    });
  });
});
