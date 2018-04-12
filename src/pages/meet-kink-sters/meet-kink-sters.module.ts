import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeetKinkStersPage } from './meet-kink-sters';
import { SwingModule } from 'angular2-swing';
@NgModule({
  declarations: [
    MeetKinkStersPage,
  ],
  imports: [
    IonicPageModule.forChild(MeetKinkStersPage),
     SwingModule
  ],
})
export class MeetKinkStersPageModule {}
