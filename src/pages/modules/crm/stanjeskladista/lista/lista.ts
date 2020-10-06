import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html'
})
export class CRMListaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  val;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  lenght = 0;
  rc = 0;

  parametriupita: any = {}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    super();
    this.searchControl = new FormControl();



  }
  ionViewWillEnter() {
    this.parametriupita = this.navParams.data;
    this.getData().then(x => {
    this.items = x.items;
      this.nemapodataka = false;
      if (this.items.length == 0) {
        this.nemapodataka = true;
      }
      else {
        this.nemapodataka = false;
      }
      if (this.parametriupita.skladisteid != null) {
        this.buildgroups('klasa');
      } else {
        this.buildgroups('skladiste');
      }

      this.itemsoriginal = x.items;
      this.lenght = this.items.length;
      if (this.lenght > 0) {
        this.rc = this.items[0].rc;
      }
    });
  }

  cancel() {
    this.navCtrl.pop();
  }

  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMOB_StanjeSkladista",
          "params": {
            "action": 1,
            "skladisteid": this.parametriupita.skladisteid,
            "klmasterrobaid": this.parametriupita.klmasterrobaid,
            "robaid": this.parametriupita.robaid,
            "naziv": this.parametriupita.naziv
          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

  trazilica(ev: any) {
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
      item.nazivgrupe = item[tip];
      if (this.groups.find((group) => group.naziv == item[tip]) == undefined) {
        this.groups.push({ naziv: item[tip], skladiste: item.skladiste, klasa: item.klasa });
      }
    });
    console.log("Grupe: ", this.groups);
  }

  runninggrouptotals(naziv) {
    let total = 0;

    this.items.forEach((item) => {
      if (item.nazivgrupe == naziv) {
        total++;
      }
    });

    return total;
  }


  // getDetails(item) {
  //     this.navCtrl.push('TemeljnoRobaDetPage', item);
  // }

}
