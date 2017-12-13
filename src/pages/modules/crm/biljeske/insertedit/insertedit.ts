import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ItemSliding , ViewController, AlertController} from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-biljeske-insertedit',
  templateUrl: 'insertedit.html'
})
export class CRMInsertEditPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any []= [];
  val;
  groups:any=[];
  nemapodataka=false;
  naslov='';
// senkovic pokušaj br 1
  item:any={};
  

  parametriupita:any={};
  kontrolenaformi:any={};
  action=0;
  sakrijTipke=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController, public alertCtrl: AlertController) {
    super();

    
   
    if(this.navParams.get('parkontaktid')!=0){
      this.naslov='Izmjena bilješke';
      this.action=1;
      //this.kontrolenaformi=this.navParams.data;
      this.kontrolenaformi.sadrzaj=this.navParams.get('sadrzaj');
      this.kontrolenaformi.parkontaktid=this.navParams.get('parkontaktid');
      this.kontrolenaformi.operateriid=this.navParams.get('operateriid');
      this.kontrolenaformi.tema=this.navParams.get('tema');
      this.kontrolenaformi.osobapar=this.navParams.get('osobapar');
      this.kontrolenaformi.osoba=this.navParams.get('osoba');
      this.kontrolenaformi.osobeid=this.navParams.get('osobeid');
      this.kontrolenaformi.datum=this.navParams.get('datum');
      this.kontrolenaformi.osobeparid=this.navParams.get('osobeparid');
      this.kontrolenaformi.parkontaktvrsta=this.navParams.get('parkontaktvrsta');
      this.kontrolenaformi.parkontaktvrstaid=this.navParams.get('parkontaktvrstaid');
      this.kontrolenaformi.partner=this.navParams.get('partner');
      this.kontrolenaformi.partneriid=this.navParams.get('partneriid');

      console.log('kontrole na formi kad je kliknut item: ',this.kontrolenaformi);
    }
    else{
      this.naslov='Nova bilješka';
      this.action=0;
      console.log('Sad treba ići u insert jer nije poslan item!');
      this.kontrolenaformi.partner=this.navParams.get('partnerinaziv');
      this.kontrolenaformi.partneriid=this.navParams.get('partneriid');
      //this.kontrolenaformi.datum=new Date().toISOString();
      this.kontrolenaformi.datum=moment(new Date().toISOString()).locale('hr').format();
      console.log('datum s lokalnim vremenom: ',this.kontrolenaformi.datum);
      this.kontrolenaformi.tema = '';
      this.kontrolenaformi.sadrzaj = '';
      console.log('kontrole na formi kad nema itema: ', this.kontrolenaformi);
      this.parametriupita=this.navParams.data;
    }
    console.log('this.kontrolenaformi u insertedit: ', this.kontrolenaformi);
     
    //this.parametriupita = this.navParams.data;
    // console.log('stiglo', this.parametriupita.partneriid);
    // console.log('parametri upita:', this.parametriupita);
    //   this.getData().then(x => {
    //   if(x.length>0){this.items = x.items;
    //   this.naslov = this.items['0'].n;
    //   console.log('this.items["0"]',this.items['0']);
    //   console.log('this.naslov', this.naslov);
    //     }
    // });
  }

  cancel(){
    this.viewCtrl.dismiss(0);
  }

  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spParKontaktAzur",
        "params":{"action":this.action,
                  "parkontaktid":this.kontrolenaformi.parkontaktid,
                  "partneriid":this.kontrolenaformi.partneriid,
                  "osobeid":this.kontrolenaformi.osobeid,
                  "osobeparid": this.kontrolenaformi.osobeparid,
                  "operateriid":'@@operateriid',
                  "parkontaktvrstaid":this.kontrolenaformi.parkontaktvrstaid,
                  "datum": this.kontrolenaformi.datum,
                  "tema": this.kontrolenaformi.tema,
                  "sadrzaj": this.kontrolenaformi.sadrzaj
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
    {'action':action, 'osobeid':this.kontrolenaformi.osobeid, 'osobeparid': this.kontrolenaformi.osobeparid, 'parkontaktvrstaid':this.kontrolenaformi.parkontaktvrstaid
    , 'partneriid':this.kontrolenaformi.partneriid }
    //this.parametriupita
  );
    modal.present();
    modal.onDidDismiss(data => {
      if(typeof data != 'undefined'){
        if(data.action==55){
          this.kontrolenaformi.osobeid=data.id;
          this.kontrolenaformi.osoba=data.naziv;
        }
        if(data.action==555){
          this.kontrolenaformi.osobeparid=data.id;
          this.kontrolenaformi.osobapar=data.naziv;
        }
        if(data.action==14){
          this.kontrolenaformi.parkontaktvrstaid=data.id;
          this.kontrolenaformi.parkontaktvrsta=data.naziv;
        }
      }

      });
  }

  brisiOsobe(slidingItem: ItemSliding){
    this.kontrolenaformi.osobaid=null;
    this.kontrolenaformi.osoba='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }

  brisiOsobePar(slidingItem: ItemSliding){
    this.kontrolenaformi.osobaparid=null;
    this.kontrolenaformi.osobapar='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }

  
  brisiVrstu(slidingItem: ItemSliding){
    this.kontrolenaformi.parkontaktvrstaid=null;
    this.kontrolenaformi.parkontaktvrsta='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }

  spremi(){
    if(this.kontrolenaformi.sadrzaj.trim() =='' || this.kontrolenaformi.tema.trim()==''){
      //alert
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo upišite bar "O čemu" ili "Što"!',
        buttons: ['OK']
      });
      alert.present();
    }
    else{
    // ovdje prvo spremati i sakriti tipke
    this.sakrijTipke=true;
       this.getData().then(x => {
         this.sakrijTipke=false;
         console.log('x: ',x);
        this.viewCtrl.dismiss(1);
    });
  }
    

  }
 
}
