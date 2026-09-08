import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeEntry } from '../../../../core/services/update-notification.service';

@Component({
  selector: 'ma-update-banner',
  standalone: false,
  templateUrl: './update-banner.component.html',
  styleUrl: './update-banner.component.scss',
})
export class UpdateBannerComponent {
  @Input() changes: ChangeEntry[] = [];
  @Output() applyUpdate = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  get features(): ChangeEntry[] { return this.changes.filter(c => c.type === 'feature'); }
  get fixes(): ChangeEntry[] { return this.changes.filter(c => c.type === 'fix'); }
  get hasUX(): boolean { return this.changes.some(c => c.type === 'ux'); }
}
