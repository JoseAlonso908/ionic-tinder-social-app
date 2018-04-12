import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { Chat } from '../chat/chat';
import { WriteAReviewPage } from '../write-a-review/write-a-review';
import { GroupsPage } from '../groups/groups';
import { BuddychatPage } from '../buddychat/buddychat';
import { ChatProvider } from '../../providers/chat/chat'
import { FireauthProvider } from '../../providers/fireauth/fireauth';
import { RequestsProvider } from '../../providers/requests/requests';
import { PicturemodalPage } from '../picturemodal/picturemodal';
import { elementAt } from 'rxjs/operator/elementAt';
import { GESTURE_GO_BACK_SWIPE } from 'ionic-angular/gestures/gesture-controller';
import { NotificationProvider } from '../../providers/notification/notification';

/**
 * Generated class for the DungeonListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dungeon-listing',
  templateUrl: 'dungeon-listing.html',
})
export class DungeonListingPage {

  dungeondata: any;
  buddy: any;
  slides = [];

  reviews: any;

  avg: any;
  mark1: any;
  mark2: any;
  mark3: any;
  mark4: any;

  avgt: any;
  mark1t: any;
  mark2t: any;
  mark3t: any;
  mark4t: any;

  public revewied: boolean;

  clientData: any;
  yourPhoto: string;
  yourLoc: string;

  revewempty = false;
  ownner = false;
  notifi_length = 0
  constructor(public pushstate: NotificationProvider,
    public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider, public userservice: FireauthProvider, public dungeonfriendserver: RequestsProvider) {


    this.dungeondata = this.navParams.data.lists[this.navParams.data.dungeondata];

  }

  ionViewDidLoad() {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////
    this.revewied = false;
    this.clientData = JSON.parse(localStorage.getItem('clientData'));
    console.log(this.clientData);
    this.yourLoc = this.clientData.location;
    this.yourPhoto = this.clientData.photoUrl;
    this.userservice.getuserbyuid(this.dungeondata.ownner.uid).then((user) => {
      this.buddy = user;
    }).catch((err) => {

    })

    for (let i = 0; i < 5; i++) {
      if (this.dungeondata.body.dungeonPhoto[i] != "" && this.dungeondata.body.dungeonPhoto[i] != null)
        this.slides.push(this.dungeondata.body.dungeonPhoto[i]);
    }
    if (this.dungeondata.ownner.email == this.clientData.email) {
      this.revewied = true;
      this.ownner = true;
    }

    this.reviews = this.dungeondata.body.reveiws;
    let temp1 = 0, temp2 = 0, temp3 = 0, temp4 = 0, temp5 = 0, bodylength = this.reviews.body.length;

    for (let j = 0; j < bodylength; j++) {
      temp1 += this.reviews.body[j].mark.avg;
      temp2 += this.reviews.body[j].mark.clean;
      temp3 += this.reviews.body[j].mark.comfor;
      temp4 += this.reviews.body[j].mark.loc;
      temp5 += this.reviews.body[j].mark.fac;
      if (this.reviews.body[j].reviewer.name == this.clientData.name && this.reviews.body[j].reviewer.loc == this.yourLoc)
        this.revewied = true;

    }

    if (bodylength != 0) {
      this.avgt = Math.floor(10 * temp1 / bodylength);
      this.mark1t = Math.floor(10 * temp2 / bodylength);
      this.mark2t = Math.floor(10 * temp3 / bodylength);
      this.mark3t = Math.floor(10 * temp4 / bodylength);
      this.mark4t = Math.floor(10 * temp5 / bodylength);

      this.avg = Math.floor(10 * temp1 / bodylength) / 10;
      this.mark1 = Math.floor(10 * temp2 / bodylength) / 10;
      this.mark2 = Math.floor(10 * temp3 / bodylength) / 10;
      this.mark3 = Math.floor(10 * temp4 / bodylength) / 10;
      this.mark4 = Math.floor(10 * temp5 / bodylength) / 10;
    } else
      this.revewempty = true;

  }
  zoomIn(index: any) {

    let modal = this.modalCtrl.create(PicturemodalPage, { "img": this.slides[index] });
    modal.present();
  }
  goMeetKinkSters() {
    this.navCtrl.push(MeetKinkStersPage);
  }
  goMessages() {
    this.navCtrl.push(MessagesPage);
  }
  goDungeonFinderWalkthorugh() {
    this.navCtrl.push(DungeonFinderWalkthorughPage);
  }
  goMenuSide() {
    this.navCtrl.push(MenuSidePage);
  }

  goChat() {
    this.dungeonfriendserver.makedungeonfriend(this.buddy).then((res) => {
      if (res) {
        this.chatservice.buddyinit(this.buddy);
        this.navCtrl.push(BuddychatPage);
      } else {

      }
    }).catch((err) => {

    })

    // this.navCtrl.push(Chat, { navParams: this.toUser });
  }

  goWriteAR() {
    this.navCtrl.push(WriteAReviewPage, { param: this.dungeondata });
  }
  goGroups() {
    this.navCtrl.push(GroupsPage);
  }



}
