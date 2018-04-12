import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Events, NavParams } from 'ionic-angular';

import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { ItsAMatchPage } from '../its-a-match/its-a-match';
import { GroupsPage } from '../groups/groups';

import { FireauthProvider } from '../../providers/fireauth/fireauth';
import { RequestsProvider } from '../../providers/requests/requests';

import firebase from 'firebase';
import { connreq } from '../../models/interface/request';
import { NotificationProvider } from '../../providers/notification/notification';

// import $ from 'jquery';


/**
 * Generated class for the MeetKinkStersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { Http } from '@angular/http';
import 'rxjs/Rx';

import {
  StackConfig,
  DragEvent,
  SwingStackComponent
} from 'angular2-swing';
import { elementAt } from 'rxjs/operator/elementAt';
// import { RecurseVisitor } from '@angular/compiler/src/i18n/i18n_ast';


@IonicPage()
@Component({
  selector: 'page-meet-kink-sters',
  templateUrl: 'meet-kink-sters.html'
})
export class MeetKinkStersPage {

  croppedstate = false;

  notifi_length = 0
  like: boolean;
  dislike: boolean;
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  profile: any;
  userprofile: boolean;
  profileindex = 0;
  notification: boolean;

  newreques = {} as connreq;
  cards = [];
  stackConfig: StackConfig;
  recentCard: string = '';
  cardX: any;
  selectFlag: boolean;

  brightLevel: boolean;

  tempelement: any;
  listelementFlag: boolean;
  tempx: any;

  cardimage: boolean;

  itismatch = false;
  constructor(public pushstate: NotificationProvider,
    public events: Events, public navCtrl: NavController, public navParams: NavParams, public http: Http, public fireservice: FireauthProvider, public requestservice: RequestsProvider) {
    this.cardimage = true;
    ////////////////////////filter users
    this.initcards();
    ////////////////////////
    this.like = false;
    this.dislike = false;
    this.selectFlag = false;
    this.brightLevel = false;
    this.listelementFlag = false;

    this.tempx = 0;

    this.stackConfig = {
      throwOutConfidence: (offset, element: any) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth / 2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
        this.cardX = x;
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };
  }


  // ionViewWillEnter() {
  //   this.requestservice.getmyrequests();
  //   this.events.subscribe('gotrequests', () => {
  //     this.myrequests = this.requestservice.myrequests;
  //   })


  // }
  ionViewDidLoad() {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////
    // this.events.unsubscribe('gotrequests');

  }


  ngAfterViewInit() {
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#ffffff';
    });
    this.cards = [{ email: '' }];
    this.cards.pop();
    // this.addNewCards(2);
  }

  initcards() {
    let that = this;


    this.fireservice.getallusers().then((res: any) => {
      that.cards = res;
    })


    this.cardimage = true;

  }


  mouseup() {
    this.brightLevel = false;
    this.like = false;
    this.dislike = false;
    if (this.cardX > 45)
      this.voteUp(false);
    else if (this.cardX < -57)
      this.voteUp(true);
  }

  brightset() {
    //  $("#list").removeClass('list-ios');
    //  $("#list").removeClass('list');
    this.brightLevel = true;

  }

  brightset1(event) {
    this.brightLevel = true;
    if (this.tempx > event.x) {
      console.log("left");
      this.like = true;
      this.dislike = false;
      this.tempx = event.x;
    }
    else if (this.tempx < event.x) {
      this.dislike = true;
      this.like = false;
      console.log("right");
      this.tempx = event.x;
    }
    // event.target.classList.remove('list-ios');
    //  $("#list").removeClass('list-ios');
    //  $("#list").removeClass('list');

    // this.brightLevel = true;

  }
  // Called whenever we drag an element
  onItemMove(element, x, y, r) {
    if (this.listelementFlag) {
      this.listelementFlag = false;
      element = this.tempelement;
    }
    let color = '';
    const abs = Math.abs(x);
    const min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    const hexCode = this.decimalToHex(min, 2);

    if (x > 0) {
      color = '#' + hexCode + 'FF' + hexCode;
      if (x > 45) this.dislike = true;
      else
        this.dislike = false;
    } else {
      if (x < -57) this.like = true;
      else
        this.like = false;
      color = '#FF' + hexCode + hexCode;
    }

    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${-x / 4}deg)`;
    element.style['background-color'] = `rgba(2, 2, 2, 0)`;
  }



  voteUp(like: boolean) {

    let reciptientcard = this.cards.pop();
    let that = this;
    if (like) {
      that.requestservice.checkmatch(reciptientcard);
      this.events.subscribe('match', () => {
        this.itismatch = this.requestservice.match;
      })
      setTimeout(() => {

        if (this.itismatch) {
          this.requestservice.match = false;
          this.itismatch = false;

          that.navCtrl.push(ItsAMatchPage, { navParams: reciptientcard });
        }
      }, 3000);

      // .then((res) => {
      //   if (res) {
      //     that.itismatch = true;
      //     that.navCtrl.push(ItsAMatchPage, { navParams: reciptientcard });
      //   }


      // }).catch((err) => {



      // })

    } else {
      that.requestservice.deleterequest(reciptientcard).then((res: any) => {
        if (res) {

        } else {

        }
      }).catch((err) => {

      })
    }

    if (this.cards.length == 1 || this.cards.length == 0)
      this.cardimage = false;
    else
      this.cardimage = true;
    if (this.cards.length == 0) {
      // this.cardnumber = 4;      
      // this.addNewCards(4);
      this.initcards();

    }
  }

  decimalToHex(d, padding) {
    let hex = Number(d).toString(16);
    padding = typeof (padding) === 'undefined' || padding === null ? padding = 2 : padding;
    while (hex.length < padding) {
      hex = '0' + hex;
    }

    return hex;
  }

  deleteItemLike(list, index) {
    let that = this
    let reciptient = list.splice(this.cards.length - index - 1, 1);

    that.requestservice.checkmatch(reciptient[0])

    this.events.subscribe('match', () => {
      this.itismatch = this.requestservice.match;
    })
    setTimeout(() => {

      if (this.itismatch) {
        this.requestservice.match = false;
        this.itismatch = false;

        that.navCtrl.push(ItsAMatchPage, { navParams: reciptient[0] });
      }
    }, 3000);

    // that.requestservice.checkmatch(reciptient[0]).then((res) => {
    //   alert(res);
    //   if (res) {
    //     that.itismatch = true;

    //     that.navCtrl.push(ItsAMatchPage, { navParams: reciptient[0] });

    //   }

    // }).catch((err) => {


    // })
    console.log(this.itismatch);

    if (this.cards.length == 1 || this.cards.length == 0)
      this.cardimage = false;
    else
      this.cardimage = true;



    if (this.cards.length == 0) {

      this.initcards();
    }
  }
  deleteItemDislike(list, index) {

    let reciptient = list.splice(this.cards.length - index - 1, 1);
    this.requestservice.deleterequest(reciptient[0]).then((res: any) => {
      if (res) {

      } else {

      }
    }).catch((err) => {

    })

    if (this.cards.length == 1 || this.cards.length == 0)
      this.cardimage = false;
    else
      this.cardimage = true;

    if (this.cards.length == 0) {
      // this.cardnumber = 4;
      // this.addNewCards(4);
      this.initcards();
    }
  }
  profileDislike() {
    if (this.selectFlag)
      this.deleteItemDislike(this.cards, this.profileindex);
    else
      this.voteUp(false);
    this.userprofile = false;
  }
  profileLike() {
    if (this.selectFlag)
      this.deleteItemLike(this.cards, this.profileindex);
    else
      this.voteUp(true);
    this.userprofile = false;
  }

  showLikeDis(event) {
    console.log(event);
  }

  swipeSomething(element) {
    console.log(event);
    this.tempelement = element;
    this.listelementFlag = true;
  }
  onclickSelecttinder() {
    this.selectFlag = !this.selectFlag;
  }
  goProfile(selecteditem: any, index) {
    console.log(selecteditem);
    this.profile = selecteditem;
    this.profileindex = index;
    this.userprofile = true;
    if ((this.profile.profile.workUrl != null) && (this.profile.profile.workUrl != ''))
      this.croppedstate = true
    else
      this.croppedstate = false;
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

  goGroups() {
    this.navCtrl.push(GroupsPage);
  }

}
