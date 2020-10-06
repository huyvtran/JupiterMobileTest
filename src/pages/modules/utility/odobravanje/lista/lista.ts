import { ConstProvider } from './../../../../../providers/core/const-provider';
import { Component } from '@angular/core';

import { Platform, NavController, IonicPage, ToastController, ModalController, ItemSliding, AlertController} from 'ionic-angular';
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";


import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { UtilityDMSService } from '../../../../../providers/modules/utility/utility-dms-provider';
import { OdobravanjeListaProvider } from '../../../../../providers/modules/utility/odobravanje/odobravanje-lista-provider'; 
//import { OdobravanjeDohvatRepxaProvider } from '../../../../../providers/modules/utility/odobravanje/odobravanje-dohvatRepxa-provider'; 
import { StorageProvider } from '../../../../../providers/core/storage-provider';

import _ from 'lodash';
import { isTrueProperty } from 'ionic-angular/umd/util/util';

@IonicPage()
@Component({
  selector: 'page-utility-odobravanje-lista',
  templateUrl: 'lista.html',
  providers: [File, FileOpener, UtilityDMSService, OdobravanjeListaProvider]
})

export class UtilityOdobravanjeListaPage extends BasePage {
  data: any;
  dokument: any
  dokumentid: number = 0;
  vrstadokid: number [];
  vrstadokumenta: any;
  statusid: number = 0;
  
  //filter - vrste dokumentata za odabir
  datafilter: any;
  dataFilter: Array<any>;
  dataFilterSpremi: any = []; 
  // vrstadokDefaults: any = []; -- bila
  dataFilterDefaultVrDok: any = []; 

  //var za konfigurator vidljivosti polja
  indpartner: number = 0;
  indbrojdok: number = 0;
  inddatumdok: number = 0;
  indvrstadok: number = 0;
  indiznos: number = 0;
  napomena: number = 0;
  indoperater: number = 0;
  inddatumisporuke: number = 0;
  indlokacija: number = 0;
  indskladiste: number = 0;
  indorgshema: number = 0;
  indstatus: number = 0;

  direktorij: string = "JupiterMobileDocs";
  constructor(public navCtrl: NavController, 
              private dmsProvider: UtilityDMSService, 
              private toastCtrl: ToastController, 
              private modalCtrl: ModalController, 
              private file: File,
              private alertCtrl: AlertController,
              private vrstadokProvider: OdobravanjeListaProvider,  
              private storage: StorageProvider,
              private platform : Platform ) {
              super();

    console.log("ušo1");
    console.log(file);
    console.log("ušo2");

  //obrisi folder
    this.removeDir(this.direktorij)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log("ušo3");
        this.global.logError(err, false);
      });
  }


  ionViewWillEnter() {
    console.log("ušo4");
    this.getData(); 
    this.napuniVrsteDok();  
  }


  getData() {
    this.getDataDef().then(res => {
      console.log(res);
      this.data = res ? res.dokumenti : null;
      console.log("ušoDatafilter", this.data);
      this.datafilter = this.data;
      this.data =  _.filter(this.datafilter, (v) => _.includes(this.dataFilterSpremi, v.vrstadokid))
      console.log("test1FIlter", this.data);
      console.log("spremiOznacene2:", this.dokumentid);
    }).catch(err => this.global.logError(err, false));
  }
    

  doRefresh(refresher) {
    this.getData();
    setTimeout(() => {
      refresher.complete();
    },280);
    if (this.dataFilterSpremi != null) {
      this.datafilter.forEach(defaults => {  
        if (this.dataFilterSpremi.indexOf((defaults.vrstadokid)) == -1)  
          {
            this.dataFilterSpremi.push(defaults.dataFilterSpremi); 
          } 
      });
      console.log("spremiOznacene1:", this.dataFilterSpremi);
    } else {
        this.napuniVrsteDok();  
    };
  }


  buttonState(item) {
    if (item != null && item.attachments)
      return false;
    return true;
  }


  getDataDef() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMob_Odobravanje_Grid", 
          "params": {
            "action": "allDocs",
            "operateriid": "@@operateriid"// "74"     //"@@operateriid"  //"74" 
          },
          "tablename": "dokumenti"
        }, 
      ]
    }
    return this.global.getData(dataDef);
  }


  removeDir(dirname) {
    return this.file.removeRecursively(this.file.externalApplicationStorageDirectory, dirname);
  }


  getFileSystemFile(path) {
    let dataDef: ICore.IData = {
      files: {
        filepath: path,
        endpoint: "files"
      }
    }
    return this.global.getData(dataDef);
  }


  getDMSFile(dokId) {
    let data: ICore.IData = this.getDMSFileDefinition(dokId);
    return this
      .global
      .getData(data);
  }


  getDMSFileDefinition(dokId): ICore.IData {
    let data: ICore.IData = {
      "queries":
        [
          {
            "query": "spMobDmsQuery",
            "params": {
              "action": "getDoc",
              "dokid": dokId
            },
            "singlerow": true
          }
        ]
    }
    return data;
  }


  pregled(item) {
    //ako postoji attachment prikazi
    if (item.attachments.length === 0)
      this.presentToast("Nema povezanih dokumenata")
    else if (item.attachments.length === 1) {
      //slidingItem.close();
      if (item.attachments[0].dokid != null) {
        this.getDMSFile(item.attachments[0].dokid)
          .then(x => {
            this.variable.loaderActive = true;
            this.dokument = x.dokblob;
            this.dmsProvider.saveFileOnDevice(this.dokument, item.attachments[0].naziv);
          })
      } else if (item.attachments[0].url != null) {
        this.getFileSystemFile(item.attachments[0].url)
          .then(x => {
            this.variable.loaderActive = true;
            this.dokument = x.blob;
            this.dmsProvider.saveFileOnDevice(this.dokument, item.attachments[0].naziv);
          })
      }
    }
    else if (item.attachments.length > 1) {
      //slidingItem.close();
      //digni modal sa popisom dokumenata
      //this.presentModal(item.attachments)
      this.navCtrl.push("UtilityOdobravanjePregledViewPage", { item })
    }
  }


  presentModal(data) {
    this.navCtrl.push("UtilityOdobravanjePregledViewPage", { data: data })  
  }


  odobri(item) {
    this.presentModalDokumentDet(item, "odobri");
  }


  odbaci(item) {
    this.presentModalDokumentDet(item, "odbaci");
  }


  odobribrzi(item) {
    this.azur(item.dokumentid, "odobri",'', item.statusid, item.tablename).then(x => {
    this.getData();
  });
  }


  odbacibrzi(item) {
    console.log(item);
    this.azur(item.dokumentid, "odbaci",'', item.statusid, item.tablename).then(x => {
    this.getData();
  }); 
  }


  azur(dokumentid: number, status: string, data: any, statusid: number, tablename: string) {
    console.log("azur");    
    console.log(data);        
    //console.log(this.getData);
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMob_Odobravanje_Odobri",   
          "params": {
            "dokumentid": dokumentid,          
            "operateriid": "@@operateriid", ///"74", //"@@operateriid",  //"74", 
            "napomena": data.napomena,
            "status": status,
            "statusid": statusid,  
            "tablica": tablename   
          }
        }
      ]
    }
    //return null;
    return this.global.getData(dataDef);
  }


  presentModalDokumentDet(item, status: string) {
    try {
      this.global.modal = this
        .modalCtrl   
        .create('UtilityOdobravanjeDetaljiDetPage', { item, status: status }); 
      this.global.modal.present();
      this.global.modal.onDidDismiss(data => {
        console.log(data);
        if (data != null && data.type == "ok") {
          try {
          this.azur(item.dokumentid, status, data.parametri, item.statusid, item.tablename).then(x => {  
          this.getData();
            });
          } catch (e) {
            this.global.logError(e, true);
          }
        }
        this.global.modal = null;
      })
    } catch (e) {
      this.global.logError(e, true);
    }
  }


  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  setCard(item) {
    if (this.dokumentid == item.dokumentid)
     this.dokumentid = 0;   
    else
      this.dokumentid = item.dokumentid; 
  }


  dataExists(): boolean {
    if (this.data != null && this.data.length > 0) {
      return true;
    }
    else
      return false;
  }

  
  // inicijalno punjenje vrstadok za filtriranje dok. 
  napuniVrsteDok() {
    return new Promise((resolve)=> {
        this.dataFilterDefaultVrDok = [];
        this.vrstadokProvider.getVrstaDokumenta()
        .then((res) => { 
          this.dataFilterDefaultVrDok = res; 
          this.dataFilterDefaultVrDok.forEach(defaults => {     
            this.dataFilterSpremi.push(defaults.vrstadokid); 
          });
          console.log('VrstaDok defaults: ',res)})
        resolve();
      }) 
  }
 
 
  // forma za filtriranje dokumenata 
  prikazdokumenataizbor() {
    this.vrstadokProvider.getVrstaDokumenta()
    .then((res) => {
        this.vrstadokumenta = res;
        const alert = this.alertCtrl.create();
        //alert.enableBack();
        alert.setTitle("Prikaži samo:");
        console.log(this.vrstadokProvider);
        this.vrstadokumenta.forEach(vrsta => {       
          console.log("datafilter", this.dataFilterSpremi);
          if (this.dataFilterSpremi.indexOf((vrsta.vrstadokid)) > -1) {
          alert.addInput({
                name: 'checkbox' + String(vrsta.vrstadokid),
                type: 'checkbox',
                label: vrsta.dokument,
                value: String(vrsta.vrstadokid),        
                checked: true
              });
            }
            else {
              alert.addInput({
                name: 'checkbox' + String(vrsta.vrstadokid),
                type: 'checkbox',
                label: vrsta.dokument,
                value: String(vrsta.vrstadokid),        
                checked: false  
              });
            }
          }
        );
                
              
       alert.addButton(
          {
            text: 'Odustani',
            role: 'cancel',
            handler: () => {
                this.vrstadokumenta.vrstadokid = [];  
            }
          }
       );
        

        alert.addButton(
          {
            text: 'Potvrdi',
            handler: dataFilter => {
                this.vrstadokid = dataFilter;
                console.log(parseInt(dataFilter));
  
                console.log("UšoDatafilter22");
                var ids = dataFilter.map(function(item) {
                  return parseInt(item, 10);
              });

                console.log(ids);

                this.data =  _.filter(this.datafilter, (v) => _.includes(ids, v.vrstadokid))
                console.log(this.data);
                console.log(this.datafilter); 

                this.dataFilterSpremi = [];
                this.data.forEach(defaults => {  
                  if (this.dataFilterSpremi.indexOf((defaults.vrstadokid)) == -1)  
                    {
                      this.dataFilterSpremi.push(defaults.vrstadokid); 
                    } 
                });
                console.log("spremiOznacene:", this.dataFilterSpremi);
              }     
            }
        );
        alert.present();

        let deregisterBackButton = this.platform.registerBackButtonAction(() => {
          // dismiss on back press
          alert.dismiss();
        }, 401);

        // deregister handler after modal closes
        alert.onDidDismiss(() => {
          deregisterBackButton();
        });

        return this
       // .global
        .getData();
        
    })
  }
  
  
  //dohvat repixa
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
              "Id": item.dokumentid,
              "repx": item.repxname
            } 
          }
        ]
    }
    return this
      .global
      .getData(data, properties);
  }


  //pregled repixa 
  pregledrpx(item) {
    console.log(item)
    this.getFile(item)
      .then(x => {
        this.variable.loaderActive = true;
        console.log(x)
        //this.url = this.file.externalApplicationStorageDirectory + this.dmsProvider.direktorij + "/" + item.opis + item.id + ".pdf"
        this.dmsProvider.saveFileOnDevice(x.blob, item.brojdok + ".pdf");
      })
      .catch((err) => console.log(err))
  }


}