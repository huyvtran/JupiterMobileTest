import { Component } from '@angular/core';
import { NavController, IonicPage} from 'ionic-angular';


import {BasePage} from '../../../../providers/base/base-page';
import {TerproSifarniciProvider} from '../../../../providers/modules/terpro/terpro-sifarnici-provider';
/*
  Generated class for the Lokacija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'terpro-page-izvjestaji',
  templateUrl: 'izvjestaji.html'
})
export class TerproIzvjestajiPage  extends BasePage{

  constructor(public navCtrl: NavController,private sifarniciService : TerproSifarniciProvider) {
    super();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
  }


  openIzvjestaj(report){
    console.log(report)
		this.navCtrl.push(report)
	}

}
