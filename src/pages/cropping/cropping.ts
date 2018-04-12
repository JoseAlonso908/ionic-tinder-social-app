import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

/**
 * Generated class for the CroppingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cropping',
  templateUrl: 'cropping.html',
})
export class CroppingPage {
  @ViewChild('cropper') ImageCropper: ImageCropperComponent;
  public cropperSettings;

  public croppedWidth: Number;

  public croppedHeight: Number;
  public data: any;
  public canSave: boolean = false;

  clientData;

  constructor(public navCtrl: NavController) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.cropOnResize = true;
    this.cropperSettings.keepAspect = true;
    this.cropperSettings.croppedHeight = 300;
    this.cropperSettings.croppedWidth = 300;





    this.data = {};

    this.clientData = JSON.parse(localStorage.getItem('clientData'));


  }

  ionViewDidLoad() {
    if (this.clientData.workUrl == null || this.clientData.workUrl == '') {
      this.clientData.workUrl = this.clientData.photoUrl;
    }

    setTimeout(() => {
      this.selectImage();
    }, 1000);


  }



  handleCropping(bounds: Bounds) {

    this.croppedHeight = (bounds.bottom - bounds.top);
    this.croppedWidth = (bounds.right - bounds.left);
    this.canSave = true;
  }

  selectImage() {
    // this.canSave = false;
    let image: any = new Image();
    let data = this.clientData.workUrl;
    // setTimeout(() => {
    alert(this.clientData.workUrl);
    image.src = data;


    // let bounds: Bounds
    // bounds.bottom = 300;
    // bounds.top = 30;
    // bounds.left = 0;
    // bounds.right = 300;
    // Assign the Image object to the ImageCropper component

      this.ImageCropper.setImage(image);

    
    // }, 1000);

  }


  saveImage() {
    console.dir(this.data.image);
    this.clientData.photoUrl = this.data.image;
    localStorage.setItem('clientData', JSON.stringify(this.clientData));
    this.navCtrl.pop();
  }
}
