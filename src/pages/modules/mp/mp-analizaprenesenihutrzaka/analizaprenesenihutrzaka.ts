import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ToastController, PopoverController } from 'ionic-angular';

import { BasePage } from '../../../../providers/base/base-page';
import * as ICore from '../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';
import { ItemSliding } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StorageProvider } from '../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../providers/core/const-provider';

@IonicPage()
@Component({
  selector: 'page-analizaprenesenihutrzaka',
  templateUrl: 'analizaprenesenihutrzaka.html'
})
export class MPAnalizaprenesenihutrzakaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  val;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  prazno=true;
  item:any={trgovinaid:null, datumod: '0', datumdo: '0', samorazlike: true, razlike:1};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public toastCtrl: ToastController
            , public popoverCtrl: PopoverController, public storagee: Storage, public constant: ConstProvider, public storage: StorageProvider) {
    super();
    this.searchControl = new FormControl();
    this.item.datumdo = new Date().toISOString().split('T')[0]; //današnji datum
    var date = new Date();                          //datum 
    date.setDate(date.getDate() - 30);              // prije
    this.item.datumod = date.toISOString().split('T')[0];  // 30 dana

  
  }
  ionViewWillEnter(){
    let key=this.constant.storageKeys.find(item => item.keyname == 'analizaprenesenihutrzakaff');
    
    this.storage.getFromStorage(key.keyvalue, null, true).then(data => {
      if(data){
      console.log('data iz storagea: ',data);
      this.item=data;
      }
    });
  
  }

  otvori(){
    this.getData().then(x => {
      this.items = x.items;
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
  // openDetalji(item) {
  //   console.log('item prije slanja u detalje: ', item);

  //   this.navCtrl.push('MPPreglednefiskaliziranihracunaListaracunaPage', item); //senkovic pokušaj br 1
  
  // }

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

  getData() {
    if(this.item.samorazlike==true){
       this.item.razlike=1;
    }
    else{
      this.item.razlike=0;
    }
    let key=this.constant.storageKeys.find(item => item.keyname == 'analizaprenesenihutrzakaff');
    
    this.storage.addToStorage(key.keyvalue, null, this.item, true);
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMOB_MPKontrolaPrijenosa",
          "params": {
            "action": 1,
            "operateriid": '@@operateriid',
            "trgovinaid": this.item.trgovinaid,
            "datumod": this.item.datumod,
            "datumdo": this.item.datumdo,
            "samoRazlike": this.item.razlike    
          },
          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

  izaberi(action) {
      this.global.modal = this.modalCtrl.create('CRMKonsolidacijaTrazilicaPage',
        {
          'action': action, 
          'operateriid': '@@operateriid',
          'trgovinaid': this.item.trgovinaid,
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
          }
        }
        
        this.global.modal=null;
      });
    }

    transform(num){
      if(num!=null){
      let number= num.toString();
      let result =number.split('.').join('$').split(',').join('#').split('$').join(',').split('#').join('.');
      
      return result;
      }
      else{
        return num;
      }
    }

    brisiTrgovinu(slidingItem: ItemSliding) {
      this.item.trgovinaid = null;
      this.item.trgovina = '';
  
      try {
        slidingItem.close();
      } catch (error) {
        //
      }
    }

  }

