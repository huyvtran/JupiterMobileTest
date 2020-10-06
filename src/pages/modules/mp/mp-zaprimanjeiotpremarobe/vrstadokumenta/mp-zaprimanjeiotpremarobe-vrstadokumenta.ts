import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ToastController, PopoverController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-mp-zaprimanjeiotpremarobe-vrstadokumenta',
  templateUrl: 'mp-zaprimanjeiotpremarobe-vrstadokumenta.html'
})
export class MPZaprimanjeiotpremarobeVrstadokumentaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  val;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  prazno=true;
  item:any={trgovinaid:null, trgovinanaziv: null, vrstadokid:null, opisvrstadok:null, sifravrstadok:null};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public toastCtrl: ToastController
            , public popoverCtrl: PopoverController, public storage: Storage) {
    super();
    this.searchControl = new FormControl();

  }
  ionViewWillEnter(){
    this.item.trgovinaid = this.navParams.get('trgovinaid');
    this.item.trgovinanaziv = this.navParams.get('trgovinanaziv');
    this.otvori();
    
  
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
 

  getData() {
    
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMPUnosDokMobApp",
          "params": {
            "action": 11,
            "operaterid": '@@operateriid'   
          },
          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

  dalje(item){
    this.item.vrstadokid = item.vrstadokid;
    this.item.opisvrstadok = item.opis;
    this.item.sifravrstadok = item.sifra;
    this.navCtrl.push('MPZaprimanjeiotpremarobeOtvorenidokumentiPage', {
      'trgovinaid': this.item.trgovinaid,
      'trgovinanaziv': this.item.trgovinanaziv,
      'vrstadokid': this.item.vrstadokid,
      'opisvrstadok': this.item.opisvrstadok,
      'sifravrstadok': this.item.sifravrstadok,

    });
  }



    
  }

