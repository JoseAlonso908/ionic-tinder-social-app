import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController  } from 'ionic-angular';
import { GetStartedPage } from '../get-started/get-started';
import { Storage } from '@ionic/storage';
import { SignEmailPage } from '../sign-email/sign-email';
/**
 * Generated class for the SplashGroupChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash-group-chat',
  templateUrl: 'splash-group-chat.html',
})
export class SplashGroupChatPage {

  constructor(public storage:Storage, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController) {


   
  }

  ionViewDidLoad() {
    this.storage.get('enable').then((val) => {
      if (val) {
        // this.storage.get('email').then((val) => {
        //   this.emailinput = val;
        // });
        // this.storage.get('password').then((val) => {
        //   this.password = val;

        // });
        // this.check_remember = val;
        this.navCtrl.setRoot(SignEmailPage);
      }
    });
    console.log('ionViewDidLoad SplashGroupChatPage');
    this.menu.enable(false);
  }
  slides = [
    {
      // title: "Welcome to the Docs!",
      // description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "assets/img/splash/splashgroupchat.png",
      
    },
    {
      // title: "What is Ionic?",
      // description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      // image: "assets/img/ica-slidebox-img-2.png",
       image: "assets/img/splash/splashdungeonmap.png",
    },
    {
      // title: "What is Ionic Cloud?",
      // description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      // image: "assets/img/ica-slidebox-img-3.png",
       image: "assets/img/splash/splashtinder.png",
    }
    // {
    //   // title: "What is Ionic?",
    //   // description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
    //   // image: "assets/img/ica-slidebox-img-2.png",
    //    image: "assets/img/splash/splashover18.png",
    // }
  ];
  AcceptDo() {
     this.navCtrl.push(GetStartedPage);
  }

}




