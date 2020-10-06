import { Component, ViewChild } from '@angular/core';
import { NavController,  Content, ModalController, IonicPage, Searchbar } from 'ionic-angular';

import {TerkomSifarniciProvider} from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import {TerkomArtiklProvider} from '../../../../../providers/modules/terkom/terkom-artikl-provider';
import {TerkomNarudzbaProvider} from '../../../../../providers/modules/terkom/terkom-narudzba-provider';
import * as INarudzba from '../../../../../interfaces/terkom/INarudzba';
import {BasePage} from '../../../../../providers/base/base-page';




/*
  Generated class for the KlasaRobe page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-klasa-robe',
  templateUrl: 'klasa-robe.html'
})
export class TerkomKlasaRobePage extends BasePage{
  @ViewChild(Content) content: Content;
  @ViewChild(Searchbar) searchBar: Searchbar;
  //tabBarElement: any;
  segment: string = "trazilica";
  item : any = [];
  constructor(public narudzbeService:TerkomNarudzbaProvider, public modalCtrl : ModalController,
    public navCtrl: NavController, public sifarniciService: TerkomSifarniciProvider, private artiklService: TerkomArtiklProvider) {
      super();
      //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      //this.tabBarElement.style.display = 'none';
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if(this.searchBar)
        this.searchBar.setFocus();
    }, 150);
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

    setTimeout(() => {
      if(this.searchBar)
        this.searchBar.setFocus();
    }, 150);
  }

  //dohvati artikle za odabranu klasu robe 
  getArtikl(id, naziv){
      //console.log("narudzbaid " + this.data.id );
      //console.log(id);
      if(id == null)
        return;
      this.sifarniciService.klasaRobeId = id;

        this.sifarniciService.loadRobe(this.sifarniciService.klasaRobeId).then((result) => {
          this.navCtrl.push("TerkomRobaPage", {naziv});
        }, (error) => {
              this.global.logError(error, false);
        });
  	  
  }

  showNarudzba(){
      //ovdje poslatiparametar da zna sakriti i dalje tabs na pregledu narudzbe
      this.navCtrl.popTo("NarudzbaDetailPage");
  }


  setQuantitiy(id){
    //podigni modal za dodavanje količine
      if(id == null)
         return;
      this.artiklService.kolicina = 0;
      this.artiklService.newArtikl = true;
      this.artiklService.robaId = id;

      this.global.modal = this
        .modalCtrl
        .create("TerkomArtiklEditPage",null,{enableBackdropDismiss: false});
        
      this.global.modal.present();


	    this.global.modal.onDidDismiss((data) => {
        // console.log("uso55");
        // console.log(data);
          if(data != null)
          {
            if(data.crazlogpovrataid != null)
            {
              if(! Array.isArray(data.crazlogpovrataid) ){
                data.crazlogpovrataid = [data.crazlogpovrataid];
              }
              this.addArtikl(data.crazlogpovrataid);
            }
            else
            {
              let initvar: number[] = [];
              this.addArtikl(initvar);
            }

          }
              
		      this.global.modal = null;

          //fokusiraj trazilicu robe ako je vidljiva
           setTimeout(() => {
              if(this.searchBar){
                  this.searchBar.value = ''
                  this.searchBar.setFocus();
              }
               
            }, 150);
	    });


      // let artiklModal = this.modalCtrl.create("TerkomArtiklEditPage");
      // artiklModal.present();
      // artiklModal.onDidDismiss(kolicina => {
      //     if(kolicina != null)
      //       this.addArtikl(kolicina);
      // });

      
  }


  addArtikl(razlogpovratanizid){

    let artikl = new INarudzba.NarudzbaStavka()
    artikl.robaid = this.artiklService.robaId;
    artikl.kolicina = Number(this.artiklService.kolicina);
    // artikl.cijena = this.artiklService.stavka.cijena;
    // artikl.rabatPosto = Number(this.artiklService.stavka.rabatPosto);
    artikl.cijena = this.artiklService.cijena;
    artikl.rabatPosto = Number(this.artiklService.rabatPosto);
    artikl.opis = this.artiklService.opis;
    artikl.razlogpovratadetid=razlogpovratanizid;

      //console.log(id);
      //console.log(item);
      //spremi stavku narudzbe

      this.artiklService.getBrojStavkeNarudzbe()
      .then((res) => {return this.narudzbeService.deleteWherePovNakInd(this.narudzbeService.NarudzbaID)})
      .then((res) => this.artiklService.insertStavka(artikl ,this.narudzbeService.NarudzbaID))
      .then((res) => {return this.narudzbeService.insertPovratnaNaknada(this.narudzbeService.NarudzbaID)})
      .then((result) => {
           //console.log(result);
           this.getZaglavlje();
           this.getStavke();
      })
      .catch((error) => this.global.logError(error, false))
  }


  getStavke(){
     this.artiklService.getStavke(this.narudzbeService.NarudzbaID).then((res) => {
              
            }).catch((err) => {
              console.log(err);
          });
  }

  getZaglavlje(){
    this.narudzbeService.getNarudzba(this.narudzbeService.NarudzbaID).then((res) => {

          }).catch((err) => {
            this.global.logError(err, false);
      });
  }


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
