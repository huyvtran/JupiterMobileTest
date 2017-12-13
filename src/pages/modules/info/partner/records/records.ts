import { Component } from '@angular/core';
import {IonicPage, ToastController} from 'ionic-angular';

import {PartnerinfoProvider} from '../../../../../providers/partnerinfo-provider';

@IonicPage()
@Component({
  selector: 'page-parter-records',
  templateUrl: 'records.html'
})
export class PartnerRecordsPage {

  constructor(public partner : PartnerinfoProvider, private toastCtrl: ToastController) {

  }

  uIzradi() {
    let message = "Funkcionalnost je u izradi";
    
    let toast = this
        .toastCtrl
        .create({message: message, duration: 3000, position: 'bottom'});

    toast.onDidDismiss(() => {
        
    });

    toast.present();
}

}
