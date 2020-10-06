// 12032018 - dsenkovic - dodan fokus na izmjeni količine i na unosu količine kad je odabrana roba

import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ToastController, PopoverController, AlertController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ItemSliding } from 'ionic-angular';

///import {VariableProvider} from '../../../../../providers/core/variable-provider';



@IonicPage()
@Component({
  selector: 'page-mp-zaprimanjeiotpremarobe-unoskolicine',
  templateUrl: 'mp-zaprimanjeiotpremarobe-unoskolicine.html'
})
export class MPZaprimanjeiotpremarobeUnoskolicinePage extends BasePage {
  items: any[] = [];
  items2: any[] = [];
  itemsoriginal: any[] = [];
  val;
  action=0;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  prazno=true;
  item:any={trgovinaid:null, trgovinanaziv:null, vrstadokid:null, sifravrstadok:null, opisvrstadok: null, dokid:null, datum:null
          , brojdokumenta:null, kolicinaulaz:null , roba: null, robaid:null, detid:null};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public toastCtrl: ToastController
            , public popoverCtrl: PopoverController, public storage: Storage, public alertCtrl: AlertController) {
    super();
    this.searchControl = new FormControl();
    

  }
  ionViewWillEnter(){
    this.item.trgovinaid = this.navParams.get('trgovinaid');
    this.item.trgovinanaziv = this.navParams.get('trgovinanaziv');
    this.item.vrstadokid = this.navParams.get('vrstadokid');
    this.item.opisvrstadok = this.navParams.get('opisvrstadok');
    this.item.sifravrstadok = this.navParams.get('sifravrstadok');
    this.item.dokid = this.navParams.get('dokid');
    this.item.datum = this.navParams.get('datum');
    this.item.brojdokumenta = this.navParams.get('brojdokumenta');
    
    this.prikazi();
    
  
  }
  // ionViewDidEnter(){
    

  // }

  izaberi(action) {
    if (action == 16 && this.item.trgovinaid == null){
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo izaberite trgovinu!',
        buttons: ['OK']
      });
      alert.present();
    }else {
      
      
    this.global.modal = this.modalCtrl.create('CRMKonsolidacijaTrazilicaPage',
      {
        'action': action, 
        'trgovinaid': this.item.trgovinaid,
        "robaid": this.item.robaid,
        'operateriid': '@@operateriid',
        'app':'mp'
        
      }
      //this.parametriupita
    );
    this.global.modal.present();

    this.global.modal.onDidDismiss(data => {
      
      if(data==null){
        console.log('data je null');
        data={action:0};
        console.log('data: ', data);
      }
      if (typeof data != 'undefined') {
        
        if (data.action == 16) {
          this.item.robaid = data.id;
          this.item.roba = data.naziv;
          // .text-input
          let elem = <HTMLInputElement>document.querySelector('.text-input');
          if (elem) { setTimeout(() => { elem.focus(); }, 550); }
        }
      }
      
      this.global.modal=null;
    });
  } 
  
}

brisiRobu(slidingItem: ItemSliding) {
  this.item.robaid = null;
  this.item.roba = '';

  try {
    slidingItem.close();
  } catch (error) {
    //
  }
}

izmjenaunosa(item, slidingItem: ItemSliding){

  let alert = this.alertCtrl.create({
    title: 'Izmjena količine',
    inputs: [
      {
        name: 'kolicinaulaz',
        placeholder: 'Količina ulaz'
      }
    ],
    buttons: [
      {
        text: 'Odustani',
        role: 'cancel',
        handler: data => {
          console.log('Odustani clicked');
        }
      },
      {
        text: 'Spremi',
        handler: data => {
          console.log('Spremi clicked');
          this.item.detid=item.detid;
          this.item.robaid=item.robaid;
          this.item.kolicinaulaz=data.kolicinaulaz;
          if(data.kolicinaulaz==null || data.kolicinaulaz=='' || typeof data.kolicinaulaz == 'undefined'){
            let toast = this.toastCtrl.create({
              message: 'Unesite količinu!',
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }
          else{
            this.spremi(4);
          }
          
        }
      }
    ]
  });
  alert.present().then(element =>{
  let elem = <HTMLInputElement>document.querySelector('.alert-input');
  if (elem) { setTimeout(() => { elem.focus(); }, 200); }
  });

  try {
    slidingItem.close();
  } catch (error) {
    //
  }
}

brisiunos(item, slidingItem: ItemSliding){

  let alert = this.alertCtrl.create({
        title: 'Sigurno želite obrisati unos?',
        buttons: [
          {
            text: 'NE',
            role: 'cancel',
            handler: () => {
              console.log('NE clicked');
            }
          },
          {
            text: 'DA',
            handler: () => {
              console.log('DA clicked');
              this.item.detid=item.detid;
              this.item.robaid=item.robaid;
              this.spremi(5);
            }
          }
        ]
  });
  alert.present();
  

  try {
    slidingItem.close();
  } catch (error) {
    //
  }
}

  spremi(action){
    // insert = 3 ; update = 4; delete = 5;

    this.action=action;
    if(this.item.kolicinaulaz!=null || action==5)
    {
      if(this.item.robaid!=null){
    this.getData().then(x => {
      console.log('Response:',JSON.stringify(Response));
    //  if(typeof x == 'undefined'){
    //   let alert = this.alertCtrl.create({
    //     title: 'Upozorenje',
    //     subTitle: 'Roba se već nalazi na dokumentu!',
    //     buttons: ['OK']
    //   });
    //   alert.present();
    //    return;
    //  }
      //this.items = x.items;
      this.prikazi();
      this.item.robaid=null;
      this.item.roba=null;
      this.item.kolicinaulaz=null;
      //this.prazno=false;
        //this.nemapodataka = false;
        if (this.items.length == 0) {
          //this.nemapodataka = true;
          //this.prazno=true;
        }
        else {
          //this.nemapodataka = false;
          //this.prazno=false;
        }
      
      }).catch(err =>{
        console.log('err', err);
        let alert = this.alertCtrl.create({
          title: 'Info',
          subTitle: err['_body'],
          buttons: [{
            text: 'Ok',
            handler: () => {
    
            }
        }]
        });
        alert.present();
        
    });
  }
    else{
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo izaberite robu!',
        buttons: ['OK']
      });
      alert.present();
    }
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo upišite količinu!',
        buttons: ['OK']
      });
      alert.present();

    }
  }

  prikazi(){
    this.getData2().then(x => {
      this.items = x.items;
      console.log("items:", this.items);
      this.prazno=false;
        this.nemapodataka = false;
        
        if (this.items.length == 0) {
          this.nemapodataka = true;
          this.prazno=true;

        }
        else {
          this.nemapodataka = false;
          this.prazno=false;
        }
      });
  }

  
  getData() {
    let properties : ICore.IProperties = { errorMessageResponse: true}
    
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMPUnosDokMobApp",
          "params": {
            "action": this.action,
            "operaterid": '@@operateriid',
            "trgovinaid": this.item.trgovinaid,
            "vrstadokid": this.item.vrstadokid,
            "robaid": this.item.robaid,
            "id": this.item.dokid,
            "kolicinaulaz": this.item.kolicinaulaz,
            "detid": this.item.detid
          },
          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef, properties);

  }

  getData2() {
    // pregled stavaka = 6;
    let properties : ICore.IProperties = { errorMessageType: 'alert'}
    
    
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMPUnosDokMobApp",
          "params": {
            "action": 6,
            "operaterid": '@@operateriid',
            "trgovinaid": this.item.trgovinaid,
            "vrstadokid": this.item.vrstadokid,
            "id": this.item.dokid,
            "kolicinaulaz": this.item.kolicinaulaz,
            "detid": this.item.detid
          },
          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef, properties);

  }

  // dalje(item){
  //   this.item.dokid = item.id;
  //   this.item.brojdokumenta = item['broj dokumenta'];
  //   this.item.datum = item.datum;
  //   console.log('Ovo je dokid: ', this.item.dokid);
  //   this.navCtrl.push('', {
  //     'trgovinaid': this.item.trgovinaid,
  //     'trgovinanaziv': this.item.trgovinanaziv,
  //     'vrstadokid': this.item.vrstadokid,
  //     'opisvrstadok': this.item.opisvrstadok,
  //     'sifravrstadok': this.item.sifravrstadok,
  //     'dokid': this.item.dokid,
  //     'brojdokumenta': this.item.brojdokumenta,
  //     'datum': this.item.datum      


  //   });
  // }



    
  }

