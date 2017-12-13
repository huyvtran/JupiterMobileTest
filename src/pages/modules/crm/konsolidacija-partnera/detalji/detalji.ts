import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';



@IonicPage()
@Component({
  selector: 'page-konsolidacija-detalji-lista',
  templateUrl: 'detalji.html'
})
export class CRMKonsolidacijaDetaljiPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any []= [];
  val;
  groups:any=[];
  nemapodataka=false;
  naslov='';
// senkovic pokušaj br 1
  item:any={};

  parametriupita:any={}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    super();

    this.item=this.navParams.data; //senkovic pokušaj br 1
    console.log('this.item došao u detalje: ', this.item);
    
    //this.parametriupita = this.navParams.data;
    // console.log('stiglo', this.parametriupita.partneriid);
    // console.log('parametri upita:', this.parametriupita);
    this.getData().then(x => {
      
      if(x.items.length>0){this.items = x.items;
        console.log('x.items: ',x.items);
    this.naslov = this.items['0'].n;
    console.log('this.items["0"]',this.items['0']);
    console.log('this.naslov', this.naslov);
      }
  });
  }

  cancel(){
    this.navCtrl.pop();
  }

  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spMob_KonsolidacijaPartneri",
        "params":{"action":333,
                  "operateriid":'@@operateriid',
                  "aplikacija":'partneri',
                  "partnerid":this.item.id,
                  "firma": this.item.f
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef, true);

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
