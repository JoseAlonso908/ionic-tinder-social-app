import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItsAMatchPage } from './its-a-match';

@NgModule({
  declarations: [
    ItsAMatchPage,
  ],
  imports: [
    IonicPageModule.forChild(ItsAMatchPage),
  ],
})
export class ItsAMatchPageModule {}
