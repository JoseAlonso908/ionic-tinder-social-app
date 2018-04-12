import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { GroupsPage } from '../groups/groups';
import { Events } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';
import { BuddychatPage } from '../buddychat/buddychat';
import { flatten } from '@angular/compiler';
import { NotificationProvider } from '../../providers/notification/notification';

/**
 * Generated class for the DungeonmessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dungeonmessages',
  templateUrl: 'dungeonmessages.html',
})
export class DungeonmessagesPage {
  notifi_length = 0

  myfriends = [];
  onlinestate;
  note;

  emptyfriend: boolean;

  constructor(public pushstate: NotificationProvider,
    public navCtrl: NavController, public navParams: NavParams, public events: Events, private requestservice: RequestsProvider, public chatservice: ChatProvider) {

    this.emptyfriend = false;

  }

  ionViewWillEnter() {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////
    this.requestservice.getmydungeonfriends();
    this.events.subscribe('dungeonfriends', () => {
      this.myfriends = [];
      this.myfriends = this.requestservice.mydungeonfriends;
    })


  }


  ionViewDidLoad() {
    let state = ['onlinestate', 'offlinestate'];
    // this.events.unsubscribe('dungeonfriends');
    this.note = '';
    this.onlinestate = state[Math.floor(Math.random() * state.length)];
    setTimeout(() => {
      if (this.myfriends.length == 0)
        this.emptyfriend = true;

    }, 3000);
 

  }
  deletefriend(item) {
    this.requestservice.deletedungeonfriend(item).then((res) => {
      if(res)this.navCtrl.push(DungeonmessagesPage);
 
    }).catch((err) => {
 
    });
   
    
  }
  goChat(buddy) {
    console.log(buddy);
    this.chatservice.buddyinit(buddy);
    this.navCtrl.push(BuddychatPage);
    // this.navCtrl.push(Chat, { navParams: this.toUser });
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
