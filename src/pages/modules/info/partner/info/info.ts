import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';

import { PartnerinfoProvider } from '../../../../../providers/partnerinfo-provider';

import {BasePage} from '../../../../../providers/base/base-page';

declare var window;

@IonicPage()
@Component({
  selector: 'page-partner-info',
  templateUrl: 'info.html',
})
export class PartnerInfoPage extends BasePage {
  public info: any = {};
  constructor(public partner: PartnerinfoProvider, private toastCtrl: ToastController) {
      super();
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
