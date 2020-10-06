import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ToastController, PopoverController, AlertController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
//import * as ICore from '../../../../../interfaces/iCore';
import { Storage } from '@ionic/storage';

import { FormControl } from '@angular/forms';
import { ItemSliding } from 'ionic-angular';

import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../../providers/core/const-provider';

@IonicPage()
@Component({
  selector: 'page-mp-stanje-filterforma',
  templateUrl: 'filterforma.html'
})
export class MPStanjeFilterFormaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  val;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  item:any={trgovinaid: null, datumod: '20170101', datumdo: '20171201', status:null, robaid:null};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController
            , public toastCtrl: ToastController, public popoverCtrl: PopoverController, public storagee: Storage, public constant: ConstProvider
            , public storage: StorageProvider) {
    super();
    this.searchControl = new FormControl();
    this.item.datumdo = new Date().toISOString().split('T')[0]; //današnji datum
    var date = new Date();                          //datum 
    date.setDate(date.getDate() - 30);              // prije
    let datumod = date.toISOString().split('T')[0];  // 30 dana    
    let dat = datumod.split('-');
    this.item.datumod = dat[0] + '-01-01';
    console.log('datumod: ', this.item.datumod);
  }

  ionViewWillEnter(){
    let key=this.constant.storageKeys.find(item => item.keyname == 'stanjeff');
    
    this.storage.getFromStorage(key.keyvalue, null, true).then(data => {
      if(data){
      console.log('data iz storagea: ',data);
      this.item=data;
      }
    });
  }


  popoverRazdoblje(myEvent) {
    let popover = this
    .popoverCtrl
    .create('SharedDateFilterPage');
popover.present({ ev: myEvent });

popover.onDidDismiss((data) => {
    if (data != null) 
    {
      let datumod=data.start.split('T');
      let datumdo=data.end.split('T');
        this.item.datumod = datumod[0];
        this.item.datumod2 = datumod[0];
        console.log('datumod: ',this.item.datumod);
        console.log('data.start', data.start);
        this.item.datumdo = datumdo[0];
        this.item.datumdo2 =datumdo[0];
    }
})
  }

  otvori(){
    
    if(this.item.status=='nista'){
      this.item.status=null;
    }
    console.log('this.item: ', this.item);
    if (this.item.trgovinaid == null) {
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo izaberite trgovinu!',
        buttons: ['OK']
      });
      alert.present();

    }
    else {
    let key=this.constant.storageKeys.find(item => item.keyname == 'stanjeff');
      
      this.storage.addToStorage(key.keyvalue, null, this.item, true);

    this.navCtrl.push('MPStanjeListaPage', this.item);
  }
}

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
        'datumod': this.item.datumod, 
        'datumdo': this.item.datumdo,
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
        if (data.action == 15) {
          this.item.trgovinaid = data.id;
          this.item.trgovina = data.naziv;
          this.brisirobu();
        }
        if (data.action == 16) {
          this.item.robaid = data.id;
          this.item.roba = data.naziv;
        }
      }
      
      this.global.modal=null;
    });
  } 
  
}

brisiTrgovinu(slidingItem: ItemSliding) {
  this.item.trgovinaid = null;
  this.item.trgovina = '';
  this.brisirobu();

  try {
    slidingItem.close();
  } catch (error) {
    //
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

brisirobu(){
  this.item.robaid = null;
  this.item.roba = '';
}



}
