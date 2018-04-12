import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { MenuSidePage } from '../menu-side/menu-side';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { DungeonListingPage } from '../dungeon-listing/dungeon-listing';
import { GroupsPage } from '../groups/groups';
import { DungeonFinderPage } from '../dungeon-finder/dungeon-finder';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FirstproviderProvider } from '../../providers/firstprovider/firstprovider';
import firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { NotificationProvider } from '../../providers/notification/notification';
import { flatten } from '@angular/compiler';


/**
 * Generated class for the AddyourdungeonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-addyourdungeon',
  templateUrl: 'addyourdungeon.html',
})
export class AddyourdungeonPage {

  dungeonLists = [];
  dungeonIndex: number;


  photouploadstate: boolean[];

  yourdungeonphotos: boolean;
  addyourdungeon: boolean;
  yourdungeonreviewsno: boolean;
  yourdungeonreviews: boolean;

  paid = false;
  title: string;
  locationName: string;
  location = { "lat": 0, "long": 0 };
  description: string;
  detailPhotoUrl: string;

  dungeonPhoto: any;

  reviews: any;

  avg: any;
  mark1: any;
  mark2: any;
  mark3: any;
  mark4: any;

  avgt: any;
  mark1t: any;
  mark2t: any;
  mark3t: any;
  mark4t: any;

  reportData = {
    "ownner": { "email": "", "uid": "" },
    "body": []
  };

  dungeonlists = {
    "pay":{"paid":true,"payday":""},
    "detail": { "title": "", "location": { "lat": 0, "long": 0 }, "locationName": "", "description": "", "detailPhotoUrl": "" },
    "dungeonPhoto": [],
    "reveiws": {}
  }

  fileUrl: string;
  clientData: any;
  fileTransfer: any;
  kind: any;
  notifi_length = 0



  constructor(public pushstate: NotificationProvider, public geocoder: NativeGeocoder, public geolocation: Geolocation, public server: FirstproviderProvider, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public actionsheetCtrl: ActionSheetController, public platform: Platform, private camera: Camera, public loadingCtrl: LoadingController, public transfer: Transfer) {
    // 


  }

  ionViewDidLoad() {
    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    let messageNotification = this.pushstate.notification;
    for (let i = 0; i < messageNotification.length; i++)
      this.notifi_length += messageNotification[i].cnt;
    ///////////////
    this.getcurrentpos();
    this.clientData = JSON.parse(localStorage.getItem('clientData'));
    this.fileTransfer = this.transfer.create();

    this.title = "Add Your Dungeon Title";
    this.locationName = "Your Location, State, Country";
    this.description = "Write your Description...";
    this.detailPhotoUrl = "assets/icon/your-dungeon-add-photo.png";
    this.dungeonPhoto = ["", "", "", "", ""];
    this.reviews = { "count": 0, "body": [] }

    this.photouploadstate = [false, false, false, false, false];

    this.yourdungeonphotos = false;
    this.addyourdungeon = true;
    this.yourdungeonreviewsno = false;
    this.yourdungeonreviews = false;



    this.dungeonLists = this.navParams.data.dungeonlists;
    this.dungeonIndex = this.navParams.data.index;
    console.log(this.dungeonLists);
    if (this.dungeonIndex != -1) this.initialData();


    this.initAutocomplete();



  }
  ///////////////////////current pos
  getcurrentpos() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.getcountry(position);

      this.location.lat = position.coords.latitude;
      this.location.long = position.coords.longitude;



    }).catch((err) => {

    })


  }
  getcountry(pos) {
    this.geocoder.reverseGeocode(pos.coords.latitude, pos.coords.longitude).then((res: NativeGeocoderReverseResult) => {

      this.locationName = res.subLocality + "," + res.locality + "," + res.administrativeArea + "," + res.countryName + "," + res.postalCode
    }).catch((err) => {

    })
  }

  ///////////////////////////////click dungeon photo
  clickDungeonPhoto(kind: any) {
    this.kind = kind;
    this.uploadPic();
  }

  /////////////////////////////////////////save dungeon list
  saveData() {
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();

    if (this.title != "Add Your Dungeon Title" && this.description != "Write your Description...") {

      this.reportData.ownner.email = this.clientData.email;
      this.reportData.ownner.uid = firebase.auth().currentUser.uid;


      this.dungeonlists.dungeonPhoto = this.dungeonPhoto;
      this.dungeonlists.detail.title = this.title;
      if (this.detailPhotoUrl == "assets/icon/your-dungeon-add-photo.png")
        this.detailPhotoUrl = this.clientData.photoUrl;
      this.dungeonlists.detail.detailPhotoUrl = this.detailPhotoUrl;
      this.dungeonlists.detail.description = this.description;
      this.dungeonlists.detail.location = this.location;
      this.dungeonlists.detail.locationName = this.locationName;
      this.dungeonlists.reveiws = this.reviews;

      if (this.dungeonIndex == -1)
        this.dungeonLists.push(this.dungeonlists);
      else
        this.dungeonLists[this.dungeonIndex] = this.dungeonlists;

      this.reportData.body = this.dungeonLists;



      let credention = { "status": "dungeonlist", "email": this.clientData.email, "body": JSON.stringify(this.reportData) }
      this.server.postAdminData(credention).then((result) => {
        loading.dismiss();
        if (Object(result).status == "success") {
          let toast = this.toastCtrl.create({
            message: "Successfully updated your listing!",
            duration: 4000
          })
          toast.present();

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

    } else {
      let toast = this.toastCtrl.create({
        message: "please insert dungeon data correctly",
        duration: 4000
      })
      loading.dismiss();
      toast.present();

    }

  }

  initialData() {
    for (let i = 0; i < this.dungeonLists.length; i++) {
      // if (this.dungeonLists[i].paid != null && this.dungeonLists[i].paid != "")
      //   this.paid = this.dungeonLists[i].paid;
      if (this.dungeonLists[i].detail.title != null && this.dungeonLists[i].detail.title != "")
        this.title = this.dungeonLists[i].detail.title;

      if (this.dungeonLists[i].detail.locationName != null && this.dungeonLists[i].detail.locationName != "")
        this.locationName = this.dungeonLists[i].detail.locationName;

      if (this.dungeonLists[i].detail.description != null && this.dungeonLists[i].detail.description != "")
        this.description = this.dungeonLists[i].detail.description;

      if (this.dungeonLists[i].detail.detailPhotoUrl != null && this.dungeonLists[i].detail.detailPhotoUrl != "")
        this.detailPhotoUrl = this.dungeonLists[i].detail.detailPhotoUrl;

      if (this.dungeonLists[i].dungeonPhoto != null)
        this.dungeonPhoto = this.dungeonLists[i].dungeonPhoto;

      for (let i = 0; i < 5; i++)
        if (this.dungeonPhoto[i] != null && this.dungeonPhoto[i] != "")
          this.photouploadstate[i] = true;

      if (this.dungeonLists[i].reveiws.count != 0)
        this.reviews = this.dungeonLists[i].reveiws;
      let temp1 = 0, temp2 = 0, temp3 = 0, temp4 = 0, temp5 = 0, bodylength = this.reviews.body.length;

      for (let j = 0; j < bodylength; j++) {
        temp1 += this.reviews.body[j].mark.avg;
        temp2 += this.reviews.body[j].mark.clean;
        temp3 += this.reviews.body[j].mark.comfor;
        temp4 += this.reviews.body[j].mark.loc;
        temp5 += this.reviews.body[j].mark.fac;

      }
      if (bodylength != 0) {
        this.avgt = Math.floor(10 * temp1 / bodylength);
        this.mark1t = Math.floor(10 * temp2 / bodylength);
        this.mark2t = Math.floor(10 * temp3 / bodylength);
        this.mark3t = Math.floor(10 * temp4 / bodylength);
        this.mark4t = Math.floor(10 * temp5 / bodylength);

        this.avg = Math.floor(10 * temp1 / bodylength) / 10;
        this.mark1 = Math.floor(10 * temp2 / bodylength) / 10;
        this.mark2 = Math.floor(10 * temp3 / bodylength) / 10;
        this.mark3 = Math.floor(10 * temp4 / bodylength) / 10;
        this.mark4 = Math.floor(10 * temp5 / bodylength) / 10;
      }
    }
  }

  ////////////////////////////upload photo
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
      destinationType: 2,
      sourceType: type,
      allowEdit: true,
      encodingType: 0,
      correctOrientation: true,
      saveToPhotoAlbum: userChoice,
      cameraDirection: 1
    }

    this.camera.getPicture(options).then((imageData) => {

      this.fileUrl = imageData;
      this.uploadPhoto();
    }, (err) => {
      // Handle error
      console.log("Camera pic error::" + err);
    });

  }

  uploadPhoto() {

    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();

    if (this.fileUrl != null && this.fileUrl != '') {

      let options: FileUploadOptions = {
        fileKey: "photo",
        fileName: "" + this.clientData.name.replace(" ", "") + "detail_dungeon_list.jpg",
        headers: {}
      };

      var ext = this.fileUrl.split("?")[0].split(".").pop();

      if (ext == "jpg" || ext == "jpeg" || ext == "JPG" || ext == "JPEG")
        options.mimeType = "image/jpeg";
      else if (ext == "png" || ext == "PNG")
        options.mimeType = "image/png";
      else {
        return;
      }
      options.httpMethod = "POST";
      options.chunkedMode = false;
      console.log(this.fileUrl);
      this.fileTransfer.upload(this.fileUrl, 'http://spankrr.com/FET/profile_image/index.php', options).then((entry) => {
        loading.dismiss();
        this.fileUrl = JSON.parse(entry.response).photoUrl;
        if (this.kind == 5)
          this.detailPhotoUrl = this.fileUrl
        else {
          this.dungeonPhoto[this.kind] = this.fileUrl;
          this.photouploadstate[this.kind] = true;
        }
        // this.detailPhotoUrl = JSON.parse(entry.response).photoUrl;

      }, (err) => {
        let toast = this.toastCtrl.create({
          message: "Update Fail.",
          duration: 8000,
          position: 'center'
        })
        toast.present();
        loading.dismiss();
      });
    }
  }

  removereview(i) {
    this.reviews.body.splice(i);
    this.reviews.count--;
    if (this.reviews.count == 0) {
      this.yourdungeonreviewsno = true;
      this.yourdungeonreviews = false;
    }
  }

  ///////////////////////
  clickchoosephoto() {
    this.yourdungeonphotos = true;
    this.addyourdungeon = false;
    this.yourdungeonreviewsno = false;
    this.yourdungeonreviews = false;

  }
  clickdungeondetails() {
    this.yourdungeonphotos = false;
    this.addyourdungeon = true;
    this.yourdungeonreviewsno = false;
    this.yourdungeonreviews = false;
  }
  clickreviews() {

    if (this.reviews.count == 0) {
      this.yourdungeonreviewsno = true;
      this.yourdungeonreviews = false;
    } else {
      this.yourdungeonreviewsno = false;
      this.yourdungeonreviews = true;

    }

    this.yourdungeonphotos = false;
    this.addyourdungeon = false;

  }
  // /////////////////////////////////////////////////location autocomplete start
  initAutocomplete() {
    let that = this;
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac1-input');
    var searchBox = new google.maps.places.SearchBox(input);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();
      let lat = (places[0].geometry.viewport.f.b + places[0].geometry.viewport.f.f) / 2;
      let long = (places[0].geometry.viewport.b.b + places[0].geometry.viewport.b.f) / 2;

      that.location.lat = lat;
      that.location.long = long;

      console.log(lat);
      that.locationName = places[0].formatted_address;
      if (places.length == 0) {
        return;
      }
    });
  }

  // /////////////////////////////////////////////////location autocomplete end
  goDungeonFinder() {
    this.navCtrl.setRoot(DungeonFinderPage);
  }
  goMeetKinkSters() {

    this.navCtrl.setRoot(MeetKinkStersPage);
  }
  goMessages() {

    this.navCtrl.setRoot(MessagesPage);
  }
  goDungeonFinderWalkthorugh() {

    this.navCtrl.setRoot(DungeonFinderWalkthorughPage);
  }
  goMenuSide() {

    this.navCtrl.setRoot(MenuSidePage);
  }
  goDungeonListing() {

    this.navCtrl.setRoot(DungeonListingPage);

  }
  goGroups() {
    this.navCtrl.setRoot(GroupsPage);
  }

}
