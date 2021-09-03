/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IMAGE, RestService, USER } from 'src/app/services/rest.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
})
export class PersonPage implements OnInit {
  person: any;
  userId: any;
  imgUrl: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private rest: RestService,
    private toastCtrl: ToastController,
    private router: Router,
    private storageServ: StorageService
  ) {}

  ngOnInit() {
    this.person = JSON.parse(this.activeRoute.snapshot.paramMap.get('person'));
    this.imgUrl = IMAGE;
    this.storageServ.get(USER).then((res) => {
      this.userId = res._id;
    });
  }

  async presentToast(
    title: string = '',
    duration: number = 2000,
    position: any = 'top'
  ) {
    const toast = await this.toastCtrl.create({
      message: title,
      duration,
      position,
    });
    toast.present();
  }

  request(user) {
    user.chat_list.forEach(elem => {
      if (elem.message_id.sender === this.userId || elem.message_id.receiver === this.userId) {
        this.router.navigateByUrl('/tabs/chats');
      }
    });
    const details = {
      senderId: this.userId,
      receiverId: user._id,
      requestStatus: 0,
      body: 'Chat Request',
    };
    const params = `messages/chat/${details.senderId}/${details.receiverId}`;
    this.rest.create(params, details).subscribe(
      (res) => {
        this.router.navigateByUrl('/tabs/chats');
      },
      (err) => console.error(err)
    );
  }
}
