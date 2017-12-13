import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
//import * as ICore from '../../../../../interfaces/iCore';

@IonicPage()
@Component({
  selector: 'page-pregledugovora-detaljidetalja-lista',
  templateUrl: 'detaljidetalja.html',
})
export class CRMPregledUgovoraDetaljidetaljaPage extends BasePage {

  item: any = {};
  keys: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  super();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetaljidetaljaPage');
    this.item = this.navParams.data;
    console.log('items', this.item);
    //this.prikazi();
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

  // prikazi() {
  //   let key: string;
  //   for (key in this.item) {
  //     if (this.item.hasOwnProperty(key)) {
  //       if(key.substr(key.length-2)=='id'){
  //         console.log('ovaj ima id: ',key);
  //       }
  //       else{
  //       console.log(key + " = " + this.item[key]);
  //         this.keys.push({ key: key, value: this.item[key] });
  //       }
  //     }
  //     }
  //   console.log("this.keys", this.keys);
  // }
}


