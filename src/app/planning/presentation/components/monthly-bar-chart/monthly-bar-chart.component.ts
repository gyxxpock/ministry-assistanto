import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyBar } from '../../../domain/models';
import { SharedModule } from '../../../../shared/presentation/shared.module';

interface BarColumn {
  bar: MonthlyBar;
  isCurrentMonth: boolean;
  isSelected: boolean;
  plannedHeight: number;
  actualHeight: number;
  remainingHeight: number;
  monthDate: Date;
}

const BAR_AREA_HEIGHT = 120;
const COL_WIDTH = 44;
const COL_GAP = 6;

/**
 * Gráfico SVG puro de las 12 barras mensuales del periodo del objetivo activo.
 * Solo Inputs/Outputs — no inyecta ninguna Facade ni importa domain más allá
 * del tipo MonthlyBar.
 */
@Component({
  selector: 'app-monthly-bar-chart',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './monthly-bar-chart.component.html',
  styleUrls: ['./monthly-bar-chart.component.scss'],
})
export class MonthlyBarChartComponent {
  @Input() monthlyBars: MonthlyBar[] = [];
  @Input() selectedYear: number | null = null;
  @Input() selectedMonth: number | null = null;
  @Output() monthSelected = new EventEmitter<{ year: number; month: number }>();

  readonly barAreaHeight = BAR_AREA_HEIGHT;
  readonly colWidth = COL_WIDTH;
  readonly colGap = COL_GAP;

  private readonly today = new Date();

  get chartWidth(): number {
    return Math.max(1, this.monthlyBars.length) * (COL_WIDTH + COL_GAP);
  }

  get maxValue(): number {
    const values = this.monthlyBars.flatMap(b => [b.plannedHours, b.actualHours]);
    return Math.max(1, ...values);
  }

  get columns(): BarColumn[] {
    const maxValue = this.maxValue;
    return this.monthlyBars.map(bar => {
      const isCurrentMonth =
        bar.year === this.today.getFullYear() && bar.month === this.today.getMonth() + 1;
      const isSelected = bar.year === this.selectedYear && bar.month === this.selectedMonth;
      const plannedHeight = (bar.plannedHours / maxValue) * BAR_AREA_HEIGHT;
      const actualHeight = (bar.actualHours / maxValue) * BAR_AREA_HEIGHT;
      const remainingHeight = Math.max(plannedHeight - actualHeight, 0);

      return {
        bar,
        isCurrentMonth,
        isSelected,
        plannedHeight,
        actualHeight,
        remainingHeight,
        monthDate: new Date(bar.year, bar.month - 1, 1),
      };
    });
  }

  columnX(index: number): number {
    return index * (COL_WIDTH + COL_GAP);
  }

  onColumnClick(bar: MonthlyBar): void {
    this.monthSelected.emit({ year: bar.year, month: bar.month });
  }
}
