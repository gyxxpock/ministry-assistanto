import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { WeeklyScheduleEditorComponent } from './weekly-schedule-editor.component';
import { WeeklySchedule } from '../../../domain/models';

function makeSchedule(partial: Partial<WeeklySchedule> = {}): WeeklySchedule {
  return { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0, ...partial };
}

describe('WeeklyScheduleEditorComponent', () => {
  let component: WeeklyScheduleEditorComponent;
  let fixture: ComponentFixture<WeeklyScheduleEditorComponent>;
  let outsideEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), WeeklyScheduleEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyScheduleEditorComponent);
    component = fixture.componentInstance;

    outsideEl = document.createElement('div');
    document.body.appendChild(outsideEl);
  });

  afterEach(() => {
    document.body.removeChild(outsideEl);
  });

  it('creates the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('columns — order according to weekStart', () => {
    it('orders mon..sun starting on Monday when weekStart is "monday"', () => {
      component.weekStart = 'monday';
      component.draft = makeSchedule();
      expect(component.columns.map(c => c.key)).toEqual(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
    });

    it('orders starting on Sunday when weekStart is "sunday"', () => {
      component.weekStart = 'sunday';
      component.draft = makeSchedule();
      expect(component.columns.map(c => c.key)).toEqual(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']);
    });

    it('orders starting on Saturday when weekStart is "saturday"', () => {
      component.weekStart = 'saturday';
      component.draft = makeSchedule();
      expect(component.columns.map(c => c.key)).toEqual(['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri']);
    });

    it('takes each column value from the current draft', () => {
      component.weekStart = 'monday';
      component.draft = makeSchedule({ mon: 7.5 });
      expect(component.columns[0].value).toBe(7.5);
    });
  });

  describe('ngOnChanges — syncs draft when isOpen turns true', () => {
    it('copies the schedule Input into draft when isOpen changes to true', () => {
      const schedule = makeSchedule({ mon: 4 });
      component.schedule = schedule;
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });

      expect(component.draft).toEqual(schedule);
      expect(component.draft).not.toBe(schedule); // must be a copy
    });

    it('does NOT touch draft when isOpen changes to false', () => {
      component.draft = makeSchedule({ mon: 9 });
      component.schedule = makeSchedule({ mon: 1 });
      component.isOpen = false;
      component.ngOnChanges({ isOpen: new SimpleChange(true, false, false) });

      expect(component.draft.mon).toBe(9);
    });

    it('resets confirmingReset to false when isOpen changes to true, discarding any pending confirm', () => {
      component.confirmingReset = true;
      component.schedule = makeSchedule();
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });

      expect(component.confirmingReset).toBe(false);
    });

    it('resets confirmingReset to false when isOpen changes to false', () => {
      component.confirmingReset = true;
      component.isOpen = false;
      component.ngOnChanges({ isOpen: new SimpleChange(true, false, false) });

      expect(component.confirmingReset).toBe(false);
    });

    it('sets ignoreNextDocumentClick=true immediately, then clears it asynchronously', fakeAsync(() => {
      component.schedule = makeSchedule();
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });

      // Immediately after opening, an outside click must be ignored.
      const outsideClick = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(outsideClick, 'target', { value: outsideEl });
      let emitted = false;
      component.closeRequested.subscribe(() => (emitted = true));
      component.onDocumentClick(outsideClick);
      expect(emitted).toBe(false);

      tick(0); // flushes the setTimeout(0) that resets ignoreNextDocumentClick

      component.onDocumentClick(outsideClick);
      expect(emitted).toBe(true);
    }));
  });

  describe('onRangeChange', () => {
    it('clamps values above maxDailyHours (8) down to 8', () => {
      component.draft = makeSchedule({ mon: 0 });
      component.onRangeChange('mon', '10');
      expect(component.draft.mon).toBe(8);
    });

    it('clamps negative values up to 0', () => {
      component.draft = makeSchedule({ tue: 5 });
      component.onRangeChange('tue', '-3');
      expect(component.draft.tue).toBe(0);
    });

    it('accepts valid intermediate values unchanged', () => {
      component.draft = makeSchedule();
      component.onRangeChange('wed', '2.5');
      expect(component.draft.wed).toBe(2.5);
    });

    it('emits scheduleChange with the full draft after the 150ms debounce', fakeAsync(() => {
      component.draft = makeSchedule();
      let emitted: WeeklySchedule | undefined;
      component.scheduleChange.subscribe(s => (emitted = s));

      component.onRangeChange('mon', '6');
      expect(emitted).toBeUndefined(); // not yet, still debouncing

      tick(150);
      expect(emitted).toEqual(jasmine.objectContaining({ mon: 6 }));
    }));

    it('debounces rapid consecutive changes into a single scheduleChange emission', fakeAsync(() => {
      component.draft = makeSchedule();
      let emissions = 0;
      component.scheduleChange.subscribe(() => emissions++);

      component.onRangeChange('mon', '3');
      tick(50);
      component.onRangeChange('mon', '5');
      tick(50);
      component.onRangeChange('mon', '7');
      tick(150);

      expect(emissions).toBe(1);
    }));
  });

  describe('formatHours', () => {
    it('formats whole hours with ":00"', () => {
      expect(component.formatHours(3)).toBe('3:00');
    });

    it('formats half hours as ":30"', () => {
      expect(component.formatHours(1.5)).toBe('1:30');
    });

    it('formats 0 as "0:00"', () => {
      expect(component.formatHours(0)).toBe('0:00');
    });
  });

  describe('onResetRequest (first step of the reset two-step confirm)', () => {
    it('sets confirmingReset to true', () => {
      component.confirmingReset = false;
      component.onResetRequest();
      expect(component.confirmingReset).toBe(true);
    });

    it('does NOT emit resetRequested', () => {
      let emitted = false;
      component.resetRequested.subscribe(() => (emitted = true));
      component.onResetRequest();
      expect(emitted).toBe(false);
    });

    it('does NOT touch draft', () => {
      component.draft = makeSchedule({ mon: 5 });
      component.onResetRequest();
      expect(component.draft).toEqual(makeSchedule({ mon: 5 }));
    });
  });

  describe('onResetConfirm (second step of the reset two-step confirm)', () => {
    it('resets draft to an all-zero schedule', () => {
      component.draft = makeSchedule({ mon: 5, tue: 5 });
      component.onResetConfirm();
      expect(component.draft).toEqual({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 });
    });

    it('emits resetRequested', () => {
      let emitted = false;
      component.resetRequested.subscribe(() => (emitted = true));
      component.onResetConfirm();
      expect(emitted).toBe(true);
    });

    it('resets confirmingReset back to false', () => {
      component.confirmingReset = true;
      component.onResetConfirm();
      expect(component.confirmingReset).toBe(false);
    });

    it('does NOT emit scheduleChange', fakeAsync(() => {
      let emitted = false;
      component.scheduleChange.subscribe(() => (emitted = true));
      component.onResetConfirm();
      tick(200);
      expect(emitted).toBe(false);
    }));
  });

  describe('onResetCancel (cancel button on the reset confirm panel)', () => {
    it('reverts confirmingReset to false', () => {
      component.confirmingReset = true;
      component.onResetCancel();
      expect(component.confirmingReset).toBe(false);
    });

    it('does NOT emit resetRequested', () => {
      component.confirmingReset = true;
      let emitted = false;
      component.resetRequested.subscribe(() => (emitted = true));
      component.onResetCancel();
      expect(emitted).toBe(false);
    });

    it('does NOT touch draft', () => {
      component.confirmingReset = true;
      component.draft = makeSchedule({ mon: 5 });
      component.onResetCancel();
      expect(component.draft).toEqual(makeSchedule({ mon: 5 }));
    });
  });

  describe('onClose', () => {
    it('emits closeRequested', () => {
      let emitted = false;
      component.closeRequested.subscribe(() => (emitted = true));
      component.onClose();
      expect(emitted).toBe(true);
    });
  });

  describe('onDocumentClick — click-outside-to-close', () => {
    function clickEventWithTarget(target: EventTarget): MouseEvent {
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: target });
      return event;
    }

    it('does nothing when isOpen is false', () => {
      component.isOpen = false;
      let emitted = false;
      component.closeRequested.subscribe(() => (emitted = true));

      component.onDocumentClick(clickEventWithTarget(outsideEl));
      expect(emitted).toBe(false);
    });

    it('emits closeRequested when the click target is outside the host element', () => {
      component.isOpen = true;
      let emitted = false;
      component.closeRequested.subscribe(() => (emitted = true));

      component.onDocumentClick(clickEventWithTarget(outsideEl));
      expect(emitted).toBe(true);
    });

    it('does NOT emit closeRequested when the click target is inside the host element', () => {
      fixture.detectChanges();
      component.isOpen = true;
      let emitted = false;
      component.closeRequested.subscribe(() => (emitted = true));

      const insideTarget = fixture.nativeElement as HTMLElement;
      component.onDocumentClick(clickEventWithTarget(insideTarget));
      expect(emitted).toBe(false);
    });
  });

  describe('onDocumentClick — interaction with a pending reset confirm', () => {
    function clickEventWithTarget(target: EventTarget): MouseEvent {
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: target });
      return event;
    }

    beforeEach(fakeAsync(() => {
      component.schedule = makeSchedule();
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });
      tick(0); // clears ignoreNextDocumentClick set by ngOnChanges
    }));

    it('cancels the pending reset confirm on an outside click, WITHOUT closing the editor', () => {
      component.confirmingReset = true;
      fixture.detectChanges(); // renders .week-editor__reset-confirm and populates the ViewChild

      let closeEmitted = false;
      component.closeRequested.subscribe(() => (closeEmitted = true));

      component.onDocumentClick(clickEventWithTarget(outsideEl));

      expect(component.confirmingReset).toBe(false);
      expect(closeEmitted).toBe(false);
    });

    it('closes the editor on a further outside click once there is no pending reset confirm', () => {
      component.confirmingReset = false;
      fixture.detectChanges();

      let closeEmitted = false;
      component.closeRequested.subscribe(() => (closeEmitted = true));

      component.onDocumentClick(clickEventWithTarget(outsideEl));

      expect(closeEmitted).toBe(true);
    });

    it('does NOT cancel the reset confirm nor close the editor when the click lands inside the confirm panel itself', () => {
      component.confirmingReset = true;
      fixture.detectChanges();

      const confirmPanel: HTMLElement = fixture.nativeElement.querySelector('.week-editor__reset-confirm');
      expect(confirmPanel).not.toBeNull();

      let closeEmitted = false;
      component.closeRequested.subscribe(() => (closeEmitted = true));

      component.onDocumentClick(clickEventWithTarget(confirmPanel));

      expect(component.confirmingReset).toBe(true);
      expect(closeEmitted).toBe(false);
    });
  });

  describe('@HostListener(\'document:click\') wiring (integration, real DOM event)', () => {
    it('closes the editor when a real click event bubbles up to document from outside the host', fakeAsync(() => {
      component.schedule = makeSchedule();
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });
      fixture.detectChanges();
      tick(0); // clears ignoreNextDocumentClick set by ngOnChanges

      let emitted = false;
      component.closeRequested.subscribe(() => (emitted = true));

      outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(emitted).toBe(true);
    }));
  });

  describe('ngOnDestroy', () => {
    it('stops emitting scheduleChange after destroy (unsubscribes internal debounce pipeline)', fakeAsync(() => {
      component.draft = makeSchedule();
      let emitted = false;
      component.scheduleChange.subscribe(() => (emitted = true));

      component.ngOnDestroy();
      component.onRangeChange('mon', '4');
      tick(200);

      expect(emitted).toBe(false);
    }));
  });

  describe('DOM rendering', () => {
    it('renders nothing when isOpen is false', () => {
      component.isOpen = false;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.week-editor')).toBeNull();
    });

    it('renders the panel with 7 sliders when isOpen is true', () => {
      component.schedule = makeSchedule();
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });
      fixture.detectChanges();

      const sliders = fixture.nativeElement.querySelectorAll('.day-column__slider');
      expect(sliders.length).toBe(7);
    });

    it('does not render .week-editor__reset-confirm when confirmingReset is false', () => {
      component.schedule = makeSchedule();
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });
      component.confirmingReset = false;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.week-editor__reset-confirm'))).toBeNull();
    });

    it('renders .week-editor__reset-confirm when confirmingReset is true', () => {
      component.schedule = makeSchedule();
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });
      component.confirmingReset = true;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.week-editor__reset-confirm'))).not.toBeNull();
    });

    it('clicking the reset button then the cancel button reverts without emitting resetRequested', () => {
      component.schedule = makeSchedule();
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });
      fixture.detectChanges();

      let emitted = false;
      component.resetRequested.subscribe(() => (emitted = true));

      const resetBtn: HTMLElement = fixture.nativeElement.querySelector('.week-editor__reset-btn');
      resetBtn.click();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.week-editor__reset-confirm'))).not.toBeNull();

      const cancelBtn: HTMLElement = fixture.nativeElement.querySelector(
        '.week-editor__reset-confirm-actions button:not([color="warn"])',
      );
      cancelBtn.click();
      fixture.detectChanges();

      expect(emitted).toBe(false);
      expect(fixture.debugElement.query(By.css('.week-editor__reset-confirm'))).toBeNull();
    });

    it('clicking the reset button then the confirm button emits resetRequested', () => {
      component.schedule = makeSchedule();
      component.isOpen = true;
      component.ngOnChanges({ isOpen: new SimpleChange(false, true, false) });
      fixture.detectChanges();

      let emitted = false;
      component.resetRequested.subscribe(() => (emitted = true));

      const resetBtn: HTMLElement = fixture.nativeElement.querySelector('.week-editor__reset-btn');
      resetBtn.click();
      fixture.detectChanges();
      expect(emitted).toBe(false); // first tap only shows the confirm panel

      const confirmBtn: HTMLElement = fixture.nativeElement.querySelector(
        '.week-editor__reset-confirm-actions button[color="warn"]',
      );
      confirmBtn.click();

      expect(emitted).toBe(true);
    });
  });
});
