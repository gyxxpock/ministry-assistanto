import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  NgZone,
  OnDestroy,
  ViewChild,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, asyncScheduler, fromEvent, merge } from 'rxjs';
import { debounceTime, takeUntil, throttleTime } from 'rxjs/operators';

const ITEM_H = 44;

@Component({
  selector: 'ma-duration-wheel-picker',
  templateUrl: './duration-wheel-picker.component.html',
  styleUrls: ['./duration-wheel-picker.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DurationWheelPickerComponent),
      multi: true,
    },
  ],
})
export class DurationWheelPickerComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  @ViewChild('hoursWheel')   private hoursEl!:   ElementRef<HTMLElement>;
  @ViewChild('minutesWheel') private minutesEl!: ElementRef<HTMLElement>;

  private readonly cdr      = inject(ChangeDetectorRef);
  private readonly zone     = inject(NgZone);
  private readonly injector = inject(Injector);
  private readonly destroy$ = new Subject<void>();

  private hostControl: NgControl | null = null;

  readonly hoursItems  = Array.from({ length: 9  }, (_, i) => i);     // 0–8 h
  readonly minuteItems = Array.from({ length: 12 }, (_, i) => i * 5); // 0–55 min

  protected isDisabled = false;
  protected selectedH  = 0;
  protected selectedM  = 15;

  private pendingValue: number | null = null;
  private isWriting    = false;

  private onChange:  (v: number) => void = () => {};
  private onTouched: () => void          = () => {};

  // ── ControlValueAccessor ───────────────────────────────────────────
  writeValue(totalMinutes: number): void {
    if (totalMinutes == null) return;
    if (!this.hoursEl) { this.pendingValue = totalMinutes; return; }
    this.applyValue(totalMinutes);
  }

  registerOnChange(fn: (v: number) => void): void  { this.onChange  = fn; }
  registerOnTouched(fn: () => void): void           { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  // ── Lifecycle ──────────────────────────────────────────────────────
  ngAfterViewInit(): void {
    // Inyección lazy para evitar dependencia circular con NG_VALUE_ACCESSOR
    this.hostControl = this.injector.get(NgControl, null);

    this.zone.runOutsideAngular(() => {
      this.attachListener(this.hoursEl.nativeElement,   'hours');
      this.attachListener(this.minutesEl.nativeElement, 'minutes');
    });

    if (this.pendingValue !== null) {
      this.applyValue(this.pendingValue);
      this.pendingValue = null;
    } else {
      this.snapTo(this.hoursEl.nativeElement,   this.hoursItems.indexOf(this.selectedH));
      this.snapTo(this.minutesEl.nativeElement, this.minuteItems.indexOf(this.selectedM));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Private ────────────────────────────────────────────────────────
  private applyValue(totalMinutes: number): void {
    this.selectedH = Math.min(8, Math.floor(totalMinutes / 60));
    this.selectedM = Math.min(55, Math.round((totalMinutes % 60) / 5) * 5);

    this.isWriting = true;
    this.snapTo(this.hoursEl.nativeElement,   Math.max(0, this.hoursItems.indexOf(this.selectedH)));
    this.snapTo(this.minutesEl.nativeElement, Math.max(0, this.minuteItems.indexOf(this.selectedM)));
    setTimeout(() => { this.isWriting = false; }, 200);
  }

  private snapTo(el: HTMLElement, index: number): void {
    el.scrollTop = index * ITEM_H;
  }

  private attachListener(el: HTMLElement, col: 'hours' | 'minutes'): void {
    merge(
      fromEvent(el, 'scrollend'),
      fromEvent(el, 'scroll').pipe(debounceTime(150))
    )
      .pipe(
        throttleTime(0, asyncScheduler, { leading: false, trailing: true }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.onSettled(el, col));
  }

  private onSettled(el: HTMLElement, col: 'hours' | 'minutes'): void {
    if (this.isWriting) return;

    const items = col === 'hours' ? this.hoursItems : this.minuteItems;
    const idx   = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H)));

    if (col === 'hours') this.selectedH = items[idx];
    else                 this.selectedM = items[idx];

    const total = this.selectedH * 60 + this.selectedM;
    this.zone.run(() => {
      this.onChange(total);
      this.onTouched();
      this.hostControl?.control?.markAsDirty();
      this.cdr.markForCheck();
    });
  }
}
