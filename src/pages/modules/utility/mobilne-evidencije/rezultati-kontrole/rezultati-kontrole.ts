import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ViewController, ModalController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import { UtilityMobEvProvider } from '../../../../../providers/modules/utility/mobilne-evidencije/utility-mobilne-evidencije-provider';
import { GlobalProvider } from '../../../../../providers/core/global-provider';


@IonicPage()
@Component({
  selector: 'page-rezultati-kontrole',
  templateUrl: 'rezultati-kontrole.html',
})
export class RezultatiKontrolePage extends BasePage {

  kontroleOrderedList : any[] = []

  constructor(public navCtrl: NavController, private utilityMobEvProvider: UtilityMobEvProvider, public navParams:NavParams,
    public viewCtrl : ViewController, public global: GlobalProvider, private modalCtrl: ModalController) {
      super();
      this.kontroleOrderedList = navParams.data;
      console.log(navParams.data)
  }

  ionViewDidLoad() {
    // console.log(this.kontroleOrderedList);
  }

  getBackgroundColor(index:number) {
    if (this.kontroleOrderedList[index].tipnaziv == 'Tekstualni')
        return '#eeeeee';
  }

  getGraniceNorme(kontrola){
    if (kontrola.tipnaziv == "Brojčani" )
      return '(' + kontrola.decmin + ' - ' + kontrola.decmax + ')'
  }

  getColor(kontrola) {
    if (kontrola.decimalvalue < kontrola.decmin || kontrola.decimalvalue > kontrola.decmax)
      { return '#e6e600' }
  }

  presentZakljuciPage(){
    this.global.modal = this
            .modalCtrl
            .create("UtilityMobEvRadniNaloziZakljuciPage",{enableBackdropDismiss: false});


    this.global.modal.onDidDismiss((data) => {
      this.global.modal = null;
      if (data==true)
      {
        console.log(data)
        this.utilityMobEvProvider.naloziIzmijenjeni = true;
        this.navCtrl.popToRoot();
      }
    });

    this.global.modal.present()
}

}
