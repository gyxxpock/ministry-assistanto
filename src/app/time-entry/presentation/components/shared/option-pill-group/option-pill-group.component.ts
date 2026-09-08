import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface PillOption {
  value: string;
  label: string; // clave i18n
  icon?: string;
}

@Component({
  selector: 'ma-option-pill-group',
  standalone: false,
  templateUrl: './option-pill-group.component.html',
  styleUrl: './option-pill-group.component.scss',
})
export class OptionPillGroupComponent {
  @Input() options: PillOption[] = [];
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  select(v: string): void {
    this.valueChange.emit(v);
  }
}
