import { Component } from '@angular/core';
import { ViewController, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BasePage } from '../../../../../providers/base/base-page';

import { TerproSifarniciProvider } from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';
import { TerproNarudzbaProvider } from '../../../../../providers/modules/terpro/terpro-narudzba-provider';


/*
  Generated class for the NarudzbaZaglavljeEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
	selector: 'terpro-page-narudzba-zaglavlje-edit',
	templateUrl: 'narudzba-zaglavlje-edit.html'
})
export class TerproNarudzbaZaglavljeEditPage extends BasePage {

	//datum = new Date();
	form: FormGroup;
	submitAttempt: boolean = false;
	narudzba: any = [];
	constructor(public narudzbeService: TerproNarudzbaProvider, public viewCtrl: ViewController, public formBuilder: FormBuilder, public sifarniciService: TerproSifarniciProvider) {

		super()
		this.form = formBuilder.group({
			opis: [narudzbeService.narudzba.opis ? narudzbeService.narudzba.opis : '', Validators.maxLength(100)],
			nacinPlacanja: [narudzbeService.narudzba.nacinplacanjaid],
			datum: [narudzbeService.narudzba.datumdok]
		});

	}


	ionViewWillEnter() {
		//this.tabBarElement.style.display = 'none';
		//console.log("zag details")
		//this.sifarniciService.loadNacinIsporuke();
		this.sifarniciService.loadNacinPlacanja(this.narudzbeService.narudzba.vrstadokid);
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad NarudzbaZaglavljeEditPage');
	}


	save() {

		this.submitAttempt = true;

		if (!this.form.valid) {
			console.log("nije validna");
		}
		else {
			//console.log("success!")

			this.narudzba.opis = this.form.value.opis;
			this.narudzba.nacinplacanjaid = parseInt(this.form.value.nacinPlacanja);
			this.narudzba.datumdok = this.form.value.datum;

			//console.log(this.narudzba);
			this.narudzbeService.update(this.narudzba, this.narudzbeService.pronarudzbeglaid)
				.then((res) => {
					//vrati nazad i refresh narudzbe
					this.narudzbeService.getNarudzba(this.narudzbeService.pronarudzbeglaid)
						.then((res) => { this.viewCtrl.dismiss(); })
				}).catch((err) => this.global.logError(err, false))
		}

	}


	dismiss() {
		console.log("dismiss");
		this.viewCtrl.dismiss();
	}

}
