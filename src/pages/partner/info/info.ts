import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';

import { GlobalProvider } from '../../../providers/core/global-provider';
import { PartnerinfoProvider } from '../../../providers/partnerinfo-provider';

declare var window;

@IonicPage()
@Component({
  selector: 'page-partner-info',
  templateUrl: 'info.html',
})
export class PartnerInfoPage {
  public info: any = {};
  constructor(private partner: PartnerinfoProvider, private globalProvider: GlobalProvider, private toastCtrl: ToastController) {    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PartnerGeneral');
  }


  call(value) {
    window.location = "tel:" + value;
  }

  sendMail(value) {
    window.location = "mailto:" + value;
  }

  openWeb(value) {
    let toast = this
        .toastCtrl
        .create({message: "Funkcionalnost je u izradi", duration: 3000, position: 'bottom'});

    toast.present();
  }
}
