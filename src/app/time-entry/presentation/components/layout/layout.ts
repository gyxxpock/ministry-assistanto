import { Component, inject, signal } from '@angular/core';
import { ThemeService, ThemeMode } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  readonly themeService = inject(ThemeService);

  navVisible = signal(true);
  headerOpacity = signal(1);
  private lastScrollTop = 0;

  get themeIcon(): string {
    const icons: Record<ThemeMode, string> = {
      light: 'light_mode',
      dark: 'dark_mode',
      system: 'brightness_auto',
    };
    return icons[this.themeService.mode()];
  }

  // Método que captura el evento de scroll definido en el HTML
  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const currentScroll = element.scrollTop;

    // El título se desvanece gradualmente en los primeros 100px de scroll
    const newOpacity = 1 - (currentScroll / 100);
    this.headerOpacity.set(newOpacity < 0 ? 0 : newOpacity);

    // Lógica: Si baja más de 50px y hace scroll hacia abajo, oculta.
    // Si hace scroll hacia arriba, muestra.
    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      this.navVisible.set(false);
    } else {
      this.navVisible.set(true);
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}
