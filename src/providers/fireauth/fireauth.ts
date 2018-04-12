import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { usercreds } from '../../models/interface/usercreds';
import firebase from 'firebase';



/*
  Generated class for the FireauthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FireauthProvider {
  firedata = firebase.database().ref('/chatusers');
  constructor(public afireauth: AngularFireAuth) {
    console.log("fireauthProvider");

  }
  login(credentials: usercreds) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then((res) => {
        console.log(res);
        resolve([true,res]);
      }).catch((err) => {
        console.log(err)
        resolve([false,err]);
        // reject(err);

      })
    })

    return promise;

  }



  signup(newuser) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {
        this.afireauth.auth.currentUser.updateProfile({
          displayName: "user" + newuser.birthday,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/fetxxx-395b5.appspot.com/o/mask-icon.png?alt=media&token=228e3ba3-deb1-4462-a1a0-4c636fee43a6'
        }).then(() => {
          this.firedata.child(this.afireauth.auth.currentUser.uid).set({
            uid: this.afireauth.auth.currentUser.uid,
            displayName: "user" + newuser.birthday,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/fetxxx-395b5.appspot.com/o/mask-icon.png?alt=media&token=228e3ba3-deb1-4462-a1a0-4c636fee43a6',
            profile: { "location": "location is miss", "dom": false, "sub": false, "ask": false, "fetish": "user's fetish is miss" }
          }).then(() => {
            resolve({ success: true });
          }).catch((err) => {
            reject(err);
          })

        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;

  }

  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        resolve({ success: false });
      })
    })
    return promise;
  }
  passwordupdate(newpass: string) {
    var user = firebase.auth().currentUser;

    var promise = new Promise((resolve, reject) => {
      user.updatePassword(newpass).then(function () {
        resolve({ success: true });
      }).catch(function (error) {
        resolve({ success: false });
      })
    })

    return promise;
  }

  updateprofile(profile: any) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.currentUser.updateProfile({
        displayName: profile.name,
        photoURL: profile.photoUrl,

      }).then(() => {
        firebase.database().ref('/chatusers/' + firebase.auth().currentUser.uid).update({
          photoURL: profile.photoUrl,
          uid: firebase.auth().currentUser.uid,
          displayName: profile.name,
          profile: profile

        }).then(() => {
          resolve({ success: true });

        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  changeEmail(newemail) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().currentUser.updateEmail(newemail).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        resolve({ success: false });
      })
    })
    return promise;
  }
  getuserdetails() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.email).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('uid').once('value', (snapshot) => {
        let cards = snapshot.val();
        let temparr = [];
        let somekey = Object.keys(cards);
        
        for (var card in cards) {
          if (card != firebase.auth().currentUser.uid)
            temparr.push(cards[card]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getuserbyuid(uid: any) {
    var promise = new Promise((resolve, reject) => {
      firebase.database().ref('/chatusers/' + uid).once('value', (snapshot) => {
        let user = snapshot.val();
          resolve(user)

      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
}


