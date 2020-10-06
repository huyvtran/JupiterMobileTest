import { Component, forwardRef } from '@angular/core';
import { NavParams, NavController, ModalController, AlertController, ItemSliding, IonicPage, LoadingController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';

import { TerkomNarudzbaProvider } from '../../../../../providers/modules/terkom/terkom-narudzba-provider';
import { TerkomArtiklProvider } from '../../../../../providers/modules/terkom/terkom-artikl-provider';
import { TerkomSifarniciProvider } from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { Narudzba } from '../../../../../interfaces/terkom/INarudzba';
import * as INarudzba from '../../../../../interfaces/terkom/INarudzba';


/*
  Generated class for the NarudzbaDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
	selector: 'page-narudzba-detail',
	templateUrl: 'narudzba-detail.html'
})


export class TerkomNarudzbaDetailPage extends BasePage {


	//tabBarElement: any;
	response: any;
	vrstaDok: string;
	spremiButtonClicked: boolean = false;
	idjevi: Array<ListaNarudzbiZaProvjeru> = new Array<ListaNarudzbiZaProvjeru>();

	constructor(public alertCtrl: AlertController, public navCtrl: NavController,
		public modalCtrl: ModalController, public narudzbeService: TerkomNarudzbaProvider,
		public artiklService: TerkomArtiklProvider, private sifarniciService: TerkomSifarniciProvider,
		public navParams: NavParams, private loading: LoadingController, private storage: StorageProvider) {

		super();
    this.vrstaDok = this.navParams.get('vrstaDok');
    console.log("narudbe su:",this.narudzbeService.narudzba);
    console.log("narudba vrsta dok je:",this.narudzbeService.narudzba.vrstadokid);
		//this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
		//this.tabBarElement.style.display = 'none';
		//console.log("constructor")
		//console.log(narudzbeService)
	}

	//dohvat stavki narudzbe
	getStavke() {
		//console.log("get stavka")
		this.artiklService.getStavke(this.narudzbeService.NarudzbaID).then((res) => {

		}).catch((err) => {
			this.global.logError(err, false);
		});
	}

	getZaglavlje() {
		//console.log("get zag")
		this.narudzbeService.getNarudzba(this.narudzbeService.NarudzbaID).then((res) => {

		}).catch((err) => {
			this.global.logError(err, false);
		});
	}


	addStavka() {
		this.navCtrl.push("TerkomKlasaRobePage");
	}

	//forma za edit artikla / kolicine
	editStavka(stavka) {
		//podigni modal za dodavanje količine
		if (stavka.id == null)
			return;

		if (stavka.pov_nak_sysind === 1)
			return;

		//napuni model stavka u servisu
		this.artiklService.stavkaID = stavka.id;
		this.artiklService.newArtikl = false;
		this.global.modal = this
			.modalCtrl
			.create("TerkomArtiklEditPage", null, { enableBackdropDismiss: false });
		this.global.modal.present();

		this.global.modal.onDidDismiss((data) => {
			// console.log("uso65");
			// console.log(data);
			// console.log("konvert1");
			if(! Array.isArray(data.crazlogpovrataid) ){
			  data.crazlogpovrataid = [data.crazlogpovrataid];
			}
			if (data != null)
				this.updateStavka(data);
			this.global.modal = null;
		});

	}


	//spremanje izmijena - update artikla
	updateStavka(data) {
		//spremi stavku narudzbe
		this.artiklService.updateStavka(data, this.artiklService.stavka, this.narudzbeService.NarudzbaID)
			.then((res) => { return this.narudzbeService.deleteWherePovNakInd(this.narudzbeService.NarudzbaID) })
			.then((res) => { return this.narudzbeService.insertPovratnaNaknada(this.narudzbeService.NarudzbaID) })
			.then((result) => {
				//console.log(result);
				this.getZaglavlje();
				this.getStavke();
			}, (error) => {
				this.global.logError(error, false);
			});
	}


	deleteStavka(slidingItem: ItemSliding, id) {
		let alert = this.alertCtrl.create({
			title: 'Želite obrisati stavku?',
			buttons: [
				{
					text: 'Odustani',
					handler: () => {
						slidingItem.close();
					}
				},
				{

					text: 'Obriši',
					handler: () => {
						//delete stavke narudzbe

						this.narudzbeService.deleteWherePovNakInd(this.narudzbeService.NarudzbaID)
							.then((res) => { return this.artiklService.deleteStavka(id, this.narudzbeService.NarudzbaID) })
							.then((res) => { return this.narudzbeService.insertPovratnaNaknada(this.narudzbeService.NarudzbaID) })
							.then((result) => {
								//console.log(result);
								//refresh stavki
								slidingItem.close();
								this.getZaglavlje();
								this.getStavke();
							}, (error) => {
								this.global.logError(error, false);
							});

					}
				}]
		});
		// now present the alert on top of all other content
		alert.present();


	}


	editZagNarudzba(id) {

    console.log('sifarcnici servis razlog povrata', this.sifarniciService.multiRazlogPovrata);

		if (this.narudzbeService.narudzba.prijenosind === 1 && this.sifarniciService.ponovnoSlanjeZabrana === 1)
			return;
		//podigni formu za edit napomene, nacina placanja i nacina isporuke
		this.global.modal = this
			.modalCtrl
			.create("TerkomNarudzbaZaglavljeEditPage", { data: id });

		this.global.modal.present();

		this.global.modal.onDidDismiss((kolicina) => {
			this.global.modal = null;
		});

	}

	sendNarudzba(prijenosInd) {
		//console.log(prijenosInd)
		if (this.variable.hasInternet) {

			let content = 'Slanje...';
			let loading = this.loading.create({
				content: content,

			});

			let title;
			let message = "";

			if (prijenosInd === 1) {
				title = "Narudžba je već poslana";
				message = "Želite ponovno poslati narudžbu?"
			}
			else {
				title = "Želite  poslati narudžbu?"
			}

			let alert = this.alertCtrl.create({
				title: title,
				message: message,
				buttons: [
					{
						text: 'Odustani',
						handler: () => {
							this.spremiButtonClicked = false;
						}
					},
					{
						text: 'Pošalji',
						handler: () => {

							loading.present().then(() => {
								setTimeout(() => {
									this.spremiButtonClicked = true;
									this.narudzbeService.getNeposlaneNarudzbe(this.narudzbeService.NarudzbaID)
										//ako je pubvar  provjeriStanjePrilikomSlanja = 1 onda provjeri za sve stavke
										.then((res) => {
											if (this.sifarniciService.provjeriStanjePrilikomSlanja === 1) {

												//za svaku narudzbu dohvati skladiste id i robe id stavki u string+
												return this.checkStanjeArtiklaNaServeru(loading)
											}
											else
												return res;
										})
										.then((res) => {
											if (this.spremiButtonClicked)
												this.narudzbeService.postRequest()
													.then((res) => {
														console.log(res)
														loading.dismiss();
														if (res && res.length > 0 &&  res[0].success == true) {
															this.spremiButtonClicked = false;
															this.global.presentToast("Uspješno poslana narudžba.")
														}
														else {
															this.spremiButtonClicked = false;
															this.global.logError("Greška u slanju \n" + res[0].error, true)
															//this.global.presentToastError("Greška u slanju. Pokušajte ponovo kasnije.");
															//this.global.presentToastError(res[0].error)
														}
													});
										})
										.catch((error) => {
											loading.dismiss();
											this.spremiButtonClicked = false;
											this.global.logError(error, true)
										})

								}, 500);
							});

						}
					}]
			});

			alert.present();
		}
		else {
			this.spremiButtonClicked = false;
			this.global.presentToast("Trenutno nemate ineternet konekciju");
		}

	}


	dohvatiIdijeveSkladistaIRobe(): Promise<any> {
		return new Promise((resolve, reject) => {
			//za svaku neposlanu narudzbu dohvati idijeve u listu
			this.narudzbeService.NeposlaneNarudzbe.forEach(nar => {
				let robaids: string = ""
				nar.stavke.forEach(stavka => {
					if (robaids === "")
						robaids += stavka.robaid.toString()
					else
						robaids += "," + stavka.robaid.toString()
				});
				this.idjevi.push({ skladisteid: nar.skladisteid, robaids: robaids })
			});
			resolve(this.idjevi)

		});
	}


	checkStanjeArtiklaNaServeru(loading): Promise<INarudzba.Narudzba[]> {
		console.log("checkiram stanje na serveru")
		if (this.sifarniciService.provjeriStanjePrilikomSlanja != 1)
			return new Promise((resolve) => { resolve(); });

		return new Promise((resolve, reject) => {
			//za svaku narudzbu za svaki artikl provjeri stanje na skladistu na servisu i ustanovi moze lise poslati narudzba
			this.narudzbeService.NeposlaneNarudzbe.forEach((nar) => {

				let robaids: string = ""
				nar.stavke.forEach(stavka => {
					if (robaids === "")
						robaids += stavka.robaid.toString()
					else
						robaids += "," + stavka.robaid.toString()
				});


				this.artiklService.getStanjeArtikalaNarudzbeNaSkladistu(robaids, nar.skladisteid)
					.then((val) => {
						if (val && val.length > 0) {
							nar.stavke.forEach(stavka => {
								let stanjeNaSkladistu = this.storage.filterCollectionSingleValue(val, 'robaid', stavka.robaid);
								if ((Number(stanjeNaSkladistu.kolicina) - Number(stavka.kolicina)) < 0)
									nar.posalji = false;
								stavka.imanastanju = (Number(stanjeNaSkladistu.kolicina) - Number(stavka.kolicina)) > 0
							});

						}
						let stavkeNaziv: string = ""
						if (!nar.posalji) {
							nar.stavke.forEach(stavka => {
								if (!stavka.imanastanju) {
									if (stavkeNaziv === "")
										stavkeNaziv += stavka.naziv;
									else
										stavkeNaziv += '<p>' + stavka.naziv + '</p>';
								}
							});

							loading.dismiss();
							this.spremiButtonClicked = false;
							let alert = this.alertCtrl.create({
								title: 'Arikla nema dovoljno na stanju!',
								subTitle: stavkeNaziv,
								buttons: ['Ok']
							});
							alert.present();
						}

						resolve(this.narudzbeService.NeposlaneNarudzbe);

					})
			})
		});
	}

}




export interface ListaNarudzbiZaProvjeru {
	skladisteid: number,
	robaids: string
}
