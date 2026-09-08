import { Component, Input } from '@angular/core';
import { ChangelogEntry } from '../../../../core/services/changelog.service';

@Component({
  selector: 'ma-version-history',
  standalone: false,
  templateUrl: './version-history.component.html',
  styleUrl: './version-history.component.scss',
})
export class VersionHistoryComponent {
  @Input() entries: ChangelogEntry[] = [];

  // Append T12:00:00 to avoid UTC off-by-one in negative-offset timezones
  formatVersion(isoDate: string, locale: string = 'es'): string {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' })
      .format(new Date(`${isoDate}T12:00:00`));
  }
}
