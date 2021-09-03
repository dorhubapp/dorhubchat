import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  localData: any;
  profileEdit: any;
  previewCropper = false;
  loading: any;
  socket: any;
  profilePhotos: any;
  pictures: any = { src: '', photo_id: '' };
  photos: any;
  photo: any;
  imgUrl: string;
  photoPreview: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  selectedPicture: any;
  ishidden = false;
  @ViewChild(ImageCropperComponent, { static: false }) angularCropper: ImageCropperComponent;

  constructor(
    public loadingCtrl: LoadingController,
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    public router: Router,
    private storageServ: StorageService,
    private sanitizer: DomSanitizer
  ) {
  }

  async ngOnInit() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'lines-small',
      mode: 'ios',
      animated: true,
      translucent: true,
      backdropDismiss: true
    });
    this.storageServ.getPayload().then((res) => {
      this.loadProfilePictures(res._id);
    });
    this.imgUrl = environment.UPLOADS + '/profile/';


    this.storageServ.get(OtherLocalStorage.PROFILE_EDIT).then(res => {
      this.profileEdit = res;
      console.log('from storage: ',this.profileEdit);

    });
  }

  async loadProfilePictures(userId) {
    this.authServ.getUserById(userId).subscribe((res) => {
      this.localData = res.data;
      this.profilePhotos = res.data.profile_photos;
      this.contentLoaded = true;
    }, err => console.error(err));
  }

  async takePicture(collection) {
    const image = await Camera.getPhoto({
      quality: 75,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      saveToGallery: true,
    });
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      image && image.dataUrl
    );
    this.selectedPicture = collection;
    this.previewPhoto(this.photo);
  }

  previewPhoto(photo) {
    this.photoPreview = photo.changingThisBreaksApplicationSecurity;
  }

  clearPreview() {
    this.angularCropper.imageBase64 = null;
    this.croppedImage = null;
    this.photo = null;
    this.ishidden = true;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }

  async uploadPicture() {
    const imgData = {
      id: this.selectedPicture.id,
      user_id: this.localData._id,
      education: this.localData.educations ? this.localData.educations.education_id._id : '60009740d3041302a4c64dcf',
      base64: this.croppedImage,
      status: 1
    };
    console.log(imgData);
    // return
    const data = {
      collection: imgData,
      collections: JSON.stringify(this.profilePhotos)
    };
    this.loading.present();
    this.authServ.uploadProfilePhoto(data).subscribe(
      (res: any) => {
        this.clearPreview();
        console.log(res);
        if (res.status === 'success') {
          Storage.set({ key: TOKEN_KEY, value: res.token });
          if (this.localData.profile_completed !== 0) {
            this.setFeed(res.profile_photo, 'Added a new photo');
          }
          this.loading.dismiss().then(() => {
            this.authServ.refreshProfilePhoto.next(true);
            this.socket.emit('refresh', {});
          });
        }
      },(err) => {
        this.loading.dismiss();
        console.error(err);
      });
  }

  async setProfilePicture(imgSrc) {
    if (imgSrc === 'default.jpg') {return;}
    const images = {
      profile_photo: imgSrc.substr(imgSrc.lastIndexOf('/') + 1),
      user_id: this.localData._id,
      education: this.localData.educations ? this.localData.educations.education_id._id : '60009740d3041302a4c64dcf',
      aboutMe: this.localData.profile_text_about ? this.localData.profile_text_about : 'No information about me yet.'
    };
    this.authServ.setProfilePhoto(images).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status === 'success') {
          _.remove(this.profileEdit, { profile_photo: this.profileEdit.profile_photo });
          this.profileEdit.profile_photo = images.profile_photo;
          this.storageServ.store(OtherLocalStorage.PROFILE_EDIT, this.profileEdit);
          if (this.localData.profile_completed !== 0) {
            this.setFeed(images.profile_photo, 'Changed profile photo');
          }
          this.authServ.refreshProfilePhoto.next(true);
          this.navCtrl.navigateRoot('/tabs/profile');
        }
      },
      (err) => console.error(err));
  }

  async setFeed(img, feed) {
    const credentials = {
      image: img,
      user_id: this.localData._id,
      feed: '',
      type: feed,
    };
    this.profileServ.addFeed(credentials).subscribe((res: any) => {
      if (res.status === 'success') {
        this.socket.emit('refresh', {});
      }
    },(err) => console.error(err));
  }

}
