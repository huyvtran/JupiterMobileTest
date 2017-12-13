import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
//import * as ICore from '../../../../../interfaces/iCore';

import { Storage } from '@ionic/storage';
import { ItemSliding } from 'ionic-angular';




@IonicPage()
@Component({
  selector: 'page-cjenik-filter-forma',
  templateUrl: 'filter-forma.html',
})
export class CRMCjenikFilterFormaPage extends BasePage {
  items: any [] = [];
  parametriupita:any={
                      action:0,                      
                      robaid:null
                      ,robanaziv:''
                      ,klmasterrobaid:null
                      ,klmasterrobanaziv:''
                      ,naziv:''
                      ,cjenikid:null
                      ,cjeniknaziv:''
                      ,skladisteid:null
                      ,skladistenaziv:''
                      ,partneriid:null
                      ,partnerinaziv:''
                    };
  

  

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public storage: Storage) {
  
  super();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterFormaPage');
    this.storage.get('jm_crm_cjenikfilterforma_parametriupita').then(val => {
      if (val) {
        this.parametriupita = val;
        console.log('parametri upita: ',this.parametriupita);
      }
  });
  }


  izaberi(action){
    this.parametriupita.action=action;
    let modal = this.modalCtrl.create('CRMKonsolidacijaTrazilicaPage', 
    {'action':action, 'skladisteid':this.parametriupita.skladisteid, 'robaid': this.parametriupita.robaid, 'klmasterrobaid':this.parametriupita.klmasterrobaid
    , 'partneriid':this.parametriupita.partneriid, 'cjenikid':this.parametriupita.cjenikid }
    //this.parametriupita
  );
    modal.present();
    modal.onDidDismiss(data => {
      if(data==null){
        console.log('data je null');
        data={action:0};
        console.log('data: ', data);
      }
      if(typeof data != 'undefined'){
        if(data.action==12){
          this.parametriupita.cjenikid=data.id;
          this.parametriupita.cjeniknaziv=data.naziv;
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

  brisiCjenik(slidingItem: ItemSliding){
    this.parametriupita.cjenikid=null;
    this.parametriupita.cjeniknaziv=''; 
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }
  brisiKlasuRobe(slidingItem: ItemSliding){
    this.parametriupita.klmasterrobaid=null;
    this.parametriupita.klmasterrobanaziv='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }
  brisiRobu(slidingItem: ItemSliding){
    this.parametriupita.robaid=null;
    this.parametriupita.robanaziv='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }
  brisiNaziv(slidingItem: ItemSliding){
    this.parametriupita.naziv='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }
  ocistiSve(){
    this.brisiCjenik(undefined);
    this.brisiKlasuRobe(undefined);
    this.brisiRobu(undefined);
    this.brisiNaziv(undefined);
  }

  spremiParametreUpita(){
    this.storage.set('jm_crm_cjenikfilterforma_parametriupita', this.parametriupita);
  }

  prikazi(){

  
    console.log("parametriupita: ",this.parametriupita);

    if( this.parametriupita.cjenikid==null && this.parametriupita.klmasterrobaid==null && this.parametriupita.robaid==null && this.parametriupita.naziv==''){
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo izaberite najmanje jedan parametar izvještaja!',
        buttons: ['OK']
      });
      alert.present();
      
    }
    else{
      this.spremiParametreUpita();
           
      this.navCtrl.push('CRMCjenikListaPage', this.parametriupita);
      
    }
   
    
  }



}
