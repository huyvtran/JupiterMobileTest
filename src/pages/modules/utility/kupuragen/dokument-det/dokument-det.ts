import { Component } from '@angular/core';
import { ViewController, IonicPage, NavParams, ModalController } from 'ionic-angular';


import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';


@IonicPage()
@Component({
  selector: 'page-utility-kupuragen-dokument-det',
  templateUrl: 'dokument-det.html'
})
export class UtilityKupUraGenDokumentDetPage extends BasePage {
  private item: any;
  private status: string;
  private statusText: string;

  private napomena: string;

  private parametri: any = {};

  private data: any = [];



  constructor(private viewCtrl: ViewController, private navParams : NavParams, private modalCtrl : ModalController) {
    super();
    this.item = this.navParams.get("item");
    this.status = this.navParams.get("status");

    if (this.status == "odobri") {
      this.statusText = "odobri";
    } else {
      this.statusText = "odbaci";
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
                "query": "spMobUtilityKupGenQuery",
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
                "query": "spMobUtilityKupGenQuery",
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
                      this.parametri.nacinnaplateid = data.id;
                      this.parametri.nacinnaplate = data.naziv;
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
          "query": "spMobUtilityKupGenQuery",
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
    }).catch(err => this.global.logError(err, false));
  }

  getDataDefProvjera() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobUtilityKupGenAzur",
          "params": {
            "action": "validacija",
            "kupprometid": this.parametri.kupprometid,
            "operateriid": "@@operateriid",
            "status": this.status,
            "memo1": this.parametri.memo1,
            "memo2": this.parametri.memo2,
            "memo3": this.parametri.memo3,
            "orgshemaid": this.parametri.orgshemaid,
            "nacinnaplateid": this.parametri.nacinnaplateid
          }
        }
      ]
    }


    return this.global.getData(dataDef, {showLoader: false});

  }



}

