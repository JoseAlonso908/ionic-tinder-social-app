import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';
/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {
  firedata = firebase.database().ref('/buddychat');
  buddy: any;
  buddymessages;

  messageingState = false;



  constructor(public events: Events) {
  }
  public buddyinit(buddy) {
    this.buddy = buddy;
  }
  makeReadState() {
    if (this.buddy) {
      var promise = new Promise((resolve, reject) => {
        this.firedata.child(firebase.auth().currentUser.uid).child(this.buddy.uid).orderByChild('sendby').equalTo(this.buddy.uid).once('value', (snapshot) => {
          let tempstore = snapshot.val();

          for (var tempkey in tempstore) {
            this.firedata.child(firebase.auth().currentUser.uid).child(this.buddy.uid).child(tempkey).update({
              readstate: true
            }).then(() => {
              resolve(true);

            }).catch((err) => {
              reject(err);
            })

          }
        })


      })
      return promise;
    }


  }
  addnewmessage(msg) {
    if (this.buddy) {
      var promise = new Promise((resolve, reject) => {
        this.firedata.child(firebase.auth().currentUser.uid).child(this.buddy.uid).push({
          sendby: firebase.auth().currentUser.uid,
          sendbyName: firebase.auth().currentUser.displayName,
          message: msg,
          timestamp: new Date().getHours() + ":" + new Date().getMinutes(),
        }).then(() => {
          this.firedata.child(this.buddy.uid).child(firebase.auth().currentUser.uid).push({
            sendby: firebase.auth().currentUser.uid,
            sendbyName: firebase.auth().currentUser.displayName,
            message: msg,
            timestamp: new Date().getHours() + ":" + new Date().getMinutes(),
            readstate: false


          }).then(() => {
            resolve(true);
          }), ((err) => {
            reject(err);
          })
        })
      })
      return promise;
    }

  }
  getbuddymessages() {

    let temp;
    this.firedata.child(firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();

      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);

      }


      this.events.publish('newmessage');
    })

  }





}
