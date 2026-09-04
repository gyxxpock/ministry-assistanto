import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TimeEntryCalendarComponent } from './time-entry-calendar';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { TimeEntryEditDialogComponent } from '../time-entry-edit/time-entry-edit-dialog.component';
import { TimeEntryVM } from '../../models/time-entry.vm';

const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const makeEntry = (id: string, dateStr: string, durationMinutes = 60): TimeEntryVM => ({
  id,
  date: dateStr,
  type: 'preaching',
  durationMinutes,
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
});
