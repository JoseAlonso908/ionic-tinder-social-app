import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { Chat } from '../chat/chat';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { GroupsPage } from '../groups/groups';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';
import { BuddychatPage } from '../buddychat/buddychat';
import { Alert } from 'ionic-angular/components/alert/alert';
import { NotificationProvider } from '../../providers/notification/notification';
import firebase from 'firebase';
/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  messageNotification = [];
  notifi_length = 0;

  // toUser: Object;
  myfriends = [];
  myfriendsmessages = [];
  firstFriendstates = [false];
  notificationstates = [];
  onlinestate;
  note;

  emptyfriend: boolean;



  constructor(public pushstate: NotificationProvider, public navCtrl: NavController, public navParams: NavParams, public events: Events, private requestservice: RequestsProvider, public chatservice: ChatProvider) {
    this.emptyfriend = false;
    this.requestservice.getmyfriends();


  }

  ionViewDidLoad() {
    // /////////////////notification state

    this.pushstate.getpushstate();
    this.notifi_length = 0;
    this.messageNotification = this.pushstate.notification;
    for (let i = 0; i < this.messageNotification.length; i++) {
      this.notifi_length += this.messageNotification[i].cnt;

    }
    // /////////////


    




  }

  ionViewWillEnter() {
    let temp = [];
    let tempfriends = [];
    // this.events.subscribe('friends', () => {

    this.myfriends = [];
    tempfriends = [];
    temp = this.requestservice.myfriends

    for (let i = 0; i < temp.length; i++) {

      this.chatservice.buddy = temp[i];
      this.chatservice.getbuddymessages();
      this.myfriendsmessages[i] = this.chatservice.buddymessages;
      if (this.myfriendsmessages[i].length == 0)
        this.firstFriendstates[i] = true;
      else if ((this.myfriendsmessages[i].length == 1) && (firebase.auth().currentUser.uid != this.myfriendsmessages[i][this.myfriendsmessages[i].length - 1].sendby))
        this.firstFriendstates[i] = true;
      else
        this.firstFriendstates[i] = false;

      if (this.messageNotification.length == 0)
        this.notificationstates[i] = 0;
      else
        for (let j = 0; j < this.messageNotification.length; j++)
          if (this.messageNotification[j].key === temp[i].uid)
            this.notificationstates[i] = this.messageNotification[j].cnt;
          else
            this.notificationstates[i] = 0;



      if (this.firstFriendstates[i])
        tempfriends.push([temp[i], true, (this.myfriendsmessages[i].length == 0) ? { message: '', timestamp: '' } : this.myfriendsmessages[i][this.myfriendsmessages[i].length - 1], this.notificationstates[i]])

    }

    for (let i = 0; i < temp.length; i++) {
      if (!this.firstFriendstates[i])
        tempfriends.push([temp[i], false, (this.myfriendsmessages[i].length == 0) ? { message: '', timestamp: '' } : this.myfriendsmessages[i][this.myfriendsmessages[i].length - 1], this.notificationstates[i]])
    }
    for (let i = 0; i < temp.length; i++) {
      setTimeout(() => {
        this.myfriends.push(tempfriends[i]);

      }, i * 200);
    }
    // })



    let state = ['online', 'offline'];
    // this.events.unsubscribe('friends');
    this.note = 'Hello brother..';
    this.onlinestate = state[Math.floor(Math.random() * state.length)];
    setTimeout(() => {
      if (this.myfriends.length == 0)
        this.emptyfriend = true;

    }, 3000);
  }
  deletefriend(item, i) {
    this.myfriends.splice(i, 1);
    this.deleteNotification(item);

    this.requestservice.deletefriend(item).then((res) => {
    }).catch((err) => {
      this.requestservice.getmyfriends();
      // /////////////////notification state

      this.pushstate.getpushstate();
      this.notifi_length = 0;
      this.messageNotification = this.pushstate.notification;
      for (let i = 0; i < this.messageNotification.length; i++) {
        this.notifi_length += this.messageNotification[i].cnt;

      }
      // /////////////

    });

  }
  deleteNotification(item) {
    for (let i = 0; i < this.messageNotification.length; i++)
      if (this.messageNotification[i].key == item.uid) {
        this.notifi_length -= this.messageNotification[i].cnt
        this.messageNotification.splice(i, 1);
      }

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
    this.myfriends = [];
    const animationsOptions = {
      animation: 'md-transition',
      duration: 800
    }

    this.navCtrl.push(MenuSidePage, {}, animationsOptions);
  }
  goChat(buddy) {
    this.chatservice.buddyinit(buddy);
    const animationsOptions = {
      animation: 'wp-transition',
      duration: 800
    }

    this.navCtrl.push(BuddychatPage, {}, animationsOptions);

  }
  goGroups() {
    this.navCtrl.push(GroupsPage);
  }
}
