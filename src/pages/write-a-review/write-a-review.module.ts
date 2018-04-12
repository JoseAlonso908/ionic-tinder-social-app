import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WriteAReviewPage } from './write-a-review';

@NgModule({
  declarations: [
    WriteAReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(WriteAReviewPage),
  ],
})
export class WriteAReviewPageModule {}
