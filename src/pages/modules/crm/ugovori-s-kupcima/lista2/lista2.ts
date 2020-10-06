import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-pregledugovora-lista2',
  templateUrl: 'lista2.html'
})
export class CRMPregledUgovoraLista2Page extends BasePage {
  items: any[] = [];
  itemsoriginal: any []= [];
  val;
  searchControl: FormControl;
  groups:any=[];
  nemapodataka=false;
  lenght = 0;
  rc = 0;
  aktivan=0;
  prviput=true;

  parametriupita:any={}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    super();
    this.searchControl = new FormControl();
   
  }

  ionViewWillEnter(){
    if(this.prviput==true){
    this.parametriupita = this.navParams.data;
    this.getData().then(x => {this.items = x.items;
      this.nemapodataka=false;
      if(this.items.length==0){
        this.nemapodataka=true;
      }
      else{
        this.nemapodataka=false;
      }
      if(this.parametriupita.skladisteid != null) {
        this.buildgroups('klasa');
      } else {
        this.buildgroups('skladiste');
      }
      this.buildgroups('roba');
      this.itemsoriginal = x.items;
      this.lenght = this.items.length;
      if (this.lenght > 0){
      this.rc = this.items[0].rc;
      }
    });
    this.prviput=false;
  }
  }

  cancel(){
    this.navCtrl.pop();
  }

  getData() {
    if(this.parametriupita.aktivan==true){
      this.aktivan=1;
    }
    else{
      this.aktivan=0;
    }
    console.log('aktivan ? : ',this.aktivan);
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spMOB_UgovoriSaKupcima",
        "params":{"action":3,
                  "aktivan":this.aktivan,
                  "KupUgovoriVrsteId":this.parametriupita.KupUgovoriVrsteId,
                  "robaid":this.parametriupita.robaid,
                  "klmasterrobaid":this.parametriupita.klmasterrobaid,
                  "naziv":this.parametriupita.naziv
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef);

  }

  trazilica(ev: any){
    //this.getData().then(x => this.items = x);
    let val = ev.target.value;
    
        // if the value is an empty string don't filter the items
        console.log('search...');
        if (val) {
        if (val.trim() == '') {
          this.items = this.itemsoriginal;
          this.lenght = this.items.length;
        } else {
          this.items = this.itemsoriginal.filter((item) => {
            return (item.partner.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
          this.lenght = this.items.length;
        }
      }
      else {
        this.items = this.itemsoriginal;
        this.lenght = this.items.length;
      }
  

  }

  buildgroups(tip) {
    this.groups = [];
    this.items.forEach((item) => {
      item.nazivgrupe=item[tip];
      if (this.groups.find((group) => group.naziv == item[tip]) == undefined) {
        this.groups.push({ naziv: item[tip], roba:item.roba, robaid: item.robaid});
      }
    });
    console.log("Grupe: ",this.groups);
  }

  runninggrouptotals(naziv) {
    let total = 0;

    this.items.forEach((item) => {
      if (item.nazivgrupe == naziv) {
        total ++;
      }
    });

    return total;
  }

  openDetalji(item) {
    this.navCtrl.push('CRMPregledUgovoraDetaljidetaljaPage', item);
      
    
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

  

}
