import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { GroupsPage } from '../groups/groups';
import { NotificationProvider } from '../../providers/notification/notification';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

/**
 * Generated class for the PurchasepayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-purchasepay',
  templateUrl: 'purchasepay.html',
})
export class PurchasepayPage {
  paid: false;
  photourl = "";
  notifi_length = 0;

  constructor(
    private payPal: PayPal,
    public pushstate: NotificationProvider,
    private viewCtl: ViewController,
    public navCtrl: NavController, public navParams: NavParams) {

      this.paid = this.navParams.data.paid;
      this.photourl = this.navParams.data.photourl;
  }

  ionViewDidLoad() {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////

  }
  goPay() {
    this.payPal.init({
      PayPalEnvironmentProduction: 'AdLRr2KdUNhzPVCrjBc_fG4occaQaWbB8yeyaCBvrXoOzB_EdHaaq7iqPzKGVbah2CJAZVBMhhDsvKOK',
      PayPalEnvironmentSandbox: 'ASToSw-T5-jqr2ESDsCtZvY1yH3MeaTI0LJcYZadrx6DSJ9l_zAd4gjFGnQ-ELEGeM6qIHZTW-N7xpL1'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('5', 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          this.viewCtl.dismiss({ paidstate: 0 });
          console.log(res);
          // Successfully paid
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          alert("Error or render dialog closed without being successful")
   
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
        alert("Error in configuration")
      });
    }, () => {
      alert("Error in initialization, maybe PayPal isn't supported or something else")
      // Error in initialization, maybe PayPal isn't supported or something else
    });

  }
  goCancel() {
    this.viewCtl.dismiss({ paidstate: 1 });

  }

  goMeetKinkSters() {
    this.viewCtl.dismiss({ paidstate: 2 });
    this.navCtrl.push(MeetKinkStersPage);
  }
  goMessages() {
    this.viewCtl.dismiss({ paidstate: 2 });
    this.navCtrl.push(MessagesPage);
  }
  goDungeonFinderWalkthorugh() {
    this.viewCtl.dismiss({ paidstate: 2 });
    this.navCtrl.push(DungeonFinderWalkthorughPage);
  }
  goMenuSide() {
    this.viewCtl.dismiss({ paidstate: 2 });
    this.navCtrl.push(MenuSidePage);
  }

  goGroups() {
    this.viewCtl.dismiss({ paidstate: 2 });
    this.navCtrl.push(GroupsPage);
  }


}
