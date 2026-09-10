import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

export interface PillOption {
  value: string;
  label: string; // clave i18n, o texto ya localizado (ver `scrollable`/Input `label` docs)
  icon?: string;
}

@Component({
  selector: 'ma-option-pill-group',
  standalone: true,
  imports: [TranslateModule, MatIconModule],
  templateUrl: './option-pill-group.component.html',
  styleUrl: './option-pill-group.component.scss',
})
export class OptionPillGroupComponent implements OnChanges {
  @Input() options: PillOption[] = [];
  @Input() value = '';
  // Modo "tabs con scroll": pills de ancho natural (no flex:1) dentro de un
  // contenedor con overflow-x:auto, en lugar de repartirse el 100% del ancho
  // en partes iguales. Por defecto false para no alterar el layout existente
  // (Settings: theme/frequency/weekStart, siempre 2-4 opciones que deben
  // llenar el ancho completo).
  @Input() scrollable = false;
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
