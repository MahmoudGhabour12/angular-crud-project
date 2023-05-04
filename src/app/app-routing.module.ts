import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsListComponent } from './views/units-list/units-list.component';

const routes: Routes = [
  {
    path: '',
    component: UnitsListComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
