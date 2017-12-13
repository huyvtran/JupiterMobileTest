import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

//import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-analizakupca-lista',
  templateUrl: 'lista.html'
})
export class CRMAnalizaKupcaListaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  // val;
  // searchControl: FormControl;
  // groups:any=[];
  nemapodataka = false;
  lenght = 0;
  rc = 0;
  stora = '';
  izdano1;
  izdano2;
  izdano3;
  realizirano1;
  realizirano2;
  realizirano3;
  otpisano1;
  otpisano2;
  otpisano3;
  prviput=true;



  parametriupita: any = {}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    super();
    this.nemapodataka = false;
    //this.searchControl = new FormControl();

  }
  ionViewWillEnter(){
    if(this.prviput==true){
    this.parametriupita = this.navParams.data;
    console.log('parametri upita poslije slanja u listu: ', this.parametriupita);
    this.prviput=false;
    this.provjerastore();
    }
  }

  provjerastore() {
    if (this.parametriupita.objektanalize == 'Ponude') {
      this.stora = 'spmananakuppon1';
      this.getData1(this.stora).then(x => {
        console.log('x: ', x);
        this.izdano1 = x.items[0].column1;
        console.log('this.izdano1', this.izdano1);
        this.izdano2 = x.items[0].column2;
        this.izdano3 = x.items[0].column3;

        if (x.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });
      this.getData2().then(x => {
        console.log('x: ', x);
        this.realizirano1 = x.items[0].column1;
        console.log('this.realizirano1', this.realizirano1);
        this.realizirano2 = x.items[0].column2;
        this.realizirano3 = x.items[0].column3;

        if (x.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });
      this.getData3().then(x => {
      this.items = x.items;
        console.log('x: ', x);
        this.otpisano1 = x.items[0].column1;
        console.log('this.otpisano1', this.otpisano1);
        this.otpisano2 = x.items[0].column2;
        this.otpisano3 = x.items[0].column3;

        if (x.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });

    }
    else if (this.parametriupita.objektanalize == 'Otprema') {
      this.stora = 'spmananakupNOT';
      this.getData1(this.stora).then(x => {
        console.log('x: ', x);
        this.izdano1 = x.items[0].column1;
        console.log('this.izdano1', this.izdano1);
        this.izdano2 = x.items[0].column2;
        this.izdano3 = x.items[0].column3;

        if (x.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });


    }
    else if (this.parametriupita.objektanalize == 'Fakture') {
      this.stora = 'spmananakupfak ';
      this.getData1(this.stora).then(x => {
        console.log('x: ', x);
        this.izdano1 = x.items[0].column1;
        console.log('this.izdano1', this.izdano1);
        this.izdano2 = x.items[0].column2;
        this.izdano3 = x.items[0].column3;

        if (x.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });


    }

    else if (this.parametriupita.objektanalize == 'Maloprodaja') {
      this.stora = 'spmananakupMPMaloprodajaGla2 ';
      this.getData1(this.stora).then(x => {
        console.log('x: ', x);
        this.izdano1 = x.items[0].column1;
        console.log('this.izdano1', this.izdano1);
        this.izdano2 = x.items[0].column2;
        this.izdano3 = x.items[0].column3;

        if (x.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }

      });


    }


  }

  roba() {
    console.log('klik roba');
    this.navCtrl.push('CRMAnalizaKupcaRobaListaPage', this.parametriupita);

  }

  lokacije() {
    console.log('klik lokacije');
    this.navCtrl.push('CRMAnalizaKupcaLokacijeListaPage', this.parametriupita);

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

  getData2() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmananakuppon2",
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

  getData3() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmananakuppon3",
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



}

