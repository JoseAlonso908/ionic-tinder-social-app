import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatGroupPage } from './chat-group';

@NgModule({
  declarations: [
    ChatGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatGroupPage),
  ],
})
export class ChatGroupPageModule {}
