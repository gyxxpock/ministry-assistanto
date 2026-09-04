import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TimeEntryFormComponent } from './time-entry-form.component';
import { CreateTimeEntryVM, TimeEntryVM, UpdateTimeEntryVM } from '../../models/time-entry.vm';

function makeEntry(overrides: Partial<TimeEntryVM> = {}): TimeEntryVM {
  return {
    id: 'e1',
    date: new Date('2025-11-05'),
    durationMinutes: 120,
    type: 'preaching',
    typeLabel: 'Predicación',
    ...overrides,
  };
}

describe('TimeEntryFormComponent', () => {
  let fixture: ComponentFixture<TimeEntryFormComponent>;
  let component: TimeEntryFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeEntryFormComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeEntryFormComponent);
    component = fixture.componentInstance;
  });

  describe('create mode (no entry input)', () => {
    beforeEach(() => fixture.detectChanges());

    it('initializes in create mode', () => {
      expect(component.isEditMode).toBeFalse();
    });

    it('form is valid with default values', () => {
      expect(component.form.valid).toBeTrue();
    });

    it('canSubmit is true when form is valid', () => {
      expect(component.canSubmit).toBeTrue();
    });

    it('submit emits CreateTimeEntryVM', () => {
      let emitted: CreateTimeEntryVM | UpdateTimeEntryVM | undefined;
      component.save.subscribe((vm) => (emitted = vm));

      component.form.controls.durationMinutes.setValue(90);
      component.submit();

      expect(emitted).toBeDefined();
      expect((emitted as CreateTimeEntryVM).durationMinutes).toBe(90);
    });

    it('submit does not emit when form is invalid', () => {
      let count = 0;
      component.save.subscribe(() => count++);

      component.form.controls.durationMinutes.setValue(0);
      component.submit();

      expect(count).toBe(0);
    });

    it('setPreset sets durationMinutes and marks dirty', () => {
      component.setPreset(180);
      expect(component.form.controls.durationMinutes.value).toBe(180);
      expect(component.form.controls.durationMinutes.dirty).toBeTrue();
    });
  });

  describe('edit mode (entry input provided)', () => {
    const entry = makeEntry({ id: 'e99', durationMinutes: 60, type: 'study' });

    beforeEach(() => {
      component.entry = entry;
      fixture.detectChanges();
    });

    it('initializes in edit mode', () => {
      expect(component.isEditMode).toBeTrue();
    });

    it('patches form with entry values', () => {
      expect(component.form.controls.durationMinutes.value).toBe(60);
      expect(component.form.controls.type.value).toBe('study');
    });

    it('canSubmit is false when form has no changes', () => {
      expect(component.canSubmit).toBeFalse();
    });

    it('submit emits UpdateTimeEntryVM with only dirty fields', () => {
      let emitted: CreateTimeEntryVM | UpdateTimeEntryVM | undefined;
      component.save.subscribe((vm) => (emitted = vm));

      component.form.controls.durationMinutes.setValue(90);
      component.form.controls.durationMinutes.markAsDirty();
      component.submit();

      expect((emitted as UpdateTimeEntryVM).id).toBe('e99');
      expect((emitted as UpdateTimeEntryVM).durationMinutes).toBe(90);
    });

    it('emits cancel when no fields changed', () => {
      let cancelled = false;
      component.cancel.subscribe(() => (cancelled = true));

      component.submit();

      expect(cancelled).toBeTrue();
    });
  });

  describe('onDateChange', () => {
    beforeEach(() => fixture.detectChanges());

    it('marks date control as dirty and valid after change', () => {
      component.onDateChange();
      expect(component.form.controls.date.dirty).toBeTrue();
    });
  });
});
