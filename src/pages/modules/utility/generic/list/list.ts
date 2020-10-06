import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
import * as IGenericSettings from '../../../../../interfaces/modules/utility/generic/IGenericSettings';

import * as Moment from 'moment';

import { UtilityDMSService } from '../../../../../providers/modules/utility/utility-dms-provider';
import { GenericFormProvider } from '../../../../../providers/modules/utility/generic/generic_form_provider';
import { SignaturePage } from '../../../shared/signature/signature/signature';

@IonicPage()
@Component({
  selector: 'page-dms-list',
  templateUrl: 'list.html'
})
export class GenericListPage extends BasePage {

  //ulazni parameri u granulu
  settings: IGenericSettings.Settings

  //parametri za slanje na servis
  dataDefParams: any;

  id: number = 0;
  dokumenti: any;

  //ulazne postavke izgleda liste
  itemListSettings: any;
  table: string;
  constructor(public navCtrl: NavController,private navParams : NavParams, private genericProvider: GenericFormProvider, private dmsProvider: UtilityDMSService, private modal: ModalController) {
    super();
    //spMobProd_Fakture //spMobProd_PonGla
 
    this.settings = this.navParams.data;

    this.bindParameters().then((res) => {
      this.setQueryString();
    })

  }

  slideItem(item) {
    if (this.id != 0)
      this.setCard(item)
  }


  ionViewWillEnter() {

    if (this.genericProvider.refreshData)
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

  setCard(item) {

    if (this.id == item.id)
      this.id = 0;
    else
      this.id = item.id;

  }



  getDataDef() {
    try {
      let dataDef: ICore.IData = {

        "queries": [
          {
            "query": this.settings.procedura,
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

  bindParameters(): Promise<any> {

    try {
      return new Promise((resolve, reject) => {
        try {

          if(this.settings.filter.raspondana){
            this.genericProvider.parametri.datumod = this.genericProvider.getDatePeriod(this.settings.filter.raspondana);
          }
          this.genericProvider.parametri.partneriid = this.settings.filter.partneriid ? this.settings.filter.partneriid : null;
          this.genericProvider.parametri.partnerinaziv = this.settings.filter.partnerinaziv ? this.settings.filter.partnerinaziv : '';

          resolve();
        }
        catch (err) {
          reject(err)
        }
      });
    }
    catch (err) {
      this.global.presentToast(err);
    }

  }


  getFile(item) {
    let properties: ICore.IPropertiesCore = {
      customApiEndPoint: "repx"
    }

    let data: ICore.IData = {
      "queries":
        [
          {
            "query": "stora",
            "params": {
              "Id": item.id,
              "repx": item.repx
            }
          }
        ]
    }
    return this
      .global
      .getData(data, properties);
  }

  info(slide, item) {
    this.navCtrl.push('GenericInfoPage', { data: item })
      .then((res) => {
        slide.close();
      })
  }


  pregled(item) {
    console.log(item)
    this.getFile(item)
      .then(x => {
        this.variable.loaderActive = true;
        console.log(x)
        //this.url = this.file.externalApplicationStorageDirectory + this.dmsProvider.direktorij + "/" + item.opis + item.id + ".pdf"
        this.dmsProvider.saveFileOnDevice(x.blob, item.opis + item.id + ".pdf");
      })
      .catch((err) => console.log(err))
  }



  openSignaturePage(item) {
    this.global.modal = this
      .modal
      .create(SignaturePage, {data: item}, { enableBackdropDismiss: false });

    this.global.modal.present();

    this.global.modal.onDidDismiss((kolicina) => {
      this.global.modal = null;
    });
  }




  searchOptions() {

    setTimeout(() => {
      let modal = this.modal.create("GenericFilterListPage", { data: null })
      modal.present();

      modal.onDidDismiss(data => {
        if (data) {
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

  openDMSPage(item) {
    this.navCtrl.push('DMSGenericPage', { entityname: item.opis + 'Mob', entityid: item.id })
  }


  setQueryString() {

    return new Promise((resolve, reject) => {
      try {
        this.genericProvider.searchString = Moment(this.genericProvider.parametri.datumod).format("DD.MM.YYYY") + ' - ' + Moment(this.genericProvider.parametri.datumdo).format("DD.MM.YYYY");
        if (this.genericProvider.parametri.partneriid)
          this.genericProvider.searchString = this.genericProvider.searchString + ', ' + this.genericProvider.parametri.partnerinaziv;

        resolve();
      }
      catch (err) {
        reject(err)
      }
    });
  }


  createQueryParams(): Promise<any> {

    return new Promise((resolve, reject) => {
      try {

        this.dataDefParams = {
          "datumod": this.genericProvider.parametri.datumod,
          "datumdo": this.genericProvider.parametri.datumdo,
          "partneriid": this.genericProvider.parametri.partneriid
        }

        resolve(this.dataDefParams);
      }
      catch (err) {
        reject(err)
      }

    });

  }


}
