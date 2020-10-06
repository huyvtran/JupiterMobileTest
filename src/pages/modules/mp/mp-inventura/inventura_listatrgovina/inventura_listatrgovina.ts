import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Platform, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../../providers/core/const-provider';


//import { InventuraTrazilicarobePage } from '../../../../../pages/modules/crm/mp-inventura/inventura-trazilicarobe/inventura-trazilicarobe';
//import { mojprovider } from '../../providers/mojprovider/mojprovider';

/**
 * Generated class for the ListaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inventura-listatrgovina',
  templateUrl: 'inventura_listatrgovina.html',
})
export class Inventura_ListatrgovinaPage extends BasePage {
  searchQuery: string = '';
  items: any[] = [];
  itemsoriginal: any[] = [];
  x: number; y: number;
  nemapodataka = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public _platform: Platform,
    public storagee: Storage,
    public constant: ConstProvider, 
    public storage: StorageProvider,
    //public mojprovider: mojprovider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController
  ) {
    super();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaPage');
    // let alert = this.alertCtrl.create({
    //   title: 'Vrsta inventure?',
    //   subTitle: 'Online - Svaka evidencija se odmah šalje na server. Potrebna stalna internetska veza. <br><br> Offline - Evidencije se skupljaju na mobilnom uređaju, a na server se šalju tek na zahtjev. Internetska veza je potrebna samo kod preuzimanja liste robe i kod slanja evidencije na server.',
    //   buttons: [
    //     {
    //       text: 'ONLINE',
    //       role: 'ne',
    //       handler: () => {
    //         console.log('Ne clicked');
    //         alert.dismiss();
    //       }
    //     },
    //     {
    //       text: 'OFFLINE',
    //       handler: () => {

    //         console.log('Da clicked');
    //         alert.dismiss();
    //         this.navCtrl.parent.select(1);
    //       }
    //     }
    //   ]
    // });
    // alert.present();
  }

  ngOnInit() {
    this.getlistfromwebservice(0);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    console.log('search...');
    if (val.trim() == '') {
      this.items = this.itemsoriginal;
    } else {
      this.items = this.itemsoriginal.filter((item) => {
        return (item.naziv.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    this.x = this.items.length;
    this.y = this.itemsoriginal.length;
  }

  prikaziRobu(item) {
    this.navCtrl.push('InventuraTrazilicarobePage', item);
  }

  // getlistfromwebservicecore() {
  //   //this.mojprovider.callwebservice("test 4").subscribe((items) => { this.items = items; });
  //   this.getData().then(x => {
  //   this.items = x.items;

  //     if (this.items.length == 0) {
  //       this.nemapodataka = true;
  //     }
  //     else {
  //       this.nemapodataka = false;
  //     }

  //   });
  // }

  odustani(){
    this.navCtrl.setRoot('MPInventuraPocetnaPage');
  }


doRefresh(refresher) {

  this.getlistfromwebservice(refresher);
  // this.mojprovider.callwebserviceTrgovine("@action = 1")
  //   .subscribe((items) => {

  //     refresher.complete();
  //     console.log(items);

  //     console.log('items.length', items.length);
  //     if (items.length > 0) {

  //       if (typeof items[0].errornumber == 'undefined' || items[0].errornumber == 0) { // no error
  //         this.items = items;
  //         this.itemsoriginal = items;
  //         this.x = this.items.length;
  //         this.y = this.itemsoriginal.length;
  //         this.storage.set('trgovine', items);

  //       } else { // error
  //         console.log(items[0].errdescription);
  //         if (items[0].errornumber == -2) {
  //           let alert = this.alertCtrl.create({
  //             title: 'Login expired!',
  //             subTitle: '',
  //             buttons: [{
  //               text: 'OK',
  //               handler: () => {
  //                 console.log('OK clicked');
  //               }
  //             }]
  //           });
  //           alert.present();
  //           //this.app.getRootNav().setRoot(login, {}, {animate: true, direction: 'forward'});
  //         }
  //         return;
  //       } // end of error
  //     } // end of items.length > 0
  //   }
  //     ,
  //     err => {
  //       console.log("http fail!");
  //       refresher.complete();
  //       this.connectionAlert();
  //     }
  //   ) // end of callwebservice
}

getData(){
  let dataDef: ICore.IData = {
    "queries": [
      {
      "query": "spmp_MOBINV",
      "params":{"action": 1                
      },
      
      "tablename": "items"
      }
  ]
  }

  return this.global.getData(dataDef);

}

getlistfromwebservice(refresher) {

  // let loading = this.loadingCtrl.create({
  //   content: 'dohvat liste trgovina ...'
  // });
  // this.items = [];

  // loading.present();
  // // this.loadheader();

  // this.mojprovider.callwebserviceTrgovine("@action = 1")
  //   .subscribe((items) => {

  //     loading.dismiss();
  //     console.log(items);

  //     console.log('items.length', items.length);
  //     if (items.length > 0) {

  //       if (typeof items[0].errornumber == 'undefined' || items[0].errornumber == 0) { // no error
  //         this.items = items;
  //         this.itemsoriginal = items;
  //         this.x = this.items.length;
  //         this.y = this.itemsoriginal.length;
  //         this.storage.set('trgovine', items);

  //       } else { // error
  //         console.log(items[0].errdescription);
  //         if (items[0].errornumber == -2) {
  //           let alert = this.alertCtrl.create({
  //             title: 'Login expired!',
  //             subTitle: '',
  //             buttons: [{
  //               text: 'OK',
  //               handler: () => {
  //                 console.log('OK clicked');
  //               }
  //             }]
  //           });
  //           alert.present();
  //           //this.app.getRootNav().setRoot(login, {}, {animate: true, direction: 'forward'});
  //         }
  //         return;
  //       } // end of error
  //     } // end of items.length > 0
  //   }
  //     ,
  //     err => {
  //       console.log("http fail!");
  //       loading.dismiss();
  //       this.connectionAlert();
  //     }
  //   ) // end of callwebservice

  this.getData().then(x => {
    this.items = x.items;

      if (this.items.length == 0) {
        this.nemapodataka = true;
      }
      else {
        this.nemapodataka = false;
          
          this.itemsoriginal = x.items;
          this.x = this.items.length;
          this.y = this.itemsoriginal.length;
          let key=this.constant.storageKeys.find(item => item.keyname == 'inventuralistatrgovinaon');
          
          this.storage.addToStorage(key.keyvalue, null, this.items, true);
      }
      if(refresher){
        refresher.complete();
      }

    });
}



connectionAlert() {
  let alert = this.alertCtrl.create({
    title: 'Connection Error',
    subTitle: 'Provjerite svoju internet vezu.',
    buttons: ['OK']
  });
  alert.present();
}


}
