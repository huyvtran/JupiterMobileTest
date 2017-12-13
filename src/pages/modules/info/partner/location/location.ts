import {Component} from '@angular/core';
import {NavController, IonicPage, ToastController} from 'ionic-angular';

//import {PartnerLocationDetPage} from '../location-det/location-det';
import {PartnerinfoProvider} from '../../../../../providers/partnerinfo-provider';

@IonicPage()
@Component({selector: 'page-partner-location', templateUrl: 'location.html'})
export class PartnerLocationPage {
  modifiedData : any;
  term : string = '';

  constructor(private navCtrl : NavController, public partner : PartnerinfoProvider, private toastCtrl: ToastController) {
    //this.partner.InitStorage(118);

  }

  // this is run whenever the (ionInput) event is fired
  searchFn(ev : any) {
    this.term = ev.target.value;
  }

  detailItem(item : any) {
    this
      .navCtrl
      .push('PartnerLocationDetPage', {item});
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
