import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { MyProfilePage } from '../my-profile/my-profile';
import { SignUpEPage } from '../sign-up-e/sign-up-e';
import { FirstproviderProvider } from '../../providers/firstprovider/firstprovider';
import { FireauthProvider } from '../../providers/fireauth/fireauth';

import { usercreds } from '../../models/interface/usercreds'
import { Storage } from '@ionic/storage';



/**
 * Generated class for the SignEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-email',
  templateUrl: 'sign-email.html',


})
export class SignEmailPage {
  credential = {} as usercreds;
  userData = { "status": "", "email": "", "new_pass": "" };
  password: any;
  emailinput: any;
  check_email: boolean;
  check_pass: boolean;
  pass_input_mode: string;
  eyeclasshide: boolean;
  incorrect_state: boolean;
  check_remember: boolean;
  wrongtext: string;


  public icon_color: any;
  constructor(public authservice: FireauthProvider, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public user_provid: FirstproviderProvider, public toastCtrl: ToastController, public storage: Storage, public alertCtrl: AlertController) {
    this.check_email = false;
    this.check_pass = false;
    this.pass_input_mode = 'password';
    this.eyeclasshide = true;
    this.icon_color = 'light';
    this.incorrect_state = false;
    this.check_remember = false;



  }
  // connectServer() {

  //   let loading = this.loadingCtrl.create({
  //     content: "Please Wait..."
  //   });
  //   loading.present();
  //   let status = "login";
  //   this.userData.status = status;
  //   this.userData.email = this.emailinput;
  //   this.userData.password = this.password;

  //   this.user_provid.postAdminData(this.userData).then((result) => {
  //     loading.dismiss();

  //     if (Object(result).status == "success") {


  //       if (this.check_remember) {
  //         this.storage.set('email', this.emailinput);
  //         this.storage.set('password', this.password);
  //         this.storage.set('enable', this.check_remember);

  //       } else {
  //         let enable: false;
  //         this.storage.clear();
  //         this.storage.set('enable', enable);
  //       }
  //       this.SignInFE();
  //       this.navCtrl.setRoot(MyProfilePage);

  //     } else {
  //       // let toast = this.toastCtrl.create({
  //       //   message:"Invalid Username or Password",
  //       //   duration:2000
  //       // })
  //       // toast.present();
  //       this.incorrect_state = true;
  //       // this.navCtrl.push(SignInEIncorrectPage);

  //     };
  //   }, (err) => {
  //     let toast = this.toastCtrl.create({
  //       message: "No Network",
  //       duration: 2000
  //     })
  //     toast.present();
  //     loading.dismiss();
  //   });

  // }
  ionViewDidLoad() {
    this.storage.get('enable').then((val) => {
      if (val) {
        this.storage.get('email').then((val) => {
          this.emailinput = val;
        });
        this.storage.get('password').then((val) => {
          this.password = val;

        });
        this.check_remember = val;
        this.navCtrl.setRoot(MyProfilePage);
      }
    });

  }
  email_validate() {
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i

    if (!pattern.test(this.emailinput)) {
      this.check_email = false;
    }
    else {
      this.check_email = true;
    }
  }
  pass_validate() {
    if (this.password.length > 5) {
      this.check_pass = true;
    }
    else {
      this.check_pass = false;
    }
  }
  val_pass_showing() {

    // $('#eye-state').css('color', 'blue');
    // $('#eye-state').addClass("eye-class-show");
    // $('#eye-state').removeClass("eye-class-hide");

    if (this.eyeclasshide) {
      // $('#eye-state').addClass("eye-class-show");
      // $('#eye-state').removeClass("eye-class-hide");
      this.icon_color = 'dissable'
      this.pass_input_mode = 'text';
      this.eyeclasshide = !this.eyeclasshide;

    } else {
      // $('#eye-state').addClass("eye-class-hide");
      // $('#eye-state').removeClass("eye-class-show");

      this.icon_color = 'light'
      this.eyeclasshide = !this.eyeclasshide;
      this.pass_input_mode = 'password';
    }

  }

  // SignInF(){
  //   let provider = new firebase.auth.FacebookAuthProvider();

  //   firebase.auth().signInWithRedirect(provider).then(()=>{
  //     firebase.auth().getRedirectResult().then((result)=>{
  //       alert(JSON.stringify(result));
  //       this.navCtrl.push(MyProfilePage);
  //     }).catch(function(error){
  //       alert(JSON.stringify(error))
  //     });
  //   })


  // }
  SignInFE() {
    if (this.check_email && this.check_pass) {
      let loading = this.loadingCtrl.create({
        content: "Please Wait..."
      });
      loading.present();
      this.credential.email = this.emailinput;
      this.credential.password = this.password;
      this.authservice.login(this.credential).then((res: any) => {
        if (res[0]) {

          this.userData.email = this.emailinput;
          this.userData.status = "create_new_password";
          this.userData.new_pass = this.password;
          this.user_provid.postAdminData(this.userData).then((result) => {//new create pass in server
            loading.dismiss();

            if (Object(result).status == "success") {/////////////////////////here

              console.log(Object(result).user);
              localStorage.setItem('clientData', Object(result).user);
              // console.log(localStorage.getItem('clientData'));
              if (this.check_remember) {
                this.storage.set('email', this.emailinput);
                this.storage.set('password', this.password);
                this.storage.set('enable', this.check_remember);

              } else {
                let enable: false;
                this.storage.clear();
                this.storage.set('enable', enable);
              }
              this.navCtrl.setRoot(MyProfilePage);


            } else {
              this.incorrect_state = true;
              this.wrongtext = "Your email isn’t registered in our database";

            };
          }, (err) => {

            let toast = this.toastCtrl.create({
              message: "No Network",
              duration: 2000
            })
            toast.present();
            loading.dismiss();

          });

        } else {
          console.log(res);

          this.incorrect_state = true;
          this.wrongtext = res[1].message;

          loading.dismiss();
        }
      }, (err) => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: "No Network",
          duration: 2000
        })
        toast.present();
        loading.dismiss();
      });

    }
    else {
      let toast = this.toastCtrl.create({
        message: "Invalid Username or Password",
        duration: 2000
      })
      toast.present();
    }
  }

  // SignInE() {
  //   if (this.check_email && this.check_pass)
  //     this.connectServer();
  //   else {
  //     let toast = this.toastCtrl.create({
  //       message: "Invalid Username or Password",
  //       duration: 2000
  //     })
  //     toast.present();
  //   }

  // }
  SignUpE() {
    this.navCtrl.push(SignUpEPage);

  }

  shownewcreatepass() {
    let createnewpass = this.alertCtrl.create({
      title: 'Change password',
      message: "Create new password",
      inputs: [
        {
          name: 'new_password',
          placeholder: 'new password',
          type: 'password'



        },
        {
          name: 'confirm_password',
          placeholder: 'confirm password',
          type: 'password'

        }
      ],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            if ((data.new_password != data.confirm_password) || (data.new_password.length < 5)) {

              let toast = this.toastCtrl.create({
                message: "confirm incorrect or over 5 letter. Try again",
                duration: 2000
              })
              toast.present();
              this.shownewcreatepass();


            } else {
              let createnewpass_data_post = { "new_password": "", "email": "", "status": "" };
              createnewpass_data_post.new_password = data.new_password;
              createnewpass_data_post.email = this.emailinput;
              let status = "create_new_password";
              createnewpass_data_post.status = status;
              let loading = this.loadingCtrl.create({
                content: "Please Wait..."
              });
              loading.present();

              this.user_provid.postAdminData(createnewpass_data_post).then((result) => {
                loading.dismiss();

                if (Object(result).status == "success") {


                  console.log("enter server");
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
                loading.dismiss();
              });



            }



          }
        }
      ]

    });

    createnewpass.present();
  }

  ForgotPassFire() {

    if (this.check_email) {

      let loading = this.loadingCtrl.create({
        content: "Please Wait..."
      });
      loading.present();
      this.authservice.passwordreset(this.emailinput).then((res: any) => {
        loading.dismiss();
        if (res.success) {
          let toast = this.toastCtrl.create({
            message: "Email sent successed",
            duration: 2000
          })
          toast.present();

        } else {
          let toast = this.toastCtrl.create({
            message: "You are not registered",
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
        loading.dismiss();

      });

    } else {


      let toast = this.toastCtrl.create({
        message: "please insert email correctly",
        duration: 2000
      })
      toast.present();
    }
  }



  ForgotPass() {
    if (this.check_email) {
      let forgot_post = { "email": "", "status": "" };
      forgot_post.email = this.emailinput;
      let status = "forgot_password";
      forgot_post.status = status;
      let loading = this.loadingCtrl.create({
        content: "Please Wait..."
      });
      loading.present();

      this.user_provid.postAdminData(forgot_post).then((result) => {
        loading.dismiss();

        if (Object(result).status == "success") {

          this.showPrompt();
          console.log("enter server");

        } else {
          // let toast = this.toastCtrl.create({
          //   message:"Invalid Username or Password",
          //   duration:2000
          // })
          // toast.present();
          //this.incorrect_state = true;
          // this.navCtrl.push(SignInEIncorrectPage);
          let toast = this.toastCtrl.create({
            message: "You are not registered",
            duration: 2000
          })
          toast.present();


        };
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
        message: "please insert email correctly",
        duration: 2000
      })
      toast.present();
    }

  }
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Confirm',
      message: "Enter confirm code",
      inputs: [
        {
          name: 'code',
          placeholder: 'Confirm code'

        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            console.log(data.code);
            let confirm_data_post = { "confirm_code": "", "email": "", "status": "" };
            confirm_data_post.confirm_code = data.code.trim();
            confirm_data_post.email = this.emailinput;
            let status = "confirm_code";
            confirm_data_post.status = status;
            let loading = this.loadingCtrl.create({
              content: "Please Wait..."
            });
            loading.present();

            this.user_provid.postAdminData(confirm_data_post).then((result) => {
              loading.dismiss();

              if (Object(result).status == "success") {


                this.shownewcreatepass();
                console.log("enter server");

              } else {
                // let toast = this.toastCtrl.create({
                //   message:"Invalid Username or Password",
                //   duration:2000
                // })
                // toast.present();
                //this.incorrect_state = true;
                // this.navCtrl.push(SignInEIncorrectPage);
                let toast = this.toastCtrl.create({
                  message: "Code is error. Try again",
                  duration: 2000
                })
                toast.present();


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
        }
      ]
    });
    prompt.present();
  }


}
