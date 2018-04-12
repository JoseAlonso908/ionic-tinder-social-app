import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DungeonFinderPage } from './dungeon-finder';

@NgModule({
  declarations: [
    DungeonFinderPage,
  ],
  imports: [
    IonicPageModule.forChild(DungeonFinderPage),
  ],
})
export class DungeonFinderPageModule {}
