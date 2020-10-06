import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../../providers/core/const-provider';

//import { mojprovider } from '../../providers/mojprovider/mojprovider';

/**
 * Generated class for the InventuraUnoskolicinePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inventura-unoskolicine',
  templateUrl: 'inventura-unoskolicine.html',
})
export class InventuraUnoskolicinePage extends BasePage {
  item: any = { kolicina: 0 };
  items: any;
  nemapodataka=false;

  constructor(public navCtrl: NavController, public storagee: Storage, public navParams: NavParams, public viewCtrl: ViewController, public constant: ConstProvider
    , public storage: StorageProvider
    //,public mojprovider: mojprovider
  ) {
    super();
    
  }

  ionViewDidEnter() {
    this.item = this.navParams.data;

    let elem = <HTMLInputElement>document.querySelector('.some-class');
    if (elem) { setTimeout(() => { elem.focus(); }, 550); }
    if (elem) { elem.focus(); }
    console.log('elem', elem);
    let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoninvid');
    
    this.storage.getFromStorage(key.keyvalue, null, true).then(element => {
      this.item.invid=element;
      this.vecUneseneKolicine();
      
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventuraUnoskolicinePage');


    let elem = <HTMLInputElement>document.querySelector('.some-class');
    if (elem) { setTimeout(() => { elem.focus(); }, 550); }
    if (elem) { elem.focus(); }
    console.log('elem', elem);
    this.vecUneseneKolicine();
  }

  potvrdi() {
    this.viewCtrl.dismiss(this.item);
  }

  getData() {
    // "@action = 4, @invid =" + this.mojprovider.invid + ", @robaid =" + this.item.robaid
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmp_MOBINV",
          "params": {
            "action": 4,
            "invid": this.item.invid,
            "robaid": this.item.robaid
          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }


  getData2(item) {
    // @action = 5, @invid =" + this.mojprovider.invid + ", @robaid =" + this.item.robaid + ", @detid =" + item.detid + ", @brisi = 1"
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmp_MOBINV",
          "params": {
            "action": 5,
            "invid": this.item.invid,
            "robaid": this.item.robaid,
            "detid": item.detid,
            "brisi": 1

          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }


  vecUneseneKolicine() {
    // let sql = "@action = 4, @invid =" + this.mojprovider.invid + ", @robaid =" + this.item.robaid;
    // console.log(sql);
    // this.mojprovider.callwebserviceTrgovine(sql).subscribe((items) => {
    this.getData().then(x => {
      this.items = x.items;

      if (this.items.length == 0) {
        this.nemapodataka = true;
      }
      else {
        this.nemapodataka = false;

        this.items = x.items;
        console.log('vec unesene kolicine: ', this.item);
      }
    });
  }




  runninggrouptotals() {
    let total = 0;
    if (this.items) {
      this.items.forEach((item) => {
        total += item.kolicina;
      });
    }
    return total;
  }



  delete(item) {
    // let sql = "@action = 5, @invid =" + this.mojprovider.invid + ", @robaid =" + this.item.robaid + ", @detid =" + item.detid + ", @brisi = 1";
    // console.log(sql);
    // this.mojprovider.callwebserviceTrgovine(sql).subscribe((items) => {
    this.getData2(item).then(x => {
      this.items = x.items;

      if (this.items.length == 0) {
        this.nemapodataka = true;
      }
      else {
        this.nemapodataka = false;

        console.log('brisanje itema ', this.item);
        this.vecUneseneKolicine();
      }
    });


  }

  nazad() {
    this.viewCtrl.dismiss();
  }
}
