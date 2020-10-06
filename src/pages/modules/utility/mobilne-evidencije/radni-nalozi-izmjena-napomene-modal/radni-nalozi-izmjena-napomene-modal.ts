import { Component} from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import { UtilityMobEvProvider } from '../../../../../providers/modules/utility/mobilne-evidencije/utility-mobilne-evidencije-provider';
import { GlobalProvider } from '../../../../../providers/core/global-provider';

@IonicPage()
@Component({
  selector: 'page-radni-nalozi-izmjena-napomene-modal',
  templateUrl: 'radni-nalozi-izmjena-napomene-modal.html'
})
export class UtilityMobEvRadniNaloziIzmjenaNapomeneModalPage extends BasePage {

  kontrola:any;
  napomenaInit:string;
  
  constructor(public navCtrl: NavController, private utilityMobEvProvider: UtilityMobEvProvider, public navParams:NavParams,
    public global: GlobalProvider) {
    super();

    console.log(navParams.data)
    this.kontrola = navParams.data;
    this.napomenaInit = navParams.data.opis;
  }

  spremiNapomenu(){
    return new Promise((resolve)=> {
      this.utilityMobEvProvider.spremiNapomenu(this.kontrola.kkvaldetid, this.kontrola.opis)
      resolve()
    })
  }

  spremiNapomenuIzatvori() {
    this.global.modal.dismiss([true, this.kontrola.opis]);
  }

}
