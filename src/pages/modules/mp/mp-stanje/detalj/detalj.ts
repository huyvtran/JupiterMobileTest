import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ToastController, AlertController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-mp-stanje-detalj',
  templateUrl: 'detalj.html'
})
export class MPStanjeDetaljPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  val;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  item: any = {};
  parametriupita: any = {};
  oznacenosve = false;
  ukupno = 0;
  zaslanje: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public alertCtrl: AlertController, public toastCtrl: ToastController) {
    super();
    this.searchControl = new FormControl();
    this.item = this.navParams.data;



  }
  ionViewWillEnter(){
    
     this.getData().then(x => {
     this.items = x.items;
       this.nemapodataka = false;
       if (this.items.length == 0) {
         this.nemapodataka = true;
       }
       else {
         this.nemapodataka = false;
       }
     });
   }


  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMOB_MpStanjeKartica",
          "params": {
            "robaid": this.item.robaid,
            "trgovinaid": this.item.trgovinaid, 
            "datumod": this.item.datumod,
            "datumdo": this.item.datumdo
          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }


}
