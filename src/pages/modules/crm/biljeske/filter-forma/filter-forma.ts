import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { Storage } from '@ionic/storage';
import { ItemSliding } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-biljeske-filter-forma',
  templateUrl: 'filter-forma.html',
})
export class CRMBiljeskeFilterFormaPage extends BasePage {
  items: any [] = [];
  checked = false;
  nemapodataka=false;
  item:any={};
  parametriupita:any={
                      action:0,
                       skladisteid:null
                      ,skladistenaziv:''
                      ,robaid:null
                      ,robanaziv:''
                      ,klmasterrobaid:null
                      ,klmasterrobanaziv:''
                      ,naziv:''
                      ,partneriid:null
                      ,partnerinaziv:''
                      ,aplikacija:''
                      ,firma: ''
                    };
  parametri:any={};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController
    , public storage: Storage, public toastCtrl: ToastController) {
  
  super();
  this.getData().then(x => {
    if(x){
    this.items = x.items;
    }
    else{
      this.items=[];
    }
  })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KonsolidacijaFilterFormaPage');
    this.storage.get('jm_crm_biljeske_parametriupita').then(val => {
      if (val) {
        this.parametriupita = val;
        console.log('parametri upita: ',this.parametriupita);
      }
  });
  }
  ionViewDidEnter(){
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
        "query": "spMob_ParKontakt",
        "params":{"action":5,
                  "operateriid":'@@operateriid',
                  "partneriid":this.parametriupita.partneriid
                  
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef);

  }

  izaberi(action){
    this.parametriupita.action=action;
    this.global.modal = this.modalCtrl.create('CRMKonsolidacijaTrazilicaPage', 
    //this.parametriupita
    {'action':action, 'skladisteid':this.parametriupita.skladisteid, 'robaid': this.parametriupita.robaid, 'klmasterrobaid':this.parametriupita.klmasterrobaid
    , 'partneriid':this.parametriupita.partneriid, 'cjenikid':this.parametriupita.cjenikid }
  );
  this.global.modal.present();
  this.global.modal.onDidDismiss(data => {
      if(data==null){
        console.log('data je null');
        data={action:0};
        console.log('data: ', data);
      }
      if(typeof data != 'undefined'){
        if(data.action==6){
          this.parametriupita.skladisteid=data.id;
          this.parametriupita.skladistenaziv=data.naziv;
        }
        if(data.action==7){
          this.parametriupita.partneriid=data.id;
          this.parametriupita.partnerinaziv=data.naziv;
          console.log('parametri upita nakon odabira partnera: ', this.parametriupita);
        }
        if(data.action==11){
          this.parametriupita.klmasterrobaid=data.id;
          this.parametriupita.klmasterrobanaziv=data.naziv;
        }
        if(data.action==8){
          this.parametriupita.robaid=data.id;
          this.parametriupita.robanaziv=data.naziv;
        }
        

      }
      this.global.modal=null;
      });
  }

  
  brisiPartnere(slidingItem: ItemSliding){
    this.parametriupita.partneriid=null;
    this.parametriupita.partnerinaziv='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }
  ocistiSve(){
    this.brisiPartnere(undefined);
  }

  spremiParametreUpita(){
    this.storage.set('jm_crm_biljeske_parametriupita', this.parametriupita);
  }

  prikazi(){

  
    console.log("parametriupita: ",this.parametriupita);
    

    if( this.parametriupita.partnerinaziv==''){
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo izaberite partnera za pregled bilješki!',
        buttons: ['OK']
      });
      alert.present();
      
    }
    else{
      this.spremiParametreUpita();
          // this.parametri={'partneriid':this.parametriupita.partneriid, 'partnerinaziv':this.parametriupita.partnerinaziv};
      this.navCtrl.push('CRMBiljeskeListaPage', this.parametriupita);
      
    }
   
    
  }

  novabiljeska(){
    this.parametriupita.parkontaktid=0;
    this.global.modal = this.modalCtrl.create('CRMInsertEditPage', {'partneriid':this.parametriupita.partneriid, 'partnerinaziv':this.parametriupita.partnerinaziv, 'parkontaktid':this.parametriupita.parkontaktid});
    this.global.modal.present();
    this.global.modal.onDidDismiss(data=>{
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

doRefresh(refresher) {
  this.getData().then(x => {
    this.items = x.items;
  refresher.complete();
});
}

refreshaj(){
  this.getData().then(x => {
    console.log('items', this.items);
    this.items = x.items;
  });
}

}