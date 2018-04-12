import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


/**
 * Generated class for the EditbiomodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editbiomodal',
  templateUrl: 'editbiomodal.html',
})
export class EditbiomodalPage {
  aboutme: string;
  editable: boolean;

  constructor(public viewCtl:ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.aboutme = this.navParams.data.aboutme;
  }
  returnParent(){
    this.viewCtl.dismiss({"data" : this.aboutme});
  }
  goBack(){
    this.viewCtl.dismiss({"data" : this.navParams.data.aboutme});
  }
  

}


