import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { ChatGroupPage } from '../chat-group/chat-group';
import { GroupsPage } from '../groups/groups';
import { NotificationProvider } from '../../providers/notification/notification';

/**
 * Generated class for the AddUserToGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-user-to-group',
  templateUrl: 'add-user-to-group.html',
})
export class AddUserToGroupPage {

  selectedItem: any;
  avatars: string[];
  state: string[];
  idarray: any[];
  items: Array<{ name: string, note: string, avatar: string, addstate: any, onlinestate: string, id: any }>;
  notifi_length = 0
  // iconname: any;
  constructor(public pushstate: NotificationProvider, public navCtrl: NavController, public navParams: NavParams) {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////

    // If we navigated to this page, we will have an item available as a nav param
    // this.iconname = 'md-person-add';
    this.selectedItem = navParams.get('item');


    // Let's populate this page with some filler content for funzies
    // this.avatas = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    // 'american-football', 'boat', 'bluetooth', 'build'];
    this.avatars = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];
    this.state = ['onlinestate', 'offlinestate'];
    this.items = [];

    for (let i = 1; i < 10; i++) {
      this.items.push({
        name: 'Item ' + i,
        note: 'This is item #' + i,
        //  icon: this.icons[Math.floor(Math.random() * this.icons.length)]
        avatar: 'assets/img/photo' + i + '.png',
        addstate: 'md-person-add',
        onlinestate: this.state[Math.floor(Math.random() * this.state.length)],
        id: Math.floor(34245653635 * Math.random())
      });
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    // this.navCtrl.push(AddUserToGroupPage, {
    //   item: item
    // // });
    // if(this.iconname=='md-person-add')
    // this.iconname='md-remove';
    if (item.addstate == 'md-person-add')
      item.addstate = 'md-remove';
    else
      item.addstate = 'md-person-add';
    this.navCtrl.push(ChatGroupPage, { item: item });

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
