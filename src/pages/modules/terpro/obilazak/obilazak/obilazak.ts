import { Component, ViewChild } from '@angular/core';
import { NavController,  Content, LoadingController, ItemSliding, List, ToastController, IonicPage } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';

import { TerproNarudzbaProvider } from '../../../../../providers/modules/terpro/terpro-narudzba-provider';
import { TerproSifarniciProvider } from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';


@IonicPage()
@Component({
  selector: 'terpro-page-obilazak',
  templateUrl: 'obilazak.html'
})
export class TerproObilazakPage extends BasePage {
  @ViewChild(Content) content: Content;

  originalLokacije: any[];
  segment: string = "new";
  //selZonaID: number;
  //zone: any[];
  lokacije: any[];
  showSearchForm: boolean = true;
  start: number = 0;
  finish: number = 0;
  pomak: number = 20;
  searcham: boolean = false;
  pronadeneLokacije = [];

  constructor(public toastCtrl: ToastController, public navCtrl: NavController,
    public loading: LoadingController,
    public sifarniciService: TerproSifarniciProvider,
    public narudzbeService: TerproNarudzbaProvider) {
    super();
    this.getLokacije();
  }

  ionViewWillEnter() {

  }

  getSegmentData() {
    if (this.segment === "history")
      this.showSearchForm = false;
    else
      this.showSearchForm = true;
    this.content.resize();
  }


  doInfinite(infiniteScroll) {
    //console.log('Begin async operation');

    setTimeout(() => {
      //dok ima podataka
      if ((this.finish - this.start) > this.pomak) {
        if (!this.searcham) {
          //ako je samo scroll 
          for (var i = this.start; i < (this.start + this.pomak); i++) {
            this.lokacije.push(this.originalLokacije[i]);
          }
          this.start = this.start + this.pomak;
        }
      }
      else {

        if (!this.searcham) {
          //ako je samo scroll 
          for (var j = this.start; j < this.finish; j++) {
            this.lokacije.push(this.originalLokacije[j]);
          }
          this.start = this.start + this.pomak;
        }
      }

      //console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 200);
  }


  getLokacije() {
    this.start = 0;
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

  openAkcionPage(parstruid, lokacija) {
    //console.log(parstruid)
    if (parstruid == null)
      return;

    //ako je odabrana lokacija setaj globalni parametar
    //setaj parstruid koji se koristi na pregledu / editu artikla narudzbeService
    this.narudzbeService.parstruid = parstruid;
    //setaj partneriid za potrebe provjere veze roba partner
    this.narudzbeService.partneriid = lokacija ? lokacija.partneriid: null;
    this.narudzbeService.lokacija = lokacija.naziv;
    let loading = this.loading.create({
      content: 'Loading...'
    });

    loading.present().then(() => {
      //dohvati sume napravljenih dokumenata za odabranu lokaciju
      this.sifarniciService.loadVrsteDok(parstruid).then((res) => {

        this.navCtrl.push("TerproObilazakAkcijaPage", { data: lokacija }).catch((err) => console.log(err));
        setTimeout(() => {
          loading.dismiss();
        });
      }).catch(error => {
        this.global.logError(error, false);
        loading.dismiss();
      })

    });
  }

  //*
  searchLokacije(searchbar) {
    var q = searchbar.target.value;
    this.lokacije = [];

    if (!q || q.trim() === '' || q.trim().length < 3) {
      this.searcham = false;
      // Load cached lokacije
      //this.lokacije = this.originalLokacije;
      //dodaj 30 itema u listu

      if (this.originalLokacije.length < 20)
        this.lokacije = this.originalLokacije;
      else
        for (var i = 0; i < this.pomak; i++) {
          this.lokacije.push(this.originalLokacije[i]);
        }
      this.start = this.pomak;
      this.finish = this.originalLokacije.length;

    } else {
      this.searcham = true;
      // Get the searched lokacije from dataset


        // this.robaSearchDataList = this.roba.filter((v) => {
        //         if(v.barcode)
        //             return v.naziv.toLowerCase().includes(term.toLowerCase()) || v.sifra.toLowerCase().includes(term.toLowerCase()) || v.barcode.toLowerCase().includes(term.toLowerCase())
        //         else
        //             return v.naziv.toLowerCase().includes(term.toLowerCase()) || v.sifra.toLowerCase().includes(term.toLowerCase())
        //     })

 
      this.pronadeneLokacije = this.originalLokacije.filter((v) => {
        if (v.naziv && q) {
          if (v.naziv.toLowerCase().indexOf(q.toLowerCase()) > -1 || v.sifra.toLowerCase().includes(q.toLowerCase()) || v.sifra_partnera.toLowerCase().includes(q.toLowerCase()) || v.naziv_partnera.toLowerCase().includes(q.toLowerCase()) ) {
            return true;
          }
          return false;
        }
      });

      for (var j = 0; j < this.pronadeneLokacije.length; j++) {
        this.lokacije.push(this.pronadeneLokacije[j]);
      }


      // this.lokacije = this.originalLokacije.filter((v) => {
      //   if(v.naziv && q) {
      //       if (v.naziv.toLowerCase().indexOf(q.toLowerCase()) > -1) {
      //         return true;
      //       }
      //       return false;
      //   }
      // });
    }
  }


  presentToast(message, duration) {

    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
  }

}
