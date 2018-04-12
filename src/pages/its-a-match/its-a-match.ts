import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { Chat } from '../chat/chat';
import { GroupsPage } from '../groups/groups';
import { ChatProvider } from '../../providers/chat/chat';
import { BuddychatPage } from '../../pages/buddychat/buddychat';
import { NotificationProvider } from '../../providers/notification/notification';


/**
 * Generated class for the ItsAMatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-its-a-match',
  templateUrl: 'its-a-match.html',
})
export class ItsAMatchPage {

  photoUrl;
  notification;
  userName;
  notifi_length = 0
  constructor(public pushstate: NotificationProvider,
    public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider) {
    this.notification = false;
    this.photoUrl = this.navParams.data.navParams.photoURL;
    this.userName = this.navParams.data.navParams.displayName;
  }
  ionViewDidLoad() {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////
    console.log('ionViewDidLoad ItsAMatchPage');
  }
  goMeetKinkSters() {
    this.navCtrl.pop();
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
  goChat1() {
    this.chatservice.buddyinit(this.navParams.data.navParams);
    this.navCtrl.push(BuddychatPage);


  }
  goGroups() {
    this.navCtrl.push(GroupsPage);
  }

}
