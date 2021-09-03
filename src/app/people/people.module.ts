import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeoplePage } from './people.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { PeoplePageRoutingModule } from './people-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    PeoplePageRoutingModule
  ],
  declarations: [PeoplePage]
})
export class PeoplePageModule {}
