import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeEntryEditDialogComponent } from './time-entry-edit-dialog.component';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { TimeEntryVM } from '../../models/time-entry.vm';

function makeEntry(overrides: Partial<TimeEntryVM> = {}): TimeEntryVM {
  return {
    id: 'e1',
    date: new Date('2025-11-05'),
    durationMinutes: 90,
    type: 'study',
    typeLabel: 'Estudio',
    ...overrides,
  };
}

function makeDialogRef() {
  return jasmine.createSpyObj<MatDialogRef<TimeEntryEditDialogComponent>>('MatDialogRef', ['close']);
}

function makeFacade() {
  return jasmine.createSpyObj<TimeEntryFacade>('TimeEntryFacade', [
    'addEntry', 'updateEntry', 'removeEntry',
  ]);
}

describe('TimeEntryEditDialogComponent — create mode', () => {
  let fixture: ComponentFixture<TimeEntryEditDialogComponent>;
  let component: TimeEntryEditDialogComponent;
  let facade: jasmine.SpyObj<TimeEntryFacade>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TimeEntryEditDialogComponent>>;

  beforeEach(async () => {
    facade = makeFacade();
    dialogRef = makeDialogRef();
    facade.addEntry.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      declarations: [TimeEntryEditDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TimeEntryFacade, useValue: facade },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeEntryEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts in create mode', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.entry).toBeUndefined();
  });

  it('onSave calls facade.addEntry and closes dialog', async () => {
    const vm = { date: new Date(), durationMinutes: 60, type: 'preaching' as const };
    await component.onSave(vm);
    expect(facade.addEntry).toHaveBeenCalledWith(vm);
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('onCancel closes dialog without saving', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
    expect(facade.addEntry).not.toHaveBeenCalled();
  });
});

describe('TimeEntryEditDialogComponent — edit mode', () => {
  let fixture: ComponentFixture<TimeEntryEditDialogComponent>;
  let component: TimeEntryEditDialogComponent;
  let facade: jasmine.SpyObj<TimeEntryFacade>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TimeEntryEditDialogComponent>>;
  const existingEntry = makeEntry({ id: 'e42' });

  beforeEach(async () => {
    facade = makeFacade();
    dialogRef = makeDialogRef();
    facade.updateEntry.and.returnValue(Promise.resolve());
    facade.removeEntry.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      declarations: [TimeEntryEditDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TimeEntryFacade, useValue: facade },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { entry: existingEntry } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeEntryEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts in edit mode with the injected entry', () => {
    expect(component.isEditMode).toBeTrue();
    expect(component.entry).toEqual(existingEntry);
  });

  it('onSave calls facade.updateEntry and closes dialog', async () => {
    const vm = { id: 'e42', durationMinutes: 120 };
    await component.onSave(vm);
    expect(facade.updateEntry).toHaveBeenCalledWith(vm);
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('onDeleteRequest shows confirmation', () => {
    component.onDeleteRequest();
    expect(component.showDeleteConfirm).toBeTrue();
  });

  it('onDeleteCancel hides confirmation', () => {
    component.showDeleteConfirm = true;
    component.onDeleteCancel();
    expect(component.showDeleteConfirm).toBeFalse();
  });

  it('onDeleteConfirm calls facade.removeEntry and closes dialog', async () => {
    await component.onDeleteConfirm();
    expect(facade.removeEntry).toHaveBeenCalledWith('e42');
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
