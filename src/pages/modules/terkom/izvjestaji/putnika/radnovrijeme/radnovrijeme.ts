import { Component } from '@angular/core';
import { LoadingController, IonicPage, PopoverController , NavParams} from 'ionic-angular';


import * as Moment from 'moment';
import { BasePage } from '../../../../../../providers/base/base-page';

import { ConstProvider } from '../../../../../../providers/core/const-provider';
import { TerkomIzvjestajiProvider } from '../../../../../../providers/modules/terkom/terkom-izvjestaji-provider';

/*
  Generated class for the ObilazakAkcija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
	selector: 'page-izvjestaji-radnovrijeme',
	templateUrl: 'radnovrijeme.html'
})
export class TerkomIzvjestajiPutnikaRadnoVrijemePage extends BasePage {

	datumOd: string = new Date().toISOString();
	datumDo: string = new Date().toISOString();
	public radnovrijeme = new Array<any>();
	periodDana: number = 0;

	constructor(public loading: LoadingController,
		public config: ConstProvider,
		private izvjestajiService: TerkomIzvjestajiProvider,
		private popoverCtrl: PopoverController,
		private navParams : NavParams) {
		super();
		this.periodDana  = this.navParams.get("rasponDana");
		//this.datumOd = Moment(new Date()).subtract(+1, 'weeks').toISOString();
		//this.datumDo = this.global.getTime("d").start;
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad ObilazakAkcijaPage');
		this.datumOd = this.izvjestajiService.getDatePeriod(this.periodDana);
	}

	prikazi() {
		let params = { datod: this.datumOd, datdo: this.datumDo};

		let loading = this.loading.create({
			content: 'Loading...'
		});

		loading.present().then(() => {
			this.izvjestajiService.getRadnoVrijeme(params)
			.then(data => {			
				//console.log(this.realizacija)
				setTimeout(() => {
					this.radnovrijeme = data;
					loading.dismiss();
				}, 1000);
			})
			.catch(err => {
				loading.dismiss();
				this.global.logError(err, false);
			})
		
		});


	}


	presentPopover(myEvent) {
		var exclude = ["group1", "group4"]
		let popover = this
			.popoverCtrl
			.create('SharedDateFilterPage', { exclude: exclude });
		popover.present({ ev: myEvent });

		popover.onDidDismiss((data) => {
			if (data != null) {
				this.datumOd = data.start;
				this.datumDo = data.end;
			}
		})

	}


}




