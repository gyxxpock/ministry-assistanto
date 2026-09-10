import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DayOverridePanelComponent } from './day-override-panel.component';

describe('DayOverridePanelComponent', () => {
  let component: DayOverridePanelComponent;
  let fixture: ComponentFixture<DayOverridePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), DayOverridePanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DayOverridePanelComponent);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('renders nothing when selectedDate is null', () => {
      component.selectedDate = null;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.day-panel')).toBeNull();
    });

    it('renders the panel when selectedDate is set', () => {
      component.selectedDate = new Date(2026, 8, 7);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.day-panel')).not.toBeNull();
    });
  });

  describe('hasOverride', () => {
    it('is false when overrideHours is null', () => {
      component.overrideHours = null;
      expect(component.hasOverride).toBe(false);
    });

    it('is true when overrideHours is a number (including 0)', () => {
      component.overrideHours = 0;
      expect(component.hasOverride).toBe(true);
      component.overrideHours = 5;
      expect(component.hasOverride).toBe(true);
    });
  });

  describe('ngOnChanges — hoursInput reflects override-or-template', () => {
    it('sets hoursInput to templateHours when there is no override', () => {
      component.templateHours = 4;
      component.overrideHours = null;
      component.ngOnChanges({ templateHours: new SimpleChange(0, 4, false) });
      expect(component.hoursInput).toBe(4);
    });

    it('sets hoursInput to overrideHours when an override exists, ignoring templateHours', () => {
      component.templateHours = 4;
      component.overrideHours = 9.5;
      component.ngOnChanges({ overrideHours: new SimpleChange(null, 9.5, false) });
      expect(component.hoursInput).toBe(9.5);
    });

    it('recomputes hoursInput when selectedDate changes', () => {
      component.templateHours = 2;
      component.overrideHours = null;
      component.ngOnChanges({ selectedDate: new SimpleChange(null, new Date(), false) });
      expect(component.hoursInput).toBe(2);
    });

    it('does nothing when an unrelated Input changes', () => {
      component.hoursInput = 42;
      component.templateHours = 4;
      component.overrideHours = null;
      component.ngOnChanges({ weekStart: new SimpleChange('monday', 'sunday', false) });
      expect(component.hoursInput).toBe(42);
    });
  });

  describe('onConfirm', () => {
    it('emits confirm with the current hoursInput', () => {
      component.hoursInput = 3.5;
      let emitted: number | undefined;
      component.confirm.subscribe(v => (emitted = v));

      component.onConfirm();

      expect(emitted).toBe(3.5);
    });

    it('clamps a value above maxDailyHours (24) down to 24', () => {
      component.hoursInput = 30;
      let emitted: number | undefined;
      component.confirm.subscribe(v => (emitted = v));

      component.onConfirm();

      expect(emitted).toBe(24);
    });

    it('clamps a negative value up to 0', () => {
      component.hoursInput = -5;
      let emitted: number | undefined;
      component.confirm.subscribe(v => (emitted = v));

      component.onConfirm();

      expect(emitted).toBe(0);
    });

    it('treats a NaN hoursInput as 0', () => {
      component.hoursInput = NaN;
      let emitted: number | undefined;
      component.confirm.subscribe(v => (emitted = v));

      component.onConfirm();

      expect(emitted).toBe(0);
    });
  });

  describe('onClear', () => {
    it('arms confirmingClear on the first call without emitting', () => {
      component.overrideHours = 5;
      let emitted = false;
      component.clear.subscribe(() => (emitted = true));

      component.onClear();

      expect(component.confirmingClear).toBe(true);
      expect(emitted).toBe(false);
    });

    it('emits clear on the second call (two-step confirm) and disarms confirmingClear', () => {
      component.overrideHours = 5;
      let emitted = false;
      component.clear.subscribe(() => (emitted = true));
      component.onClear();
      expect(emitted).toBe(false);
      component.onClear();
      expect(emitted).toBe(true);
      expect(component.confirmingClear).toBe(false);
    });

    it('does nothing when there is no override', () => {
      component.overrideHours = null;
      component.onClear();
      expect(component.confirmingClear).toBe(false);
    });
  });

  describe('auto-revert timeout for confirmingClear (3s)', () => {
    it('reverts confirmingClear to false automatically after 3s with no second tap', fakeAsync(() => {
      component.overrideHours = 5;
      let emitted = false;
      component.clear.subscribe(() => (emitted = true));

      component.onClear();
      expect(component.confirmingClear).toBe(true);

      tick(3000);

      expect(component.confirmingClear).toBe(false);
      expect(emitted).toBe(false); // auto-revert never emits clear
    }));

    it('does NOT auto-revert before the 3s elapse', fakeAsync(() => {
      component.overrideHours = 5;
      component.onClear();

      tick(2999);
      expect(component.confirmingClear).toBe(true);

      tick(1); // let the pending timer settle so fakeAsync does not complain about outstanding timers
      expect(component.confirmingClear).toBe(false);
    }));

    it('clears the previous timeout when a second tap confirms before the 3s elapse (no stray revert or re-emit afterwards)', fakeAsync(() => {
      component.overrideHours = 5;
      let emissions = 0;
      component.clear.subscribe(() => emissions++);

      component.onClear(); // arms
      tick(1000);
      component.onClear(); // confirms — clears the pending timeout

      tick(3000);

      expect(component.confirmingClear).toBe(false);
      expect(emissions).toBe(1);
    }));
  });

  describe('onDocumentClick — outside click reverts a pending clear confirm', () => {
    let outsideEl: HTMLElement;

    beforeEach(() => {
      outsideEl = document.createElement('div');
      document.body.appendChild(outsideEl);
    });

    afterEach(() => {
      document.body.removeChild(outsideEl);
    });

    function clickEventWithTarget(target: EventTarget): MouseEvent {
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: target });
      return event;
    }

    it('does nothing when confirmingClear is false', () => {
      component.confirmingClear = false;
      component.onDocumentClick(clickEventWithTarget(outsideEl));
      expect(component.confirmingClear).toBe(false);
    });

    it('reverts confirmingClear without emitting clear when the click lands outside the host element', () => {
      component.overrideHours = 5;
      component.onClear(); // arms confirmingClear
      let emitted = false;
      component.clear.subscribe(() => (emitted = true));

      component.onDocumentClick(clickEventWithTarget(outsideEl));

      expect(component.confirmingClear).toBe(false);
      expect(emitted).toBe(false);
    });

    it('does NOT revert confirmingClear when the click lands inside the host element', () => {
      fixture.detectChanges();
      component.overrideHours = 5;
      component.onClear();

      component.onDocumentClick(clickEventWithTarget(fixture.nativeElement));

      expect(component.confirmingClear).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('clears the pending auto-revert timeout', () => {
      spyOn(window, 'clearTimeout').and.callThrough();
      component.overrideHours = 5;
      component.onClear(); // arms, schedules the 3s timeout

      component.ngOnDestroy();

      expect(window.clearTimeout).toHaveBeenCalled();
    });

    it('prevents the auto-revert from firing after destroy (timeout already cleared)', fakeAsync(() => {
      component.overrideHours = 5;
      component.onClear();
      component.ngOnDestroy();

      tick(3000);

      // If the timeout had survived, cancelClearConfirm() would flip this to false at t=3000.
      expect(component.confirmingClear).toBe(true);
    }));
  });

  describe('isHoursInputInvalid', () => {
    it('is true for a negative hoursInput', () => {
      component.hoursInput = -1;
      expect(component.isHoursInputInvalid).toBe(true);
    });

    it('is true when hoursInput exceeds maxDailyHours', () => {
      component.hoursInput = component.maxDailyHours + 1;
      expect(component.isHoursInputInvalid).toBe(true);
    });

    it('is false for 0 (lower boundary)', () => {
      component.hoursInput = 0;
      expect(component.isHoursInputInvalid).toBe(false);
    });

    it('is false for maxDailyHours (upper boundary)', () => {
      component.hoursInput = component.maxDailyHours;
      expect(component.isHoursInputInvalid).toBe(false);
    });

    it('is false for a valid in-range value', () => {
      component.hoursInput = 10;
      expect(component.isHoursInputInvalid).toBe(false);
    });
  });

  describe('DOM rendering', () => {
    beforeEach(() => {
      component.selectedDate = new Date(2026, 8, 7);
    });

    it('displays templateHours with the "template-label" i18n key when there is no override', () => {
      component.templateHours = 4;
      component.overrideHours = null;
      fixture.detectChanges();

      const currentEl: HTMLElement = fixture.nativeElement.querySelector('.day-panel__current');
      expect(currentEl.textContent).toContain('planning.day-panel.template-label');
      expect(currentEl.textContent).toContain('4');
    });

    it('displays overrideHours with the "override-label" i18n key when an override exists', () => {
      component.templateHours = 4;
      component.overrideHours = 9;
      fixture.detectChanges();

      const currentEl: HTMLElement = fixture.nativeElement.querySelector('.day-panel__current');
      expect(currentEl.textContent).toContain('planning.day-panel.override-label');
      expect(currentEl.textContent).toContain('9');
    });

    it('disables the clear button when there is no override', () => {
      component.overrideHours = null;
      fixture.detectChanges();

      const clearBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.day-panel__clear-btn');
      expect(clearBtn.disabled).toBe(true);
    });

    it('enables the clear button when an override exists, and a second click emits clear', () => {
      component.overrideHours = 5;
      fixture.detectChanges();

      const clearBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.day-panel__clear-btn');
      expect(clearBtn.disabled).toBe(false);

      let emitted = false;
      component.clear.subscribe(() => (emitted = true));
      clearBtn.click();
      expect(emitted).toBe(false);
      clearBtn.click();

      expect(emitted).toBe(true);
    });

    it('applies day-panel__field--invalid when isHoursInputInvalid is true', () => {
      component.templateHours = 4;
      component.overrideHours = null;
      fixture.detectChanges();
      component.hoursInput = -3;
      fixture.detectChanges();

      const field: HTMLElement = fixture.nativeElement.querySelector('.day-panel__field');
      expect(field.classList.contains('day-panel__field--invalid')).toBe(true);
    });

    it('does NOT apply day-panel__field--invalid when hoursInput is valid', () => {
      component.templateHours = 4;
      component.overrideHours = null;
      fixture.detectChanges();
      component.hoursInput = 4;
      fixture.detectChanges();

      const field: HTMLElement = fixture.nativeElement.querySelector('.day-panel__field');
      expect(field.classList.contains('day-panel__field--invalid')).toBe(false);
    });

    it('shows the "close" icon and "clear" aria-label when confirmingClear is false', () => {
      component.overrideHours = 5;
      fixture.detectChanges();

      const clearBtn: HTMLElement = fixture.nativeElement.querySelector('.day-panel__clear-btn');
      expect(clearBtn.querySelector('mat-icon')!.textContent!.trim()).toBe('close');
      expect(clearBtn.getAttribute('aria-label')).toBe('planning.day-panel.clear');
      expect(clearBtn.classList.contains('day-panel__clear-btn--confirming')).toBe(false);
    });

    it('swaps to the "delete_forever" icon, "clear-confirm" aria-label and confirming class once armed', () => {
      component.overrideHours = 5;
      fixture.detectChanges();

      const clearBtn: HTMLElement = fixture.nativeElement.querySelector('.day-panel__clear-btn');
      clearBtn.click();
      fixture.detectChanges();

      expect(clearBtn.querySelector('mat-icon')!.textContent!.trim()).toBe('delete_forever');
      expect(clearBtn.getAttribute('aria-label')).toBe('planning.day-panel.clear-confirm');
      expect(clearBtn.classList.contains('day-panel__clear-btn--confirming')).toBe(true);
    });

    it('clicking the confirm button emits confirm with hoursInput', () => {
      component.templateHours = 3;
      component.overrideHours = null;
      component.ngOnChanges({ templateHours: new SimpleChange(0, 3, false) });
      fixture.detectChanges();

      let emitted: number | undefined;
      component.confirm.subscribe(v => (emitted = v));

      const confirmBtn: HTMLElement = fixture.nativeElement.querySelector('button[color="primary"]');
      confirmBtn.click();

      expect(emitted).toBe(3);
    });
  });
});
