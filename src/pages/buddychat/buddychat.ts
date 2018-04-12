import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ActionSheetController, Platform } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { Events, TextInput, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { AddUserToGroupPage } from '../add-user-to-group/add-user-to-group';
import { GroupsPage } from '../groups/groups';
import { NotificationProvider } from '../../providers/notification/notification';
import { ImageHndlerProvider } from '../../providers/image-hndler/image-hndler';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

import firebase from 'firebase';
import { Keyboard } from 'ionic-angular/platform/keyboard';
/**
 * Generated class for the BuddychatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  buddy: any;
  newmessage;
  allmessages = [];
  photoURL;
  showEmojiPicker: boolean;

  messageNotification = [];

  onlinestate;
  note;

  imgornot;
  fileTransfer: TransferObject
  sending_ani: boolean;

  notifi_length = 0;

  constructor(public keyboard:Keyboard, public transfer: Transfer, public camera: Camera, public platform: Platform, public actionsheetCtrl: ActionSheetController, public zone: NgZone, public imgstore: ImageHndlerProvider, public loadingContrl: LoadingController, public pushstate: NotificationProvider, public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider, public events: Events) {
    this.fileTransfer = this.transfer.create();

  }

  ionViewDidLoad() {


    let state = ['onlinestate', 'offlinestate'];
    // this.events.unsubscribe('friends');
    this.note = '';
    this.onlinestate = state[Math.floor(Math.random() * state.length)];


    this.showEmojiPicker = false;

    this.chatservice.getbuddymessages()
    this.getmessage();
    this.chatservice.messageingState = true;
    this.allmessages = this.chatservice.buddymessages;
    this.buddy = this.chatservice.buddy;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollToBottom();

    this.chatservice.makeReadState().then((res) => {
      // /////////////////notification state
      this.pushstate.getpushstate();
      this.notifi_length = 0;
      this.messageNotification = this.pushstate.notification;
      for (let i = 0; i < this.messageNotification.length; i++) {
        this.notifi_length += this.messageNotification[i].cnt;
      }
      // /////////////

    }).catch((err) => {

    });

    this.events.subscribe('newmessage', () => {

      this.getmessage();
      this.chatservice.makeReadState().then((res) => {
        // /////////////////notification state
        this.pushstate.getpushstate();
        this.notifi_length = 0;
        this.messageNotification = this.pushstate.notification;
        for (let i = 0; i < this.messageNotification.length; i++) {
          this.notifi_length += this.messageNotification[i].cnt;
        }
        // /////////////

      }).catch((err) => {

      });
    })





  }
  getmessage() {
    this.allmessages = [];
    this.imgornot = [];
    this.allmessages = this.chatservice.buddymessages;
    for (var key in this.allmessages) {
      if (this.allmessages[key].message.substring(0, 4) == 'http')
        this.imgornot.push(true);
      else
        this.imgornot.push(false);
    }
    this.scrollToBottom();
  }

  addmessage() {
    this.sending_ani = true;
   
    setTimeout(() => {
      this.chatservice.addnewmessage(this.newmessage).then(() => {
        this.scrollToBottom();
        this.newmessage = '';
      })
    }, 20);
    setTimeout(() => {
      this.sending_ani = false;

    }, 400);
  }
  uploadPic() {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Upload Profile Picture',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture(1);
          }
        },
        {
          text: !this.platform.is('ios') ? 'gallery' : 'Gallery',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.takePicture(0);
          }
        },
        {
          text: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          }
        }
      ]
    });
    return actionsheet.present();

  }

  autoSavePicture(): boolean {
    return JSON.parse(localStorage.getItem('saveToLibrary'));
  }

  takePicture(type) {
    console.log("takePicture start");
    let userChoice: boolean = this.autoSavePicture();
    const options: CameraOptions = {
      quality: 80,
      destinationType: 1,
      sourceType: type,
      allowEdit: true,
      encodingType: 0,
      correctOrientation: true,
      saveToPhotoAlbum: userChoice,
      cameraDirection: 1,


    }

    this.camera.getPicture(options).then((imageData) => {


      // this.fileUrl = imageData;
      if (imageData) this.uploadPhoto(imageData);
    }, (err) => {
      // Handle error
      console.log("Camera pic error::" + err);
    });

  }


  uploadPhoto(fileUrl: string) {

    let loading = this.loadingContrl.create({
      content: "Please Wait..."
    });
    loading.present();

    if (fileUrl != null && fileUrl != '') {

      let options: FileUploadOptions = {
        fileKey: "photo",
        fileName: "" + this.buddy.displayName.replace(" ", "") + ".jpg",
        headers: {}
      };

      var ext = fileUrl.split("?")[0].split(".").pop();

      if (ext == "jpg" || ext == "jpeg" || ext == "JPG" || ext == "JPEG")
        options.mimeType = "image/jpeg";
      else if (ext == "png" || ext == "PNG")
        options.mimeType = "image/png";
      else {
        return;
      }
      options.httpMethod = "POST";
      options.chunkedMode = false;
      console.log(fileUrl);
      this.fileTransfer.upload(fileUrl, 'http://spankrr.com/FET/profile_image/index.php', options).then((entry) => {

        loading.dismiss();
        this.chatservice.addnewmessage(JSON.parse(entry.response).photoUrl).then(() => {
          this.scrollToBottom();
          this.newmessage = '';
        })
      }).catch((err) => {
        alert(err);
        loading.dismiss();
      })
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        // this.deleteNotification(this.buddy);

        this.content.scrollToBottom();
      }
    }, 400)
  }
  deleteNotification(item) {
    for (let i = 0; this.messageNotification.length; i++)
      if (this.messageNotification[i] == item)
        this.messageNotification.splice(i, 1);
  }



  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.messageInput.setFocus();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  goMeetKinkSters() {
    this.chatservice.messageingState = false;
    this.events.unsubscribe('newmessage');
    this.navCtrl.setRoot(MeetKinkStersPage);
  }

  goMessages() {
    this.chatservice.messageingState = false;
    this.events.unsubscribe('newmessage');
    this.navCtrl.setRoot(MessagesPage);
  }
  goDungeonFinderWalkthorugh() {
    this.chatservice.messageingState = false;
    this.events.unsubscribe('newmessage');
    this.navCtrl.setRoot(DungeonFinderWalkthorughPage);
  }
  goMenuSide() {
    this.chatservice.messageingState = false;
    this.events.unsubscribe('newmessage');
    this.navCtrl.setRoot(MenuSidePage);
  }
  goAddGroup() {
    // this.navCtrl.setRoot(AddUserToGroupPage);

  }
  goGroups() {
    this.chatservice.messageingState = false;
    this.events.unsubscribe('newmessage');
    this.navCtrl.setRoot(GroupsPage);
  }



}
