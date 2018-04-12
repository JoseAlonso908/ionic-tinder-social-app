import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { DungeonListingPage } from '../dungeon-listing/dungeon-listing';
import { GroupsPage } from '../groups/groups';
import { concat } from 'rxjs/observable/concat';
import { FirstproviderProvider } from '../../providers/firstprovider/firstprovider';
import { NotificationProvider } from '../../providers/notification/notification';

/**
 * Generated class for the WriteAReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-write-a-review',
  templateUrl: 'write-a-review.html',

})
export class WriteAReviewPage {
  notifi_length = 0


  dungeondata: any;
  clientData: any;
  like:any;
  dislike:any;
  headline:any;

  review = {
    "mark": { "avg": 0, "clean": 0, "comfor": 0, "loc": 0, "fac": 0 },
    "reviewer": { "name": "", "loc": "", "photo": "" },
    "date": "",
    "des": { "head": "", "like": "", "dislike": "" }
  };


  constructor(public pushstate: NotificationProvider,
    public server: FirstproviderProvider, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.dungeondata = this.navParams.data.param;
    this.clientData = JSON.parse(localStorage.getItem('clientData'));
  }
  public mark1 = 0;
  public mark2 = 0;
  public mark3 = 0;
  public mark4 = 0;
  ionViewDidLoad() {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////

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
  noteChanged(event) {
    console.log(event);
    this.mark1 = event._value / 10.0;


  }
  noteChanged1(event) {
    console.log(event);
    this.mark2 = event._value / 10.0;


  }
  noteChanged2(event) {
    console.log(event);
    this.mark3 = event._value / 10.0;


  }
  noteChanged3(event) {
    console.log(event);
    this.mark4 = event._value / 10.0;


  }

  reviews = { "count": "", "body": [] };



  goYourDR() {

    this.review.mark.avg = Math.floor(10 * (this.mark1 + this.mark2 + this.mark3 + this.mark4) / 5) / 10;
    this.review.mark.clean = this.mark1;
    this.review.mark.comfor = this.mark2;
    this.review.mark.loc = this.mark3;
    this.review.mark.fac = this.mark4;
    this.review.reviewer.name = this.clientData.name;
    this.review.reviewer.loc = this.clientData.location;
    this.review.reviewer.photo = this.clientData.photoUrl;
    this.review.date = new Date().toDateString();
    this.review.des.head = this.headline;
    this.review.des.like = this.like;
    this.review.des.dislike = this.dislike;

    this.dungeondata.body.reveiws.count++;;
    this.dungeondata.body.reveiws.body.push(this.review);

    this.saveData();





  }
  saveData() {
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();

    let credention = { "status": "dungeonlist", "email": this.dungeondata.ownner.email, "body": JSON.stringify(this.dungeondata) }

    this.server.postAdminData(credention).then((result) => {
      loading.dismiss();
      if (Object(result).status == "success") {
        let toast = this.toastCtrl.create({
          message: "Successe added your review",
          duration: 4000
        })
        toast.present();
        this.navCtrl.push(DungeonListingPage, { "lists": [this.dungeondata], "dungeondata": 0 });

      } else {
        let toast = this.toastCtrl.create({
          message: "No Network",
          duration: 2000
        })
        toast.present();


      }

    }, (err) => {
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: "No Network",
        duration: 2000
      })
      toast.present();


    });



  }
  goGroups() {
    this.navCtrl.push(GroupsPage);
  }
  goback(){
    this.navCtrl.pop();
  }



}
