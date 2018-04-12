import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignEmailPage } from './sign-email';

@NgModule({
  declarations: [
    SignEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(SignEmailPage),
  ],
})
export class SignEmailPageModule {}
