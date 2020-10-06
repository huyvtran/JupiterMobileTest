import { Component } from '@angular/core';
import { NavParams, LoadingController, IonicPage} from 'ionic-angular';

import {BasePage} from '../../../../../../../providers/base/base-page';

import {ConstProvider} from '../../../../../../../providers/core/const-provider';
import { TerkomIzvjestajiProvider } from '../../../../../../../providers/modules/terkom/terkom-izvjestaji-provider';

/*
  Generated class for the ObilazakAkcija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-izvjestaji-preglednarudzbistavke',
  templateUrl: 'detalji.html'
})
export class TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljeDetaljiPage extends BasePage {

	  public stavke = new Array<any>();
		public terkomglaid : number;

	constructor(
				public navParams: NavParams,
				public loading: LoadingController,
				public config: ConstProvider,
				private izvjestajiService : TerkomIzvjestajiProvider) {
				super();

				this.terkomglaid = this.navParams.get('terkomglaid');
				console.log(this.terkomglaid)
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad ObilazakAkcijaPage');
		this.prikazi();
	}

	prikazi(){

    let loading = this.loading.create({
      content: 'Loading...'
    });

    loading.present().then(() => {
			this.izvjestajiService.getStavkeNarudzbiURazdoblju(this.terkomglaid).then(data => {
				//console.log(data);
				  setTimeout(() => {
						this.stavke = data;
	        	loading.dismiss();
	      	}, 1000);
				
			})
        .catch(err => {
					setTimeout(() => {	
	        	loading.dismiss();
	      	}, 1000);
					this.global.logError(err, false);
				})
	    
	    });

      
  }

    	
}




