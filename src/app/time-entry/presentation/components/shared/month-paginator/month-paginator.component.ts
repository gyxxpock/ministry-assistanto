import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ma-month-paginator',
  standalone: false,
  templateUrl: './month-paginator.component.html',
  styleUrl: './month-paginator.component.scss',
})
export class MonthPaginatorComponent {
  @Input({ required: true }) currentDate!: Date;
  @Input({ required: true }) isCurrentMonth!: boolean;
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() today = new EventEmitter<void>();
}
