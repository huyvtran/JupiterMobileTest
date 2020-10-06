import { Component } from '@angular/core';
import { NavController,  LoadingController, IonicPage, PopoverController, NavParams, ModalController, AlertController} from 'ionic-angular';

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
  selector: 'page-pitanja',
  templateUrl: 'pitanja.html'
})
export class TerkomPitanjaPage extends BasePage {

	upitniId : number;
	nazivUpitnika: string;
	odgovorenoNovoPitanje: boolean = false;
	constructor(public navCtrl: NavController, 
				public loading: LoadingController,
				public config: ConstProvider,
				private modalCtrl: ModalController,
				private upitniciProvider : TerkomUpitniciProvider,
				private navParams: NavParams,
				private alertCtrl : AlertController) {
				super();
				this.upitniId = this.navParams.get('upitniId');
				this.nazivUpitnika = this.navParams.get('naziv');
	}

	ionViewWillEnter() {
			//dohvati id.eve odgovorenih pitanja
			this.refreshData();
	}

	refreshData(){
		this.upitniciProvider.getOdgovorenaPitanjaZaUpitnik(this.upitniId).then((res) => {
				//dohvati listu svih odgovora
				this.upitniciProvider.getOdgovoriSvi()
					.then((res) => {
						//dohvati pitanja za odabrani upitnik sa pripadajucim odgovorima
						this.upitniciProvider.getPitanja(this.upitniId).then((res) => console.log(res))
					})
				
			})
	}

    prikaziOdgovore(pitanje){
	
		this.global.modal = this
						.modalCtrl
						.create("TerkomUpitniciOdgovorPage", {pitanje: pitanje, upitnikId: this.upitniId},{enableBackdropDismiss: false});


		this.global.modal.onWillDismiss((data) => {
			if(data){
				this.refreshData();
				this.odgovorenoNovoPitanje = true;
			}		
			else
				this.odgovorenoNovoPitanje = false;
			this.global.modal = null;
		});

		this.global.modal.present();
	}


	//slanje svakog pojedinog upitnika sa odgovorima na pitanja
	sendOdgovoriNaPitanja(){
		if(this.variable.hasInternet)
  		{
			let title = "Slanje upitnika";
			let message = "Želite  poslati odgovore na upitnik?";
	
			
  			let alert = this.alertCtrl.create({
				title: title,
				message : message,
		        buttons: [
		        {
		          text: 'Odustani',
		          handler: () => {
		          }
		        },
		        {
		          	text: 'Pošalji',
		          	handler: () => {
						//posalji ovaj upitnik / listu pitanja
						this.upitniciProvider.postRequest(this.upitniId)
							.then((res) => {
								if(res &&  res[0].success == true)
								{
									this.global.presentToast("Upitnik uspješno poslan.")
								}
								else
								{
									this.global.presentToast("Greška slanja.")
								}		
							});
		          	}
		        }]
	      	});

  			alert.present();
  		}
  		else
		{
			this.global.presentToast("Trenutno nemate ineternet konekciju");
		}   

	}


}




