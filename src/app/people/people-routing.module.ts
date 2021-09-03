import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeoplePage } from './people.page';

const routes: Routes = [
  {
    path: '',
    component: PeoplePage,
  },
  {
    path: 'person',
    loadChildren: () => import('./person/person.module').then( m => m.PersonPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeoplePageRoutingModule {}
