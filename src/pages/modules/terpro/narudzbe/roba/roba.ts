import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage, Searchbar } from 'ionic-angular';

import { TerproSifarniciProvider } from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';
import { TerproArtiklProvider } from '../../../../../providers/modules/terpro/terpro-artikl-provider';
import { TerproNarudzbaProvider } from '../../../../../providers/modules/terpro/terpro-narudzba-provider';

import { BasePage } from '../../../../../providers/base/base-page';
import * as INarudzba from '../../../../../interfaces/terpro/INarudzba';
import { StorageProvider } from '../../../../../providers/core/storage-provider';

/*
  Generated class for the Roba page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-terpro-roba',
  templateUrl: 'roba.html'
})
export class TerproRobaPage extends BasePage {

  @ViewChild(Searchbar) searchBar: Searchbar;
  //tabBarElement: any;

  originalArtikli: any[];
  artikli: Array<any>;
  start: number = 0;
  finish: number = 0;
  pomak: number = 20;
  searcham: boolean = false;
  pronadeniArtikli = [];
  klasaRobe: string

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public sifarniciService: TerproSifarniciProvider,
    public artiklService: TerproArtiklProvider,
    public narudzbeService: TerproNarudzbaProvider,
    private storage : StorageProvider) {
    super();
    this.artikli = [];
    this.klasaRobe = this.navParams.get('naziv');

    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    //this.tabBarElement.style.display = 'none';

    //dodaj 20 itema u listu
    if (this.sifarniciService.robaKlMaster.length < 20)
      this.artikli = this.sifarniciService.robaKlMaster
    else {
      for (var i = 0; i < this.pomak; i++) {
        this.artikli.push(this.sifarniciService.robaKlMaster[i]);
      }
    }
    this.start = this.start + this.pomak;
    this.originalArtikli = this.sifarniciService.robaKlMaster;
    this.finish = this.originalArtikli.length;

  }

  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }

  ionViewWillEnter() {
    //this.tabBarElement.style.display = 'none';
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RobaPage');

  }

  //edit artikl kolicina
  setQuantitiy(id) {
    //console.log(id)
    //podigni modal za dodavanje količine
    if (id == null)
      return;
    this.artiklService.kolicina = 0;
    this.artiklService.newArtikl = true;
    this.artiklService.robaId = id;


    this.global.modal = this
      .modalCtrl
      .create("TerproArtiklEditPage", null, { enableBackdropDismiss: false });

    this.global.modal.present();


    this.global.modal.onDidDismiss((kolicina) => {
      if (kolicina != null)
        this.addArtikl(kolicina);
      this.global.modal = null;

      //fokusiraj trazilicu robe ako je vidljiva
      setTimeout(() => {
        if (this.searchBar) {
          this.searchBar.value = ''
          this.searchBar.setFocus();
        }

      }, 150);
    });
    // let artiklModal = this.modalCtrl.create("TerkomArtiklEditPage");
    // artiklModal.present();
    // artiklModal.onDidDismiss(kolicina => {
    //    	//console.log(data);
    //     if(kolicina != null)
    //       this.addArtikl(kolicina);
    // });


  }


  addArtikl(kolicina) {
    let artikl = new INarudzba.NarudzbaStavka()
    artikl.robaid = this.artiklService.robaId;
    artikl.kolicina = Number(this.artiklService.kolicina);
    artikl.cijena = this.artiklService.cijena;
    artikl.rabat = Number(this.artiklService.rabatPosto);
    artikl.odgoda = Number(this.artiklService.stavka.odgoda);
    artikl.rabat1 = Number(this.artiklService.stavka.rabat1);
    artikl.rabat2 = Number(this.artiklService.stavka.rabat2);
    artikl.rabat3 = Number(this.artiklService.stavka.rabat3);
    artikl.rabat4 = Number(this.artiklService.stavka.rabat4);
    artikl.rabat5 = Number(this.artiklService.stavka.rabat5);
    //console.log(id);
    console.log(artikl);
    //spremi stavku narudzbe

    this.artiklService.getBrojStavkeNarudzbe(this.narudzbeService.pronarudzbeglaid)
      .then((res) => { return this.artiklService.insertStavka(artikl, this.narudzbeService.pronarudzbeglaid) })
      .then((res) => { return this.narudzbeService.deleteWherePovNakInd(this.narudzbeService.pronarudzbeglaid) })
      .then((res) => { return this.narudzbeService.dodajAmbalazu(this.narudzbeService.pronarudzbeglaid) })
      .then((res) => { return this.narudzbeService.insertPovratnaNaknada(this.narudzbeService.pronarudzbeglaid) })
      .then((res) => { return this.artiklService.getStavke(this.narudzbeService.pronarudzbeglaid) })
      .then((res) => this.narudzbeService.getNarudzba(this.narudzbeService.pronarudzbeglaid))
      .catch((error) => this.global.logError(error, false))
  }




  showNarudzba() {
    this.navCtrl.pop();
    this.navCtrl.popTo("TerproNarudzbaDetailPage");
  }


  searchRoba(searchbar) {
    var q = searchbar.target.value;
    this.artikli = [];

    if (!q || q.trim() === '' || q.trim().length < 3) {
      this.searcham = false;
      // Load cached lokacije
      //this.lokacije = this.originalLokacije;
      //dodaj 30 itema u listu

      //dodaj 20 itema u listu
      if (this.sifarniciService.robaKlMaster.length < 20)
        this.artikli = this.sifarniciService.robaKlMaster
      else {
        for (var i = 0; i < this.pomak; i++) {
          this.artikli.push(this.sifarniciService.robaKlMaster[i]);
        }
      }

      this.start = this.pomak;
      this.finish = this.originalArtikli.length;

    } else {
      this.searcham = true;
      // Get the searched lokacije from dataset


      this.pronadeniArtikli = this.originalArtikli.filter((v) => {
        if (v.barcode)
          return v.naziv.toLowerCase().includes(q.toLowerCase()) || v.sifra.toLowerCase().includes(q.toLowerCase()) || v.barcode.toLowerCase().includes(q.toLowerCase())
        else
          return v.naziv.toLowerCase().includes(q.toLowerCase()) || v.sifra.toLowerCase().includes(q.toLowerCase())
      })

      this.pronadeniArtikli = this.storage.orderItemsBy(this.pronadeniArtikli, 'sifra', 'asc')
      // this.pronadeniArtikli = this.originalArtikli.filter((v) => {
      //   if(v.naziv && q) {
      //       if (v.naziv.toLowerCase().indexOf(q.toLowerCase()) > -1) {
      //         return true;
      //       }
      //       return false;
      //   }
      // });

      for (var j = 0; j < this.pronadeniArtikli.length; j++) {
        this.artikli.push(this.pronadeniArtikli[j]);
      }

    }
  }


  doInfinite(infiniteScroll) {
    //console.log('Begin async operation');

    setTimeout(() => {
      //dok ima podataka
      if ((this.finish - this.start) > this.pomak) {
        if (!this.searcham) {
          //ako je samo scroll 
          for (var i = this.start; i < (this.start + this.pomak); i++) {
            this.artikli.push(this.originalArtikli[i]);
          }
          this.start = this.start + this.pomak;
        }
      }
      else {

        if (!this.searcham) {
          //ako je samo scroll 
          for (var j = this.start; j < this.finish; j++) {
            this.artikli.push(this.originalArtikli[j]);
          }
          this.start = this.start + this.pomak;
        }
      }

      //console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 200);
  }


}
