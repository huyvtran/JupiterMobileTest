import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

//import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-analizakupca-robalista',
  templateUrl: 'robalista.html'
})
export class CRMAnalizaKupcaRobaListaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  // val;
  // searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  lenght = 0;
  rc = 0;
  stora = '';

  parametriupita: any = {}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    super();
    this.nemapodataka = false;

    this.parametriupita = this.navParams.data;
    console.log('parametri upita poslije slanja u listu: ', this.parametriupita);
    this.provjerastore();

  }

  provjerastore() {
    if (this.parametriupita.objektanalize == 'Ponude') {
      this.stora = 'spManAnakupPonR1 ';
      this.getData1(this.stora).then(x => {
        console.log('x: ', x);
        this.items = x.items;
        this.buildgroups('klasa robe');

        if (x.items.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });

    }
    else if (this.parametriupita.objektanalize == 'Otprema') {
      this.stora = 'spManAnakupNOTR1 ';
      this.getData1(this.stora).then(x => {
        console.log('x: ', x);
        console.log('x: ', x);
        this.items = x.items;
        this.buildgroups('klasa robe');

        if (x.items.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });


    }
    else if (this.parametriupita.objektanalize == 'Fakture') {
      this.stora = 'spManAnakupFakR1  ';
      this.getData1(this.stora).then(x => {
        console.log('x: ', x);
        console.log('x: ', x);
        this.items = x.items;
        this.buildgroups('klasa robe');

        if (x.items.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });


    }

    else if (this.parametriupita.objektanalize == 'Maloprodaja') {
      this.stora = 'spManAnakupMPR1  ';
      this.getData1(this.stora).then(x => {
        console.log('x: ', x);
        console.log('x: ', x);
        this.items = x.items;
        this.buildgroups('klasa robe');

        if (x.items.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });


    }


  }

  cancel() {
    this.navCtrl.pop();
  }

  getData1(stora) {

    console.log('getData1', this.parametriupita)

    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": stora,
          "params": {
            "dat1": this.parametriupita.datumod2,
            "dat2": this.parametriupita.datumdo2,
            "org": this.parametriupita.orgsortkey,
            "klm": this.parametriupita.klasasortkey,
            "ParId": this.parametriupita.partneriid,
            "ParStruId": this.parametriupita.lokacijaid
          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef, true);

  }

  buildgroups(tip) {
    this.groups = [];
    this.items.forEach((item) => {
      item.nazivgrupe = item[tip];
      if (this.groups.find((group) => group.naziv == item[tip]) == undefined) {
        this.groups.push({ naziv: item[tip], klasa: item[tip] });
      }
    });
    console.log("Grupe: ", this.groups);
  }

  runninggrouptotals(naziv) {
    let total = 0;

    this.items.forEach((item) => {
      if (item['klasa robe'] == naziv) {
        total++;
      }
    });

    return total;
  }

}

