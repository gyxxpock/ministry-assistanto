import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEntryCalendar } from './time-entry-calendar';

describe('TimeEntryCalendar', () => {
  let component: TimeEntryCalendar;
  let fixture: ComponentFixture<TimeEntryCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeEntryCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeEntryCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
