import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, NavParams, LoadingController, Events } from 'ionic-angular';
//import { mojprovider } from '../../providers/mojprovider/mojprovider';
import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../../providers/core/const-provider';

//import { Inventura_ListatrgovinaPage } from '../../../../../pages/modules/crm/mp-inventura/inventura_listatrgovina/inventura_listatrgovina';
//import { InventuraOffListatrgovinaPage } from '../../../../../pages/modules/crm/mp-inventura/inventura_off_listatrgovina/inventura_off_listatrgovina';

/**
 * Generated class for the InventuraTrazilicarobePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mpinventurapocetna',
  templateUrl: 'mpinventurapocetna.html',
})
export class MPInventuraPocetnaPage extends BasePage  {

  item:any = {};
  items: any[] = [];
  itemsoriginal: any;
  gotovo: any[] = [];
  naziv: string;
  trgovina: string;
  searchTerm: string = '';
  searchControl: FormControl;
  neposlanih = 0;
  trgovinaid = 0;
  duljinagotovo = 0;
  duljinaitemsoriginal = 0;
  duljinaitems = 0;
  nemapodataka = false;
  searching: boolean = false;
  vectrazim = false;
  ime;

  //@ViewChild('searchControl') searchControl ;

  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, public storagee: Storage, public navCtrl: NavController, public navParams: NavParams, 
    //public mojprovider: mojprovider, 
    public modalCtrl: ModalController, public events: Events, public constant: ConstProvider
    , public storage: StorageProvider) {
     super();
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
     this.storagee.get('mpinventura_ime').then((ime) => { // -------------------------- ovdje nisam mijenjao po novom jer ne koristimo ime u ovoj aplikaciji
        this.ime  = ime;
      }
      ); 
  } 

  online(){
    this.navCtrl.push('Inventura_ListatrgovinaPage');

  }

  offline(){
    this.navCtrl.push('InventuraOffListatrgovinaPage');
    
  }

  // logout() {
  //   let alert = this.alertCtrl.create({
  //     title: 'Jeste li sigurni da se želite odjaviti?',
  //     buttons: [
  //       {
  //         text: 'Ne',
  //         role: 'ne',
  //         handler: () => {
  //           console.log('Ne clicked');
  //         }
  //       },
  //       {
  //         text: 'Da',
  //         handler: () => {
            
  //           this.storage.set('mpinventura_guid', '');
  //           this.events.publish('user:logout');
  //           let item: any = {};
  //           item.guid = '';
  //           this.mojprovider.setguid(item);
  //           console.log('Da clicked');
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

}
