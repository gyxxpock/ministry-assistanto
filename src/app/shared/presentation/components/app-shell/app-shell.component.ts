import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  template: `
    <div class="app-shell-wrapper" (scroll)="onScroll($event)" [class.nav-is-hidden]="!navVisible()">
      <!-- Content container -->
      <main class="content-container">
        <div class="router-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Floating Bottom Navigation -->
      <nav class="floating-nav" [class.nav-hidden]="!navVisible()">
        <mat-toolbar class="bottom-toolbar">
          <button mat-button routerLink="/time-entry/list" routerLinkActive="active-link">
            <mat-icon>format_list_bulleted</mat-icon>
            <span class="label">{{ 'timeEntry.pages.list.title' | translate }}</span>
          </button>

          <button mat-button routerLink="/time-entry/calendar" routerLinkActive="active-link">
            <mat-icon>date_range</mat-icon>
            <span class="label">{{ 'timeEntry.pages.calendar.title' | translate }}</span>
          </button>

          <button mat-button routerLink="/goals" routerLinkActive="active-link">
            <mat-icon>flag</mat-icon>
            <span class="label">{{ 'goals.pages.list.title' | translate }}</span>
          </button>

          <button mat-button routerLink="/time-entry/settings" routerLinkActive="active-link">
            <mat-icon>settings</mat-icon>
            <span class="label">{{ 'timeEntry.pages.settings.title' | translate }}</span>
          </button>
        </mat-toolbar>
      </nav>
    </div>
  `,
  styles: [`
    .app-shell-wrapper {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow-y: auto;
      transition: padding-bottom 0.3s ease;

      &.nav-is-hidden {
        padding-bottom: 0;
      }

      &:not(.nav-is-hidden) {
        padding-bottom: 64px;
      }
    }

    .content-container {
      flex: 1;
      overflow-y: auto;
    }

    .router-wrapper {
      min-height: 100%;
    }

    .floating-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      transition: transform 0.3s ease;

      &.nav-hidden {
        transform: translateY(100%);
      }
    }

    .bottom-toolbar {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0;
    }

    button {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 64px;
      transition: opacity 0.2s ease;

      &:not(.active-link) {
        opacity: 0.7;
      }

      &.active-link {
        opacity: 1;
      }
    }

    .label {
      font-size: 0.75rem;
      margin-top: 4px;
      text-align: center;
    }

    mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  `],
})
export class AppShellComponent {
  navVisible = signal(true);
  private lastScrollTop = 0;

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const currentScroll = element.scrollTop;

    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      this.navVisible.set(false);
    } else {
      this.navVisible.set(true);
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}
