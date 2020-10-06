import { Component } from '@angular/core';
import { NavParams , ViewController, IonicPage, LoadingController} from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import {TerkomSifarniciProvider} from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import * as ICore from '../../../../../interfaces/ICore';
import { NativeGeolocationPluginProvider } from '../../../../../providers/native/geolocation/geolocation-provider'
import { TerkomNarudzbaProvider } from '../../../../../providers/modules/terkom/terkom-narudzba-provider';
import { TerkomEvidencijaPosjetaProvider } from '../../../../../providers/modules/terkom/terkom-evidencijaposjeta-provider';
import { timestamp } from 'rxjs/operator/timestamp';

@IonicPage()
@Component({
  selector: 'page-evidencija-posjeta',
  templateUrl: 'evidencija-posjeta.html'
})
export class TerkomEvidencijaPosjetaPage  extends BasePage{
    selectedVrsteObilaska : Array<any> = []
    checkedItems : any = [];
    napomena : string = "";
    azuriranje: boolean = false;
    sent : boolean = false;
    obilazakGlaId: number;
    infoLokacije: any = [];


  constructor(
    public evidencijaPosjetaSeris: TerkomEvidencijaPosjetaProvider,
    public nativeGeolocationProvider: NativeGeolocationPluginProvider,
    public narudzbaServis : TerkomNarudzbaProvider,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public sifarniciProvider :
    TerkomSifarniciProvider, private loading : LoadingController) {
      super();
      //this.checkedItems = new Array(sifarniciProvider.vrstaObilazaka? sifarniciProvider.vrstaObilazaka.length : 0);
      this.infoLokacije = this.navParams.get('data');
      console.log('lokacijadata  je:', this.infoLokacije);
  }


  ionViewWillEnter()
  {
    console.log('indikator je:', this.infoLokacije.indobilazak);
  }

  ionViewDidLeave(){
        //ako nije poslan spremi i napomenu i chkAzurirajPostojeci parametar u storage
          console.log('indikator je:', this.infoLokacije.indobilazak);
        if(!this.sent)
            this.evidencijaPosjetaSeris.save(this.selectedVrsteObilaska.toString(), this.napomena, this.azuriranje)
                .then((res) => {
                    //osvjezi brojak zapocetih posjeta
                    this.evidencijaPosjetaSeris.getPosjet();
                })
        else
            //osvjezi brojak zapocetih posjeta
            this.evidencijaPosjetaSeris.getPosjet();
  }

  ionViewDidLoad(){

        this.getObilazakId();
        this.nativeGeolocationProvider.getLocation();

        this.sifarniciProvider.loadVrstaObilazka()
            .then((res) => {

                 //dohvati ukoliko je zapocet posjet i rekreiraj state na formi
                this.evidencijaPosjetaSeris.getPosjet()
                    .then((res) => {
                        console.log(res);
                        if(res != null && res != undefined){
                            var array = JSON.parse("[" + res.selected + "]");
                            this.selectedVrsteObilaska = array;

                            this.napomena = res.napomena;
                            this.azuriranje = res.azuriranje;

                            //protrci kroz popis vrstaobilaska iz sifarnika i dodaj ischecked true za sve iteme koji su u storaeu
                            if(this.sifarniciProvider.vrstaObilazaka)
                                this.sifarniciProvider.vrstaObilazaka.forEach(vrsta => {
                                        if(array.indexOf(vrsta.tkvrstaobilaskaid) !== -1) {
                                            //postoji, postavi na ture
                                            vrsta.ischecked = true;
                                        }
                                });
                        }


                    })
            })


  }

  updateModel(vrstaId, value){

      var self = vrstaId;

      if(value === true){

          this.selectedVrsteObilaska.push(vrstaId)
      }
      else
      {
          var index = this.selectedVrsteObilaska.indexOf(self);
          this.selectedVrsteObilaska.splice(index, 1);
      }

      //spremi lokalno podatke do slanja onda isprazni
      this.evidencijaPosjetaSeris.save(this.selectedVrsteObilaska.toString(), this.napomena, this.azuriranje);


  }



  sendEvidencijaPosjeta(){

      if(this.selectedVrsteObilaska != null && this.selectedVrsteObilaska.length > 0)
      {
            let loading = this.loading.create({
                content: 'Loading...'
            });


            loading.present().then(() => {

                this.sendEvidencijaDet().then((val) => {
                    setTimeout(() => {
                        this.sent = true;
                        // this.evidencijaPosjetaSeris.isprazniPosjet(this.narudzbaServis.parstruid);
                        loading.dismiss();
                        this.global.presentToast("Uspješno poslana evidencija posjeta")
                    }, 1000);

                })
                .catch((err) => {
                    setTimeout(() => {
                        loading.dismiss();
                    }, 1000);
                    this.global.logError(err, false);
                })

            });
      }
      else{
           this.global.presentToast("Morate odabrati barem jedan razlog obilaska!")
      }


  }


  getObilazakId() {
    return new Promise((resolve)=> {
        this.obilazakGlaId
        this.getObilazakGlaId()
        .then((res) => {
          this.obilazakGlaId = res[0].tkobilazakglaid;

          console.log('obilazak id je',this.obilazakGlaId);

        });


        resolve();
      })
}

getObilazakGlaId() {

  let data : ICore.IData = {
      "queries": [
  {
      "query": "spMobTerkom_GetObilazakId",
      "params": {
          "operaterid" : "@@operaterid",
          "parstruid" : this.narudzbaServis.parstruid,

          //"azurirajpostojeci" : this.azuriranje ? 1 : 0
      }
  }
]
  }
  return this
      .global
      .getData(data);

}

  sendEvidencijaDet() {

        let data : ICore.IData = {
            "queries": [
        {
            "query": "spMobTerkom_ObilazakInsertDet",
            "params": {
                "tkobilazakglaid" : this.obilazakGlaId,
                "vrsteobilaska" : this.selectedVrsteObilaska.toString(),
                "napomena" : this.napomena
                //"azurirajpostojeci" : this.azuriranje ? 1 : 0
            }
        }
      ]
        }
        return this
            .global
            .getData(data);

  }


  postaviVrijemeDolaska()
  {
    this.infoLokacije.indobilazak = 1;
    this.navParams.data.indobilazak =  this.infoLokacije.indobilazak;
    this.insertObilazakGla()
    .then((res)=>{
      this.obilazakGlaId = res[0].id;
      console.log('unesena glava je:', this.obilazakGlaId);
      // console.log('indObilazak je:',  this.navParams.data.indobilazak);
    })
  }

  postaviVrijemeOdlaska()
  {
    this.infoLokacije.indobilazak = 0;
    this.navParams.data.indobilazak =  this.infoLokacije.indobilazak;
    this.insertVrijemeOdlaska();
    // console.log('indObilazak je:',  this.navParams.data.indobilazak);
  }

  insertVrijemeOdlaska() {

    let data : ICore.IData = {
        "queries": [
    {
        "query": "spMobTerkom_ObilazaInsertVrijemeOdlaska",
        "params": {
            "tkobilazakglaid" :  this.obilazakGlaId
        }
    }
  ]
    }
    return this
        .global
        .getData(data);

  }

  insertObilazakGla() {

    let data : ICore.IData = {
        "queries": [
    {
        "query": "spMobTerkom_ObilazaInsertGla",
        "params": {
            "operaterid" : "@@operaterid",
            "parstruid" : this.narudzbaServis.parstruid,
            "datum" : 	 new Date().toISOString(),
            "lat" : this.nativeGeolocationProvider.latitude,
            "lon" : this.nativeGeolocationProvider.longitude,
            //"azurirajpostojeci" : this.azuriranje ? 1 : 0
        }
    }
  ]
    }
    return this
        .global
        .getData(data);
}



  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }


}
