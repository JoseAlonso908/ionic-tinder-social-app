import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PicturemodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-picturemodal',
  templateUrl: 'picturemodal.html',
})
export class PicturemodalPage {

  img_url:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PicturemodalPage');
    this.img_url = this.navParams.data.img;
  }
  goBack(){
    this.navCtrl.pop();
  }

}
