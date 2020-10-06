import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';

import * as ICore from '../../../../../interfaces/iCore';
import * as Moment from 'moment';
import { UtilityDMSService } from '../../../../../providers/modules/utility/utility-dms-provider';
import { BasePage } from '../../../../../providers/base/base-page';

@IonicPage()
@Component({
  selector: 'dms-list',
  templateUrl: 'list.html'
})
export class DMSListPage extends BasePage {
  //parametri za slanje na servis
  dataDefParams: any;

  dokumenti: any;
  dokument: string;


  constructor(private dmsProvider: UtilityDMSService, private modal: ModalController) {
    super();

    this.setQueryString();
  }



  ionViewWillEnter() {
    this.createQueryParams()
    .then((res) => {
      this.getData();
    })

  }

  getData() {
    this.getDataDef()
      .then(res => {
        this.dokumenti = res ? res.dokumenti : null;

      }).catch(err => this.global.logError(err, false));
  }





  getDataDef() {
    try {
      let dataDef: ICore.IData = {

        "queries": [
          {
            "query": "dms.spDocumentsSearch",
            "params": this.dataDefParams,
            "tablename": "dokumenti"
          }
        ]
      }

      return this.global.getData(dataDef);
    }
    catch (err) {
      this.global.presentToast(err);
    }

  }


  showFile(item) {
    console.log(item)
    this.getDetails(item.dokid).then(x => {
      this.dokument = x.dokblob;
    })
      .then((res) => {
        //konvertiraj
        this.variable.loaderActive = true;
        this.dmsProvider.saveFileOnDevice(this.dokument, item.naziv);
      })
      .catch((err) => {
        this.variable.loaderActive = false;
        this.global.logError(err);
      })
  }


  getDetails(dokid) {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobDmsQuery",
          "params": {
            "action": "getDoc",
            "dokId": dokid,
            "ParentFolderId": null,
          },
          "singlerow": true
        }
      ]
    }
    return this.global.getData(dataDef);

  }

  searchOptions() {

    setTimeout(() => {
      let modal = this.modal.create("DMSFilterListPage", { data: null })
      modal.present();

      modal.onDidDismiss(data => {
        if (data) {
          //console.log(this.dmsProvider.parametri)
          this.setQueryString();
          this.createQueryParams()
            .then((res) => {
              this.getData();
            })
            .catch(err => this.variable.loaderActive = false)

        }
      });
    }, 200);


  }

  setQueryString() {

    return new Promise((resolve, reject) => {
      try {
        this.dmsProvider.searchString = Moment(this.dmsProvider.parametri.datumdodanood).format("DD.MM.YYYY") + ' - ' + Moment(this.dmsProvider.parametri.datumdodanodo).format("DD.MM.YYYY");
        if (this.dmsProvider.parametri.kreator)
          this.dmsProvider.searchString = this.dmsProvider.searchString + ', Kreator: ' + this.dmsProvider.parametri.kreator;
        
          if (this.dmsProvider.parametri.vlasnik)
          this.dmsProvider.searchString = this.dmsProvider.searchString + ', Vlasnik: ' + this.dmsProvider.parametri.vlasnik;

          if (this.dmsProvider.parametri.tekst)
          this.dmsProvider.searchString = this.dmsProvider.searchString + ', Tekst: ' + this.dmsProvider.parametri.tekst;

          if (this.dmsProvider.parametri.naziv)
          this.dmsProvider.searchString = this.dmsProvider.searchString + ', Naziv: ' + this.dmsProvider.parametri.naziv;

        resolve();
      }
      catch (err) {
        reject(err)
      }
    });
  }


  createQueryParams(): Promise<any> {
    //console.log(this.dmsProvider.parametri)
    return new Promise((resolve, reject) => {
      try {

        this.dataDefParams = {
          "DatumDodanoOd": this.dmsProvider.parametri.datumdodanood,
          "datumdodanodo": this.dmsProvider.parametri.datumdodanodo,
          "vlasnik": this.dmsProvider.parametri.vlasnik,
          "kreator": this.dmsProvider.parametri.kreator,
          "naziv": this.dmsProvider.parametri.naziv,
          "tekst": this.dmsProvider.parametri.tekst
        }

        resolve(this.dataDefParams);
      }
      catch (err) {
        reject(err)
      }

    });

  }



}
