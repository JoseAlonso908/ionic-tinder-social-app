import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DungeonListingPage } from './dungeon-listing';

@NgModule({
  declarations: [
    DungeonListingPage,
  ],
  imports: [
    IonicPageModule.forChild(DungeonListingPage),
  ],
})
export class DungeonListingPageModule { }
