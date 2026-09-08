import { computed, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

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
  private _triggered = false;

  readonly isUpdateAvailable = computed(() => this._available() && !this._dismissed());
  readonly changes = this._changes.asReadonly();

  constructor() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.pipe(
      filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'),
      takeUntilDestroyed(),
    ).subscribe(() => this._triggerUpdate());

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) this._triggerUpdate();
      });
    }
  }

  applyUpdate(): void {
    this.swUpdate.activateUpdate().then(() => window.location.reload());
  }

  dismiss(): void {
    this._dismissed.set(true);
    this._triggered = false;
  }

  private _triggerUpdate(): void {
    if (this._triggered) return;
    this._triggered = true;
    this._dismissed.set(false);
    this.fetchChangelog();
  }

  private fetchChangelog(): void {
    this.http
      .get<ChangelogEntry[]>(`assets/changelog.json?v=${Date.now()}`)
      .subscribe({
        next: (entries) => {
          if (entries?.[0]) this._changes.set(entries[0].changes);
          this._available.set(true);
        },
        error: () => {
          this._available.set(true);
        },
      });
  }
}
