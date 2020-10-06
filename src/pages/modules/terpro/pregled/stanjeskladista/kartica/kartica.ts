import { Component } from '@angular/core';
import { LoadingController,  IonicPage,  PopoverController, NavParams} from 'ionic-angular';


import { BasePage } from '../../../../../../providers/base/base-page';

import { ConstProvider } from '../../../../../../providers/core/const-provider';
import { TerproIzvjestajiProvider } from '../../../../../../providers/modules/terpro/terpro-izvjestaji-provider';
import { StorageProvider } from '../../../../../../providers/core/storage-provider';

/*
  Generated class for the ObilazakAkcija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
	selector: 'page-izvjestaji-stanje-skladista-kartica',
	templateUrl: 'kartica.html'
})
export class TerproIzvjestajiStanjeSkladistaKarticaPage extends BasePage {

	public kartica : any;
	public originalData : any
	nezakljuceni: boolean = false;

	constructor(public loading: LoadingController,
		public config: ConstProvider,
		private izvjestajiService: TerproIzvjestajiProvider,
		private popoverCtrl: PopoverController,
		private navParams: NavParams,
		private storage : StorageProvider) {
		super();

		this.kartica = this.navParams.get('data');
		this.originalData = this.navParams.get('data');
		console.log(this.kartica);

		 
	}


	filtriraj(nezakljuceni){
		console.log(nezakljuceni)


		let loading = this.loading.create({
			content: 'filtriram...'
		});

		loading.present().then(() => {


				setTimeout(() => {
					if(nezakljuceni)
						this.kartica = this.storage.filterCollectionWherePopertyNotEqual(this.originalData, 'status', 1 )
					else
						this.kartica = this.originalData;
					loading.dismiss();
				}, 500);
				
		});
	}

}




