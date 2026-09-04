import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TimeEntryDayComponent } from './time-entry-day.component';
import { TimeEntryVM } from '../../models/time-entry.vm';

function makeEntry(overrides: Partial<TimeEntryVM> = {}): TimeEntryVM {
  return {
    id: 'e1',
    date: new Date('2025-11-05'),
    durationMinutes: 60,
    type: 'preaching',
    typeLabel: 'Predicación',
    ...overrides,
  };
}

describe('TimeEntryDayComponent', () => {
  let fixture: ComponentFixture<TimeEntryDayComponent>;
  let component: TimeEntryDayComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeEntryDayComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeEntryDayComponent);
    component = fixture.componentInstance;
  });

  it('renders with empty entries by default', () => {
    fixture.detectChanges();
    expect(component.entries).toEqual([]);
  });

  it('accepts entries via @Input', () => {
    const entries = [makeEntry({ id: 'a' }), makeEntry({ id: 'b' })];
    component.entries = entries;
    fixture.detectChanges();
    expect(component.entries.length).toBe(2);
  });

  it('emits edit event when onEdit is called', () => {
    const entry = makeEntry();
    let emitted: TimeEntryVM | undefined;
    component.edit.subscribe((e: TimeEntryVM) => (emitted = e));

    component.onEdit(entry);

    expect(emitted).toEqual(entry);
  });

  it('does not emit edit for entries not explicitly triggered', () => {
    let count = 0;
    component.edit.subscribe(() => count++);
    fixture.detectChanges();
    expect(count).toBe(0);
  });
});
