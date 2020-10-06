import { Component } from '@angular/core';
import { ViewController, IonicPage, NavParams, ModalController } from 'ionic-angular';


import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';


@IonicPage()
@Component({
  selector: 'page-utility-odobravanje-detalji-det',
  templateUrl: 'detalji-det.html'
})
export class UtilityOdobravanjeDetaljiDetPage extends BasePage {
  private item: any;
  private status: string;
  private statusText: string;
  private naslovText: string;
  private napomena: string;
  private parametri: any = {};
  private data: any = [];


  constructor(private viewCtrl: ViewController, 
              private navParams : NavParams, 
              private modalCtrl : ModalController) {
              super();
    this.item = this.navParams.get("item");
    this.status = this.navParams.get("status");

    if (this.status == "odobri") {
      this.statusText = "odobri";
    } else {
      this.statusText = "odbaci";
    }

    if (this.status == "odobri") {
      this.naslovText = "Odobri - napomena";
    } else {
      this.naslovText = "Razlog odbacivanja";
    }
  }

  ionViewWillEnter() {
    this.getData();
  }

  
  setStatus() {
    this.getDataProvjera();
  }
  

  odustani() {
    this.viewCtrl.dismiss({type:"cancel", parametri:this.parametri });
  }


  trazilica(action) {
    try
    {
        var query: ICore.IData = null;
        if (action == "orgshema") {
          query = {
            "queries": [
              {
                "query": "spMobUtilityKupQuery",
                "params": {
                  "action": "getOrgShema",
                  "operateriid": "@@operateriid"
                }
              }
            ]
          }
        } else if (action == "nacinplacanja") {
          query = {
            "queries": [
              {
                "query": "spMobUtilityKupQuery",
                "params": {
                  "action": "getNacinPlacanja",
                  "operateriid": "@@operateriid"
                }
              }
            ]
          }
        }

        this.global.modal = this
        .modalCtrl
        .create('ModalNavPage', {page: 'SharedTrazilicaTreePage', action: action, query});
        this.global.modal.present();
        this.global.modal.onDidDismiss(data => {
            if (data!= null) {
                try
                {
                    if (action == "orgshema") {
                        this.parametri.orgshemaid = data.id;
                        this.parametri.orgshemanaziv = data.naziv;
                    } else if (action == "nacinplacanja") {
                      this.parametri.pronacinnaplateid = data.id;
                      this.parametri.pronacinnaplate = data.naziv;
                    }
                } catch(e) {
                    this.global.logError(e, true);
                }
            }
            this.global.modal = null;
        })
    } catch(e) {
        this.global.logError(e, true);
    }
  }

  clearValue(slide, value, name) {
    slide.close();
    this.parametri[name] = null;
    this.parametri[value] = null;
  }


  getData() {
    this.getDataDef().then(res => {
      this.data = res;
      console.log(this.data);
    }).catch(err => this.global.logError(err, false));
  }

  getDataDef() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobUtilityKupQuery",
          "params": {
            "action": "getPostavke",
            "operateriid": "@@operateriid"
          },
          "singlerow": true
        }
      ]
    }
    return this.global.getData(dataDef);
  }


  getDataProvjera() {
    this.getDataDefProvjera().then(res => {
        this.viewCtrl.dismiss({type:"ok", parametri:this.parametri });
        console.log("ušo6557")
    }).catch(err => this.global.logError(err, false));
  }


   getDataDefProvjera() {
    console.log("ušo333")
     let dataDef: ICore.IData = {
     
       "queries": [
        {
           "query": "spMob_Odobravanje_Odobri",
           "params": {
             "napomena": this.parametri.napomena,
            // "tablica": "nabzahgla",
            // "statusid": this.dokumenti.statusid
            //  "orgshemaid": this.parametri.orgshemaid,
            //  "pronacinnaplateid": this.parametri.pronacinnaplateid,
            //  "redodobravanja": this.data.red
            //  ,"model": this.data.model
           }
         }
       ]
     }
     return this.global.getData(dataDef, {showLoader: false});
  }
  
}