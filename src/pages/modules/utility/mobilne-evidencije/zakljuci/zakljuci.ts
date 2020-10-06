import { Component} from '@angular/core';
import { NavController, IonicPage, NavParams, ViewController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import { UtilityMobEvProvider } from '../../../../../providers/modules/utility/mobilne-evidencije/utility-mobilne-evidencije-provider';
import { GlobalProvider } from '../../../../../providers/core/global-provider';

@IonicPage()
@Component({
  selector: 'page-zakljuci',
  templateUrl: 'zakljuci.html'
})
export class UtilityMobEvRadniNaloziZakljuciPage extends BasePage {

  statusi:any[] = []
  
  constructor(public navCtrl: NavController, private utilityMobEvProvider: UtilityMobEvProvider, public navParams:NavParams,
    public viewCtrl : ViewController, public global: GlobalProvider) {
    super();
  }

  ionViewWillLoad(){
    this.utilityMobEvProvider.getStatusi().then(res=>{
      this.statusi = res.statusi
    })
  }

  zakljuci(){
    try{
      this.utilityMobEvProvider.Zakljuci();
      this.global.modal.dismiss(true);
    }
    catch(e) {
      this.global.logError(e, true);
  }
  }

  buttonState() {
    if (this.utilityMobEvProvider.Zakljucak != null && this.utilityMobEvProvider.Status != null) 
        return false;
    return true;
  }

}
