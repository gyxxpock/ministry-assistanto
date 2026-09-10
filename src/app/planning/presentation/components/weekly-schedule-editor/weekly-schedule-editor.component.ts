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
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { WeeklySchedule } from '../../../domain/models';
import { WEEK_DAY_INDEX } from '../../../../core/services/week-start.service';
import { WeekDay } from '../../../../shared/domain/week-day.model';
import { SharedModule } from '../../../../shared/presentation/shared.module';

/** Días ISO fijos de WeeklySchedule, en orden lunes..domingo (índice 0=lunes). */
const ISO_WEEKDAY_KEYS: (keyof WeeklySchedule)[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function keyForJsDow(jsDow: number): keyof WeeklySchedule {
  const isoIndex = (jsDow + 6) % 7; // 0=domingo..6=sábado -> 0=lunes..6=domingo
  return ISO_WEEKDAY_KEYS[isoIndex];
}

interface DayColumn {
  key: keyof WeeklySchedule;
  labelDate: Date;
  value: number;
}

const ZERO_SCHEDULE: WeeklySchedule = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };
const MAX_DAILY_HOURS = 8;

/**
 * Panel flotante para editar el horario semanal base. Solo Inputs/Outputs —
 * no inyecta ninguna Facade. El guardado real (PlanningFacade.saveWeeklySchedule)
 * lo ejecuta el shell al recibir scheduleChange/resetRequested.
 */
@Component({
  selector: 'app-weekly-schedule-editor',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, SharedModule],
  templateUrl: './weekly-schedule-editor.component.html',
  styleUrls: ['./weekly-schedule-editor.component.scss'],
})
export class WeeklyScheduleEditorComponent implements OnChanges, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Panel de confirmación del reset — usado por onDocumentClick para
   *  distinguir "tap fuera del panel de confirmación" de "tap fuera del editor". */
  @ViewChild('resetConfirmPanel') private resetConfirmPanelRef?: ElementRef<HTMLElement>;

  @Input() schedule: WeeklySchedule = ZERO_SCHEDULE;
  @Input() weekStart: WeekDay = 'monday';
  @Input() isOpen = false;

  @Output() scheduleChange = new EventEmitter<WeeklySchedule>();
  @Output() resetRequested = new EventEmitter<void>();
  @Output() closeRequested = new EventEmitter<void>();

  draft: WeeklySchedule = { ...ZERO_SCHEDULE };

  /** Confirmación de dos pasos para el reset destructivo (ver
   *  time-entry-edit-dialog.component.ts showDeleteConfirm para el patrón de referencia). */
  confirmingReset = false;

  readonly maxDailyHours = MAX_DAILY_HOURS;

  private readonly destroy$ = new Subject<void>();
  private readonly change$ = new Subject<WeeklySchedule>();
  /** Evita que el mismo click que abre el panel lo cierre inmediatamente
   *  (el listener document:click se registra antes de que el evento termine
   *  de subir por la cadena de burbujeo). */
  private ignoreNextDocumentClick = false;

  constructor() {
    this.change$.pipe(debounceTime(150), takeUntil(this.destroy$)).subscribe(schedule => {
      this.scheduleChange.emit(schedule);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.confirmingReset = false;
      if (this.isOpen) {
        this.draft = { ...this.schedule };
        this.ignoreNextDocumentClick = true;
        setTimeout(() => { this.ignoreNextDocumentClick = false; }, 0);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get columns(): DayColumn[] {
    const startIndex = WEEK_DAY_INDEX[this.weekStart];
    return Array.from({ length: 7 }, (_, i) => {
      const dow = (startIndex + i) % 7; // 0=domingo..6=sábado
      const key = keyForJsDow(dow);
      return {
        key,
        labelDate: new Date(2024, 0, 7 + dow), // 2024-01-07 fue domingo
        value: this.draft[key],
      };
    });
  }

  onRangeChange(key: keyof WeeklySchedule, rawValue: string): void {
    const value = Math.min(this.maxDailyHours, Math.max(0, Number(rawValue)));
    this.draft = { ...this.draft, [key]: value };
    this.change$.next({ ...this.draft });
  }

  formatHours(value: number): string {
    const h = Math.floor(value);
    const m = Math.round((value - h) * 60);
    return `${h}:${String(m).padStart(2, '0')}`;
  }

  /** Primer tap del botón de reset: solo muestra el panel de confirmación,
   *  no destruye nada todavía. */
  onResetRequest(): void {
    this.confirmingReset = true;
  }

  /** Segundo tap (botón "Confirmar" del panel): aquí sí se ejecuta el reset destructivo. */
  onResetConfirm(): void {
    this.confirmingReset = false;
    this.draft = { ...ZERO_SCHEDULE };
    this.resetRequested.emit();
  }

  onResetCancel(): void {
    this.confirmingReset = false;
  }

  onClose(): void {
    this.closeRequested.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen || this.ignoreNextDocumentClick) return;
    const target = event.target as Node;

    // Un tap fuera del panel de confirmación de reset lo cancela primero,
    // sin cerrar todo el editor en el mismo gesto.
    if (this.confirmingReset && !this.resetConfirmPanelRef?.nativeElement.contains(target)) {
      this.confirmingReset = false;
      return;
    }

    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeRequested.emit();
    }
  }
}
