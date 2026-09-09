import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';

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
export class OptionPillGroupComponent implements OnChanges {
  @Input() options: PillOption[] = [];
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    // Force re-evaluation of template bindings when value input changes
    if (changes['value']) {
      // Trigger change detection by updating the property reference
      this.value = changes['value'].currentValue;
    }
  }

  select(v: string): void {
    this.valueChange.emit(v);
  }
}
