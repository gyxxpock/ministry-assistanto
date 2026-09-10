import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { TimeEntryCalendarComponent } from './time-entry-calendar';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { TimeEntryEditDialogComponent } from '../time-entry-edit/time-entry-edit-dialog.component';
import { TimeEntryVM } from '../../models/time-entry.vm';
import { WeekStartService } from '../../../../core/services/week-start.service';
import { WeekDay } from '../../../../shared/domain/week-day.model';

const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const makeEntry = (id: string, dateStr: string, durationMinutes = 60): TimeEntryVM => ({
  id,
  date: new Date(dateStr + 'T12:00:00'),
  type: 'preaching',
  durationMinutes,
  typeLabel: 'Predicación',
  notes: '',
});

describe('TimeEntryCalendarComponent', () => {
  let component: TimeEntryCalendarComponent;
  let fixture: ComponentFixture<TimeEntryCalendarComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const entriesSignal = signal<TimeEntryVM[]>([]);
  const weekStartSignal = signal<WeekDay>('monday');

  const mockFacade = {
    entries: entriesSignal,
    loadMonth: jasmine.createSpy('loadMonth'),
  };

  const mockWeekStartService: Pick<WeekStartService, 'weekStart'> = {
    weekStart: weekStartSignal.asReadonly(),
  };

  beforeEach(async () => {
    entriesSignal.set([]);
    weekStartSignal.set('monday');
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [TimeEntryCalendarComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: TimeEntryFacade, useValue: mockFacade },
        { provide: MatDialog,       useValue: dialogSpy },
        { provide: WeekStartService, useValue: mockWeekStartService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeEntryCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open edit dialog when clicking a day with entries', () => {
    entriesSignal.set([makeEntry('e1', todayKey, 60)]);
    fixture.detectChanges();

    const todayCell: HTMLElement = fixture.nativeElement.querySelector('.calendar-day.today');
    todayCell.click();

    expect(dialogSpy.open).toHaveBeenCalledWith(
      TimeEntryEditDialogComponent,
      jasmine.objectContaining({
        data: { entry: jasmine.objectContaining({ id: 'e1' }) },
      })
    );
  });

  it('should open create dialog with initialDate when clicking an empty current-month day', () => {
    fixture.detectChanges();

    const emptyCell: HTMLElement | null =
      fixture.nativeElement.querySelector('.calendar-day:not(.other-month):not(.has-entries)');
    emptyCell?.click();

    expect(dialogSpy.open).toHaveBeenCalledWith(
      TimeEntryEditDialogComponent,
      jasmine.objectContaining({
        data: { initialDate: jasmine.any(Date) },
      })
    );
  });

  it('should NOT open edit dialog when clicking an other-month day', () => {
    const otherMonthCell: HTMLElement | null =
      fixture.nativeElement.querySelector('.calendar-day.other-month');
    otherMonthCell?.click();

    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  it('prevMonth() navigates to the previous month and reloads', () => {
    const initial = component.currentDate();
    component.prevMonth();
    const prev = component.currentDate();
    expect(prev.getMonth()).toBe(
      initial.getMonth() === 0 ? 11 : initial.getMonth() - 1
    );
    expect(mockFacade.loadMonth).toHaveBeenCalled();
  });

  it('nextMonth() navigates to the next month and reloads', () => {
    const initial = component.currentDate();
    component.nextMonth();
    const next = component.currentDate();
    expect(next.getMonth()).toBe(
      initial.getMonth() === 11 ? 0 : initial.getMonth() + 1
    );
    expect(mockFacade.loadMonth).toHaveBeenCalled();
  });

  it('goToToday() resets to the current month', () => {
    component.prevMonth();
    component.goToToday();
    const today = new Date();
    expect(component.currentDate().getMonth()).toBe(today.getMonth());
    expect(component.currentDate().getFullYear()).toBe(today.getFullYear());
  });

  it('isCurrentMonth returns false after navigating away', () => {
    component.prevMonth();
    fixture.detectChanges();
    expect(component.isCurrentMonth()).toBe(false);
  });

  it('formatHours returns empty string for 0 minutes', () => {
    expect(component.formatHours(0)).toBe('');
  });

  it('formatHours formats minutes into h/m string', () => {
    expect(component.formatHours(90)).toBe('1h 30m');
    expect(component.formatHours(60)).toBe('1h 00m');
    expect(component.formatHours(5)).toBe('0h 05m');
  });

  it('weekDays returns 7 day names', () => {
    expect(component.weekDays.length).toBe(7);
    component.weekDays.forEach(d => expect(typeof d).toBe('string'));
  });

  describe('weekStart preference — leading padding days', () => {
    // Jan 1, 2024 is a fixed, known Monday (getDay() === 1). Also used by the
    // component itself as its weekDays reference date ("2024-01-07 fue domingo").
    const JAN_2024 = new Date(2024, 0, 1);

    it('produces the same padding as before the week-start preference existed when weekStart is "monday" (invariance)', () => {
      weekStartSignal.set('monday');
      component.currentDate.set(JAN_2024);
      fixture.detectChanges();

      const grid = component.calendarGrid();
      const leadingPadding = grid.findIndex(day => day.isCurrentMonth);

      // Pre-ticket formula: startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 → 1 - 1 = 0
      expect(leadingPadding).toBe(0);
    });

    it('adds 1 leading padding day when weekStart is "sunday", starting on the previous Sunday', () => {
      weekStartSignal.set('sunday');
      component.currentDate.set(JAN_2024);
      fixture.detectChanges();

      const grid = component.calendarGrid();
      const leadingPadding = grid.findIndex(day => day.isCurrentMonth);

      // (startDayOfWeek(1) - weekStartIndex(0) + 7) % 7 = 1
      expect(leadingPadding).toBe(1);
      expect(grid[0].date.getFullYear()).toBe(2023);
      expect(grid[0].date.getMonth()).toBe(11);
      expect(grid[0].date.getDate()).toBe(31); // Dec 31, 2023 was a Sunday
    });

    it('adds 2 leading padding days when weekStart is "saturday", starting on the previous Saturday', () => {
      weekStartSignal.set('saturday');
      component.currentDate.set(JAN_2024);
      fixture.detectChanges();

      const grid = component.calendarGrid();
      const leadingPadding = grid.findIndex(day => day.isCurrentMonth);

      // (startDayOfWeek(1) - weekStartIndex(6) + 7) % 7 = 2
      expect(leadingPadding).toBe(2);
      expect(grid[0].date.getFullYear()).toBe(2023);
      expect(grid[0].date.getMonth()).toBe(11);
      expect(grid[0].date.getDate()).toBe(30); // Dec 30, 2023 was a Saturday
    });
  });

  describe('weekDays getter — rotates day names according to weekStart', () => {
    it('returns Monday-first order when weekStart is "monday"', () => {
      weekStartSignal.set('monday');
      fixture.detectChanges();

      expect(component.weekDays).toEqual([
        'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
      ]);
    });

    it('returns Sunday-first order when weekStart is "sunday"', () => {
      weekStartSignal.set('sunday');
      fixture.detectChanges();

      expect(component.weekDays).toEqual([
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
      ]);
    });

    it('returns Saturday-first order when weekStart is "saturday"', () => {
      weekStartSignal.set('saturday');
      fixture.detectChanges();

      expect(component.weekDays).toEqual([
        'Sábado', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
      ]);
    });
  });
});
