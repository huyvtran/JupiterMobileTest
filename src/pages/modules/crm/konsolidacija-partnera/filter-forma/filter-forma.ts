import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { Storage } from '@ionic/storage';
import { ItemSliding } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-konsolidacija-filter-forma',
  templateUrl: 'filter-forma.html',
})
export class CRMKonsolidacijaFilterFormaPage extends BasePage {
  items: any [] = [];
  checked = false;
  moze = false;
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
                    
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public storage: Storage) {
  
  super();
  this.getData().then(x => this.items = x.items);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KonsolidacijaFilterFormaPage');
    this.storage.get('jm_crm_konsolidacija_partnera_parametriupita').then(val => {
      if (val) {
        this.parametriupita = val;
        console.log('parametri upita: ',this.parametriupita);
      }
  });
  }

  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spMob_KonsolidacijaPartneri",
        "params":{"action":0,
                  "operateriid":'@@operateriid',
                  "aplikacija":'partneri'
                  
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef, true);

  }

  runninggrouptotals() {
    let count = 0;
    this.items.forEach((item) => {
      if (item.odabrano == true) {
        count += 1;
      }
    });
    return count;
  }

  groupclick(){
    //this.checked=!this.checked;
    if (this.checked == true) {
      console.log('čekirano');
      this.items.forEach((item) => {

         
          item.odabrano = true;


      });
      this.toggleFirmeChecked();
    } else {
      console.log('odčekirano');
      this.items.forEach((item) => {
         
          item.odabrano = false;
    
      });
      this.toggleFirmeUnchecked();
    }
  }

  toggleFirme(item){
    console.log('ulazak u metodu',item); 
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spMob_KonsolidacijaPartneri",
        "params":{"action":1,
                  "operateriid":'@@operateriid',
                  "aplikacija":'partneri',
                  "firma":item.baza
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef, true);
  }

  toggleFirmeUnchecked(){
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spMob_KonsolidacijaPartneri",
        "params":{"action":-1,
                  "operateriid":'@@operateriid',
                  "aplikacija":'partneri'
                  
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef, true);
  }

  toggleFirmeChecked(){
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spMob_KonsolidacijaPartneri",
        "params":{"action":-11,
                  "operateriid":'@@operateriid',
                  "aplikacija":'partneri'
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef, true);
  }

  izaberi(action){
    this.parametriupita.action=action;
    let modal = this.modalCtrl.create('CRMKonsolidacijaTrazilicaPage', 
    //this.parametriupita
    {'action':action, 'skladisteid':this.parametriupita.skladisteid, 'robaid': this.parametriupita.robaid, 'klmasterrobaid':this.parametriupita.klmasterrobaid
    , 'partneriid':this.parametriupita.partneriid, 'cjenikid':this.parametriupita.cjenikid }
  );
    modal.present();
    modal.onDidDismiss(data => {
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
    this.storage.set('jm_crm_konsolidacija_partnera_parametriupita', this.parametriupita);
  }

  prikazi(){

  
    console.log("parametriupita: ",this.parametriupita);
    this.items.forEach(element => {
      if (element.odabrano == true){
        this.moze = true;
      }
    });

    if( this.parametriupita.partnerinaziv=='' || this.moze == false){
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo izaberite partnera i najmanje jednu firmu!',
        buttons: ['OK']
      });
      alert.present();
      
    }
    else{
      this.moze = false;
      this.spremiParametreUpita();  
      this.navCtrl.push('CRMKonsolidacijaListaPage', this.parametriupita);
      
    }
   
    
  }


}
