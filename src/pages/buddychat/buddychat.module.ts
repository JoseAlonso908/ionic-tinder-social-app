import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuddychatPage } from './buddychat';
import {EmojiPickerComponentModule} from "../../components/emoji-picker/emoji-picker.module";
import {EmojiProvider} from "../../providers/emoji";

@NgModule({
  declarations: [
    BuddychatPage,
    
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(BuddychatPage),
    
    
  ],
  providers:[
    EmojiProvider,
  ]
 
})
export class BuddychatPageModule {}
