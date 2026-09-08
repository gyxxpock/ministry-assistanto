import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { MonthPaginatorComponent } from './month-paginator.component';

@Pipe({ name: 'i18nDate' })
class I18nDateStub implements PipeTransform {
  transform(): string { return ''; }
}

@Pipe({ name: 'translate' })
class TranslateStub implements PipeTransform {
  transform(value: string): string { return value; }
}

describe('MonthPaginatorComponent', () => {
  let component: MonthPaginatorComponent;
  let fixture: ComponentFixture<MonthPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthPaginatorComponent, I18nDateStub, TranslateStub],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthPaginatorComponent);
    component = fixture.componentInstance;
    component.currentDate = new Date(2026, 8, 1);
    component.isCurrentMonth = true;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('accepts currentDate as required input', () => {
    const d = new Date(2025, 0, 1);
    component.currentDate = d;
    expect(component.currentDate).toBe(d);
  });

  it('accepts isCurrentMonth as required input', () => {
    component.isCurrentMonth = false;
    expect(component.isCurrentMonth).toBe(false);
  });

  it('emits prev on prev.emit()', () => {
    let emitted = false;
    component.prev.subscribe(() => (emitted = true));
    component.prev.emit();
    expect(emitted).toBe(true);
  });

  it('emits next on next.emit()', () => {
    let emitted = false;
    component.next.subscribe(() => (emitted = true));
    component.next.emit();
    expect(emitted).toBe(true);
  });

  it('emits today on today.emit()', () => {
    let emitted = false;
    component.today.subscribe(() => (emitted = true));
    component.today.emit();
    expect(emitted).toBe(true);
  });
});
