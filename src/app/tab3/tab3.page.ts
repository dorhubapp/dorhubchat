/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { IMAGE, USER } from '../services/rest.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, AfterViewInit{
  @ViewChild('imageCanvas', { static: false }) canvas: any;
  canvasElement: any;
  saveX: number;
  saveY: number;

  profilePhoto: any;

  photo: any;
  username: string;
  status: string;
  aboutMe: string;
  age: any;
  education: any;
  drawing = false;
  imgUrl: string;
  imgSrc = './assets/templates/';
  // templates: any = [{ src: '4.png' }, { src: '2.png' }];
  templates: any = [{ src: '1.png' }, { src: '3.png' }, { src: '2.png' }, { src: '4.png' }];

  constructor(
    private plt: Platform,
    private modalCtrl: ModalController,
    private alertServ: AlertService,
    private storageServ: StorageService,
    private activedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.photo = this.navParam.get('photo');
    // this.username = this.navParam.get('username');
    // this.status = this.navParam.get('status');
    this.imgUrl = IMAGE;
    this.storageServ.get(USER).then((res) => {
      console.log(res);
      this.photo = 'big_tgzhVdawWkoNLtMLOXPv.jpg';
      this.username = res.username;
      this.age = 30 + 'yrs';
      this.education = 'Undergraduate';
      this.status = 'I am who God says I am';
      this.aboutMe = 'npm WARN @capacitor/storage@0.3.7 requires a peer of @capacitor/core@3.0.0-rc.1 but none is installed.';
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.canvasElement = this.canvas.nativeElement;
      this.canvasElement.width = 500;
      this.canvasElement.height = 500;

    //   const defaultTemplate = new Image();
    //   this.profilePhoto = new Image();
    //   defaultTemplate.src = this.imgSrc + this.templates[0].src;
    //   this.profilePhoto.src = this.imgUrl + this.photo;
    //   const ctx = this.canvasElement.getContext('2d');

    //   this.profilePhoto.onload = () => {
    //     console.log(this.profilePhoto.naturalHeight, this.profilePhoto.naturalWidth);
    //     this.positionIOSContent(ctx, defaultTemplate, this.profilePhoto);
    //   };
    const shareProfileArray = [];
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = 500;
    this.canvasElement.height = 500;
    this.templates.forEach(element => {
      console.log(element.src);
      const templateImage = new Image();
      this.profilePhoto = new Image();
      templateImage.src = this.imgSrc + element.src;
      this.profilePhoto.src = this.imgUrl + this.photo;
      const ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      console.log(templateImage, this.profilePhoto);

      this.profilePhoto.onload = () => {
        if (element.src == '1.png' && element.src == '3.png') {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          // this.positionIOSContent(ctx, element.src, this.profilePhoto);
          ctx.drawImage(this.profilePhoto, 45, 110, 160, 160);
          ctx.drawImage(templateImage, 0, 0, this.canvasElement.width, this.canvasElement.height);
          ctx.font = '10px Ariel';
          ctx.fillStyle = '#19abff';
          ctx.fillText(this.username, 64, 278);

          ctx.font = '8px Ariel';
          ctx.fillStyle = '#000000';
          ctx.fillText(this.education, 64, 290);

          ctx.font = '8px Ariel';
          ctx.fillStyle = '#000000';
          ctx.fillText(this.status, 64, 340);
        } else {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.drawImage(this.profilePhoto, 45, 82, 160, 160);
          ctx.drawImage(templateImage, 0, 0, this.canvasElement.width, this.canvasElement.height);
          ctx.font = '12px Ariel';
          ctx.fillStyle = '#19abff';
          ctx.fillText(this.username, 60, 246);

          ctx.font = '8px Ariel';
          ctx.fillStyle = '#000000';
          ctx.fillText(this.education, 60, 258);

          ctx.font = '8px Ariel';
          ctx.fillStyle = '#000000';
          ctx.fillText(this.status, 60, 310);

          this.wrapText(this.aboutMe, 60, 335, 150, '8px', 'Ariel', ctx);
        }
      };
    });
    }, 300);

  }

  wrapText(text, x, y, maxWidth, fontSize, fontFace, ctx){
    const firstY = y;
    const words = text.split(' ');
    let line = '';
    const lineHeight = 10;

    ctx.font=fontSize+' '+fontFace;
    ctx.textBaseline='top';

    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if(testWidth > maxWidth) {
        ctx.fillText(line, x, y);
        if(n<words.length-1){
            line = words[n] + ' ';
            y += lineHeight;
        }
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  generateSharePhoto() {
    const shareProfileArray = [];
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = 500;
    this.canvasElement.height = 500;
    this.templates.forEach(element => {
      console.log(element.src);
      const templateImage = new Image();
      this.profilePhoto = new Image();
      templateImage.src = this.imgSrc + element.src;
      this.profilePhoto.src = this.imgUrl + this.photo;
      const ctx = this.canvasElement.getContext('2d');

      templateImage.onload = () => {
        if (element.src === '1.png' && element.src === '3.png') {
          this.positionIOSContent(ctx, element.src, this.profilePhoto);
        } else {
          this.positionAndroidContent(ctx, element.src, this.profilePhoto);
        }
      };
    });
  }

  positionIOSContent(ctx, img, profilePhoto) {
    ctx.drawImage(profilePhoto, 45, 110, 160, 160);
    ctx.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
    ctx.font = '10px Ariel';
    ctx.fillStyle = '#19abff';
    ctx.fillText(this.username, 64, 278);

    ctx.font = '8px Ariel';
    ctx.fillStyle = '#000000';
    ctx.fillText(this.education, 64, 290);

    ctx.font = '8px Ariel';
    ctx.fillStyle = '#000000';
    ctx.fillText(this.status, 64, 340);
  }

  positionAndroidContent(ctx, img, profilePhoto) {
    ctx.drawImage(profilePhoto, 45, 82, 160, 160);
    ctx.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
    ctx.font = '12px Ariel';
    ctx.fillStyle = '#19abff';
    ctx.fillText(this.username, 60, 246);

    ctx.font = '8px Ariel';
    ctx.fillStyle = '#000000';
    ctx.fillText(this.education, 60, 258);

    ctx.font = '8px Ariel';
    ctx.fillStyle = '#000000';
    ctx.fillText(this.status, 60, 310);

    this.wrapText(this.aboutMe, 60, 335, 150, '8px', 'Ariel', ctx);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  setBackground(img) {
    const background = new Image();
    background.src = this.imgSrc + img;
    const ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    background.onload = () => {
      ctx.drawImage(this.profilePhoto, 45, 110, 160, 160);
      ctx.drawImage(background,0,0, this.canvasElement.width, this.canvasElement.height);
      ctx.font = '10px Ariel';
      ctx.fillStyle = '#19abff';
      ctx.fillText(this.username, 64, 278);

      ctx.font = '8px Ariel';
      ctx.fillStyle = '#000000';
      ctx.fillText(this.education, 64, 290);

      ctx.font = '8px Ariel';
      ctx.fillStyle = '#000000';
      ctx.fillText(this.status, 64, 340);
    };
  }

  async exportCanvasImage() {
    const dataUrl = this.canvasElement.toDataURL();

    // var data = dataUrl.split(',')[1];
    // let blob = this.b64toBlob(data, 'image/png');

    // var a = window.document.createElement('a');
    // a.href = window.URL.createObjectURL(blob);

    const ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const message = this.status;
    const subject = this.username;
    const file = dataUrl;
    console.log(message,subject,file);
    // await Share.share({
    //   title: subject,
    //   text: message,
    //   url: file,
    // });
// return
    if (this.plt.is('cordova')) {
      // const options: Base64ToGalleryOptions = { prefix: 'canvas_', mediaScanner:  true };

      // this.base64ToGallery.base64ToGallery(dataUrl, options).then(
      //   async res => {
      //     this.toastServ.presentToast('Image saved to camera roll.', 'top', 2000);
      //   },
      //   err => console.log('Error saving image to gallery ', err)
      // );
    } else {
      // Fallback for Desktop
      const data = dataUrl.split(',')[1];
      const blob = this.b64toBlob(data, 'image/png');

      const a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'profileSharing.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
