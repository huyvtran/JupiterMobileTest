import { Component } from '@angular/core';
import { NavController, IonicPage, ViewController, NavParams } from 'ionic-angular';
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { UtilityDMSService } from '../../../../../providers/modules/utility/utility-dms-provider';


@IonicPage()
@Component({
  selector: 'page-utility-kupuraireks-dokument-view',
  templateUrl: 'dokumenti-view.html',
  providers: [File, FileOpener, UtilityDMSService]
})
export class UtilityKupUraIreksDokumentiViewPage extends BasePage {
  data: any;
  att: any;
  dokument: any
  
  constructor(params: NavParams, public navCtrl: NavController, private dmsProvider: UtilityDMSService, private viewCtrl: ViewController) {
    super();
    if (params.data != null && params.data.item != null) {
      this.data = params.data.item; 
      this.att = params.data.item.attachments; 
    }
  }



  getFile(item) {
    let dataDef: ICore.IData = {
      files: {
        filepath: item,
        endpoint: "files"
      }
    }
    return this.global.getData(dataDef);
  }


  pregled(item) {
    ////ako postoji attachment pprikazi
    // this.variable.loaderActive = true;
    // this.getFile(item.url)
    //   .then(x => {

    //     this.dokument = x.blob;
    //     //console.log(this.dokument)
    //     this.dmsProvider.saveFileOnDevice(this.dokument, item.naziv);
    //   })


        this.getFile(item.url)
          .then(x => {
            this.variable.loaderActive = true;
            this.dokument = x.blob;
            this.dmsProvider.saveFileOnDevice(this.dokument, item.naziv);
          });
      

  }


  closePage() {
    this
      .viewCtrl
      .dismiss();
  }

}

