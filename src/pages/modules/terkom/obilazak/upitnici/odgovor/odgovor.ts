import { Component } from '@angular/core';
import { NavController,  LoadingController, IonicPage, PopoverController, NavParams, ViewController} from 'ionic-angular';

import {BasePage} from '../../../../../../providers/base/base-page';
import {StorageProvider} from '../../../../../../providers/core/storage-provider';
import {ConstProvider} from '../../../../../../providers/core/const-provider';
import { TerkomUpitniciProvider } from '../../../../../../providers/modules/terkom/terkom-upitnici-provider';


/*
  Generated class for the ObilazakAkcija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-upitnici-odgovor',
  templateUrl: 'odgovor.html'
})
export class TerkomUpitniciOdgovorPage extends BasePage {
	tipPitanja : any
	pitanjeId : number
	pitanje: string
	upitnikId : number

	pitanjeObject: any;


	//varijable za tip pitanja 2, binding bool odgovora
	boolOdgovor : number 
	//varijabla za tip pitanja 3, binding checkbox multi select odgovora
	checkMultiSelectOdgovori : Array<any> = [];
	//varijabla za tip pitanja 1
	slobodniUnos : string;

	constructor(public navCtrl: NavController, 
				public loading: LoadingController,
				public config: ConstProvider,
				private navParams : NavParams,
				private upitniciProvider : TerkomUpitniciProvider,
				private viewCtrl : ViewController,
				private storageProvider : StorageProvider) {
				super();

				this.pitanjeObject =  this.navParams.get('pitanje');
				this.upitnikId = this.pitanjeObject.tkupitnikid;
				this.pitanje = this.pitanjeObject.pitanje;
				this.tipPitanja = this.pitanjeObject.tkpitanjevrstaid;
				this.pitanjeId = this.pitanjeObject.tkpitanjeid;

				
	}

	ionViewWillEnter() {
	
			//dohvati odgovore za pitanje
			this.upitniciProvider.getOdgovori(this.pitanjeId, this.tipPitanja)
			.then((res) => {
					//postavi vrijednost odgovora ako je pitanje odgovoreno
					this.setSelectedAnswer(res)
			})
	}



	setSelectedAnswer(odgovori){

		//slobodan unos
		if(this.tipPitanja === 1)
			this.slobodniUnos = this.pitanjeObject ? this.pitanjeObject.odgovor : null;
		//boolean single 
		else if( this.tipPitanja === 2)
			this.boolOdgovor = this.pitanjeObject? this.storageProvider.getFirstArrayElement(this.pitanjeObject.odgovorIDs) : null;
		else{
			this.checkMultiSelectOdgovori = this.pitanjeObject.odgovorIDs?  this.pitanjeObject.odgovorIDs : [];

			if(this.upitniciProvider.odgovori && this.checkMultiSelectOdgovori)
				this.upitniciProvider.odgovori.forEach(odgovor => {
						if(this.checkMultiSelectOdgovori.indexOf(odgovor.tkodgovorid) !== -1) {
							odgovor.checked = true;
						}
				});
		}
			
	}


	saveOdgovor(){
		//spremi odgovor na pitanje za upitnik i parstruid u storage za kasnije
			let odgovor = null;
			let odgovorId :number = null;
			let message : string = "";

			if(this.tipPitanja === 1){
					odgovor = this.slobodniUnos? this.slobodniUnos : null;
					odgovorId = null;
					message = "Upišite vaš odgovor."
			}		
			else if(this.tipPitanja === 2){
					odgovorId = this.boolOdgovor? Number(this.boolOdgovor) : null;
					odgovor =  null;
					message = "Odaberite jedan od ponuđenih odgovora";
			}
			else if(this.tipPitanja === 3){
					odgovor = this.checkMultiSelectOdgovori.length > 0 ? this.checkMultiSelectOdgovori : null;
					odgovorId = null;
					message = "Odaberite jedan ili više ponuđenih odogovora."
			}
				
			if(odgovor != null || odgovorId != null){
				this.upitniciProvider.saveOdgovor(this.upitnikId,this.pitanjeId,this.tipPitanja, odgovor, odgovorId)
					.then((res) => {
						if(res)
               				 this.viewCtrl.dismiss(true);
					})

			}
			else{			
				this.global.presentToast(message);
			}


			//TODO refresh liste pitanja sa answered propertyem da se sucelje izmijeni
			
	}


	updateChecked(odgovorId, checked)
	{
		var self = odgovorId;

		if(checked === true){

          this.checkMultiSelectOdgovori.push(odgovorId)
		}  
		else 
		{ 
			var index = this.checkMultiSelectOdgovori.indexOf(self);
			this.checkMultiSelectOdgovori.splice(index, 1);
		}

	}


	selectionChanged(val){
		this.boolOdgovor = val;

	}

    	
}




