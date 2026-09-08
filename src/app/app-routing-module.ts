import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppShellComponent } from './shared/presentation/components/app-shell/app-shell.component';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'time-entry/list'
      },
      {
        path: 'time-entry',
        loadChildren: () =>
          import('./time-entry/presentation/time-entry.module').then(m => m.TimeEntryModule)
      },
      {
        path: 'goals',
        loadChildren: () =>
          import('./goals/presentation/goals.module').then(m => m.GoalsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), AppShellComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
