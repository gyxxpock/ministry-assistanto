import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PlanningFacade } from '../../../facade/planning.facade';
import { GoalsFacade } from '../../../../goals/facade/goals.facade';
import { TimeEntryFacade } from '../../../../time-entry/facade/time-entry.facade';
import { WeekStartService } from '../../../../core/services/week-start.service';
import { DayPlan, MonthlyBar, WeeklySchedule } from '../../../domain/models';
import { computeDailyPlan } from '../../../domain/planning.usecase';
import { getServiceYear } from '../../../../goals/domain/goal.usecase';
import { toDateKey } from '../../utils/date-key.util';
import { PillOption } from '../../../../time-entry/presentation/components/shared/option-pill-group/option-pill-group.component';

const ZERO_SCHEDULE: WeeklySchedule = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatHoursLabel(decimalHours: number): string {
  const h = Math.floor(decimalHours);
  const m = Math.round((decimalHours - h) * 60);
  return `${h}:${String(m).padStart(2, '0')}`;
}

/**
 * Shell de PlanningModule. Es el ÚNICO componente que inyecta Facades
 * (PlanningFacade, GoalsFacade, TimeEntryFacade) e importa lógica de
 * domain/ (getServiceYear, computeDailyPlan) — todos los demás componentes
 * de planning/presentation/ son "tontos" (solo Inputs/Outputs).
 */
@Component({
  selector: 'app-planning',
  standalone: false,
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent implements OnInit {
  private readonly planningFacade = inject(PlanningFacade);
  private readonly goalsFacade = inject(GoalsFacade);
  private readonly timeEntryFacade = inject(TimeEntryFacade);
  private readonly weekStartService = inject(WeekStartService);
  private readonly translate = inject(TranslateService);

  readonly weekStart = this.weekStartService.weekStart;

  readonly selectedDate = signal<Date | null>(null);
  readonly visibleMonth = signal<Date>(new Date());
  readonly isEditorOpen = signal(false);

  // Exponemos las facades solo para bindings de solo lectura en el template
  // (activeGoal, goalProgress, weeklySchedule, dayOverrides) — el shell sigue
  // siendo el único punto de acceso, los hijos reciben todo por Input.
  readonly facade = this.planningFacade;
  readonly goalsState = this.goalsFacade;

  readonly goalPeriod = computed(() => getServiceYear(new Date()));
  readonly periodStartDate = computed(() => {
    const sy = this.goalPeriod();
    return new Date(sy.startYear, sy.startMonth - 1, 1);
  });
  readonly periodEndDate = computed(() => {
    const sy = this.goalPeriod();
    return new Date(sy.endYear, sy.endMonth - 1, 1);
  });

  readonly monthlyBars = computed<MonthlyBar[]>(
    () => this.planningFacade.planningProjection()?.monthlyBars ?? [],
  );

  // Getter (no computed signal): igual que `weekDays` en PlanningCalendarComponent,
  // debe re-evaluarse cuando cambia el idioma en runtime, no solo cuando cambian
  // los MonthlyBar. `translate.currentLang` no es un signal, así que un computed()
  // no se invalidaría solo por un cambio de idioma; el getter se reevalúa en cada
  // ciclo de detección de cambios (disparado también por el evento de ngx-translate).
  get monthPillOptions(): PillOption[] {
    const locale = this.translate.currentLang || 'es';
    const formatter = new Intl.DateTimeFormat(locale, { month: 'short' });
    return this.monthlyBars().map(bar => {
      const label = formatter.format(new Date(bar.year, bar.month - 1, 1));
      return {
        value: this.monthValueOf(bar.year, bar.month),
        label: label.charAt(0).toUpperCase() + label.slice(1),
      };
    });
  }

  readonly selectedMonthPillValue = computed(() => {
    const month = this.visibleMonth();
    return this.monthValueOf(month.getFullYear(), month.getMonth() + 1);
  });

  readonly weekPlanLabel = computed(() => formatHoursLabel(this.planningFacade.weeklyTotal()));

  readonly scheduleForEditor = computed<WeeklySchedule>(
    () => this.planningFacade.weeklySchedule() ?? ZERO_SCHEDULE,
  );

  readonly plannedByDate = computed<Map<string, number>>(() => {
    const schedule = this.planningFacade.weeklySchedule();
    const map = new Map<string, number>();
    if (!schedule) return map;

    const month = this.visibleMonth();
    const year = month.getFullYear();
    const m = month.getMonth() + 1;
    const totalDays = new Date(year, m, 0).getDate();
    const overrides = this.planningFacade.dayOverrides();
    const weekStart = this.weekStartService.weekStart();

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, m - 1, d);
      const hours = computeDailyPlan(schedule, overrides, date, weekStart);
      if (hours > 0) map.set(toDateKey(date), hours);
    }
    return map;
  });

  readonly actualByDate = computed<Map<string, number>>(() => {
    const map = new Map<string, number>();
    for (const entry of this.timeEntryFacade.entries()) {
      const date = entry.date instanceof Date ? entry.date : new Date(entry.date);
      const iso = toDateKey(date);
      map.set(iso, round2((map.get(iso) ?? 0) + entry.durationMinutes / 60));
    }
    return map;
  });

  readonly overrideDates = computed<Set<string>>(
    () => new Set(this.planningFacade.dayOverrides().map((o: DayPlan) => o.date)),
  );

  readonly selectedDayInfo = computed(() => {
    const date = this.selectedDate();
    if (!date) return null;

    const schedule = this.planningFacade.weeklySchedule();
    const overrides = this.planningFacade.dayOverrides();
    const weekStart = this.weekStartService.weekStart();
    const iso = toDateKey(date);
    const override = overrides.find((o: DayPlan) => o.date === iso);
    // Overrides vacíos a propósito: fuerza el valor de plantilla puro (sin
    // resolver la excepción), que es justo lo que necesita day-override-panel
    // para mostrar "plantilla" vs "excepción" por separado.
    const templateHours = schedule ? computeDailyPlan(schedule, [], date, weekStart) : 0;

    return {
      templateHours,
      overrideHours: override ? override.hours : null,
    };
  });

  ngOnInit(): void {
    const now = this.visibleMonth();
    this.goalsFacade.loadGoal();
    void this.planningFacade.loadPlanForMonth(now.getFullYear(), now.getMonth() + 1);
    void this.timeEntryFacade.loadMonth(now.getFullYear(), now.getMonth() + 1);
  }

  onMonthSelected(selection: { year: number; month: number }): void {
    this.navigateToMonth(selection.year, selection.month);
  }

  // Navegación primaria de meses (AC #54): tabs horizontales con scroll,
  // reutilizando ma-option-pill-group (ver time-entry.module.ts). El click en
  // las columnas del bar chart sigue funcionando como acceso adicional —
  // ambos caminos convergen en navigateToMonth().
  onMonthPillSelected(value: string): void {
    const [year, month] = value.split('-').map(Number);
    this.navigateToMonth(year, month);
  }

  private navigateToMonth(year: number, month: number): void {
    this.visibleMonth.set(new Date(year, month - 1, 1));
    this.selectedDate.set(null);
    void this.planningFacade.loadPlanForMonth(year, month);
    void this.timeEntryFacade.loadMonth(year, month);
  }

  private monthValueOf(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  onDaySelected(date: Date): void {
    this.selectedDate.set(date);
  }

  toggleEditor(): void {
    this.isEditorOpen.update(open => !open);
  }

  onScheduleChange(schedule: WeeklySchedule): void {
    void this.planningFacade.saveWeeklySchedule(schedule);
  }

  onResetRequested(): void {
    void this.planningFacade.saveWeeklySchedule({ ...ZERO_SCHEDULE });
  }

  onEditorCloseRequested(): void {
    this.isEditorOpen.set(false);
  }

  onDayConfirm(hours: number): void {
    const date = this.selectedDate();
    if (!date) return;
    void this.planningFacade.setDayOverride({ date: toDateKey(date), hours });
  }

  onDayClear(): void {
    const date = this.selectedDate();
    if (!date) return;
    void this.planningFacade.clearDayOverride(toDateKey(date));
  }
}
