import { ConstProvider } from './../../../../../providers/core/const-provider';
import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController, ModalController, ItemSliding } from 'ionic-angular';
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { UtilityDMSService } from '../../../../../providers/modules/utility/utility-dms-provider';


@IonicPage()
@Component({
  selector: 'page-utility-dokumenti-kupuraireks',
  templateUrl: 'dokumenti.html',
  providers: [File, FileOpener, UtilityDMSService]
})
export class UtilityKupUraIreksDokumentiPage extends BasePage {
  data: any;
  dokument: any

  kupprometid: number = 0;

  direktorij: string = "JupiterMobileDocs";
  constructor(public navCtrl: NavController, private dmsProvider: UtilityDMSService, private toastCtrl: ToastController, private modalCtrl: ModalController, private file: File) {
    super();


    //obrisi folder

    this.removeDir(this.direktorij)
      .then((res) => console.log(res))
      .catch((err) => {
        this.global.logError(err, false);
      });
  }

  ionViewWillEnter() {
    this.getData();
  }


  getData() {
    this.getDataDef().then(res => {
      this.data = res ? res.dokumenti : null;
    }).catch(err => this.global.logError(err, false));
  }

  getDataDef() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobUtilityKupQuery",
          "params": {
            "action": "allDocs",
            "operateriid": "@@operateriid"
          },
          "tablename": "dokumenti"
        },
        {
          "query": "spMobUtilityKupQuery",
          "params": {
            "Action": "getMimeTypes"
          },
          "tablename": "mimetypes"
        }
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
    let data : ICore.IData = {
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
    //ako postoji attachment pprikazi
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
      this.navCtrl.push("UtilityKupUraDokumentiViewPage", { item })
    }

  }


  presentModal(data) {
    this.navCtrl.push("UtilityKupUraDokumentiViewPage", { data: data })

    // this.global.modal = this
    //   .modalCtrl
    //   .create("UtilityKupUraDokumentPage", { data: data }, { enableBackdropDismiss: false });


    // this.global.modal.onWillDismiss((data) => {
    //   this.global.modal = null;
    // });

    // this.global.modal.present();

  }

  odobri(item) {
    // this.azur(item.kupprometid, "odobri").then(x => {
    //   this.getData();
    // });
    // console.log("odobravam")
     this.presentModalDokumentDet(item, "odobri");
  }


  odbaci(item) {
    // this.azur(item.kupprometid, "odbaci").then(x => {
    //   this.getData();
    // });
    this.presentModalDokumentDet(item, "odbaci");
  }

  azur(kupprometid: number, status: string, napomena: string) {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobUtilityKupAzur",
          "params": {
            "action": "setStatus",
            "kupprometid": kupprometid,
            "operateriid": "@@operateriid",
            "napomena": napomena,
            "status": status
          }
        }
      ]
    }
    return this.global.getData(dataDef);
  }

  presentModalDokumentDet(item, status: string) {
    // let modal = this.modalCtrl.create('UtilityKupUraDokumentDetPage', {});
    // modal.present();

    // modal.onDidDismiss(data => {
    //   if (data == null)
    //     return;
    // })


    try
    {
        this.global.modal = this
          .modalCtrl
          .create('UtilityKupUraDokumentDetPage', {item, status: status});
        this.global.modal.present();
        this.global.modal.onDidDismiss(data => {
            console.log(data);
            if (data!= null && data.type=="ok") {
                try
                {
                  this.azur(item.kupprometid, status, data.napomena).then(x => {
                    this.getData();
                  });
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
    if (this.kupprometid == item.kupprometid)
      this.kupprometid = 0;
    else
      this.kupprometid = item.kupprometid;
  }

  dataExists(): boolean {
    console.log(this.data);
    if (this.data != null && this.data.length > 0)
        return true;
    return false;
}
}

