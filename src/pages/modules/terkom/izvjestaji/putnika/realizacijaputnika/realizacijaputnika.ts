import { Component } from '@angular/core';
import { LoadingController,  IonicPage,  PopoverController, NavParams} from 'ionic-angular';


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
	selector: 'page-izvjestaji-realizacijaputnika',
	templateUrl: 'realizacijaputnika.html'
})
export class TerkomIzvjestajiPutnikaRealizacijaPutnikaPage extends BasePage {

	datumOd: string = new Date().toISOString();
	datumDo: string = new Date().toISOString();

	periodDana : number = 0;

	public realizacija = new Array<any>();

	public totalhL: number = 0;
	public totaliznos: number = 0;

	constructor(public loading: LoadingController,
		public config: ConstProvider,
		private izvjestajiService: TerkomIzvjestajiProvider,
		private popoverCtrl: PopoverController,
		private navParams: NavParams) {
		super();
		this.periodDana  = this.navParams.get("rasponDana");
		console.log(this.periodDana)
	}

	ionViewDidLoad() {
		//console.log("postavi datume ako postoje u parametrima 123")
		//console.log('ionViewDidLoad ObilazakAkcijaPage');
		this.datumOd = this.izvjestajiService.getDatePeriod(this.periodDana);
	}

	prikazi() {
		let params = { datod: this.datumOd, datdo: this.datumDo};

		let loading = this.loading.create({
			content: 'Loading...'
		});

		loading.present().then(() => {
			this.izvjestajiService.getRealizacijaPutnika(params)
			.then(data => {
				//console.log(data)
				this.realizacija = data;
				//console.log(this.realizacija)
				if (this.realizacija.length)
					this.getTotal();

				setTimeout(() => {
					loading.dismiss();
				}, 1000);
			})

				.catch(err => {
					loading.dismiss();
					this.global.logError(err, false);
				})
		
		});


	}


	getTotal() {
		let iznos = 0;
		let hl = 0;

		for (var i = 0; i < this.realizacija.length; i++) {
			iznos += this.realizacija[i].iznos;
			hl += this.realizacija[i].hl;
		}
		this.totaliznos = iznos;
		this.totalhL = hl;

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




