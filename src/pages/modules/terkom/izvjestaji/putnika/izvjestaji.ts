import { Component } from '@angular/core';
import { NavController, IonicPage} from 'ionic-angular';


import {BasePage} from '../../../../../providers/base/base-page';
import {TerkomSifarniciProvider} from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
/*
  Generated class for the Lokacija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-izvjestaji-putnika',
  templateUrl: 'izvjestaji.html'
})
export class TerkomIzvjestajiPutnikaPage  extends BasePage{

  constructor(public navCtrl: NavController,private sifarniciService : TerkomSifarniciProvider) {
    super();

  }

  ionViewWillEnter(){
  		//console.log("asd")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LokacijaPage');
  }


  openIzvjestaj(rpt){
    console.log(rpt)
		this.navCtrl.push(rpt.page, { rasponDana : rpt.period})
	}

}
