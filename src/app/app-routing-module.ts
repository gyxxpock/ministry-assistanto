import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'time-entry/list'
  },
  {
    path: 'time-entry',
    loadChildren: () =>
      import('./time-entry/presentation/time-entry.module').then(m => m.TimeEntryModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
