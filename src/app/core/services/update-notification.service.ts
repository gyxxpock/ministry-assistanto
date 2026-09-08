import { computed, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { filter, take } from 'rxjs/operators';

export interface ChangeEntry {
  type: 'feature' | 'fix' | 'ux';
  text: string;
}

interface ChangelogEntry {
  version: string;
  changes: ChangeEntry[];
}

@Injectable({ providedIn: 'root' })
export class UpdateNotificationService {
  // Explicit type annotations required — signals-agent TS2571 rule
  private readonly swUpdate: SwUpdate = inject(SwUpdate);
  private readonly http: HttpClient = inject(HttpClient);

  private readonly _available = signal(false);
  private readonly _changes = signal<ChangeEntry[]>([]);
  private readonly _dismissed = signal(false);

  readonly isUpdateAvailable = computed(() => this._available() && !this._dismissed());
  readonly changes = this._changes.asReadonly();

  constructor() {
    if (!this.swUpdate.isEnabled) return;

    // versionUpdates is an async event stream — correct RxJS use per signals-agent table.
    // Result is written to a Signal, following the loadMonth pattern.
    this.swUpdate.versionUpdates.pipe(
      filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'),
      take(1),
      takeUntilDestroyed(),
    ).subscribe(() => {
      this._available.set(true);
      this.fetchChangelog();
    });
  }

  applyUpdate(): void {
    this.swUpdate.activateUpdate().then(() => window.location.reload());
  }

  dismiss(): void {
    this._dismissed.set(true);
  }

  private fetchChangelog(): void {
    this.http
      .get<ChangelogEntry[]>(`/assets/changelog.json?v=${Date.now()}`)
      .pipe(take(1))
      .subscribe(entries => {
        if (entries?.[0]) this._changes.set(entries[0].changes);
      });
  }
}
