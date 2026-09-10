import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlanningCalendarComponent } from './planning-calendar.component';

describe('PlanningCalendarComponent', () => {
  let component: PlanningCalendarComponent;
  let fixture: ComponentFixture<PlanningCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), PlanningCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningCalendarComponent);
    component = fixture.componentInstance;
    component.monthDate = new Date(2026, 8, 1); // September 2026
  });

  it('creates the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('weekDays — rotates day headers according to weekStart', () => {
    it('returns Monday-first order when weekStart is "monday"', () => {
      component.weekStart = 'monday';
      expect(component.weekDays).toEqual([
        'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom',
      ]);
    });

    it('returns Sunday-first order when weekStart is "sunday"', () => {
      component.weekStart = 'sunday';
      expect(component.weekDays).toEqual([
        'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb',
      ]);
    });

    it('returns Saturday-first order when weekStart is "saturday"', () => {
      component.weekStart = 'saturday';
      expect(component.weekDays).toEqual([
        'Sáb', 'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie',
      ]);
    });
  });

  describe('calendarGrid — padding respects weekStart', () => {
    // September 1, 2026 is a Tuesday (getDay() === 2).
    it('adds 1 leading padding day when weekStart is "monday"', () => {
      component.weekStart = 'monday';
      const grid = component.calendarGrid;
      const leadingPadding = grid.findIndex(day => day.isCurrentMonth);
      expect(leadingPadding).toBe(1);
    });

    it('adds 2 leading padding days when weekStart is "sunday"', () => {
      component.weekStart = 'sunday';
      const grid = component.calendarGrid;
      const leadingPadding = grid.findIndex(day => day.isCurrentMonth);
      expect(leadingPadding).toBe(2);
    });

    it('adds 3 leading padding days when weekStart is "saturday"', () => {
      component.weekStart = 'saturday';
      const grid = component.calendarGrid;
      const leadingPadding = grid.findIndex(day => day.isCurrentMonth);
      expect(leadingPadding).toBe(3);
    });

    it('pads the grid to a multiple of 7 total days', () => {
      component.weekStart = 'monday';
      expect(component.calendarGrid.length % 7).toBe(0);
    });

    it('adds no trailing padding when leading padding + days in month is already a multiple of 7', () => {
      // Feb 2026 starts on a Sunday (no leading padding with weekStart "sunday")
      // and has exactly 28 days, so leading + month days = 28 -> no trailing padding needed.
      component.monthDate = new Date(2026, 1, 1);
      component.weekStart = 'sunday';
      expect(component.calendarGrid.length).toBe(28);
    });
  });

  describe('calendarGrid — planned/actual/override flags', () => {
    it('marks plannedHours and actualHours from the corresponding Maps keyed by toDateKey', () => {
      component.plannedByDate = new Map([['2026-09-07', 4]]);
      component.actualByDate = new Map([['2026-09-07', 2]]);

      const day = component.calendarGrid.find(d => d.date.getDate() === 7 && d.isCurrentMonth);
      expect(day?.plannedHours).toBe(4);
      expect(day?.actualHours).toBe(2);
    });

    it('defaults plannedHours/actualHours to 0 when the date is not in the Maps', () => {
      component.plannedByDate = new Map();
      component.actualByDate = new Map();

      const day = component.calendarGrid.find(d => d.date.getDate() === 7 && d.isCurrentMonth);
      expect(day?.plannedHours).toBe(0);
      expect(day?.actualHours).toBe(0);
    });

    it('marks isOverride true when the date is present in overrideDates', () => {
      component.overrideDates = new Set(['2026-09-07']);

      const overrideDay = component.calendarGrid.find(d => d.date.getDate() === 7 && d.isCurrentMonth);
      const otherDay = component.calendarGrid.find(d => d.date.getDate() === 8 && d.isCurrentMonth);
      expect(overrideDay?.isOverride).toBe(true);
      expect(otherDay?.isOverride).toBe(false);
    });

    it('marks isSelected true only for the day matching selectedDate (by toDateString)', () => {
      component.selectedDate = new Date(2026, 8, 7);
      const day = component.calendarGrid.find(d => d.date.getDate() === 7 && d.isCurrentMonth);
      const other = component.calendarGrid.find(d => d.date.getDate() === 8 && d.isCurrentMonth);
      expect(day?.isSelected).toBe(true);
      expect(other?.isSelected).toBe(false);
    });

    it('isSelected is false for every day when selectedDate is null', () => {
      component.selectedDate = null;
      expect(component.calendarGrid.every(d => !d.isSelected)).toBe(true);
    });
  });

  describe('onDayClick / daySelected output', () => {
    it('emits daySelected with the day\'s date when isCurrentMonth is true', () => {
      let emitted: Date | undefined;
      component.daySelected.subscribe(d => (emitted = d));

      const currentMonthDay = component.calendarGrid.find(d => d.isCurrentMonth && d.date.getDate() === 7);
      component.onDayClick(currentMonthDay!);

      expect(emitted).toEqual(currentMonthDay!.date);
    });

    it('does NOT emit daySelected for a padding (other-month) day', () => {
      let emitted: Date | undefined;
      component.daySelected.subscribe(d => (emitted = d));

      const paddingDay = component.calendarGrid.find(d => !d.isCurrentMonth);
      component.onDayClick(paddingDay!);

      expect(emitted).toBeUndefined();
    });
  });

  describe('DOM rendering', () => {
    it('renders 7 weekday headers and clicking a current-month cell emits daySelected', () => {
      component.weekStart = 'monday';
      fixture.detectChanges();

      const headers = fixture.nativeElement.querySelectorAll('.weekday-header');
      expect(headers.length).toBe(7);

      let emitted: Date | undefined;
      component.daySelected.subscribe(d => (emitted = d));

      const cells: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.calendar-day:not(.other-month)');
      cells[0].click();

      expect(emitted).toBeDefined();
    });

    it('does not emit when clicking an other-month cell in the DOM', () => {
      component.weekStart = 'sunday'; // guarantees leading padding cells exist for Sep 2026
      fixture.detectChanges();

      let emitted: Date | undefined;
      component.daySelected.subscribe(d => (emitted = d));

      const otherMonthCell: HTMLElement = fixture.nativeElement.querySelector('.calendar-day.other-month');
      otherMonthCell.click();

      expect(emitted).toBeUndefined();
    });

    it('renders the .is-override marker class on override days', () => {
      component.overrideDates = new Set(['2026-09-07']);
      fixture.detectChanges();

      const overrideCell = fixture.nativeElement.querySelector('.calendar-day.is-override');
      expect(overrideCell).not.toBeNull();
    });

    it('marks today\'s cell with the .today class', () => {
      const today = new Date();
      component.monthDate = today;
      fixture.detectChanges();

      const todayCell = fixture.nativeElement.querySelector('.calendar-day.today');
      expect(todayCell).not.toBeNull();
    });

    it('renders planned/actual dots only when their hours are > 0', () => {
      component.plannedByDate = new Map([['2026-09-07', 4]]);
      component.actualByDate = new Map();
      fixture.detectChanges();

      const cells: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.calendar-day:not(.other-month)'));
      const day7 = cells.find(c => c.querySelector('.day-number')?.textContent?.trim() === '7');
      expect(day7?.querySelector('.day-dot--planned')).not.toBeNull();
      expect(day7?.querySelector('.day-dot--actual')).toBeNull();
    });
  });
});
