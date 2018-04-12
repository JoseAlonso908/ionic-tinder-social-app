import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CroppingPage } from './cropping';

@NgModule({
  declarations: [
    CroppingPage,
  ],
  imports: [
    IonicPageModule.forChild(CroppingPage),
  ],
})
export class CroppingPageModule {}
