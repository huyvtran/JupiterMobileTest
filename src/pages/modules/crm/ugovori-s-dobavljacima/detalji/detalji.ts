import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
//import { CurrencyFormat } from '../../../../../pipes/currency-format';


@IonicPage()
@Component({
  selector: 'page-ugovori-s-dobavljacima-detalji-lista',
  templateUrl: 'detalji.html'
})

  
export class CRMUgovoriSDobavljacimaDetaljiPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any []= [];
  val;
  groups:any=[];
  nemapodataka=false;
  item:any={};
 
 
  
  parametriupita:any={};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    super();
    
    //this.parametriupita = this.navParams.data;
    this.item=this.navParams.data;
    console.log('stiglo', this.parametriupita.partneriid);
    console.log('parametri upita:', this.parametriupita);
    this.getData().then(x => this.items = x);
  }

  cancel(){
    this.navCtrl.pop();
  }

  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spMob_UgovoriSaKupcima",
        "params":{"action":2,
                  "KupUgovoriGlaId":this.item.kupugovoriglaid
        },
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef, true);

  }

  idiudetaljedetalja(item){
    // let modal=  this.modalCtrl.create('CRMPregledUgovoraDetaljidetaljaPage',item);
    // modal.present();
    this.navCtrl.push('CRMUgovoriSDobavljacimaDetaljiDetaljaPage',item);
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


  // getDetails(item) {
  //     this.navCtrl.push('TemeljnoRobaDetPage', item);
  // }

}
