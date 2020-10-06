import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController , ModalController, IonicPage, ActionSheetController, ToastController} from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';

import {TerproNarudzbaProvider} from '../../../../../providers/modules/terpro/terpro-narudzba-provider';
import {TerproSifarniciProvider} from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';
import {TerproArtiklProvider} from '../../../../../providers/modules/terpro/terpro-artikl-provider';

import * as Moment from 'moment';
import * as INarudzba from '../../../../../interfaces/terpro/INarudzba';


/*
  Generated class for the ObilazakAkcija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'terpro-page-obilazak-akcija',
  templateUrl: 'obilazak-akcija.html'
})
export class TerproObilazakAkcijaPage extends BasePage {

	iconNames = [];
	response : any = [];
	lokacijaData : any = [];
	ispunjeniUpitniciCount : number;
	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				public loading: LoadingController,
				public sifarniciService: TerproSifarniciProvider,
				public narudzbeService : TerproNarudzbaProvider,
				public artiklService : TerproArtiklProvider,
				public modalCtrl : ModalController,
				//private actionSheetCtrl : ActionSheetController, 
				private toastCtrl : ToastController
			) {
				super();
		// this.sifarniciService.loadVrsteDok().then((res) => {
		// 	this.vrstaDok = res;
		// });
		this.lokacijaData = this.navParams.get('data');
		//console.log(this.lokacijaData)
		this.iconNames = ["ios-paper-outline","ios-create-outline","ios-document-outline", "ios-book-outline","ios-paper-outline", "ios-paper-outline", "ios-paper-outline", "ios-paper-outline"];



	}

	
	
	ionViewWillEnter() {
		//dohvato count kreiranih evidencija posjeta  i upitnika
	}

	stanjeDistribucije(){
		let loading = this.loading.create({
      		content: 'Loading...'
    	});

	    loading.present().then(() => {
	      this.navCtrl.push("StanjeDistribucijePage", {});
	      setTimeout(() => {
	        loading.dismiss();
	      }, 500);
	    });
	}


	novaNarudzba(dok){
		//console.log(dok)
		//setaj id vrstedok
		this.narudzbeService.MaxLimit = dok.maxiznos;

		this.narudzbeService.vrstaDokId = dok.vrstadokid;

      	let loading = this.loading.create({
      		content: 'Loading...'
    	});

	    loading.present().then(() => {
			if(dok.broj > 0){

				//console.log("dizem na izbor listu narudzbi ili novu")
				//podigni modalini prozor
				this.narudzbeService.getNarudzbeLokacija().then((res) => {


					this.global.modal = this
						.modalCtrl
						.create("TerproObilazakAkcijaIzborPage", { lokacija: this.narudzbeService.lokacija, vrstaDok: dok.opis});
						
				
					//console.log(res);
					//let modal = this.modalCtrl.create("TerkomObilazakAkcijaIzborPage", { lokacija: this.narudzbeService.lokacija, vrstaDok: dok.naziv});
	
				    //modal.present();
				    this.global.modal.onWillDismiss((data) => {

				      	if (data) {

				      		if(data.id == null){								  
				      			//kreiraj novu narudzbu i redirect na  edit page
								this.narudzbeService.getBrojDokumenta(dok.vrstadokid)
								.then((res) => this.narudzbeService.getIdNovogDokumenta())
								//dohvati nacin placanja id
								.then((res) => this.sifarniciService.loadNacinPlacanjaId(dok.oznaka))
								//dohvati lokaciju
								//.then((res) => { this.nativePlugins.getLocation() })
								.then((res) => {
									setTimeout(() => {
					              		this.createNarudzba(dok.oznaka, dok.opis); 
										loading.dismiss();			
					            	});
								}, 
										
								(error) => {
										this.global.logError(error, false);
								});
				      		}
				      		else
				      		{
				      			//osvjezi zaglavlje i stavke
						      	this.narudzbeService.pronarudzbeglaid = data.id;
						      	this.narudzbeService.getNarudzba(this.narudzbeService.pronarudzbeglaid)
						      	.then((res) => {  this.artiklService.getStavke(this.narudzbeService.pronarudzbeglaid)})
						      	.then((res) =>{
						      		setTimeout(() => {
					              		this.navCtrl.push("TerproNarudzbaDetailPage", { vrstaDok: dok.opis});
					              		loading.dismiss();
					            	});

						      	})
						      	.catch(error => {
									this.global.logError(error, false);
						      		loading.dismiss();
						      	});        	
				      		}	
				      	}
				      	else
				      		loading.dismiss();

						this.global.modal = null;
				    });
					loading.dismiss();
					this.global.modal.present();
				});

					
		  		
			}
			else{

				if(dok.vrstadokid == null)
				return;

				//kreiraj novu narudzbu i redirect na  edit page

				this.narudzbeService.getBrojDokumenta(dok.vrstadokid)
				//.then((res) => this.nativePlugins.getLocation())
				.then((res) => this.narudzbeService.getIdNovogDokumenta())
				.then((res) => this.sifarniciService.loadNacinPlacanjaId(dok.oznaka))
				.then((res) => {
					setTimeout(() => {
						this.createNarudzba(dok.oznaka, dok.opis); 
						loading.dismiss();			
					});
				}, 
				(error) => {
					this.global.logError(error, false);
					loading.dismiss();
				}).catch(error => {
					this.global.logError(error, false);
					loading.dismiss();
				});
			}
	    });

  	}


  	createNarudzba(oznaka, naziv){

		let nacPlaId = null;
		//let nacIspId = null;
		//nacin placanja postavi ovisno o vrsti dokumenta, ako je MP onda je gotovina po defaultu
		if(oznaka == "MP")
			nacPlaId = this.sifarniciService.nacinPlacanjaId;
		else
		{
			//ako postoji u postavkama postavi taj
			// if(this.auth.currentUser)
			// 	nacPlaId = this.auth.currentUser.nacinPlacanjaId;
			// else
				nacPlaId = this.sifarniciService.nacinPlacanjaId;
		}

		var datum = new Date();
		//var date = new Date();
		//datum.setDate(datum.getDate()+1)	
		let narudzba = new INarudzba.Narudzba()
		narudzba.partneriid = this.narudzbeService.partneriid ? this.narudzbeService.partneriid : null;
		//narudzba.operaterid = this.config.terminalId ? this.config.terminalId : null,
		narudzba.pronarudzbeglaid = this.narudzbeService.newPronarudzbeglaid;
		narudzba.vrstadokid = this.narudzbeService.vrstaDokId ? this.narudzbeService.vrstaDokId : null;
		narudzba.parstruid = this.narudzbeService.parstruid ? this.narudzbeService.parstruid : null;
		narudzba.nacinplacanjaid = nacPlaId ? nacPlaId : null;
		//narudzba.datumdok = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())),
		//narudzba.datum_zaprimanja = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())),
		narudzba.datumdok = datum;
		narudzba.datum_zaprimanja = new Date();
		//seta se kasnije storom na servisu nakon prijenosa
		narudzba.prijenosind = 0;
		narudzba.status = 1;
		narudzba.storno = 0;
		narudzba.opis = null;
		narudzba.uuid = this.narudzbeService.generateUUID(),
		narudzba.fiskalnibroj = this.narudzbeService.getFiskalniBroj(this.narudzbeService.newbrojdok, this.narudzbeService.vrstaDokId)
		narudzba.broj = this.narudzbeService.newbroj? this.narudzbeService.newbroj : null,
		narudzba.brojdok = this.narudzbeService.newbrojdok? this.narudzbeService.newbrojdok : null,
		narudzba.broj_ispisa = 0;
		//ovo se seta kasnije nekom storom
		narudzba.narudzbeid = 0;
		narudzba.donos = 0;
		narudzba.fuuid = null;

		narudzba.kod = null
		narudzba.jir = null

		narudzba.iznos_neto = 0;
		narudzba.iznos_osnovica = 0;
		narudzba.iznos_porez = 0;
		narudzba.iznos_rabat = 0;
		narudzba.iznos_ukupno = 0;
		narudzba.odgoda = 0;
		
		narudzba.stavke = []
		
		//console.log(narudzba)
      	this.narudzbeService.save(narudzba)
			.then((broj) => {
				return this.narudzbeService.pronarudzbeglaid = broj;
			})
			//osvjezi vrste dok zbog broja narudzi po vrsi dok i lokaciji
			.then((res) => {
				return this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid)})
			//osvjezi zaglavlje i stavke da imas svjeze podatke za pregled
			.then((res) => {
				return this.narudzbeService.getNarudzba(this.narudzbeService.pronarudzbeglaid)})
			.then((res) => {
				return this.artiklService.getStavke(this.narudzbeService.pronarudzbeglaid)})		      
			.then((res) => {
				this.navCtrl.push("TerproNarudzbaDetailPage" ,{vrstaDok: naziv});
			})
		  	.catch((err) => {
		  		this.global.logError("Greška pri kreiranju narudžbe", true);
				this.global.logError(err, false);
		  		//console.log(err)
		  	});



    }


	closeActionSheet(actionSheet){
	
		actionSheet.dismiss();

      	return false;
	}

	uIzradi(){
		let message = "Funkcionalnost je u izradi";
        
        let toast = this
            .toastCtrl
            .create({message: message, duration: 3000, position: 'bottom'});

        toast.onDidDismiss(() => {
            
        });

        toast.present();
	}
    	
}




