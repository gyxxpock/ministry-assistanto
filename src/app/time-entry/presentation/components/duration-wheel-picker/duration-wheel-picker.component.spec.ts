import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DurationWheelPickerComponent } from './duration-wheel-picker.component';

describe('DurationWheelPickerComponent', () => {
  let component: DurationWheelPickerComponent;
  let fixture: ComponentFixture<DurationWheelPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DurationWheelPickerComponent],
      imports: [CommonModule, ReactiveFormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(DurationWheelPickerComponent);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('hoursItems contains 0 through 8', () => {
    expect(component.hoursItems).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('minuteItems contains multiples of 5 from 0 to 55', () => {
    expect(component.minuteItems).toEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  });

  it('starts with selectedH=0 and selectedM=15', () => {
    expect((component as any).selectedH).toBe(0);
    expect((component as any).selectedM).toBe(15);
  });

  it('writeValue before init stores pendingValue', () => {
    component.writeValue(90);
    expect((component as any).pendingValue).toBe(90);
  });

  it('writeValue null is a no-op', () => {
    component.writeValue(null as any);
    expect((component as any).pendingValue).toBeNull();
    expect((component as any).selectedH).toBe(0);
  });

  it('pending value is applied on ngAfterViewInit', fakeAsync(() => {
    component.writeValue(90); // 1h 30m
    fixture.detectChanges();
    tick(250);
    expect((component as any).selectedH).toBe(1);
    expect((component as any).selectedM).toBe(30);
  }));

  it('writeValue after init applies selected hours and minutes', fakeAsync(() => {
    fixture.detectChanges();
    component.writeValue(120); // 2h 0m
    tick(250);
    expect((component as any).selectedH).toBe(2);
    expect((component as any).selectedM).toBe(0);
  }));

  it('writeValue clamps selectedH to max 8 hours', fakeAsync(() => {
    fixture.detectChanges();
    component.writeValue(600); // 10h → clamps to 8h
    tick(250);
    expect((component as any).selectedH).toBe(8);
  }));

  it('writeValue rounds selectedM to nearest 5-minute increment', fakeAsync(() => {
    fixture.detectChanges();
    component.writeValue(67); // 1h 7m → rounds to 1h 5m
    tick(250);
    expect((component as any).selectedM).toBe(5);
  }));

  it('registerOnChange stores the callback', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    expect((component as any).onChange).toBe(spy);
  });

  it('registerOnTouched stores the callback', () => {
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    expect((component as any).onTouched).toBe(spy);
  });

  it('setDisabledState enables and disables the component', () => {
    fixture.detectChanges();
    component.setDisabledState(true);
    expect((component as any).isDisabled).toBeTrue();
    component.setDisabledState(false);
    expect((component as any).isDisabled).toBeFalse();
  });

  it('ngOnDestroy completes without error', () => {
    fixture.detectChanges();
    expect(() => fixture.destroy()).not.toThrow();
  });

  describe('onSettled (private)', () => {
    beforeEach(() => { fixture.detectChanges(); });

    it('updates selectedH and fires onChange when hours wheel settles', () => {
      const changeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(changeSpy);
      const hoursEl = (component as any).hoursEl.nativeElement as HTMLElement;
      (hoursEl as any).scrollTop = 2 * 44; // index 2 → hour 2
      (component as any).onSettled(hoursEl, 'hours');
      expect((component as any).selectedH).toBe(2);
      expect(changeSpy).toHaveBeenCalledWith(2 * 60 + 15); // 2h + 15min default
    });

    it('updates selectedM and fires onChange when minutes wheel settles', () => {
      const changeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(changeSpy);
      const minutesEl = (component as any).minutesEl.nativeElement as HTMLElement;
      (minutesEl as any).scrollTop = 6 * 44; // index 6 → minute 30
      (component as any).onSettled(minutesEl, 'minutes');
      expect((component as any).selectedM).toBe(30);
      expect(changeSpy).toHaveBeenCalledWith(0 * 60 + 30); // 0h + 30min
    });

    it('is a no-op when isWriting is true', () => {
      const changeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(changeSpy);
      (component as any).isWriting = true;
      const hoursEl = (component as any).hoursEl.nativeElement as HTMLElement;
      (component as any).onSettled(hoursEl, 'hours');
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('fires onTouched when settled', () => {
      const touchedSpy = jasmine.createSpy('onTouched');
      component.registerOnTouched(touchedSpy);
      component.registerOnChange(() => {});
      const hoursEl = (component as any).hoursEl.nativeElement as HTMLElement;
      (hoursEl as any).scrollTop = 0;
      (component as any).onSettled(hoursEl, 'hours');
      expect(touchedSpy).toHaveBeenCalled();
    });
  });
});
