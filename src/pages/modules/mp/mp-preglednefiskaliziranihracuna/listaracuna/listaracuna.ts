import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ToastController, AlertController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-mp-preglednefiskaliziranihracuna-listaracuna',
  templateUrl: 'listaracuna.html'
})
export class MPPreglednefiskaliziranihracunaListaracunaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  val;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  item: any = {};
  parametriupita: any = {};
  oznacenosve = false;
  ukupno = 0;
  zaslanje: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public alertCtrl: AlertController, public toastCtrl: ToastController) {
    super();
    this.searchControl = new FormControl();



  }
  ionViewWillEnter() {
    this.item = this.navParams.data;
    this.getData().then(x => {
      x.items.forEach((element, index) => {
        let dat = element.datumdok.split('T');
        element.datumdokumenta = dat[0];
        element.checked = false;
        element.indeks = index;
        element.poslano = 0;

      });
      this.items = x.items;

      this.brojioznacene();
      console.log('this.items: ', this.items);
      this.nemapodataka = false;
      if (this.items.length == 0) {
        this.nemapodataka = true;
      }
      else {
        this.nemapodataka = false;
      }
    });
  }

  oznacisve() {

    this.items.forEach(element => {
      if (this.oznacenosve == true) {
        element.checked = true;
      }
      else {
        element.checked = false;

      }

    });
    console.log('this.items nakon promjene checked: ', this.items);
    this.brojioznacene();

  }

  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMOB_MPPregNefisk",
          "params": {
            "action": 2,
            "operateriid": '@@operateriid',
            "trgovinaid": this.item.trgovinaid
          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

  brojioznacene() {
    this.ukupno = 0;
    this.zaslanje = [];
    this.items.forEach(element => {
      if (element.checked == true) {
        this.ukupno++;
        this.zaslanje.push(element);
      }
    });
    console.log('za slanje: ',this.zaslanje);

  }

  oznacen() {
    this.brojioznacene();
  }

  fiskalizirajjedan(item) {
    console.log('Fiskaliziram jedan račun: ', item);
    let toast = this.toastCtrl.create({
      message: 'Račun ' + item.broj + ' uspješno fiskaliziran!',
      duration: 2550,
      position: 'bottom'
    });
    toast.present();
  }

  fiskalizirajsve() {
    if (this.ukupno == 0) {
      let alert = this.alertCtrl.create({
        title: 'Nema odabranih računa za fiskalizaciju!',
        buttons: ['Ok']
      });
      alert.present();
    }
    else {
      let alert = this.alertCtrl.create({
        subTitle: 'Želite li fiskalizirati ' + this.ukupno + ' računa?',
        buttons: [
          {
            text: 'Ne',
            role: 'ne',
            handler: () => {
              console.log('Ne clicked');
            }
          },
          {
            text: 'Da',
            handler: () => {

              console.log('Da clicked');
              this.saljinaserver();
            }
          }
        ]
      });
      alert.present();
    }
  }

  saljinaserver() {
    console.log('usao u salji na server, ovo je this.zaslanje.length: ', this.zaslanje.length);

    if (this.zaslanje.length>0) {
      this.getData2(this.zaslanje[0]).then(x => {
        console.log('ovo je vratio getData2: ',x.items);
        let indeks = this.zaslanje[0].indeks;
        this.zaslanje.splice(0, 1);
        console.log('idem brisati ',indeks);
     
        this.items[indeks].poslano=1;
        this.ukupno--;
        console.log('this.ukupno: ',this.ukupno);
        
        this.saljinaserver();



      });
    }
    else {
      console.log('nema više za slanje');
      this.getData().then(x => {
        x.items.forEach((element, index) => {
          let dat = element.datumdok.split('T');
          element.datumdokumenta = dat[0];
          element.checked = false;
          element.indeks = index;
          element.poslano = 0;
  
        });
        this.items = x.items;
  
        this.brojioznacene();
        console.log('this.items: ', this.items);
        this.nemapodataka = false;
        if (this.items.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;
        }
      });
  }
}

  getData2(item) {
    console.log('ovo je item za slanje u getData2: ',item);
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMOB_MPPregNefisk",
          "params": {
            "action": 2,
            "operateriid": '@@operateriid',
            "trgovinaid": this.item.trgovinaid
          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }


}
