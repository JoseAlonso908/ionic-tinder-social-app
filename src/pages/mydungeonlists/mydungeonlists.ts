import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { Chat } from '../chat/chat';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { GroupsPage } from '../groups/groups';
import { BuddychatPage } from '../buddychat/buddychat';
import { MessagesPage } from '../messages/messages';
import { AddyourdungeonPage } from '../addyourdungeon/addyourdungeon';
import { PurchasepayPage } from '../purchasepay/purchasepay';



import { FirstproviderProvider } from '../../providers/firstprovider/firstprovider';
import { NotificationProvider } from '../../providers/notification/notification';
import { swipeShouldReset } from 'ionic-angular/util/util';

/**
 * Generated class for the MydungeonlistsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mydungeonlists',
  templateUrl: 'mydungeonlists.html',
})
export class MydungeonlistsPage {
  notifi_length = 0
  clientData: any;

  tempdungeonlist: any;
  dungeonLists: Array<any> = [];

  emptyState: boolean = true;

  changed_state: boolean;

  reportData = {
    "ownner": { "email": "", "uid": "" },
    "body": []
  };

  constructor(public pushstate: NotificationProvider,
    private modal: ModalController,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, public server: FirstproviderProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////
    console.log('ionViewDidLoad MydungeonlistsPage');
    this.clientData = JSON.parse(localStorage.getItem('clientData'));
    this.readDungeonLists();
  }
  readDungeonLists() {
    let credention = { "status": "readdungeonlist" }
    this.server.postAdminData(credention).then((result) => {
      if (Object(result).status == "success") {
        if (Object(result).body != null) {
          for (let i = 0; i < Object(result).body.length; i++) {
            // this.dungeonLists.push(JSON.parse(Object(result).body[i].body));

            if (JSON.parse(Object(result).body[i].body).ownner.email == this.clientData.email) {
              this.tempdungeonlist = (JSON.parse(Object(result).body[i].body));

              this.dungeonLists = this.tempdungeonlist.body;
            }

          }

          if (this.dungeonLists.length > 0)
            this.emptyState = false;
          else
            this.emptyState = true;
        }

        // this.dungeonLists = JSON.parse(Object(result).body);
      } else {
        let toast = this.toastCtrl.create({
          message: "No Network",
          duration: 2000
        })
        toast.present();
      }

    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "No Network",
        duration: 2000
      })
      toast.present();
    });
  }


  deleteDungeon(i) {
    this.dungeonLists.splice(i, 1);
    this.changed_state = true;
    if (this.dungeonLists.length == 0)
      this.emptyState = true;


  }

  editI: number;
  editDungeon(i) {
    if (this.changed_state) {
      this.editI = i;
      this.saveData(5);
    }
    else
      this.navCtrl.push(AddyourdungeonPage, { "dungeonlists": this.dungeonLists, "index": i });

  }
  addDungeon() {
    if (this.changed_state)
      this.saveData(6);
    else
      this.navCtrl.push(AddyourdungeonPage, { "dungeonlists": this.dungeonLists, "index": -1 });

  }

  saveData(kind: number) {
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();
    this.tempdungeonlist.body = this.dungeonLists;
    let credention = { "status": "dungeonlist", "email": this.clientData.email, "body": JSON.stringify(this.tempdungeonlist) }
    this.server.postAdminData(credention).then((result) => {
      loading.dismiss();
      if (Object(result).status == "success") {
        switch (kind) {
          case 0: {
            this.navCtrl.push(MeetKinkStersPage);
            break;
          }
          case 1: {
            this.navCtrl.push(MessagesPage);
            break;
          }
          case 2: {
            this.navCtrl.push(DungeonFinderWalkthorughPage);
            break;
          }
          case 3: {
            this.navCtrl.push(MenuSidePage);
            break;
          }
          case 4: {
            this.navCtrl.push(GroupsPage);
            break;
          }
          case 5: {//edit dungeon
            this.navCtrl.push(AddyourdungeonPage, { "dungeonlists": this.dungeonLists, "index": this.editI });
            break;
          }
          case 6: {//add dungeon
            this.navCtrl.push(AddyourdungeonPage, { "dungeonlists": this.dungeonLists, "index": -1 });
            break;
          }
        }

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

  goPurchase(index) {
    let modal = this.modal.create(PurchasepayPage, { paid: this.dungeonLists[index].pay.paid, photourl: this.dungeonLists[index].detail.detailPhotoUrl });
    modal.present();

    modal.onDidDismiss(data => {
      console.log(data.paidstate)
      switch (data.paidstate) {
        case 0: {
          this.dungeonLists[index].pay.paid = true;
          this.dungeonLists[index].pay.payday = new Date().getDate();
          this.changed_state = true;
         
          break;
        }//paid
        case 1: {
          this.dungeonLists[index].pay.paid = false;
          this.dungeonLists[index].pay.payday = "";
          this.changed_state = true;
        
          break;
        }//canceled
        case 2: { break; }//nope
      }
    });
  }



  goMeetKinkSters() {
    if (this.changed_state) this.saveData(0);
    else
      this.navCtrl.push(MeetKinkStersPage);
  }
  goMessages() {
    if (this.changed_state) this.saveData(1);
    else
      this.navCtrl.push(MessagesPage);
  }
  goDungeonFinderWalkthorugh() {
    if (this.changed_state) this.saveData(2);
    else
      this.navCtrl.push(DungeonFinderWalkthorughPage);
  }
  goMenuSide() {
    if (this.changed_state) this.saveData(3);
    else
      this.navCtrl.push(MenuSidePage);
  }
  goGroups() {
    if (this.changed_state) this.saveData(4);
    else
      this.navCtrl.push(GroupsPage);
  }
}
