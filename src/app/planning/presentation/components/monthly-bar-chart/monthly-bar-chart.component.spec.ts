import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MonthlyBarChartComponent } from './monthly-bar-chart.component';
import { MonthlyBar } from '../../../domain/models';

function makeBar(year: number, month: number, plannedHours: number, actualHours: number): MonthlyBar {
  return { year, month, plannedHours, actualHours };
}

describe('MonthlyBarChartComponent', () => {
  let component: MonthlyBarChartComponent;
  let fixture: ComponentFixture<MonthlyBarChartComponent>;
  const today = new Date();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MonthlyBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyBarChartComponent);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('chartWidth', () => {
    it('is 0-bars-wide minimum: at least 1 column-worth wide when there are no bars', () => {
      component.monthlyBars = [];
      expect(component.chartWidth).toBe(1 * (44 + 6));
    });

    it('scales linearly with the number of bars', () => {
      component.monthlyBars = [makeBar(2026, 1, 1, 1), makeBar(2026, 2, 1, 1)];
      expect(component.chartWidth).toBe(2 * (44 + 6));
    });
  });

  describe('maxValue', () => {
    it('has a floor of 1 when every bar is 0', () => {
      component.monthlyBars = [makeBar(2026, 1, 0, 0), makeBar(2026, 2, 0, 0)];
      expect(component.maxValue).toBe(1);
    });

    it('is the maximum of all plannedHours/actualHours across bars', () => {
      component.monthlyBars = [makeBar(2026, 1, 10, 25), makeBar(2026, 2, 40, 5)];
      expect(component.maxValue).toBe(40);
    });
  });

  describe('columns — height formula (hours / maxValue * 120)', () => {
    it('computes plannedHeight/actualHeight proportional to maxValue over a 120px area', () => {
      component.monthlyBars = [makeBar(2026, 1, 60, 30)];
      const [col] = component.columns;

      expect(col.plannedHeight).toBeCloseTo((60 / 60) * 120, 5);
      expect(col.actualHeight).toBeCloseTo((30 / 60) * 120, 5);
    });

    it('remainingHeight is plannedHeight minus actualHeight, floored at 0', () => {
      component.monthlyBars = [makeBar(2026, 1, 60, 30)];
      const [col] = component.columns;
      expect(col.remainingHeight).toBeCloseTo(col.plannedHeight - col.actualHeight, 5);
    });

    it('remainingHeight is 0 (not negative) when actualHeight exceeds plannedHeight', () => {
      component.monthlyBars = [makeBar(2026, 1, 10, 60)];
      const [col] = component.columns;
      expect(col.remainingHeight).toBe(0);
    });

    it('marks the bar matching today as isCurrentMonth, splitting real vs remaining', () => {
      component.monthlyBars = [
        makeBar(today.getFullYear(), today.getMonth() + 1, 50, 20),
        makeBar(2019, 1, 50, 20),
      ];
      const [current, past] = component.columns;
      expect(current.isCurrentMonth).toBe(true);
      expect(past.isCurrentMonth).toBe(false);
    });

    it('marks the bar matching selectedYear/selectedMonth as isSelected', () => {
      component.monthlyBars = [makeBar(2026, 3, 10, 5), makeBar(2026, 4, 10, 5)];
      component.selectedYear = 2026;
      component.selectedMonth = 4;

      const [march, april] = component.columns;
      expect(march.isSelected).toBe(false);
      expect(april.isSelected).toBe(true);
    });

    it('monthDate is the first day of the bar\'s (year, month)', () => {
      component.monthlyBars = [makeBar(2026, 5, 10, 5)];
      const [col] = component.columns;
      expect(col.monthDate).toEqual(new Date(2026, 4, 1));
    });
  });

  describe('columnX', () => {
    it('spaces columns by colWidth + colGap', () => {
      expect(component.columnX(0)).toBe(0);
      expect(component.columnX(1)).toBe(44 + 6);
      expect(component.columnX(3)).toBe(3 * (44 + 6));
    });
  });

  describe('onColumnClick', () => {
    it('emits monthSelected with the clicked bar\'s year and month', () => {
      const bar = makeBar(2026, 7, 10, 5);
      let emitted: { year: number; month: number } | undefined;
      component.monthSelected.subscribe(v => (emitted = v));

      component.onColumnClick(bar);

      expect(emitted).toEqual({ year: 2026, month: 7 });
    });
  });

  describe('DOM rendering', () => {
    it('renders one bar-column per monthlyBar and clicking its hit-area emits monthSelected', () => {
      component.monthlyBars = [makeBar(2026, 8, 10, 5), makeBar(2026, 9, 20, 15)];
      component.selectedYear = 2026;
      component.selectedMonth = 8;
      fixture.detectChanges();

      const hitAreas: NodeListOf<SVGRectElement> =
        fixture.nativeElement.querySelectorAll('.bar-column__hit-area');
      expect(hitAreas.length).toBe(2);

      let emitted: { year: number; month: number } | undefined;
      component.monthSelected.subscribe(v => (emitted = v));
      hitAreas[1].dispatchEvent(new MouseEvent('click'));

      expect(emitted).toEqual({ year: 2026, month: 9 });
    });
  });
});
