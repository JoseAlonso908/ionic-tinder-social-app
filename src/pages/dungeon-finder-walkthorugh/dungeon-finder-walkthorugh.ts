import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { MenuSidePage } from '../menu-side/menu-side';
import { DungeonFinderPage } from '../dungeon-finder/dungeon-finder';
import { GroupsPage } from '../groups/groups';
import { NotificationProvider } from '../../providers/notification/notification';

/**
 * Generated class for the DungeonFinderWalkthorughPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dungeon-finder-walkthorugh',
  templateUrl: 'dungeon-finder-walkthorugh.html',
})
export class DungeonFinderWalkthorughPage {
  notifi_length = 0


  constructor(public pushstate: NotificationProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////
    console.log('ionViewDidLoad DungeonFinderWalkthorughPage');
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
  goFinder() {
    this.navCtrl.push(DungeonFinderPage);
  }
  goGroups() {
    this.navCtrl.push(GroupsPage);
  }

}
