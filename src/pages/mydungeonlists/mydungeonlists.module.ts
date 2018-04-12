import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MydungeonlistsPage } from './mydungeonlists';

@NgModule({
  declarations: [
    MydungeonlistsPage,
  ],
  imports: [
    IonicPageModule.forChild(MydungeonlistsPage),
  ],
})
export class MydungeonlistsPageModule {}
