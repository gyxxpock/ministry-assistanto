import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ma-theme';
const MODE_CYCLE: Record<ThemeMode, ThemeMode> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _mode = signal<ThemeMode>(
    (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system'
  );

  readonly mode = this._mode.asReadonly();

  constructor() {
    effect(() => this._apply(this._mode()));
  }

  toggle(): void {
    const next = MODE_CYCLE[this._mode()];
    this._mode.set(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  private _apply(mode: ThemeMode): void {
    const html = document.documentElement;
    if (mode === 'system') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', mode);
    }
  }
}
