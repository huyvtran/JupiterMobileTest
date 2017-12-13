import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-cjenik-lista',
  templateUrl: 'lista.html'
})
export class CRMCjenikListaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any []= [];
  val;
  searchControl: FormControl;
  groups:any=[];
  nemapodataka=false;
  lenght = 0;
  rc = 0;

  
  parametriupita:any={}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    super();
    this.nemapodataka=false;
    this.searchControl = new FormControl();
 
   
    
  }

  ionViewWillEnter(){
    this.parametriupita = this.navParams.data;
    
       this.getData().then(x => {this.items = x.items;
                                
                                if(this.items.length==0){
                                  this.nemapodataka=true;
                                }
                                else{
                                  this.nemapodataka=false;
                                }
                                if(this.parametriupita.cjenikid != null) {
                                  this.buildgroups('klasa');
                                } else {
                                  this.buildgroups('cjenik');
                                }
                                
                                this.itemsoriginal = x.items;
                                this.lenght = this.items.length;
                                if (this.lenght > 0){
                                this.rc = this.items[0].rc;
                              }});
  }

  cancel(){
    this.navCtrl.pop();
  }

  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
        "query": "spMOB_Cjenik",
        "params":{"action": 1,
                  "cjenikid":this.parametriupita.cjenikid,
                  "klmasterrobaid":this.parametriupita.klmasterrobaid,
                  "robaid":this.parametriupita.robaid,
                  "naziv":this.parametriupita.naziv
        },
        
        "tablename": "items"
        }
    ]
    }

    return this.global.getData(dataDef, true);

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
            return (item.roba.toLowerCase().indexOf(val.toLowerCase()) > -1);
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
        this.groups.push({ naziv: item[tip] , cjenik : item.cjenik, klasa : item.klasa});
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
