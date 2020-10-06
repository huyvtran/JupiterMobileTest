import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ToastController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';
import { ItemSliding } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-biljeske-lista',
  templateUrl: 'lista.html'
})
export class CRMBiljeskeListaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  val;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  item:any={};
  parametriupita: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    super();
    this.searchControl = new FormControl();

    
    
  }
  ionViewWillEnter(){
    this.parametriupita.partneriid = this.navParams.get('partneriid');
    this.parametriupita.partnerinaziv = this.navParams.get('partnerinaziv');
    console.log('stiglo', this.parametriupita.partneriid);
    console.log('parametri upita:', this.parametriupita);
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

  cancel() {
    this.navCtrl.pop();
  }

  openDetalji(item) {
    console.log('item prije slanja u detalje: ', item);

    this.navCtrl.push('CRMKonsolidacijaDetaljiPage', item); //senkovic pokušaj br 1
    // this.navCtrl.push('CRMKonsolidacijaDetaljiPage', this.parametriupita);
    // let dataDef: ICore.IData = {
    //   "queries": [
    //     {
    //     "query": "spMob_KonsolidacijaPartneri",
    //     "params":{"action":333,
    //               "operateriid":'@@operateriid',
    //               "aplikacija":'partneri',
    //               "partnerid":this.parametriupita.partneriid,
    //               "firma": this.parametriupita.firma
    //     },

    //     "tablename": "items"
    //     }
    // ]
    // }

    // return this.global.getData(dataDef, true);



  }


  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spParKontaktQuery",
          "params": {
            "action": 0,
            "partneriId": this.parametriupita.partneriid,
          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

  novabiljeska() {
    this.parametriupita.parkontaktid = 0;

    this.global.modal = this.modalCtrl.create('CRMInsertEditPage', { 'partneriid': this.parametriupita.partneriid, 'partnerinaziv': this.parametriupita.partnerinaziv, 'parkontaktid': this.parametriupita.parkontaktid });
    this.global.modal.present();
    this.global.modal.onDidDismiss(data => {
      if(data==1){
      let toast = this.toastCtrl.create({
        message: 'Bilješka dodana!',
        duration: 2550,
        position: 'bottom'
      });
      toast.present();
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
    this.global.modal=null;
    });

  }

  editbiljeske(item) {
    this.global.modal = this.modalCtrl.create('CRMInsertEditPage', item);
    this.global.modal.present();
    this.global.modal.onDidDismiss(data => {
      if(data==1){
      let toast = this.toastCtrl.create({
        message: 'Bilješka izmjenjena!',
        duration: 2550,
        position: 'bottom'
      });
      toast.present();
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
    this.global.modal=null;
    });
  }
  brisiBiljesku(item,slidingItem: ItemSliding){
    console.log('slidingItem: ',item);
    this.item=item;
    this.getData2().then(x => {
      console.log('x brišemo bilješku: ', x);
      let toast = this.toastCtrl.create({
        message: 'Bilješka obrisana!',
        duration: 2550,
        position: 'bottom'
      });
      toast.present();
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
      });
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }
  getData2() {
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spParKontaktAzur",
        "params":{"action":2,
                  "parkontaktid":this.item.parkontaktid         
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef);

  }

  

}
