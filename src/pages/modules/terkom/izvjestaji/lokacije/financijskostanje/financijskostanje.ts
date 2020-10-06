import { Component } from '@angular/core';
import { LoadingController, IonicPage } from 'ionic-angular';


import { NumberFormatPipe } from '../../../../../../pipes/number-format.pipe';
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
	providers:[NumberFormatPipe],
	selector: 'page-izvjestaji-financijskostanje',
	templateUrl: 'financijskostanje.html'
})
export class TerkomIzvjestajiLokacijeFinancijskoStanjePage extends BasePage {

	financijskostanje: Array<any>

	constructor(public loading: LoadingController,
		public config: ConstProvider,
		private izvjestajiService: TerkomIzvjestajiProvider,
		private narudzbaServis: TerkomNarudzbaProvider,
		private pipe: NumberFormatPipe) {
		super();
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad ObilazakAkcijaPage');
		this.getFinancijskoStanje()
		console.log(this.numberFormat(123123.23123,2))
	}

	getFinancijskoStanje() {
		let params = { parstruid: this.narudzbaServis.parstruid };

		let loading = this.loading.create({
			content: 'Loading...'
		});

		loading.present().then(() => {
			this.izvjestajiService.getFinancijskoStanje(params).then(data => {
				console.log(data);
				setTimeout(() => {
					this.financijskostanje = data;
					loading.dismiss();
				}, 1000);

			})
				.catch(Error => {
					loading.dismiss();
					console.log(Error)
				})
		});
	}


	numberFormat(value, decimals): string {
		return this.pipe.transform(value, decimals)
	}



}




