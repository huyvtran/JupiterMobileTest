import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
//import { mojprovider } from '../../providers/mojprovider/mojprovider';
import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
//import { InventuraOffUnoskolicinePage } from '../../pages/inventura-off-unoskolicine/inventura-off-unoskolicine';
import { ModalController } from 'ionic-angular';
//import { PocetnaPage } from '../../pages/pocetna/pocetna';
//import { InventuraOffListatrgovinaPage } from '../../pages/inventura_off_listatrgovina/inventura_off_listatrgovina';
//import { PopisNeposlanihPage } from '../../pages/popis-neposlanih/popis-neposlanih';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../../providers/core/const-provider';

/**
 * Generated class for the InventuraTrazilicarobePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inventura-off-trazilicarobe',
  templateUrl: 'inventura-off-trazilicarobe.html',
})
export class InventuraOffTrazilicarobePage extends BasePage {

  item: any = {}
  items: any[] = [];
  itemsoriginal: any;
  gotovo: any[] = [];
  naziv: string;
  trgovina: string;
  searchTerm: string = '';
  searchControl: FormControl;
  neposlanih = 0;
  trgovinaid = 0;
  duljinagotovo = 0;
  duljinaitemsoriginal = 0;
  duljinaitems = 0;
  nemapodataka = false;
  searching: boolean = false;
  vectrazim = false;
  napomena = '';
  //prikazimiovo;
  //@ViewChild('searchControl') searchControl ;

  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, public storagee: Storage, public navCtrl: NavController
    , public navParams: NavParams,
    public constant: ConstProvider, 
    public storage: StorageProvider,
    //public mojprovider: mojprovider, 
    public modalCtrl: ModalController
    , private barcodeScanner: BarcodeScanner
  ) {
    super();
    this.item.trgovinaid = this.navParams.get('trgovinaid');
    this.searchControl = new FormControl();

  }
  ionViewDidEnter() {
          let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinventura');
          let keyg=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
          let keyt=this.constant.storageKeys.find(item => item.keyname == 'inventuraofftrgovina');
          let keyd=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffdatumdok');

    let elem = <HTMLInputElement>document.querySelector('.searchbar-input');
    if (elem) { setTimeout(() => { elem.focus(); }, 550); }
    // if (elem) { elem.focus(); }

    if (typeof this.navParams.get('trgovina') != 'undefined') {
      this.trgovina = this.navParams.get('trgovina');
      this.storage.addToStorage(keyt.keyvalue, null, this.trgovina, true).then(element => {
        console.log('spremljen naziv trgovine: ', this.trgovina);
      });
    }
    else {
      this.storage.getFromStorage(keyt.keyvalue, null,  true).then(element => {
        this.trgovina = element;
        console.log('naziv trgovine u tražilici robe: ', element);

      });
    }

    this.trgovinaid = this.navParams.get('trgovinaid');
    this.storage.getFromStorage(keyg.keyvalue, null, true).then(val => {
      if (val) {
        this.gotovo = val;
        console.log('this.gotovo iz storagea: ', this.gotovo);
        this.duljinagotovo = this.gotovo.length;
        this.brojineposlane();

      }
    });
  }


  ionViewDidLoad() {
    let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinventura');    
    let keyi=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinvid');
    
    //this.item.invid = this.mojprovider.invid;
    // if (typeof this.item.invid == 'undefined') {
    this.storage.getFromStorage(keyi.keyvalue, null, true).then(val => {
      if (val) {
        this.item.invid = val;
        //this.mojprovider.invid = val;

      }
    });
    //}
    console.log('ionViewDidLoad InventuraOffTrazilicarobePage');

    this.storage.getFromStorage(key.keyvalue, null, true).then(data => {
      if (data) {
        this.itemsoriginal = data;
        this.duljinaitemsoriginal = this.itemsoriginal.length;
      }
      else {
        this.gettrgovinaid();
      }
    })


    // let elem = <HTMLInputElement>document.querySelector('.searchbar-input');
    // if (elem) { setTimeout(() => { elem.focus(); }, 550); }
    // if (elem) { elem.focus(); }




    this.searchControl.valueChanges.subscribe(search => {
      this.nemapodataka = false;
      this.items = [];
      this.duljinaitems = this.items.length;
    });
    setTimeout(() => {
      this.searchControl.valueChanges.debounceTime(1000).subscribe(search => {
        if (!this.vectrazim) {
          this.items = [];
          this.duljinaitems = this.items.length;
          this.nemapodataka = false;
          if (this.searchTerm.length > 2) {
            //this.loaddatafromwebservice(); 
            if (isNaN(+this.searchTerm)) {
              this.search();
            }


          }

        }
      });
    }, 500);



  }


  skener() {

    this.barcodeScanner.scan().then((barcodeData) => {
      // Success! Barcode data is here
      console.log('barcodeData, ', barcodeData);
      //this.prikazimiovo = barcodeData.text;
      this.searchTerm = barcodeData.text;
    }, (err) => {
      // An error occurred
    });

  }


  popis() {
    this.navCtrl.push('PopisNeposlanihPage');
  }

  brojineposlane() {
    this.neposlanih = 0;
    this.gotovo.forEach(element => {
      if (element.poslano == 0) {
        this.neposlanih++;
      }

    });
  }

  sinkroniziraj() {
    this.napomena = '';
    if (this.neposlanih == 0) {
      let alert = this.alertCtrl.create({
        title: 'Svi unosi su poslani!',
        buttons: ['Ok']
      });
      alert.present();
    }
    else {
      let alert = this.alertCtrl.create({
        subTitle: 'Želite li poslati ' + this.neposlanih + ' unosa na server?',
        inputs: [{
          name: 'Napomena',
          placeholder: 'Napomena',
          type: 'text'
        }],

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
            handler: (data) => {

              console.log('Da clicked');
              if (data.Napomena != '') {
                this.napomena = data.Napomena;
                this.dohvatiIDdonosa();
              }
              else {
                alert.dismiss();
              }

            }
          }
        ]
      })
      alert.present();
      // let alert = this.alertCtrl.create({
      //   subTitle: 'Želite li poslati ' + this.neposlanih + ' unosa na server?',
      //   buttons: [
      //     {
      //       text: 'Ne',
      //       role: 'ne',
      //       handler: () => {
      //         console.log('Ne clicked');
      //       }
      //     },
      //     {
      //       text: 'Da',
      //       handler: () => {

      //         console.log('Da clicked');
      //         this.dohvatiIDdonosa();
      //       }
      //     }
      //   ]
      // });
      // alert.present();
    }
  }

  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmp_MOBINVOFF",
          "params": {
            "action": 14,
            "invid": this.item.invid,
            "napomena": this.napomena
          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

  // @action = 13, @iddonosa = " + iddonosa + ", @robaid = " + this.gotovo[indeks].robaid + ", @kolicina = " + this.gotovo[indeks].kolicina + 
  // ", @napomena = '"+this.napomena+
  // "'")

  getData2(iddonosa, indeks) {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmp_MOBINVOFF",
          "params": {
            "action": 13,
            "iddonosa": iddonosa,
            "robaid": this.gotovo[indeks].robaid,
            "kolicina": this.gotovo[indeks].kolicina,
            "napomena": this.napomena

          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

  getData3() {
    // @action = 11, @invid = " + this.item.invid + ""
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmp_MOBINVOFF",
          "params": {
            "action": 11,
            "invid": this.item.invid

          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }


  getData4() {
    //@action = 2, @trgovinaid=" + this.item.trgovinaid
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmp_MOBINVOFF",
          "params": {
            "action": 2,
            "trgovinaid": this.item.trgovinaid

          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

  dohvatiIDdonosa() {

    this.getData().then(x => {
      this.items = x.items;

      if (this.items.length == 0) {
        this.nemapodataka = true;
      }
      else {
        this.nemapodataka = false;

        if (typeof x.items[0].errornumber == 'undefined' || x.items[0].errornumber == 0) { // no error
          let iddonosa = x.items[0].id;
          this.saljijedanpojedan(iddonosa);
        }
      }


    });

    // this.mojprovider.callwebserviceOffTrgovine("@action = 14, @invid = " + this.item.invid +
    // ", @napomena = "+this.napomena+
    // "")
    //   .subscribe((items) => {
    //     if (typeof items[0].errornumber == 'undefined' || items[0].errornumber == 0) { // no error
    //       let iddonosa = items[0].id;
    //       this.saljijedanpojedan(iddonosa);
    //     }

    //     else { // error
    //       console.log(items[0].errdescription);
    //       return;
    //     }
    //   },
    //   err => {
    //     console.log("http fail!");
    //     this.connectionAlert();

    //   });
  }

  saljijedanpojedan(iddonosa) {
    let indeks;
    indeks = this.gotovo.findIndex(element => element.poslano == 0);
    console.log('indeks: ', indeks);
    if (indeks != -1) {
      this.getData2(iddonosa, indeks).then(x => {
        this.items = x.items;

        if (this.items.length == 0) {
          this.nemapodataka = true;
        }
        else {
          this.nemapodataka = false;

          if (typeof x.items[0].errornumber == 'undefined' || x.items[0].errornumber == 0) { // no error
            this.gotovo[indeks].poslano = 1;
            this.brojineposlane();
          let keyg=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
            
            this.storage.addToStorage(keyg.keyvalue, null, this.gotovo, true).then(element => {
              console.log('storage.set => element : ', element);
              if (element) {

                this.saljijedanpojedan(iddonosa);

              }
            });

          }
        }
      });
    }
    else {
      console.log('nema više za slanje');
      this.brojineposlane();

    }

  }

  prikaziDetaljeRobe(item) {
          let keyg=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
          let keyi=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinvid');
          
    this.item.robaid = item.robaid;
    this.item.sifra = item.sifra;
    this.item.naziv = item.naziv;
    this.item.barcode = item.barcode;
    this.item.jm = item.jm;
    console.log('this.item: ', this.item);
    //this.mojprovider.setItem(this.item);
    let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffitem');
    
    this.storage.addToStorage(key.keyvalue, null, this.item, true);
    let modal = this.modalCtrl.create('InventuraOffUnoskolicinePage');
    modal.present();
    modal.onDidDismiss(data => {
      console.log(' onDidDismiss data', data);

      //let elem = <HTMLInputElement>document.querySelector('.some-class input');
      //if (elem) { setTimeout(() => { this.searchTerm = ""; elem.focus(); }, 350); }

      if (data == 1) {
        // if (data.kolicina) {
        //   if (data.kolicina != 0) {
        //     this.item.kolicina = data.kolicina;
        //this.item = this.mojprovider.getItem();
        this.storage.getFromStorage(key.keyvalue, null, true).then(element => {
          this.item = element;
          console.log('item dohvaćen iz storagea: ', this.item);
          this.item.poslano = 0;
          this.gotovo.push(this.item);
          this.duljinagotovo = this.gotovo.length;
          
          this.storage.addToStorage(keyg.keyvalue, null, this.gotovo, true).then(element => {
            console.log('this.gotovo: ', this.gotovo);
            this.item = {};
            this.item.trgovinaid = this.trgovinaid;
            //this.item.invid = this.mojprovider.invid;
            this.storage.getFromStorage(keyi.keyvalue, null, true).then(element => {
              this.item.invid = element;
              console.log('invid nakon dohvaćanja iz storagea: ', this.item.invid);
              this.brojineposlane();

              //this.spremiKolicinu();
              //this.items = [];
              // if (elem) {    elem.setAttribute('value','');    }
              this.searchTerm = "";
              this.items = [];
              this.duljinaitems = this.items.length;


            });

          });


        });

      }
      else {
        this.storage.getFromStorage(keyg.keyvalue, null, true).then(val => {
          if (val) {
            this.gotovo = val;
            console.log('this.gotovo iz storagea: ', this.gotovo);
            this.duljinagotovo = this.gotovo.length;
            this.brojineposlane();

          }
        });
      }

      let elem = <HTMLInputElement>document.querySelector('.searchbar-input');
      if (elem) { setTimeout(() => { elem.focus(); }, 550); }
      //if (elem) { elem.focus(); }

    });
  }

  search() {
    this.vectrazim = true;
    this.nemapodataka = false;
    setTimeout(() => {
      this.vectrazim = false;
    }, 900);
    console.log(this.searchTerm);
    if (this.searchTerm.trim() == '') {
      this.items = [];
      this.duljinaitems = this.items.length;
      this.nemapodataka = false;

    }
    else {
      this.items = [];
      this.searching = true;
      console.log('searching', this.searching);
      if (!isNaN(+this.searchTerm)) {
        console.log('trazim brojeve');
        this.itemsoriginal.forEach(element => {
          if (element.Sifra == this.searchTerm.toLowerCase() || element.barcode == this.searchTerm.toLowerCase()) {
            this.items.push(element);
          }

        });

      }
      else {
        console.log('trazim nazive');

        this.itemsoriginal.forEach(element => {
          if (element.naziv.toLowerCase().match(this.searchTerm.toLowerCase())) {
            this.items.push(element);
          }

        });
      }


      setTimeout(() => {
        this.searching = false;
        console.log('searching', this.searching)
      }, 300);


      this.duljinaitems = this.items.length;
      console.log('duljinaitems= ', this.duljinaitems);
      if (this.duljinaitems == 0) {
        this.nemapodataka = true;
        this.searchTerm = '';
      }


      console.log('this.items: ', this.items);

      this.duljinaitems = this.items.length;


    }

  }



  loaddatafromwebservice() {

    //if (this.searchTerm == '') { return; }

    // let loading = this.loadingCtrl.create({ content: 'preuzimam listu robe ...' });
    // loading.present();
    // this.mojprovider.callwebserviceOffTrgovine("@action = 11, @invid = " + this.item.invid + "")
    //   .subscribe((items) => {

    //loading.dismiss();

    this.getData3().then(x => {
      this.items = x.items;

      if (this.items.length == 0) {
        this.nemapodataka = true;
      }
      else {
        this.nemapodataka = false;

        if (typeof x.items[0].errornumber == 'undefined' || x.items[0].errornumber == 0) { // no error

          this.items = [];
          this.duljinaitems = this.items.length;
          this.itemsoriginal = x.items;
          this.duljinaitemsoriginal = this.itemsoriginal.length;
          let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinventura');    
          
          this.storage.addToStorage(key.keyvalue, null, x.items, true);
        } else { // error
          console.log(x.items[0].errdescription);


          let alert = this.alertCtrl.create({
            title: 'Greška !',
            subTitle: x.items[0].errdescription,
            buttons: [{
              text: 'OK',
              handler: () => {
                console.log('OK clicked');

                let elem = <HTMLInputElement>document.querySelector('.some-class input');
                if (elem) { setTimeout(() => { this.searchTerm = ""; elem.focus(); }, 350); }

              }
            }]
          });
          alert.present();
          return;

        }
        // this.naziv = items[0].naziv;
        console.log('items; ', x.items);
        console.log('items.length; ', x.items.length);

        console.log('situacija; ', this.item);


        if (x.items) {
          if (x.items.length == 1) {
            // this.prikaziDetaljeRobe(items[0]);
          }
        }

      }
    });

    // },
    // err => {
    //   console.log("http fail!");
    //   loading.dismiss();
    //   this.connectionAlert();
    // }
    // )
  }






  connectionAlert() {
    let alert = this.alertCtrl.create({
      title: 'Connection Error',
      subTitle: 'Provjerite svoju internet vezu.',
      buttons: ['OK']
    });
    alert.present();
  }

  refresh() {
    let alert = this.alertCtrl.create({
      title: 'Sigurno želite ponovno učitati listu robe?',
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
            this.gettrgovinaid();
          }
        }
      ]
    });
    alert.present();
  }

  zavrsi() {
    // let alert = this.alertCtrl.create({
    //   title: 'Upozorenje',
    //   subTitle: 'Sigurno želite zaključiti trenutnu inventuru?',
    //   buttons: [
    //     {
    //       text: 'Ne',
    //       role: 'ne',
    //       handler: () => {
    //         console.log('Ne clicked');
    //       }
    //     },
    //     {
    //       text: 'Da',
    //       handler: () => {

    //         console.log('Da clicked');
    //         this.storage.remove('inventura');
    //         this.storage.remove('gotovo');
    //         this.storage.remove('invid');
    //         this.storage.remove('trgovina');
    //         this.navCtrl.setRoot(PocetnaPage);
    //       }
    //     }
    //   ]
    // });
    // alert.present();
    this.navCtrl.setRoot('InventuraOffListatrgovinaPage');


  }

  gettrgovinaid() {
    // let loading = this.loadingCtrl.create({ content: ' ' });
    // loading.present();
    // this.mojprovider.callwebserviceOffTrgovine("@action = 2, @trgovinaid=" + this.item.trgovinaid).subscribe((items) => {

    this.getData4().then(x => {
      this.items = x.items;

      if (this.items.length == 0) {
        this.nemapodataka = true;
      }
      else {
        let keyi=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinvid');
        let keyd=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffdatumdok');
        
        this.nemapodataka = false;
        this.item.invid = x.items[0].invid;
        this.item.datumdok = x.items[0].datumdok;
        //this.mojprovider.invid = items[0].invid;
        this.storage.addToStorage(keyi.keyvalue, null, this.item.invid, true);
        console.log('ovaj invid postavljam u storage: ', x.items[0].invid);
        this.storage.addToStorage(keyd.keyvalue, null, this.item.datumdok, true);
        this.loaddatafromwebservice();

        console.log('situacija; ', this.item);

      }
    });

    //   loading.dismiss();
    // });
  }



  // spremiKolicinu() {
  //   let loading = this.loadingCtrl.create({ content: 'spremam količinu ...' });
  //   loading.present();
  //   let sql = "@action = 5, @invid =" + this.mojprovider.invid + ", @robaid = " + this.item.robaid + ", @kolicina =" + this.item.kolicina;
  //   console.log(sql);
  //   this.mojprovider.callwebserviceTrgovine(sql).subscribe((items) => {
  //     console.log('nakon spremi kolicinu; ', this.item);
  //     loading.dismiss();
  //     if (typeof items[0].errornumber == 'undefined' || items[0].errornumber == 0) { // no error
  //       let elem = <HTMLInputElement>document.querySelector('.some-class input');
  //       if (elem) { setTimeout(() => { this.searchTerm = ""; elem.focus(); }, 550); }
  //       // this.items =items;
  //     } else { // error
  //       console.log(items[0].errdescription);

  //       let alert = this.alertCtrl.create({
  //         title: 'Greška !',
  //         subTitle: items[0].errdescription,
  //         buttons: [{
  //           text: 'OK',
  //           handler: () => {
  //             console.log('OK clicked');

  //             let elem = <HTMLInputElement>document.querySelector('.some-class input');
  //             if (elem) { setTimeout(() => { this.searchTerm = ""; elem.focus(); }, 550); }

  //           }
  //         }]
  //       });
  //       alert.present();
  //       return;

  //     }
  //   },
  //     err => {
  //       console.log("http fail!");
  //       loading.dismiss();
  //       this.connectionAlert();
  //     });
  // }


}
