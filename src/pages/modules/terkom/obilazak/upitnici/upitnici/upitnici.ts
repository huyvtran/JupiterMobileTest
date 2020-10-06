import { Component } from '@angular/core';
import { NavController,  LoadingController, IonicPage, PopoverController} from 'ionic-angular';

import {BasePage} from '../../../../../../providers/base/base-page';

import {ConstProvider} from '../../../../../../providers/core/const-provider';
import { TerkomUpitniciProvider } from '../../../../../../providers/modules/terkom/terkom-upitnici-provider';

/*
  Generated class for the ObilazakAkcija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-upitnici',
  templateUrl: 'upitnici.html'
})
export class TerkomUpitniciPage extends BasePage {


	constructor(public navCtrl: NavController, 
				public loading: LoadingController,
				public config: ConstProvider,
				private upitniciProvider : TerkomUpitniciProvider) {
				super();

	}

	ionViewWillEnter() {
		console.log("will enter!!")
		this.upitniciProvider.getCountOdgovoreneUpitnikeZaParstru().then((res) =>{
				this.upitniciProvider.getUpitnici()
		})
	}



	prikaziPitanja(upitnik){
			let loading = this.loading.create({
      		content: 'Loading...'
    	});

	    loading.present().then(() => {
	      this.navCtrl.push("TerkomPitanjaPage", {upitniId : upitnik.tkupitnikid, naziv : upitnik.naziv});
	      setTimeout(() => {
	        loading.dismiss();
	      }, 500);
	    });
	}

    	
}




