import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashGroupChatPage } from './splash-group-chat';

@NgModule({
  declarations: [
    SplashGroupChatPage,
  ],
  imports: [
    IonicPageModule.forChild(SplashGroupChatPage),
  ],
})
export class SplashGroupChatPageModule {}
