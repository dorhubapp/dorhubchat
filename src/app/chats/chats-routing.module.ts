import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatsPage } from './chats.page';

const routes: Routes = [
  {
    path: '',
    component: ChatsPage,
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatsPageRoutingModule {}
