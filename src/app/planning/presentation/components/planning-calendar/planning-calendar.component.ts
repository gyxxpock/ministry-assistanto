import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { WEEK_DAY_INDEX } from '../../../../core/services/week-start.service';
import { WeekDay } from '../../../../shared/domain/week-day.model';
import { SharedModule } from '../../../../shared/presentation/shared.module';
import { toDateKey } from '../../utils/date-key.util';

interface PlanningCalendarDay {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isOverride: boolean;
  plannedHours: number;
  actualHours: number;
}

/**
 * Grid mensual de planificación. Solo Inputs/Outputs — no inyecta ninguna
 * Facade; los mapas de horas planeadas/reales y el set de overrides los
 * calcula PlanningComponent (shell) a partir de PlanningFacade/TimeEntryFacade.
 * Mismo criterio de padding/orden de semana que TimeEntryCalendarComponent.
 */
@Component({
  selector: 'app-planning-calendar',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './planning-calendar.component.html',
  styleUrls: ['./planning-calendar.component.scss'],
})
export class PlanningCalendarComponent {
  private readonly translate = inject(TranslateService);

  @Input({ required: true }) monthDate!: Date;
  @Input() plannedByDate: Map<string, number> = new Map();
  @Input() actualByDate: Map<string, number> = new Map();
  @Input() overrideDates: Set<string> = new Set();
  @Input() weekStart: WeekDay = 'monday';
  @Input() selectedDate: Date | null = null;
  @Output() daySelected = new EventEmitter<Date>();

  private readonly today = new Date();

  // Cache memoizada de la última grilla calculada + huella (snapshot) de los
  // Inputs que la produjeron. Los Inputs son @Input() clásicos (no signals de
  // `input()`), así que computed() no aplica; y no podemos depender solo de
  // ngOnChanges porque los specs (y el propio shell en algunos casos) asignan
  // los Inputs por propiedad directa (`component.monthDate = ...`), lo que
  // NUNCA dispara ngOnChanges. Por eso mantenemos `calendarGrid` como getter
  // —compatible con esa asignación directa— pero memoizado: si ningún Input
  // relevante cambió desde la última lectura, se devuelve el mismo array (y
  // los mismos objetos Date) en vez de reconstruirlo. Esto evita el trabajo
  // repetido en cada pasada de change detection y, sobre todo, corrige
  // NG0100 (ExpressionChangedAfterItHasBeenCheckedError): antes, cada lectura
  // creaba objetos Date nuevos usados como `track` en `@for`, así que la
  // pasada de verificación (checkNoChanges) de Angular veía identidades de
  // track distintas a las de la pasada anterior dentro del mismo ciclo.
  private cachedGrid: PlanningCalendarDay[] | null = null;
  private cachedMonthTime: number | null = null;
  private cachedSelectedTime: number | null = null;
  private cachedWeekStart: WeekDay | null = null;
  private cachedPlannedByDate: Map<string, number> | null = null;
  private cachedActualByDate: Map<string, number> | null = null;
  private cachedOverrideDates: Set<string> | null = null;

  get calendarGrid(): PlanningCalendarDay[] {
    const monthTime = this.monthDate.getTime();
    const selectedTime = this.selectedDate ? this.selectedDate.getTime() : null;

    const isCacheValid =
      this.cachedGrid !== null &&
      this.cachedMonthTime === monthTime &&
      this.cachedSelectedTime === selectedTime &&
      this.cachedWeekStart === this.weekStart &&
      this.cachedPlannedByDate === this.plannedByDate &&
      this.cachedActualByDate === this.actualByDate &&
      this.cachedOverrideDates === this.overrideDates;

    if (isCacheValid) {
      return this.cachedGrid!;
    }

    const grid = this.buildCalendarGrid();
    this.cachedGrid = grid;
    this.cachedMonthTime = monthTime;
    this.cachedSelectedTime = selectedTime;
    this.cachedWeekStart = this.weekStart;
    this.cachedPlannedByDate = this.plannedByDate;
    this.cachedActualByDate = this.actualByDate;
    this.cachedOverrideDates = this.overrideDates;
    return grid;
  }

  get weekDays(): string[] {
    const locale = this.translate.currentLang || 'es';
    const startIndex = WEEK_DAY_INDEX[this.weekStart];
    return Array.from({ length: 7 }, (_, i) => {
      const dow = (startIndex + i) % 7; // 0=domingo..6=sábado
      const date = new Date(2024, 0, 7 + dow); // 2024-01-07 fue domingo
      const name = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
      return name.charAt(0).toUpperCase() + name.slice(1);
    });
  }

  onDayClick(day: PlanningCalendarDay): void {
    if (!day.isCurrentMonth) return;
    this.daySelected.emit(day.date);
  }

  private buildCalendarGrid(): PlanningCalendarDay[] {
    const year = this.monthDate.getFullYear();
    const month = this.monthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days: PlanningCalendarDay[] = [];

    const startDayOfWeek = firstDayOfMonth.getDay();
    const weekStartIndex = WEEK_DAY_INDEX[this.weekStart];
    const paddingDays = (startDayOfWeek - weekStartIndex + 7) % 7;

    for (let i = paddingDays; i > 0; i--) {
      days.push(this.buildDay(new Date(year, month, 1 - i), false));
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(this.buildDay(new Date(year, month, i), true));
    }

    const totalDays = days.length;
    const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    for (let i = 1; i <= remainingDays; i++) {
      days.push(this.buildDay(new Date(year, month + 1, i), false));
    }

    return days;
  }

  private buildDay(date: Date, isCurrentMonth: boolean): PlanningCalendarDay {
    const iso = toDateKey(date);
    return {
      date,
      dateKey: iso,
      isCurrentMonth,
      isToday: date.toDateString() === this.today.toDateString(),
      isSelected: !!this.selectedDate && date.toDateString() === this.selectedDate.toDateString(),
      isOverride: this.overrideDates.has(iso),
      plannedHours: this.plannedByDate.get(iso) ?? 0,
      actualHours: this.actualByDate.get(iso) ?? 0,
    };
  }
}
