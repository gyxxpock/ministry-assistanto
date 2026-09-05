import { Component, computed, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeEntryFacade } from '../../../facade/time-entry.facade';
import { TimeEntryEditDialogComponent } from '../time-entry-edit/time-entry-edit-dialog.component';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  totalMinutes: number;
}

@Component({
  selector: 'app-time-entry-calendar',
  standalone: false,
  templateUrl: './time-entry-calendar.html',
  styleUrl: './time-entry-calendar.scss',
})

export class TimeEntryCalendarComponent implements OnInit {
  currentDate = signal(new Date());
  today = new Date();
  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  private entriesByDate = computed(() => {
    const map = new Map<string, { totalMinutes: number }>();
    for (const entry of this.facade.entries()) {
      const dateKey = this.toKey(entry.date);
      const dayData = map.get(dateKey) ?? { totalMinutes: 0 };
      dayData.totalMinutes += entry.durationMinutes;
      map.set(dateKey, dayData);
    }
    return map;
  });

  // 1. Crea una función para normalizar la fecha a string YYYY-MM-DD
  private toKey(date: Date | string): string {
    const d = new Date(date);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  calendarGrid = computed<CalendarDay[]>(() => {
    const current = this.currentDate();
    const year = current.getFullYear();
    const month = current.getMonth();
    const entriesMap = this.entriesByDate();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days: CalendarDay[] = [];

    const startDayOfWeek = firstDayOfMonth.getDay();
    const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    for (let i = paddingDays; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push(this.createCaendarDay(
        date,
        false,
        entriesMap
      ));
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(this.createCaendarDay(
        date,
        true,
        entriesMap
      ));
    }

    const totalDays = days.length;
    const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.createCaendarDay(
        date,
        false,
        entriesMap
      ));
    }

    return days;
  });

  isCurrentMonth = computed(() => {
    const currentDate = this.currentDate();
    return (
      currentDate.getFullYear() === this.today.getFullYear() &&
      currentDate.getMonth() === this.today.getMonth()
    );
  });

  constructor(public facade: TimeEntryFacade, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.facade.loadMonth(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1);
  }

  prevMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    this.loadData();
  }

  nextMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    this.loadData();
  }

  goToToday(): void {
    this.currentDate.set(new Date());
    this.loadData();
  }

  private createCaendarDay(date: Date, isCurrentMonth: boolean, entriesMap: Map<string, { totalMinutes: number; }>): CalendarDay {
    const dateStr = this.toKey(date);
    const dayData = entriesMap.get(dateStr);
    return {
      date,
      isCurrentMonth,
      isToday: date.toDateString() === this.today.toDateString(),
      totalMinutes: dayData?.totalMinutes ?? 0
    };
  }

  onDayClick(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;

    if (day.totalMinutes === 0) {
      this.dialog.open(TimeEntryEditDialogComponent, {
        width: '450px',
        data: { initialDate: day.date },
      });
      return;
    }

    const dateKey    = this.toKey(day.date);
    const dayEntries = this.facade.entries().filter(e => this.toKey(e.date) === dateKey);
    if (dayEntries.length === 0) return;

    this.dialog.open(TimeEntryEditDialogComponent, {
      width: '450px',
      data: { entry: dayEntries[0] },
    });
  }

  formatHours(minutes: number): string {
    if (minutes === 0) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  }

}
