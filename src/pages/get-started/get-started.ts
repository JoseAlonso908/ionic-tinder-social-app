import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignEmailPage } from '../sign-email/sign-email';
import { SignUpEPage } from '../sign-up-e/sign-up-e';
/**
 * Generated class for the GetStartedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-get-started',
  templateUrl: 'get-started.html',
})
export class GetStartedPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetStartedPage');
  }
  SignInE(){
    this.navCtrl.push(SignEmailPage);

  }
  // SignInF(){
  //   this.navCtrl.push(MyProfilePage);
  // }
  SignUpE(){
    this.navCtrl.push(SignUpEPage);
  }

}
