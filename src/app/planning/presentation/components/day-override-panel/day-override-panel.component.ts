import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { WeekDay } from '../../../../shared/domain/week-day.model';
import { SharedModule } from '../../../../shared/presentation/shared.module';

const MAX_DAILY_HOURS = 24;
/** Tiempo tras el que la confirmación de "limpiar override" revierte sola si
 *  el usuario no hace ni un segundo tap ni un tap fuera del panel. */
const CLEAR_CONFIRM_TIMEOUT_MS = 3000;

/**
 * Panel sticky inferior para confirmar/limpiar la excepción (override) del
 * día seleccionado. Solo Inputs/Outputs — no inyecta ninguna Facade.
 */
@Component({
  selector: 'app-day-override-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, SharedModule],
  templateUrl: './day-override-panel.component.html',
  styleUrls: ['./day-override-panel.component.scss'],
})
export class DayOverridePanelComponent implements OnChanges, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input() selectedDate: Date | null = null;
  @Input() templateHours = 0;
  @Input() overrideHours: number | null = null;
  @Input() weekStart: WeekDay = 'monday';

  @Output() confirm = new EventEmitter<number>();
  @Output() clear = new EventEmitter<void>();

  hoursInput = 0;

  readonly maxDailyHours = MAX_DAILY_HOURS;

  /** Confirmación de dos pasos para el "limpiar override" destructivo (mismo
   *  patrón que showDeleteConfirm en time-entry-edit-dialog.component.ts,
   *  reducido a la escala de este panel pequeño). */
  confirmingClear = false;

  private clearConfirmTimeoutId: ReturnType<typeof setTimeout> | null = null;

  get hasOverride(): boolean {
    return this.overrideHours !== null;
  }

  get isHoursInputInvalid(): boolean {
    return this.hoursInput < 0 || this.hoursInput > this.maxDailyHours;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] || changes['overrideHours'] || changes['templateHours']) {
      this.hoursInput = this.overrideHours ?? this.templateHours;
      this.cancelClearConfirm();
    }
  }

  ngOnDestroy(): void {
    this.clearClearConfirmTimeout();
  }

  onConfirm(): void {
    const value = Math.min(this.maxDailyHours, Math.max(0, Number(this.hoursInput) || 0));
    this.confirm.emit(value);
  }

  /** Primer tap: solo entra en estado de confirmación. Segundo tap: emite
   *  `clear` de verdad. Revierte solo tras CLEAR_CONFIRM_TIMEOUT_MS o con un
   *  tap fuera del panel (ver onDocumentClick). */
  onClear(): void {
    if (!this.hasOverride) return;

    if (this.confirmingClear) {
      this.cancelClearConfirm();
      this.clear.emit();
      return;
    }

    this.confirmingClear = true;
    this.clearConfirmTimeoutId = setTimeout(() => this.cancelClearConfirm(), CLEAR_CONFIRM_TIMEOUT_MS);
  }

  private cancelClearConfirm(): void {
    this.confirmingClear = false;
    this.clearClearConfirmTimeout();
  }

  private clearClearConfirmTimeout(): void {
    if (this.clearConfirmTimeoutId !== null) {
      clearTimeout(this.clearConfirmTimeoutId);
      this.clearConfirmTimeoutId = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.confirmingClear) return;
    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.cancelClearConfirm();
    }
  }
}
