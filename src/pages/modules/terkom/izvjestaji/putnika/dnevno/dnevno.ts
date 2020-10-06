import { Component } from '@angular/core';
import {  LoadingController , ModalController, IonicPage} from 'ionic-angular';

import {BasePage} from '../../../../../../providers/base/base-page';

import {ConstProvider} from '../../../../../../providers/core/const-provider';

import { TerkomIzvjestajiProvider } from '../../../../../../providers/modules/terkom/terkom-izvjestaji-provider';

/*
  Generated class for the ObilazakAkcija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-izvjestaji-dnevno',
  templateUrl: 'dnevno.html'
})
export class TerkomIzvjestajiPutnikaDnevnoPage extends BasePage {


	
	constructor(public loading: LoadingController,
				public config: ConstProvider,
				public modalCtrl : ModalController,
				private izvjestajiService : TerkomIzvjestajiProvider) {
				super();
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad ObilazakAkcijaPage');
		this.getDnevnoPregled()
	}

	getDnevnoPregled(){
		let loading = this.loading.create({
      		content: 'Loading...'
    	});

		loading.present().then(() => {
			this.izvjestajiService.getDnevnoRealizacija().then(data => {
				//console.log(data);
			})
        .catch(err => this.global.logError(err, false))
	      setTimeout(() => {
	        loading.dismiss();
	      }, 1000);
	    });
	}


    	
}




