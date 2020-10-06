import { Component } from '@angular/core';
import { LoadingController, IonicPage } from 'ionic-angular';


import { BasePage } from '../../../../../../providers/base/base-page';

import { ConstProvider } from '../../../../../../providers/core/const-provider';
import { TerkomIzvjestajiProvider } from '../../../../../../providers/modules/terkom/terkom-izvjestaji-provider';
import { TerkomNarudzbaProvider } from '../../../../../../providers/modules/terkom/terkom-narudzba-provider';

/*
  Generated class for the ObilazakAkcija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
	selector: 'page-izvjestaji-otvoreniracuni',
	templateUrl: 'otvoreniracuni.html'
})
export class TerkomIzvjestajiLokacijeOtvoreniRacuniPage extends BasePage {


	public otvoreniracuni = new Array<any>();
	ukupno: number = 0;

	constructor(public loading: LoadingController,
		public config: ConstProvider,
		private izvjestajiService: TerkomIzvjestajiProvider,
		private narudzbaServis: TerkomNarudzbaProvider) {
		super();

	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad ObilazakAkcijaPage');
		this.getOtvoreniRacuni();
	}

	getOtvoreniRacuni() {
		let params = { parstruid: this.narudzbaServis.parstruid };

		let loading = this.loading.create({
			content: 'Loading...'
		});

		loading.present().then(() => {
			this.izvjestajiService.getOtvoreniRacuni(params).then(data => {
				//console.log(data);
				if (data)
					data.forEach(dat => {
						this.ukupno += dat.iznos
					});

				setTimeout(() => {
					this.otvoreniracuni = data;

					loading.dismiss();
				}, 1000);

			})
				.catch(Error => {
					loading.dismiss();
					console.log(Error)
				})
		});
	}





}




