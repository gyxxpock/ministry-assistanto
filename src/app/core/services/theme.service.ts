import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'ma-theme';
const MODE_CYCLE: Record<ThemeMode, ThemeMode> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _mql = window.matchMedia('(prefers-color-scheme: dark)');

  private readonly _mode = signal<ThemeMode>(
    (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system'
  );

  private readonly _systemDark = signal<boolean>(this._mql.matches);

  readonly mode = this._mode.asReadonly();

  readonly resolvedTheme = computed<ResolvedTheme>(() => {
    const m = this._mode();
    return m === 'system' ? (this._systemDark() ? 'dark' : 'light') : m;
  });

  private readonly _onSystemChange = (e: MediaQueryListEvent) => this._systemDark.set(e.matches);

  constructor() {
    this._mql.addEventListener('change', this._onSystemChange);
    inject(DestroyRef).onDestroy(() => this._mql.removeEventListener('change', this._onSystemChange));
    effect(() => this._apply(this.resolvedTheme()));
  }

  toggle(): void {
    const next = MODE_CYCLE[this._mode()];
    this._mode.set(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }

  private _apply(theme: ResolvedTheme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
