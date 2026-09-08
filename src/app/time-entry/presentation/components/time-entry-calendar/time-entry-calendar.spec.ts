import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { TimeEntryCalendarComponent } from './time-entry-calendar';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { TimeEntryEditDialogComponent } from '../time-entry-edit/time-entry-edit-dialog.component';
import { TimeEntryVM } from '../../models/time-entry.vm';

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

  const mockFacade = {
    entries: entriesSignal,
    loadMonth: jasmine.createSpy('loadMonth'),
  };

  beforeEach(async () => {
    entriesSignal.set([]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [TimeEntryCalendarComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: TimeEntryFacade, useValue: mockFacade },
        { provide: MatDialog,       useValue: dialogSpy },
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
});
