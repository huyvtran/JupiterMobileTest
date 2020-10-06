import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, IonicPage, ActionSheetController, ToastController, ViewController, DateTime, AlertController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/ICore';
import { TerkomNarudzbaProvider } from '../../../../../providers/modules/terkom/terkom-narudzba-provider';
import { TerkomSifarniciProvider } from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import { TerkomArtiklProvider } from '../../../../../providers/modules/terkom/terkom-artikl-provider';
import { NativeGeolocationPluginProvider } from '../../../../../providers/native/geolocation/geolocation-provider';
import { PermissionProvider } from '../../../../../providers/core/permission-provider';
import { TerkomEvidencijaPosjetaProvider } from '../../../../../providers/modules/terkom/terkom-evidencijaposjeta-provider';
import { TerkomUpitniciProvider } from '../../../../../providers/modules/terkom/terkom-upitnici-provider';
import { TerkomObavijestiProvider } from '../../../../../providers/modules/terkom/terkom-obavijesti-provider';

import * as INarudzba from '../../../../../interfaces/terkom/INarudzba';


/*
  Generated class for the ObilazakAkcija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
	selector: 'page-obilazak-akcija',
	templateUrl: 'obilazak-akcija.html'
})
export class TerkomObilazakAkcijaPage extends BasePage {

	iconNames = [];
	response: any = [];
	lokacijaData: any = [];
  ispunjeniUpitniciCount: number;
  vrijemeDolaska: any;
  pomak: number = 20;
  start: number = 0;
  lokacije: any[];
  originalLokacije: any[];
  finish: number = 0;

  submit: boolean = true;
  alertShown: boolean = false;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
		public navParams: NavParams,
		public loading: LoadingController,
		private sifarniciService: TerkomSifarniciProvider,
		private narudzbeService: TerkomNarudzbaProvider,
		private artiklService: TerkomArtiklProvider,
		public modalCtrl: ModalController,
		private nativePlugins: NativeGeolocationPluginProvider,
		private actionSheetCtrl: ActionSheetController,
		private toastCtrl: ToastController,
		private permissionPorovider: PermissionProvider,
		private evidenvijaPosjetaProvider: TerkomEvidencijaPosjetaProvider,
		private upitniciProvider: TerkomUpitniciProvider,
    private obavijestiService : TerkomObavijestiProvider,
    private evidencijaPosjetaSeris: TerkomEvidencijaPosjetaProvider,
    public narudzbaServis : TerkomNarudzbaProvider,
    private nativeGeolocationProvider: NativeGeolocationPluginProvider,
    private viewCtrl: ViewController,
    private sifarniciProvider : TerkomSifarniciProvider) {
    super();

    this.getLokacije();

		// this.sifarniciService.loadVrsteDok().then((res) => {
		// 	this.vrstaDok = res;
		// });
    this.lokacijaData = this.navParams.get('data');
    console.log('lokacijadata  je:', this.lokacijaData);
		//console.log(this.lokacijaData)
		this.iconNames = ["ios-paper-outline", "ios-create-outline", "ios-document-outline", "ios-book-outline"];

	}

  ngOnDestroy()
  {
     if (this.lokacijaData.indobilazak == 1)
    {
      this.presentAlert("Upozorenje","Niste evidentirali odlazak",true,"aaaa");
    }
  }


	ionViewWillEnter() {

		//dohvato count kreiranih evidencija posjeta  i upitnika
		this.evidenvijaPosjetaProvider.getPosjet();
		this.upitniciProvider.getCountOdgovoreneUpitnikeZaParstru()
			.then((res) => this.ispunjeniUpitniciCount = res)
      .then((res) => this.obavijestiService.getObavijesti(this.lokacijaData.parstruid, this.lokacijaData.partneriid))
      console.log('indikator je;', this.lokacijaData.indobilazak);

  }


  ionViewDidLeave(){
    console.log('indikator je;', this.lokacijaData.indobilazak);
    this.evidencijaPosjetaSeris.isprazniPosjet(this.narudzbaServis.parstruid);
  }


	stanjeDistribucije() {
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


	openEvidencijaPosjetaPage() {


    if (this.lokacijaData.parstruid == null)
      return;

    //ako je odabrana lokacija setaj globalni parametar
    this.narudzbeService.parstruid = this.lokacijaData.parstruid;
    //setaj parstruid koji se koristi na pregledu / editu artikla narudzbeService
    this.narudzbeService.parstruid = this.lokacijaData.parstruid;
    this.narudzbeService.lokacija = this.lokacijaData.naziv;
    let loading = this.loading.create({
      content: 'Loading...'
    });


    loading.present().then(() => {
      //dohvati sume napravljenih dokumenata za odabranu lokaciju
      this.sifarniciService.loadVrsteDok(this.lokacijaData.parstruid).then((res) => {

        this.navCtrl.push("TerkomEvidencijaPosjetaPage", { data: this.lokacijaData }).catch((err) => console.log(err));
        setTimeout(() => {
          loading.dismiss();



        });
      }).catch(error => {
        this.global.logError(error, false);
        loading.dismiss();
      })

    });
		// let loading = this.loading.create({
		// 	content: 'Loading...'
		// });

		// loading.present().then(() => {
    //   this.navCtrl.push("TerkomEvidencijaPosjetaPage", {data: this.lokacijaData.indobilazak});



		// 	setTimeout(() => {
		// 		loading.dismiss();
		// 	}, 500);
		// });
	}

	openUpitniciPage() {
		let loading = this.loading.create({
			content: 'Loading...'
		});

		loading.present().then(() => {
			this.navCtrl.push("TerkomUpitniciPage", {});
			setTimeout(() => {
				loading.dismiss();
			}, 500);
		});
	}



	openObavijestiPage() {
		let loading = this.loading.create({
			content: 'Loading...'
		});

		loading.present().then(() => {

			this.global.pushPage("TerkomObavijestiPage" , {parstruid : this.lokacijaData.parstruid, partneriid : this.lokacijaData.partneriid});
			//this.navCtrl.push("TerkomObavijestiPage", {parstruid : this.lokacijaData.parstruid, partneriid : this.lokacijaData.partneriid});
			setTimeout(() => {
				loading.dismiss();
			}, 500);
		});
	}

	novaNarudzba(dok) {
		//console.log(dok)
		//setaj id vrstedok
		this.narudzbeService.MaxLimit = dok.maxiznos;

		this.narudzbeService.vrstaDokId = dok.vrstadokid;

		let loading = this.loading.create({
			content: 'Loading...'
		});

		loading.present().then(() => {
			if (dok.broj > 0) {

				console.log("dizem na izbor listu narudzbi ili novu")
				//podigni modalini prozor
				this.narudzbeService.getNarudzbeLokacija().then((res) => {


					this.global.modal = this
						.modalCtrl
						.create("TerkomObilazakAkcijaIzborPage", { lokacija: this.narudzbeService.lokacija, vrstaDok: dok.naziv });


					//console.log(res);
					//let modal = this.modalCtrl.create("TerkomObilazakAkcijaIzborPage", { lokacija: this.narudzbeService.lokacija, vrstaDok: dok.naziv});

					//modal.present();
					this.global.modal.onWillDismiss((data) => {

						if (data) {

							if (data.id == null) {
								//kreiraj novu narudzbu i redirect na  edit page
								this.narudzbeService.getBrojNarudzbe()
									//dohvati nacin placanja id
									.then((res) => this.sifarniciService.loadNacinPlacanjaId(dok.oznaka))
									.then((res) => this.sifarniciService.loadNacinIsporuke())
									.then((res) => this.sifarniciService.loadSkladista())
									//dohvati lokaciju
									//.then((res) => { this.nativePlugins.getLocation() })
									.then((res) => {
										setTimeout(() => {
											this.createNarudzba(dok.oznaka, dok.naziv);
											loading.dismiss();
										});
									},

										(error) => {
											this.global.logError(error, false);
										});
							}
							else {
								//osvjezi zaglavlje i stavke
								this.narudzbeService.NarudzbaID = data.id;
								this.narudzbeService.getNarudzba(this.narudzbeService.NarudzbaID)
									.then((res) => { this.artiklService.getStavke(this.narudzbeService.NarudzbaID) })
									.then((res) => {
										setTimeout(() => {
											this.navCtrl.push("TerkomNarudzbaDetailPage", { vrstaDok: dok.naziv });
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
			else {

				if (dok.vrstadokid == null)
					return;

				//kreiraj novu narudzbu i redirect na  edit page

				this.narudzbeService.getBrojNarudzbe()
					//.then((res) => this.nativePlugins.getLocation())
					.then((res) => this.sifarniciService.loadNacinPlacanjaId(dok.oznaka))
					.then((res) => this.sifarniciService.loadNacinIsporuke())
					.then((res) => this.sifarniciService.loadSkladista())
					.then((res) => {
						setTimeout(() => {
							this.createNarudzba(dok.oznaka, dok.naziv);
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

	//dodatno o lokaciji


	detailLokacija() {

		console.log("detalji lokacije")

		this.global.modal = this
			.modalCtrl
			.create("TerkomLokacijaPage", { data: this.lokacijaData.indobilazak });

		this.global.modal.present();


		this.global.modal.onWillDismiss((data: any[]) => {
			if (data) {
				console.log("dismiss")
			}
			this.global.modal = null;
		});
	}

	AddDays = function (noOfDays) {
		this.setTime(this.getTime() + (noOfDays * (1000 * 60 * 60 * 24)));
		return this;
	}

	createNarudzba(oznaka, naziv) {

		let nacPlaId = null;
		let nacIspId = null;
		//nacin placanja postavi ovisno o vrsti dokumenta, ako je MP onda je gotovina po defaultu
		if (oznaka == "MP")
			nacPlaId = this.sifarniciService.nacinPlacanjaId;
		else {
			//ako postoji u postavkama postavi taj
			// if(this.auth.currentUser)
			// 	nacPlaId = this.auth.currentUser.nacinPlacanjaId;
			// else
			nacPlaId = this.sifarniciService.nacinPlacanjaId;
		}

		//postavi nacin isporuke
		//ako postoji u postavkama postavi taj
		// if(this.auth.currentUser)
		// 	nacIspId = this.auth.currentUser.nacinIsporukeId;
		// else
		nacIspId = this.sifarniciService.nacinIsporukeId;


		var datum = new Date();
		if (this.sifarniciService.brojDana > 0)
			datum.setDate(datum.getDate() + Number(this.sifarniciService.brojDana))
		else if (this.sifarniciService.brojDana === 0)
			datum.setDate(datum.getDate())
		else
			datum.setDate(datum.getDate() + 1)
		let narudzba = new INarudzba.Narudzba()

		//narudzba.operaterid = this.config.terminalId ? this.config.terminalId : null,
		narudzba.id = this.narudzbeService.newBrojNarudzbe ? this.narudzbeService.newBrojNarudzbe : null;
		narudzba.vrstadokid = this.narudzbeService.vrstaDokId ? this.narudzbeService.vrstaDokId : null;
		narudzba.parstruid = this.narudzbeService.parstruid ? this.narudzbeService.parstruid : null;
		narudzba.longitude = this.nativePlugins.longitude ? this.nativePlugins.longitude : null;
		narudzba.latitude = this.nativePlugins.latitude ? this.nativePlugins.latitude : null;
		narudzba.nacinisporukeid = nacIspId ? nacIspId : null;
		narudzba.nacinplacanjaid = nacPlaId ? nacPlaId : null;
		narudzba.datumdok = datum;
		narudzba.datumkreiranja = new Date();
		narudzba.prijenosind = 0;
		narudzba.opis = null;
		narudzba.skladisteid = this.sifarniciService.skladisteId ? this.sifarniciService.skladisteId : null;
		narudzba.uuid = this.narudzbeService.generateUUID()
		narudzba.stavke = []


		this.narudzbeService.save(narudzba)
			.then((broj) => {
				return this.narudzbeService.NarudzbaID = broj;
			})
			//osvjezi vrste dok zbog broja narudzi po vrsi dok i lokaciji
			.then((res) => {
				return this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid)
			})
			//osvjezi zaglavlje i stavke da imas svjeze podatke za pregled
			.then((res) => {
				return this.narudzbeService.getNarudzba(this.narudzbeService.NarudzbaID)
			})
			.then((res) => {
				return this.artiklService.getStavke(this.narudzbeService.NarudzbaID)
			})
			.then((res) => {
				this.navCtrl.push("TerkomNarudzbaDetailPage", { vrstaDok: naziv });
			})
			.catch((err) => {
				this.global.logError("Greška pri kreiranju narudžbe", true);
				this.global.logError(err, false);
				console.log(err)
			});

	}


	openIzvjestajiActionPage() {
		//console.log("usao")

		let actionSheet = this.actionSheetCtrl.create({
			title: 'Izvještaji partnera',
			cssClass: 'action-sheets-basic-page'
		});

		if (this.sifarniciService.izvjestajilokacije.length > 0) {
			this.sifarniciService.izvjestajilokacije.forEach(izvjestaj => {
				actionSheet.addButton({
					text: izvjestaj.naziv,
					handler: this.openReport.bind(this, izvjestaj),
					icon: 'search'
				})
			});
		}
		else {
			actionSheet.addButton({
				text: "Trenutno nema dodijeljenih izvještaja",
				handler: this.closeActionSheet.bind(this, actionSheet),
				role: 'cancel'
			})
		}

		actionSheet.present();

	}

	openReport(rpt) {
		this.navCtrl.push(rpt.page, { rasponDana: rpt.period })
			.catch((err) => {
				console.log(err)
				this.uIzradi()
			})
	}

	closeActionSheet(actionSheet) {

		actionSheet.dismiss();

		return false;
	}

	uIzradi() {
		let message = "Funkcionalnost je u izradi";

		let toast = this
			.toastCtrl
			.create({ message: message, duration: 3000, position: 'bottom' });

		toast.onDidDismiss(() => {

		});

		toast.present();
  }

  getLokacije() {

    //console.log("get lokacije")
    this.sifarniciService.loadLokacije().then((data) => {
      this.lokacije = [];

      //dodaj 20 itema u listu
      if (data.length < 20)
        this.lokacije = data;
      else
        for (var i = 0; i < this.pomak; i++) {
          this.lokacije.push(data[i]);
        }
      this.start = this.start + this.pomak;
      this.originalLokacije = data;
      this.finish = this.originalLokacije.length;
    }, (error) => {
      this.global.logError(error, false);
    });

  }

  presentAlert(naslov, text, zabrana, upozorenje) {

    let alert = this.alertCtrl.create({
        title: naslov,
        subTitle: text,
        buttons: [{
            text: 'Ok',
            handler: () => {
                this.alertShown = false;
                if (this.submit)
                    {

                        this.viewCtrl.dismiss();
                    }
            }
        }]
    });
    //ako je upozorenje ili da je zabrana i upozorenje onda prikazi alert
    if (upozorenje || (zabrana && !upozorenje)) {
        this.alertShown = true;
        return alert.present();
    }


}



}




