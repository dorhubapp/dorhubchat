import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alert: AlertController) { }

  async requestAlert(msg: any, title: any = '', btn1: string = 'Cancel', btn2: string = 'Okay', input: any = []) {
    let choice;
    const alert = await this.alert.create({
      header: title,
      message: msg,
      mode: 'ios',
      inputs: input,
      buttons: [
        {
          text: btn1,
          role: 'cancel'
        },
        {
          text: btn2,
          role: 'ok'
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss().then(data => {
      choice = data;
    });
    return choice;
  }

  async confirmAlert(msg: any, title: any = '', buttons: any = [], input: any = [], dismiss: boolean = true) {
    let choice;
    const alert = await this.alert.create({
      header: title,
      message: msg,
      mode: 'ios',
      inputs: input,
      buttons,
      backdropDismiss: dismiss
    });

    await alert.present();
    await alert.onDidDismiss().then(data => {
      choice = data;
    });
    return choice;
  }
}
