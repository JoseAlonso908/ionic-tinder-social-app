import { Injectable } from '@angular/core';
import { Events, NavController } from 'ionic-angular'
import firebase from 'firebase';
import { connreq } from '../../models/interface/request';
import { FireauthProvider } from '../fireauth/fireauth';
// import { flatten } from '@angular/compiler';
/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestsProvider {
  firereq = firebase.database().ref('/requests');
  firefriends = firebase.database().ref('/friends');
  firedungeonfriends = firebase.database().ref('/dungeonfriends');
  myfriends = [];
  mydungeonfriends = [];
  match=false;
  constructor(public userservice: FireauthProvider, public events: Events) {
  }


  sendrequest(req) {
    var promise = new Promise((resolve, reject) => {
      this.checkfriend(req).then((res) => {
        console.log(req.recipient);
        if (!res) {
          this.firereq.child(req.uid).push({
            sender: firebase.auth().currentUser.uid
          }).then(() => {
            resolve(true);
          }), ((err) => {
            reject(err);
          })
        } resolve(false)
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;

  }



  checkmatch(buddy) {

      this.firereq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(buddy.uid).once('value', (snapshot) => {
        let tempstore = snapshot.val();

        if (tempstore != null) {
          let somekey = Object.keys(tempstore);
          console.log(somekey + ":match");
          this.match = true;
          this.events.publish('match');
          
          this.makefriend(buddy).then((res) => {
            this.firereq.child(firebase.auth().currentUser.uid).child(somekey[0]).remove().then((res) => {
             
            }).catch((err) => {
            
            })
          }).catch((err) => {
           
          })
        }
        else {
          // resolve({ success: false });
          this.firereq.child(buddy.uid).orderByChild('sender').equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
            let tempstore = snapshot.val();
            if (tempstore == null) {
              this.sendrequest(buddy).then((res) => {
             
              }).catch((err) => {
      
              })
            }

          }), ((err) => {
         
          })
        }
      }), ((err) => {
     

      })
   
  

  }


  makefriend(buddy) {
    var promise = new Promise((resolve, reject) => {
      this.firefriends.child(firebase.auth().currentUser.uid).push({
        uid: buddy.uid
      }).then((res) => {
        this.firefriends.child(buddy.uid).push({
          uid: firebase.auth().currentUser.uid
        }).then((res) => {

          resolve(true);

        }), ((err) => {
          reject(err);
        })
      }), ((err) => {
        reject(err);
      })
    })
    return promise;
  }



  deleterequest(buddy) {
    var promise = new Promise((reject, resolve) => {
      this.firereq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(buddy.uid).once('value', (snapshot) => {
        let tempstore = snapshot.val();

        if (tempstore != null) {
          let somekey = Object.keys(tempstore);
          this.firereq.child(firebase.auth().currentUser.uid).child(somekey[0]).remove().then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          })
        }
        else
          resolve(false);
      }), ((err) => {
        reject(err);
      })
    })
    return promise;
  }

  deletefriend(buddy) {
    var promise = new Promise((reject, resolve) => {
      this.firefriends.child(firebase.auth().currentUser.uid).orderByChild('uid').equalTo(buddy.uid).once('value', (snapshot) => {
        let tempstore = snapshot.val();

        if (tempstore != null) {
          let somekey = Object.keys(tempstore);
          this.firefriends.child(firebase.auth().currentUser.uid).child(somekey[0]).remove().then(() => {
            this.firefriends.child(buddy.uid).orderByChild('uid').equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
              let tempstore = snapshot.val();

              if (tempstore != null) {
                let somekey = Object.keys(tempstore);
                this.firefriends.child(buddy.uid).child(somekey[0]).remove().then(() => {
                  resolve(true);
                }).catch((err) => {
                  reject(err);
                })
              } else
                resolve(false);
            })


          }).catch((err) => {
            reject(err);
          })
        }
        else
          resolve(false);
      }), ((err) => {
        reject(err);
      })
    })
    return promise;
  }
  deletedungeonfriend(buddy) {
    var promise = new Promise((reject, resolve) => {
      this.firedungeonfriends.child(firebase.auth().currentUser.uid).orderByChild('uid').equalTo(buddy.uid).once('value', (snapshot) => {
        let tempstore = snapshot.val();

        if (tempstore != null) {
          let somekey = Object.keys(tempstore);
          this.firedungeonfriends.child(firebase.auth().currentUser.uid).child(somekey[0]).remove().then(() => {
            this.firedungeonfriends.child(buddy.uid).orderByChild('uid').equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
              let tempstore = snapshot.val();

              if (tempstore != null) {
                let somekey = Object.keys(tempstore);
                this.firedungeonfriends.child(buddy.uid).child(somekey[0]).remove().then(() => {
                  resolve(true);
                }).catch((err) => {
                  reject(err);
                })
              } else
                resolve(false);
            })


          }).catch((err) => {
            reject(err);
          })
        }
        else
          resolve(false);
      }), ((err) => {
        reject(err);
      })
    })
    return promise;
  }

  makedungeonfriend(buddy) {
    var promise = new Promise((resolve, reject) => {
      this.checkdungeonfriend(buddy).then((res) => {
        if (!res) {
          this.firedungeonfriends.child(firebase.auth().currentUser.uid).push({
            uid: buddy.uid
          }).then(() => {
            this.firedungeonfriends.child(buddy.uid).push({
              uid: firebase.auth().currentUser.uid
            }).then(() => {
              resolve(true);
            }), ((err) => {
              reject(err);
            })
          }), ((err) => {
            reject(err);
          })

        } else resolve(true);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  getmyfriends() {
    let friendsuid = [];
    this.firefriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allfriends = snapshot.val();

      for (var i in allfriends)
        friendsuid.push(allfriends[i].uid);

      this.userservice.getallusers().then((users) => {
        this.myfriends = [];
        for (var j in friendsuid)
          for (var key in users) {
            if (friendsuid[j] === users[key].uid) {
              this.myfriends.push(users[key]);
            }
          }
        this.events.publish('friends');

      }).catch((err) => {

      })
    })
  }
  getmydungeonfriends() {
    let friendsuid = [];
    this.firedungeonfriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allfriends = snapshot.val();

      for (var i in allfriends)
        friendsuid.push(allfriends[i].uid);

      this.userservice.getallusers().then((users) => {
        this.mydungeonfriends = [];
        for (var j in friendsuid)
          for (var key in users) {
            if (friendsuid[j] === users[key].uid) {
              this.mydungeonfriends.push(users[key]);
            }
          }
        this.events.publish('dungeonfriends');

      }).catch((err) => {

      })
    })
  }

  checkdungeonfriend(buddy) {
    var promise = new Promise((resolve, reject) => {
      this.firedungeonfriends.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        let allfriends = snapshot.val();
        for (var i in allfriends) {
          console.log(i);
          console.log(allfriends[i]);
          if (allfriends[i].uid == buddy.uid)

            resolve(true);

        }
        resolve(false);
      }), ((err) => {
        reject(err);
      })
    })
    return promise;
  }

  checkfriend(buddy) {
    var promise = new Promise((resolve, reject) => {
      this.firefriends.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        let allfriends = snapshot.val();
        for (var i in allfriends) {
          console.log(i);
          console.log(allfriends[i]);
          if (allfriends[i].uid == buddy.uid)

            resolve(true);

        }
        resolve(false);
      }), ((err) => {
        reject(err);
      })
    })
    return promise;
  }





}
