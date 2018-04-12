import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ModalController, IonicPage, ToastController, NavController, NavParams, MenuController, ActionSheetController, Platform, LoadingController, Events } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../menu-side/menu-side';
import { GroupsPage } from '../groups/groups';
import { ImageHndlerProvider } from '../../providers/image-hndler/image-hndler';
import { FireauthProvider } from '../../providers/fireauth/fireauth';
import { Names } from '../../models/nameset/nameset';

import { EditbiomodalPage } from '../editbiomodal/editbiomodal'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FirstproviderProvider } from '../../providers/firstprovider/firstprovider';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { NotificationProvider } from '../../providers/notification/notification';
import { CroppingPage } from '../cropping/cropping';
/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
  providers: [Transfer, Camera]
})
export class MyProfilePage {

  croppedstate = false;

  userData = { "status": "", "email": "", "new_email": "", "new_pass": "", "profile": "" };
  newemail = ''
  check_email = false;



  imgurl = ''
  fileUrl: any;
  myprofilepage = true;
  fileuploadpage = false;
  filenouploadpage = false;
  uploadOrChange = '';

  blank = true;
  notification: boolean;
  messageNotification = [];

  clientData: any;
  fileTransfer: TransferObject

  current_pass_input_mode: string;
  currentPssword: string;
  current_check_pass: boolean;
  current_icon_color: any;
  current_eyeclasshide: boolean;

  change_pass_input_mode: string;
  changePssword: string;
  change_check_pass: boolean;
  change_icon_color: any;
  change_eyeclasshide: boolean;

  vn_pass_input_mode: string;
  vnPssword: string;
  vn_check_pass: boolean;
  vn_icon_color: any;
  vn_eyeclasshide: boolean;

  public editbiotf: boolean;

  buttonSpell: string;

  public editfet: boolean;

  fetbuttonSpell: string;



  fileuploded: boolean;

  aboutme: any;
  dom: boolean;
  sub: boolean;
  ask: boolean;
  fetish = "";
  name: string;
  inputname: string;
  name_eit_state: boolean;
  name_set = new Names().name_set;
  fetishset: boolean;

  location = { "lat": 0, "long": 0 };

  ///////////////////////////////fet variable
  fetishes = [];
  fetishes_state = [];
  customfetishes = [];
  customfet: any;
  fet_state = false;
  new_cst_fet: boolean;

  return_fetishes = [];


  myfet = [];
  ///////////////////////
  notifi_length = 0;


  change_state: boolean;
  constructor(public modalCtrl: ModalController, public geocoder: NativeGeocoder, public geolocation: Geolocation, public toastCtrl: ToastController, public user_provid: FirstproviderProvider, public zone: NgZone, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, private camera: Camera, public loadingCtrl: LoadingController,
    public imgservice: ImageHndlerProvider, public fireuserservice: FireauthProvider, public actionsheetCtrl: ActionSheetController, public platform: Platform, public transfer: Transfer, public pushstate: NotificationProvider, public events: Events) {



    this.profileShow();

    this.notification = false;
    this.fileTransfer = this.transfer.create();
    this.editbiotf = true;
    this.buttonSpell = "Edit Bio";
    this.editfet = true;


    this.fetbuttonSpell = "Add a Fetish"

    this.aboutme = this.clientData.aboutme;
    this.dom = this.clientData.dom;
    this.sub = this.clientData.sub;
    this.ask = this.clientData.ask;

    this.fetToString();//this.fetish set
    this.name = this.clientData.name;

    if ((this.clientData.workUrl != null) && (this.clientData.workUrl != ''))
      this.croppedstate = true;
    else
      this.croppedstate = false;


  }


  fetToString() {
    this.fetish = "";
    for (let i = 0; i < this.myfet.length; i++)
      if (i == (this.myfet.length - 1))
        this.fetish += this.myfet[i];
      else
        this.fetish += this.myfet[i] + ", ";
  }

  ionViewDidLoad() {
    this.getcurrentpos();
    console.log('ionViewDidLoad MyProfilePage');

    this.current_icon_color = 'light';
    this.current_eyeclasshide = true;
    this.current_check_pass = false;
    this.current_pass_input_mode = 'password';

    this.change_icon_color = 'light';
    this.change_eyeclasshide = true;
    this.change_check_pass = false;
    this.change_pass_input_mode = 'password';

    this.vn_icon_color = 'light';
    this.vn_eyeclasshide = true;
    this.vn_check_pass = false;
    this.vn_pass_input_mode = 'password';

    if (this.blank) {
      this.uploadOrChange = 'Upload Pic';
    }

    else
      this.uploadOrChange = 'Change Pic';

    this.initAutocomplete();
    this.fileuploded = false;


    var profileimg = document.getElementById('profilephoto');



    /////////////////notification state
    this.notifi_length = 0;
    this.pushstate.getpushstate();

    this.messageNotification = this.pushstate.notification;
    for (let i = 0; i < this.messageNotification.length; i++)
      this.notifi_length += this.messageNotification[i].cnt;




    this.events.subscribe('pushstate', () => {
      this.messageNotification = this.pushstate.notification;
      this.notifi_length = 0;
      for (let i = 0; i < this.messageNotification.length; i++)
        this.notifi_length += this.messageNotification[i].cnt;

    })

    /////////////





    //this.menu.enable(true);
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
      this.clientData.location = res.subLocality + "," + res.locality + "," + res.administrativeArea + "," + res.countryName;
      this.userData.profile = JSON.stringify(this.clientData);
      this.userData.status = "changeprofile";
      this.userData.email = this.clientData.email;

      localStorage.setItem('clientData', JSON.stringify(this.clientData));

      this.user_provid.postAdminData(this.userData).then((result) => {
        if (Object(result).status == "success") {
          this.fireuserservice.updateprofile(this.clientData).then((res: any) => {
            if (res.success) {

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

          })
        } else {

          let toast = this.toastCtrl.create({
            message: "No Network",
            duration: 2000
          })
          toast.present();

        }
      }), (err) => {

        let toast = this.toastCtrl.create({
          message: "No Network",
          duration: 2000
        })
        toast.present();

      }
    })

  }
  ///////////////////////////////fetish set
  initfet() {
    this.myfet = this.clientData.fetish;

    this.fetishes = ["rubber", "Latex", "leather", "cbt", "pegs", "foot worship", "adult diaper", "choking", "Exhibitionism", "Voyeurism", "spanking", "cross dressing", "domination", "submission", "slaves", "role play", "age play", "bottom", "breath play", "cane/caning", "cupping", "edge play", "flogging", "golden showers", "fisting", "everything anal", "gerean", "hard limit", "impact play", "needle play", "medical play", "pony play", "furries", "shibari", "suspensio", "switch", "wax play", "blood play", "sadomasochist", "topdrop", "rough sex", "sensory play"]


    for (let i = 0; i < this.myfet.length; i++) {
      for (let j = 0; j < this.fetishes.length; j++)
        if (this.myfet[i] == this.fetishes[j]) {
          this.fetishes_state[j] = true;
          this.fet_state = true;

        }
      if (!this.fet_state)
        this.customfetishes.push(this.myfet[i]);
      this.fet_state = false;

    }
  }
  addfetish() {
    if (this.customfet != null && this.customfet != " ") {
      for (let i = 0; i < this.customfetishes.length; i++) {
        if (this.customfetishes[i] == this.customfet)
          this.new_cst_fet = true;
      }
      if (!this.new_cst_fet) this.customfetishes.push(this.customfet);
      this.new_cst_fet = false;
    }

  }
  select_cst_fet(i) {
    this.customfetishes.splice(i, 1);

  }
  selectfet(i) {
    this.fetishes_state[i] = !this.fetishes_state[i];
  }

  savefet() {
    this.return_fetishes = [];

    for (let i = 0; i < this.fetishes.length; i++)
      if (this.fetishes_state[i])
        this.return_fetishes.push(this.fetishes[i]);

    for (let i = 0; i < this.customfetishes.length; i++)
      this.return_fetishes.push(this.customfetishes[i])

    this.myfet = this.return_fetishes;


    this.fetishset = false;
    this.myprofilepage = true;
    this.fileuploadpage = false;
    this.filenouploadpage = false;
    this.lastSaveProfile(6)
  }

  //////////////
  addfet() {
    this.fetishset = true;
    this.myprofilepage = false;
    this.fileuploadpage = false;
    this.filenouploadpage = false;
    // this.navCtrl.setRoot(FetishmodalPage, {"fetish": this.clientData.fetish});
    // let modal = this.modalCtrl.create(FetishmodalPage, {"fetish": this.clientData.fetish});
    // modal.present();
    // this.editfet = !this.editfet;
    // if (!this.editfet)
    //   this.fetbuttonSpell = "Done"
    // else
    //   this.fetbuttonSpell = "Add a Fetish"
  }
  editBio() {
    this.change_state = true;
    let modal = this.modalCtrl.create(EditbiomodalPage, { "aboutme": this.aboutme });
    modal.present();

    modal.onDidDismiss(data => {
      this.aboutme = data.data;
    });

    // this.editbiotf = !this.editbiotf;
    // if (!this.editbiotf)
    //   this.buttonSpell = "Done"
    // else
    //   this.buttonSpell = "Edit Bio"
  }
  current_val_pass_showing() {

    // $('#eye-state').css('color', 'blue');
    // $('#eye-state').addClass("eye-class-show");
    // $('#eye-state').removeClass("eye-class-hide");

    if (this.current_eyeclasshide) {
      // $('#eye-state').addClass("eye-class-show");
      // $('#eye-state').removeClass("eye-class-hide");
      this.current_icon_color = 'dissable'
      this.current_pass_input_mode = 'text';
      this.current_eyeclasshide = !this.current_eyeclasshide;

    } else {
      // $('#eye-state').addClass("eye-class-hide");
      // $('#eye-state').removeClass("eye-class-show");

      this.current_icon_color = 'light'
      this.current_eyeclasshide = !this.current_eyeclasshide;
      this.current_pass_input_mode = 'password';
    }

  }
  current_pass_validate() {

    if (this.currentPssword == this.clientData.password) {
      this.current_check_pass = true;
    }
    else {
      this.current_check_pass = false;
    }
  }
  change_val_pass_showing() {

    // $('#eye-state').css('color', 'blue');
    // $('#eye-state').addClass("eye-class-show");
    // $('#eye-state').removeClass("eye-class-hide");

    if (this.change_eyeclasshide) {
      // $('#eye-state').addClass("eye-class-show");
      // $('#eye-state').removeClass("eye-class-hide");
      this.change_icon_color = 'dissable'
      this.change_pass_input_mode = 'text';
      this.change_eyeclasshide = !this.change_eyeclasshide;

    } else {
      // $('#eye-state').addClass("eye-class-hide");
      // $('#eye-state').removeClass("eye-class-show");

      this.change_icon_color = 'light'
      this.change_eyeclasshide = !this.change_eyeclasshide;
      this.change_pass_input_mode = 'password';
    }

  }
  change_pass_validate() {
    if (this.changePssword.length > 5) {
      this.change_check_pass = true;
    }
    else {
      this.change_check_pass = false;
    }
  }
  vn_val_pass_showing() {

    // $('#eye-state').css('color', 'blue');
    // $('#eye-state').addClass("eye-class-show");
    // $('#eye-state').removeClass("eye-class-hide");

    if (this.vn_eyeclasshide) {
      // $('#eye-state').addClass("eye-class-show");
      // $('#eye-state').removeClass("eye-class-hide");
      this.vn_icon_color = 'dissable'
      this.vn_pass_input_mode = 'text';
      this.vn_eyeclasshide = !this.vn_eyeclasshide;

    } else {
      // $('#eye-state').addClass("eye-class-hide");
      // $('#eye-state').removeClass("eye-class-show");

      this.vn_icon_color = 'light'
      this.vn_eyeclasshide = !this.vn_eyeclasshide;
      this.vn_pass_input_mode = 'password';
    }

  }
  vn_pass_validate() {

    if (this.vnPssword == this.changePssword && this.vnPssword != "") {
      this.vn_check_pass = true;
    }
    else {
      this.vn_check_pass = false;
    }
  }
  // /////////////////////////////////////////////////location autocomplete start
  initAutocomplete() {



    let that = this;
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);


    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();
      that.clientData.location = places[0].formatted_address;
      if (places.length == 0) {
        return;
      }
    });
  }

  // /////////////////////////////////////////////////location autocomplete end
  email_validate() {
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i

    if (!pattern.test(this.newemail)) {
      this.check_email = false;
    }
    else {
      this.check_email = true;
    }
  }
  profileShow() {
    this.clientData = JSON.parse(localStorage.getItem('clientData'));
    // 
    // this.clientData = {
    //   "aboutme" : "verry happy!!ud83eudd23",
    //   "ask" : false,
    //   "dom" : false,
    //   "email" : "sss@sss.com",
    //   "fetish" : [ "everything anal", "impact play", "pony play" ],
    //   "location" : "Ottawa, ON, Canada",
    //   "name" : "Mserciesr",
    //   "password" : "123456",
    //   "photoUrl":"assets/img/myprofilestarterblank.png",
    //   "sub" : false,
    //   "workUrl" : "http://fet.xxx/FET/profile_image/uploads/1514392510Mercier.jpg"
    // }
    // localStorage.setItem('clientData',JSON.stringify(this.clientData));
    
    // 
    if (this.clientData.photoUrl == '' || this.clientData.photoUrl == "assets/img/myprofilestarterblank.png") {
      this.clientData.photoUrl = "assets/img/myprofilestarterblank.png";
      this.blank = true;
    }
    else
      this.blank = false;

    this.initfet();


  }


  changedProfileSaveRequest() {
    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();


    this.clientData.aboutme = this.aboutme;
    this.clientData.dom = this.dom;
    this.clientData.sub = this.sub;
    this.clientData.ask = this.ask;
    this.clientData.fetish = this.myfet;
    this.clientData.name = this.name;


    let tempProfile = this.clientData;


    this.userData.status = "changeprofile";

    if (this.check_email)
      this.userData.new_email = this.newemail;
    else
      this.userData.new_email = "";

    if (this.vn_check_pass)
      this.userData.new_pass = this.vnPssword;
    else
      this.userData.new_pass = "";

    this.newemail = "";
    this.vnPssword = "";
    this.currentPssword = "";
    this.changePssword = "";


    this.userData.profile = JSON.stringify(tempProfile);

    this.userData.email = JSON.parse(localStorage.getItem('clientData')).email;
    this.change_state = false;
    this.user_provid.postAdminData(this.userData).then((result) => {
      if (Object(result).status == "success") {
        //////////////////////////////////////////////////fire pass update
        if (this.userData.new_pass != "") {
          this.fireuserservice.passwordupdate(this.userData.new_pass).then((result) => {
            if (Object(result).success) {

              let toast = this.toastCtrl.create({
                message: "Successe changed profile",
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
            let toast = this.toastCtrl.create({
              message: "No Network",
              duration: 2000
            })
            toast.present();


          });
        }
        ////////////////////////////////////////////////////fire email update
        if (this.userData.new_email != "") {
          this.fireuserservice.changeEmail(this.userData.new_email).then((res: any) => {
            if (res.success) {
              let toast = this.toastCtrl.create({
                message: "Successe changed email with  " + this.userData.new_email,
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
            let toast = this.toastCtrl.create({
              message: "No Network",
              duration: 2000
            })
            toast.present();

          });
        }
        ////////////////////////////////////////////////////set local data
        this.clientData = JSON.parse(Object(result).profile);
        localStorage.setItem('clientData', JSON.stringify(this.clientData));
        /////////////////////////////////////fire profile
        this.fireuserservice.updateprofile(this.clientData).then((res: any) => {
          if (res.success) {


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
        //////////////////////////////////////

        loading.dismiss();



      } else {
        let toast = this.toastCtrl.create({
          message: Object(result).detail,
          duration: 2000
        })
        toast.present();
        loading.dismiss();
      }
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "No Network",
        duration: 2000
      })
      toast.present();
      loading.dismiss();

    });

  }
  sendRequestChangeemail() {

    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();


    this.userData.email = JSON.parse(localStorage.getItem('clientData')).email;
    let tempdata = JSON.parse(localStorage.getItem('clientData'));
    tempdata.email = this.newemail;
    this.userData.status = "changeemail";
    this.userData.new_email = this.newemail;
    this.userData.profile = JSON.stringify(tempdata);

    this.user_provid.postAdminData(this.userData).then((result) => {


      if (Object(result).status == "success") {/////////////////////////here


        this.fireuserservice.changeEmail(this.newemail).then((res: any) => {

          if (res.success) {
            localStorage.setItem('clientData', JSON.stringify(tempdata));
            loading.dismiss();
            let toast = this.toastCtrl.create({
              message: "Successe changed with  " + this.newemail,
              duration: 4000
            })
            toast.present();

          } else {
            let toast = this.toastCtrl.create({
              message: "No Network",
              duration: 2000
            })
            toast.present();
            loading.dismiss();
          }
        }, (err) => {
          let toast = this.toastCtrl.create({
            message: "No Network",
            duration: 2000
          })
          toast.present();
          loading.dismiss();

        });



      } else {
        let toast = this.toastCtrl.create({
          message: Object(result).detail,
          duration: 2000
        })
        toast.present();
        loading.dismiss();

      };
    }, (err) => {

      let toast = this.toastCtrl.create({
        message: "No Network",
        duration: 2000
      })
      toast.present();
      loading.dismiss();

    });
  }
  // chooseimage(){
  //   this.imgservice.uploadimage().then((uploadedurl:any) => {
  //     this.zone.run(() => {
  //       this.imgurl = uploadedurl;
  //       this.moveon = false;
  //     })
  //   })
  // }
  // updateprocceed() {
  //   this.fireuserservice.updateimage(this.imgurl).then((res:any) => {
  //     if(res.success) {
  //       this.navCtrl.push(UploadNoPicPage);
  //     }
  //     else {
  //       alert(res);
  //     }
  //   })
  // }
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
            //console.log('the user has cancelled the interaction.');
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

      this.clientData.photoUrl = imageData;
      this.fileUrl = imageData;
      if (imageData) this.uploadPhoto();
    }, (err) => {
      // Handle error
      // console.log("Camera pic error::" + err);
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
        fileName: "" + this.clientData.name.replace(" ", "") + ".jpg",
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
      this.fileTransfer.upload(this.fileUrl, 'http://spankrr.com/FET/profile_image/index.php', options).then((entry) => {


        this.clientData.photoUrl = JSON.parse(entry.response).photoUrl;
        if (this.clientData.workUrl != null && this.clientData.workUrl != '')
          this.clientData.workUrl = this.clientData.photoUrl;

        localStorage.setItem('clientData', JSON.stringify(this.clientData));


        this.blank = false;
        this.uploadOrChange = 'Change Pic';
        this.myprofilepage = false;
        this.fileuploadpage = true;
        this.filenouploadpage = false;

        this.change_state = true;
        loading.dismiss();



        // this.userData.email = this.clientData.email;
        // let tempProfile = this.clientData;
        // this.userData.status = "changeprofile";
        // this.userData.profile = JSON.stringify(tempProfile);
        // this.userData.email = JSON.parse(localStorage.getItem('clientData')).email;

        // localStorage.setItem('clientData', JSON.stringify(tempProfile));

        // this.user_provid.postAdminData(this.userData).then((result) => {
        //   if (Object(result).status == "success") {
        //     this.fireuserservice.updateprofile(this.clientData).then((res: any) => {
        //       if (res.success) {
        //         loading.dismiss();
        //       } else {
        //         loading.dismiss();
        //         let toast = this.toastCtrl.create({
        //           message: "No Network",
        //           duration: 2000
        //         })
        //         toast.present();

        //       }
        //     }, (err) => {
        //       loading.dismiss();
        //       let toast = this.toastCtrl.create({
        //         message: "No Network",
        //         duration: 2000
        //       })
        //       toast.present();

        //     })
        //   } else {
        //     loading.dismiss();
        //     let toast = this.toastCtrl.create({
        //       message: "No Network",
        //       duration: 2000
        //     })
        //     toast.present();

        //   }
        // }), (err) => {
        //   loading.dismiss();
        //   let toast = this.toastCtrl.create({
        //     message: "No Network",
        //     duration: 2000
        //   })
        //   toast.present();

        // }
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



  changePicGo() {
    if (this.blank) {
      this.myprofilepage = false;
      this.fileuploadpage = false;
      this.filenouploadpage = true;
    }
    else {
      this.myprofilepage = false;
      this.fileuploadpage = true;
      this.filenouploadpage = false;

    }



  }
  domainClick() {
    this.dom = !this.dom;
    this.change_state = true;
  }

  subClick() {
    this.sub = !this.sub;
    this.change_state = true;
  }

  askClick() {
    this.ask = !this.ask;
    this.change_state = true;
  }

  profileSaveGo() {
    // this.changedProfileSaveRequest();
    this.myprofilepage = true;
    this.fileuploadpage = false;
    this.filenouploadpage = false;




  }
  profileUnSaveGo() {

    this.myprofilepage = true;
    this.fileuploadpage = false;
    this.filenouploadpage = false;

  }

  lastSaveProfile(pagenum) {

    let loading = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loading.present();
    this.clientData.aboutme = this.aboutme;
    this.clientData.dom = this.dom;
    this.clientData.sub = this.sub;
    this.clientData.ask = this.ask;
    this.clientData.fetish = this.myfet;
    this.clientData.name = this.name;

    this.userData.email = this.clientData.email;
    let tempProfile = this.clientData;
    this.userData.status = "changeprofile";

    this.userData.profile = JSON.stringify(tempProfile);
    this.userData.email = JSON.parse(localStorage.getItem('clientData')).email;

    localStorage.setItem('clientData', JSON.stringify(tempProfile));

    this.user_provid.postAdminData(this.userData).then((result) => {
      if (Object(result).status == "success") {
        this.fireuserservice.updateprofile(this.clientData).then((res: any) => {
          if (res) {

            loading.dismiss();

            switch (pagenum) {
              case 1: {
                this.navCtrl.setRoot(MeetKinkStersPage);
                break;
              }
              case 2: {
                this.navCtrl.setRoot(MessagesPage);
                break;
              }
              case 3: {
                this.navCtrl.setRoot(DungeonFinderWalkthorughPage);
                break;
              }
              case 4: {
                this.navCtrl.setRoot(MenuSidePage);
                break;
              }
              case 5: {
                this.navCtrl.setRoot(GroupsPage);
                break;
              }
              case 6: {
                this.fetToString()
                break;
              }
            }

          } else
            loading.dismiss();

        }), ((err) => {
          loading.dismiss();

        })
      } else
        loading.dismiss();

    }), ((err) => {
      loading.dismiss();
    })

  }
  /////////name edit
  changenamestate() {

    this.change_state = true;
    this.name_eit_state = true;


  }
  tick() {
    if (this.inputname != '' && this.inputname != null) this.name = this.inputname;
    this.name_eit_state = false;
    this.inputname = ''

  }
  randNameProduct() {

    this.inputname = this.name_set[Math.floor(Math.random() * this.name_set.length)];
  }

  ///////////////
  goMeetKinkSters() {
    if (this.change_state)
      this.lastSaveProfile(1);
    else
      this.navCtrl.setRoot(MeetKinkStersPage);


  }
  goMessages() {
    if (this.change_state)
      this.lastSaveProfile(2);
    else
      this.navCtrl.setRoot(MessagesPage);


  }
  goDungeonFinderWalkthorugh() {
    if (this.change_state)
      this.lastSaveProfile(3);
    else
      this.navCtrl.setRoot(DungeonFinderWalkthorughPage);


  }
  goMenuSide() {
    if (this.change_state)
      this.lastSaveProfile(4);
    else
      this.navCtrl.setRoot(MenuSidePage);


  }
  goGroups() {
    if (this.change_state)
      this.lastSaveProfile(5);
    else
      this.navCtrl.setRoot(GroupsPage);


  }

  goCropping() {
    this.change_state = true;
    let modal = this.modalCtrl.create(CroppingPage);
    modal.present();

    modal.onDidDismiss(data => {
      this.clientData = JSON.parse(localStorage.getItem('clientData'));
      if ((this.clientData.workUrl != null) && (this.clientData.workUrl != ''))
        this.croppedstate = true;


    });
  }


}
