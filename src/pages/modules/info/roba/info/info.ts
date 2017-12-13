import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';

import { RobainfoProvider } from '../../../../../providers/robainfo-provider';

import {BasePage} from '../../../../../providers/base/base-page';

declare var window;

@IonicPage()
@Component({
  selector: 'page-roba-info',
  templateUrl: 'info.html',
})
export class RobaInfoPage extends BasePage {

  constructor(public roba: RobainfoProvider, private toastCtrl: ToastController) {
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
