import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuSidePage } from './menu-side';

@NgModule({
  declarations: [
    MenuSidePage,
  ],
  imports: [
    IonicPageModule.forChild(MenuSidePage),
  ],
})
export class MenuSidePageModule {}
