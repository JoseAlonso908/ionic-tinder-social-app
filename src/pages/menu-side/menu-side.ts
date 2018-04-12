import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyProfilePage } from '../my-profile/my-profile';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MessagesPage } from '../messages/messages';
import { DungeonmessagesPage } from '../dungeonmessages/dungeonmessages';
import { SettingsPage } from '../settings/settings';
import { GetStartedPage } from '../get-started/get-started';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { GroupsPage } from '../groups/groups';
import { MydungeonlistsPage } from '../mydungeonlists/mydungeonlists';


/**
 * Generated class for the MenuSidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu-side',
  templateUrl: 'menu-side.html',
})
export class MenuSidePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuSidePage');
  }
  goProfileMyprofileEditing() {
    this.navCtrl.push(MyProfilePage);

  }

  goBack() {
    this.navCtrl.pop().then(() => {

    }).catch((err) => {
      this.goProfileMyprofileEditing();
    })

  }
  goMeetKinkSters() {
    this.navCtrl.push(MeetKinkStersPage);
  }
  goEmptyChat() {
    this.navCtrl.push(MessagesPage);
  }
  goFindAKinkMatch() {
    this.navCtrl.push(MeetKinkStersPage);
  }
  goDungeonsNearMe() {
    this.navCtrl.push(DungeonFinderWalkthorughPage);
  }
  goDungeonMessages() {
    this.navCtrl.push(DungeonmessagesPage);
  }
  goSettings() {
    this.navCtrl.push(SettingsPage);
  }
  goLogout() {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }, function (error) {
      // An error happened.
    });
    let enable: false;
    // this.storage.clear();
    this.storage.set('enable', enable);
    this.navCtrl.setRoot(GetStartedPage);
  }
  goAddYourDungeonListing() {
    this.navCtrl.push(MydungeonlistsPage);
  }
  goGroups() {
    this.navCtrl.push(GroupsPage);
  }
}
