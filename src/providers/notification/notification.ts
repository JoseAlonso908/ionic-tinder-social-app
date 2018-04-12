import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {
  firedata = firebase.database().ref('/buddychat');

  notification = [];

  constructor(public events: Events) {
    console.log('Hello NotificationProvider Provider');
  }

  getpushstate() {

    let temp;
    let tempuser;
    let count = 0;




    this.firedata.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {

      tempuser = snapshot.val();
      this.notification = [];

      for (var userkey in tempuser) {

        this.firedata.child(firebase.auth().currentUser.uid).child(userkey).on('value', (snapmessage) => {
          let count = 0;

          temp = snapmessage.val();

          let tempMessage;
          for (var tempkey in temp) {
            if (temp[tempkey].sendby != firebase.auth().currentUser.uid)
              if (!temp[tempkey].readstate)
                count++;
            tempMessage = temp[tempkey]
          }

          if (count != 0 && (tempMessage.sendby != firebase.auth().currentUser.uid)) {
            this.notification.push({ key: userkey, cnt: count });
            this.events.publish('pushstate');
          }




        })
      }



    })
  }



}
