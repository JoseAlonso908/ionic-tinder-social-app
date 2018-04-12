import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUserToGroupPage } from './add-user-to-group';

@NgModule({
  declarations: [
    AddUserToGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(AddUserToGroupPage),
  ],
})
export class AddUserToGroupPageModule {}
