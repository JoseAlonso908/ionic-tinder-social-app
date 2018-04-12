import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { Http } from '@angular/http';
import { NotificationProvider } from '../../providers/notification/notification';

/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  @ViewChild('slider') slider: Slides;
  notifi_length = 0
  cards: Array<any>;
  groups: boolean;
  detailedgroup: boolean;
  detailedpost: boolean;
  detailedpostcomment: boolean;
  groupdetail: string;
  groupdetailpost: string;
  groupdetailpostdate: string;

  constructor(public pushstate: NotificationProvider,
    public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////



  }




  goGroups() {
    this.navCtrl.push(GroupsPage);
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

}
