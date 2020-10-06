import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-konsolidacija-lista',
  templateUrl: 'lista.html'
})
export class CRMKonsolidacijaListaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any []= [];
  val;
  searchControl: FormControl;
  groups:any=[];
  nemapodataka=false;
 

  parametriupita:any={}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    super();
    this.searchControl = new FormControl();
    
    
}

ionViewWillEnter(){
  this.parametriupita = this.navParams.data;
  console.log('stiglo', this.parametriupita.partneriid);
  console.log('parametri upita:', this.parametriupita);
  this.getData().then(x => {
    if(x){this.items = x.items;
    this.nemapodataka=false;
    if(x.items.length==0){
      this.nemapodataka=true;
    }
    else{
      this.nemapodataka=false;
    }
  }
  else{this.nemapodataka=true;}
});
}

  cancel(){
    this.navCtrl.pop();
  }

  openDetalji(item) {
    console.log('item prije slanja u detalje: ',item);
    
    this.navCtrl.push('CRMKonsolidacijaDetaljiPage', item); //senkovic pokušaj br 1
    // this.navCtrl.push('CRMKonsolidacijaDetaljiPage', this.parametriupita);
    // let dataDef: ICore.IData = {
    //   "queries": [
    //     {
    //     "query": "spMob_KonsolidacijaPartneri",
    //     "params":{"action":333,
    //               "operateriid":'@@operateriid',
    //               "aplikacija":'partneri',
    //               "partnerid":this.parametriupita.partneriid,
    //               "firma": this.parametriupita.firma
    //     },
        
    //     "tablename": "items"
    //     }
    // ]
    // }

    // return this.global.getData(dataDef, true);

    
    
  }
  
  
  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spMob_KonsolidacijaPartneri",
        "params":{"action":33,
                  "operateriid":'@@operateriid',
                  "aplikacija":'partneri',
                  "partnerid":this.parametriupita.partneriid,
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef);

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
