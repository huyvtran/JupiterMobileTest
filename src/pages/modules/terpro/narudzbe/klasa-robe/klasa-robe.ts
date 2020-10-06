import { Component, ViewChild } from '@angular/core';
import { NavController,  Content, ModalController, IonicPage } from 'ionic-angular';

import {TerproSifarniciProvider} from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';
import {TerproArtiklProvider} from '../../../../../providers/modules/terpro/terpro-artikl-provider';
import {TerproNarudzbaProvider} from '../../../../../providers/modules/terpro/terpro-narudzba-provider';
import * as INarudzba from '../../../../../interfaces/terpro/INarudzba';
import {BasePage} from '../../../../../providers/base/base-page';




/*
  Generated class for the KlasaRobe page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-terpro-klasa-robe',
  templateUrl: 'klasa-robe.html'
})
             
export class TerProKlasaRobePage extends BasePage{
  @ViewChild(Content) content: Content;
  //tabBarElement: any;
  segment: string = "trazilica";
  item : any = [];
  constructor(public narudzbeService:TerproNarudzbaProvider, public modalCtrl : ModalController,
    public navCtrl: NavController, public sifarniciService: TerproSifarniciProvider, private artiklService: TerproArtiklProvider) {
      super();
      //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      //this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
      //this.tabBarElement.style.display = 'flex';
  }

  ionViewWillEnter() {
    //this.tabBarElement.style.display = 'none';
    //isprazni dataset trazilice
    this.sifarniciService.robaSearchDataList  = [];
    //console.log(this.sifarniciService.favoriti)
  }
  

  getData(){
      this.content.resize();
      //console.log(this.segment);
  }

  //dohvati artikle za odabranu klasu robe 
  getArtikl(id, naziv){
      //console.log("narudzbaid " + this.data.id );
      //console.log(id);
      if(id == null)
        return;
      this.sifarniciService.klasaRobeId = id;

        this.sifarniciService.loadRobe(this.sifarniciService.klasaRobeId).then((result) => {
          this.navCtrl.push("TerproRobaPage", {naziv});
        }, (error) => {
              console.log("ERROR: ", error);
        });
  	  
  }

  showNarudzba(){
      //ovdje poslatiparametar da zna sakriti i dalje tabs na pregledu narudzbe
      this.navCtrl.popTo("TerproNarudzbaDetailPage");
  }


  setQuantitiy(id){
    //podigni modal za dodavanje količine
      
      if(id == null)
         return;
      this.artiklService.kolicina = 0;
      this.artiklService.newArtikl = true;
      this.artiklService.robaId = id;

      let artiklModal = this.modalCtrl.create("TerproArtiklEditPage");
      artiklModal.present();
      artiklModal.onDidDismiss(kolicina => {
          if(kolicina != null)
            this.addArtikl(kolicina);
      });

      
  }



  addArtikl(kolicina){

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
    //console.log(artikl);
    //spremi stavku narudzbe

      this.artiklService.getBrojStavkeNarudzbe(this.narudzbeService.pronarudzbeglaid)
      .then((res) => {return this.artiklService.insertStavka(artikl ,this.narudzbeService.pronarudzbeglaid)})
      .then((res) => {return this.narudzbeService.deleteWherePovNakInd(this.narudzbeService.pronarudzbeglaid)})
      .then((res) => {return this.narudzbeService.dodajAmbalazu(this.narudzbeService.pronarudzbeglaid)})
      .then((res) => {return this.narudzbeService.insertPovratnaNaknada(this.narudzbeService.pronarudzbeglaid)})
      .then((res) => {return this.artiklService.getStavke(this.narudzbeService.pronarudzbeglaid)})
      .then((res) => this.narudzbeService.getNarudzba(this.narudzbeService.pronarudzbeglaid))
      .catch((error) => this.global.logError(error, false))
      // .then((result) => {
      //      //console.log(result);
      //      this.getZaglavlje();
      //      this.getStavke();
      // })
      // .catch((error) => this.global.logError(error, false))
  }


  // getStavke(){
  //    this.artiklService.getStavke(this.narudzbeService.pronarudzbeglaid).then((res) => {
              
  //           }).catch((err) => {
  //             console.log(err);
  //         });
  // }

  // getZaglavlje(){
  //   this.narudzbeService.getNarudzba(this.narudzbeService.pronarudzbeglaid).then((res) => {

  //         }).catch((err) => {
  //           console.log(err);
  //     });
  // }


  searchRoba(searchbar)
  {
    var q = searchbar.target.value;

      if (!q || q.trim() === '' || q.trim().length < 2) {
          // Load cached lokacije
          this.sifarniciService.robaSearchDataList = [];
      } else {
          //console.log(q);
          this.sifarniciService.searchRoba(q);
      }
  }


}
