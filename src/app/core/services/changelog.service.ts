import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { ChangeEntry } from './update-notification.service';

export interface ChangelogEntry {
  version: string;
  changes: ChangeEntry[];
}

@Injectable({ providedIn: 'root' })
export class ChangelogService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly _entries = signal<ChangelogEntry[]>([]);
  readonly entries = this._entries.asReadonly();

  constructor() {
    this.http
      .get<ChangelogEntry[]>('/assets/changelog.json')
      .pipe(take(1))
      .subscribe({
        next: (data) => this._entries.set(data ?? []),
        error: () => {},
      });
  }
}
