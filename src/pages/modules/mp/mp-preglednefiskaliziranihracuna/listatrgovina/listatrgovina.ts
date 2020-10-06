import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ToastController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-mp-preglednefiskaliziranihracuna-listatrgovina',
  templateUrl: 'listatrgovina.html'
})
export class MPPreglednefiskaliziranihracunaListatrgovinaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  val;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  item:any={};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    super();
    this.searchControl = new FormControl();

  
  }
  ionViewWillEnter(){
   
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

  openDetalji(item) {
    console.log('item prije slanja u detalje: ', item);

    this.navCtrl.push('MPPreglednefiskaliziranihracunaListaracunaPage', item); //senkovic pokušaj br 1
  
  }


  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMOB_MPPregNefisk",
          "params": {
            "action": 1,
            "operateriid": '@@operateriid',
          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

}
