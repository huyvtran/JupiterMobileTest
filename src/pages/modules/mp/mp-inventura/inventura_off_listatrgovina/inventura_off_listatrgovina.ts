import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, Platform, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../../providers/core/const-provider';

//import { InventuraOffTrazilicarobePage } from '../../../../../pages/modules/crm/mp-inventura/inventura-off-trazilicarobe/inventura-off-trazilicarobe';
//import { MPInventuraPocetnaPage } from '../../../../../pages/modules/crm/mp-inventura/mpinventurapocetna/mpinventurapocetna';
//import { mojprovider } from '../../providers/mojprovider/mojprovider';
@IonicPage()
@Component({
  selector: 'page-InventuraOffListatrgovina',
  templateUrl: 'inventura_off_listatrgovina.html',
})
export class InventuraOffListatrgovinaPage extends BasePage {
  //searchQuery: string = '';
  items: any[] = [];
  itemsoriginal: any[] = [];
  x: number; y: number;
  neposlanih = 0;
  duljinaitems = 0;
  pitanje = '';
  opcija1 = '';
  opcija2 = '';
  nazivtrgovine='';
  datumdok='';
  nemainventure=false;
  izbor=false;
  nemapodataka=false;
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
  }

  nova() {
    console.log('Nova clicked');
    let alert = this.alertCtrl.create({
        subTitle: 'Sigurno želite započeti novu inventuru i obrisati podatke o trenutnoj?',
        buttons: [
          {
            text: 'Da',
            role: 'da',
            handler: () => {
              console.log('Da clicked');
              this.izbor=false;
              console.log("sakriti izbor: ", this.izbor);
          let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinventura');
          let keyg=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
          let keyi=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinvid');
          let keyt=this.constant.storageKeys.find(item => item.keyname == 'inventuraofftrgovina');
              
              this.storagee.remove(key.keyvalue);
              this.storagee.remove(keyg.keyvalue);
              this.storagee.remove(keyi.keyvalue);
              this.storagee.remove(keyt.keyvalue);
              this.getlistfromwebservice();

            }
          },
          {
            text: 'Ne',
            handler: () => {

              console.log('Ne clicked');
              

            }
          }
        ]
      });
      alert.present();
    
    
  }

  nastavi() {
    console.log('Nastavak clicked');
    this.navCtrl.setRoot('InventuraOffTrazilicarobePage');
  }

  odustani(){
    this.navCtrl.setRoot('MPInventuraPocetnaPage');
  }

  ionViewDidEnter() {
    this.nemainventure=false;
    this.izbor=false;
    console.log('još nema podataka, izbor je ',this.izbor);
          let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinventura');
          let keyg=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
          let keyi=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinvid');
          let keyt=this.constant.storageKeys.find(item => item.keyname == 'inventuraofftrgovina');
          let keyd=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffdatumdok');
          
    
    this.storage.getFromStorage(keyt.keyvalue, null, true).then(element=>{
      if(element){
      this.nazivtrgovine=element;
      }
    });
    this.storage.getFromStorage(keyd.keyvalue, null, true).then(element => {
      if(element){
        this.datumdok = element;
      }
    });

    this.storage.getFromStorage(key.keyvalue, null, true).then(data => {
      if (data) {
        this.storage.getFromStorage(keyg.keyvalue, null, true).then(val => {
          if (val) {

            this.brojineposlane(val);
            console.log('neposlanih: ',this.neposlanih);
            console.log('gotovo iz storageA: ', val);
            if (this.neposlanih == 0) {
              this.izbor=true;
              console.log('ima podataka, izbor je ',this.izbor);
              this.pitanje = 'Želite li započeti novu inventuru ili nastaviti s trenutnom?';
              this.opcija1 = 'Nova';
              this.opcija2 = 'Nastavi';

              // let alert = this.alertCtrl.create({
              //   subTitle: 'Želite li započeti novu inventuru ili nastaviti s trenutnom?',
              //   buttons: [
              //     {
              //       text: 'Nova',
              //       role: 'nova',
              //       handler: () => {
              //         console.log('Nova clicked');
              //         this.getlistfromwebservice();
              //         this.storage.remove('inventura');
              //         this.storage.remove('gotovo');
              //         this.storage.remove('invid');

              //       }
              //     },
              //     {
              //       text: 'Nastavak',
              //       handler: () => {

              //         console.log('Nastavak clicked');
              //         this.navCtrl.push(InventuraOffTrazilicarobePage);

              //       }
              //     }
              //   ]
              // });
              // alert.present();
            }
            else {
              // nastavak
              this.navCtrl.setRoot('InventuraOffTrazilicarobePage');
            }

          } 
          else { 
            //this.navCtrl.push(InventuraOffTrazilicarobePage); 
            this.izbor=true;
            console.log('ima podataka, izbor je ',this.izbor);
            this.pitanje = 'Želite li započeti novu inventuru ili nastaviti s trenutnom?';
            this.opcija1 = 'Nova inventura';
            this.opcija2 = 'Nastavi';
          }

        });

      }
      else {
        this.getlistfromwebservice();
      }
    })

  }

  brojineposlane(val) {
    this.neposlanih = 0;
    val.forEach(element => {
      if (element.poslano == 0) {
        this.neposlanih++;
      }

    });
  }

  // getItems(ev: any) {
  //   // Reset items back to all of the items
  //   // set val to the value of the searchbar
  //   let val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   console.log('search...');
  //   if (val.trim() == '') {
  //     this.items = this.itemsoriginal;
  //     this.duljinaitems = this.items.length;
  //   } else {
  //     this.items = this.itemsoriginal.filter((item) => {
  //       return (item.naziv.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //     this.duljinaitems = this.items.length;
  //   }
  //   this.x = this.items.length;
  //   this.y = this.itemsoriginal.length;
  // }

  prikaziRobu(item) {

          let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinventura');
          let keyg=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
          let keyi=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinvid');
          let keyt=this.constant.storageKeys.find(item => item.keyname == 'inventuraofftrgovina');
          let keyd=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffdatumdok');

    this.storagee.remove(key.keyvalue);
    this.storagee.remove(keyg.keyvalue);
    this.storagee.remove(keyi.keyvalue);
    this.storagee.remove(keyt.keyvalue);
    this.navCtrl.setRoot('InventuraOffTrazilicarobePage', item);
    this.items=[];
    this.duljinaitems=this.items.length;


  }




  // getlistfromwebservicecore() {
  //   this.mojprovider.callwebservice("test 4").subscribe((items) => { this.items = items; });
  // }

  getData(){
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spmp_MOBINVOFF",
        "params":{"action": 1                
        },
        
        "tablename": "items"
        }
    ]
    }
  
    return this.global.getData(dataDef);
  
  }



  getlistfromwebservice() {

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
            let keyt=this.constant.storageKeys.find(item => item.keyname == 'inventuraofftrgovina');
            
            this.storage.addToStorage(keyt.keyvalue, null, this.items, true);
        }
        
  
      });

    // let loading = this.loadingCtrl.create({
    //   content: 'dohvat liste trgovina ...'
    // });
    // this.items = [];
    // this.duljinaitems = this.items.length;

    // loading.present();
    // // this.loadheader();

    // this.mojprovider.callwebserviceOffTrgovine("@action = 1")
    //   .subscribe((items) => {

    //     loading.dismiss();
    //     console.log(items);

    //     console.log('items.length', items.length);
    //     if (items.length > 0) {

    //       if (typeof items[0].errornumber == 'undefined' || items[0].errornumber == 0) { // no error
    //         this.items = items;
    //         this.duljinaitems = this.items.length;
            
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
    //     }
    //     else{
    //       if(this.duljinaitems==0){
    //         this.nemainventure=true;
    //         this.izbor=false;
    //       }
    //     } // end of items.length > 0
    //   }
    //   ,
    //   err => {
    //     console.log("http fail!");
    //     loading.dismiss();
    //     this.connectionAlert();
    //   }
    //   ) // end of callwebservice
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
