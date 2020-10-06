import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
//import { mojprovider } from '../../providers/mojprovider/mojprovider';
import { FormControl } from '@angular/forms';
//import { InventuraUnoskolicinePage } from '../../pages/inventura-unoskolicine/inventura-unoskolicine';
import { ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  selector: 'page-inventura-trazilicarobe',
  templateUrl: 'inventura-trazilicarobe.html',
})
export class InventuraTrazilicarobePage extends BasePage {

  item: any = {}
  items: any;
  naziv: string;
  trgovina: string;
  searchTerm: string = '';
  searchControl: FormControl;
  nemapodataka = true;
  //@ViewChild('searchControl') searchControl ;

  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, public storagee: Storage, public constant: ConstProvider
            , public storage: StorageProvider, public navCtrl: NavController, public navParams: NavParams,
    //public mojprovider: mojprovider, 
    public modalCtrl: ModalController) {
    super();
    // this.item.trgovinaid = navParams.get('trgovinaid');
    // this.trgovina = navParams.get('trgovina');
    // this.gettrgovinaid();
    this.searchControl = new FormControl();
    
  }



  ionViewDidLoad() {
    this.nemapodataka = true;    
    this.item.trgovinaid = this.navParams.get('trgovinaid');
    this.trgovina = this.navParams.get('trgovina');
    this.gettrgovinaid();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      if (this.searchTerm.length == 13) { this.loaddatafromwebservice(); }
      else{
        if(this.searchTerm.length>2) {
          this.search();
        }
        if(this.searchTerm.trim()==''){
          this.search();
        }
        

      }

    });
    console.log('ionViewDidLoad InventuraTrazilicarobePage');

    let elem = <HTMLInputElement>document.querySelector('.some-class input');
    if (elem) { setTimeout(() => { elem.focus(); }, 750); }
    if (elem) { elem.focus(); }


    



    /*

    */


  }

  ionViewLoaded() {

  }

  skener() {

  }

  prikaziDetaljeRobe(item) {
    this.item.robaid = item.robaid;
    let modal = this.modalCtrl.create('InventuraUnoskolicinePage', item);
    modal.present();
    modal.onDidDismiss(data => {
      console.log(' onDidDismiss data', data);

      // let elem = <HTMLInputElement>document.querySelector('.some-class input');
      // if (elem) { setTimeout(() => { this.searchTerm = ""; elem.focus(); }, 350); }

      if (data) {
        if (data.kolicina) {
          if (data.kolicina != 0) {
            this.item.kolicina = data.kolicina;
            this.spremiKolicinu();
            this.items = [];
            // if (elem) {    elem.setAttribute('value','');    }
            //this.searchTerm = "";
          }
        }
      }

      let elem = <HTMLInputElement>document.querySelector('.searchbar-input');
      if (elem) { setTimeout(() => { elem.focus(); }, 550); }
      if (elem) { elem.focus(); }

    });
  }

  search() {
    console.log(this.searchTerm);
    this.loaddatafromwebservice();
  }


  getData() {
    // @action = 3, @trazi='" + this.searchTerm + "'"
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmp_MOBINV",
          "params": {
            "action": 3,
            "trazi": this.searchTerm
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

  getData2() {
    //@action = 2, @trgovinaid=" + this.item.trgovinaid
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmp_MOBINV",
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

  getData3() {
    // @action = 5, @invid =" + this.mojprovider.invid + ", @robaid = " + this.item.robaid + ", @kolicina =" + this.item.kolicina;

    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spmp_MOBINV",
          "params": {
            "action": 5,
            "invid": this.item.invid,
            "robaid": this.item.robaid,
            "kolicina": this.item.kolicina

          },

          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);



  }



  loaddatafromwebservice() {
    this.nemapodataka= true;

    if (this.searchTerm == '') { return; }

    // let loading = this.loadingCtrl.create({ content: 'tražim robu ...' });
    // loading.present();
    // this.mojprovider.callwebserviceTrgovine("@action = 3, @trazi='" + this.searchTerm + "'")
    //   .subscribe((items) => {
    // this.nemapodataka=true;
    // loading.dismiss();

    this.getData().then(x => {
      

      if (x.items.length == 0) {
        this.nemapodataka = true;
        this.items = {};
        console.log("length: ", x.items.length);
        console.log("nemapodataka: ", this.nemapodataka);
      }
      else {
        this.nemapodataka = false;
        console.log("nemapodataka: ", this.nemapodataka);
        console.log("length: ", x.items.length);
        if (typeof x.items[0].errornumber == 'undefined' || x.items[0].errornumber == 0) { // no error
          this.items = x.items;
          this.nemapodataka = false;
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
            this.prikaziDetaljeRobe(x.items[0]);
          }
        }

      }
    });

    // },
    // err => {
    //   this.nemapodataka=true;
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

  gettrgovinaid() {
    // let loading = this.loadingCtrl.create({ content: ' ' });
    // loading.present();
    // this.mojprovider.callwebserviceTrgovine("@action = 2, @trgovinaid=" + this.item.trgovinaid).subscribe((items) => {

    this.getData2().then(x => {
      //this.items = x.items;

      if (x.items.length == 0) {
        //this.nemapodataka = true;
      }
      else {
        //this.nemapodataka = false;
        this.item.invid = x.items[0].invid;
        //this.mojprovider.invid = items[0].invid;
        let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoninvid');
        this.storage.addToStorage(key.keyvalue, null, x.items[0].invid, true).then(element => {
          console.log('situacija; ', this.item);

        });

      }
    });
    //   loading.dismiss();
    // });
  }



  spremiKolicinu() {
    let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoninvid');
    
    // let loading = this.loadingCtrl.create({ content: 'spremam količinu ...' });
    // loading.present();
    // let sql = "@action = 5, @invid =" + this.mojprovider.invid + ", @robaid = " + this.item.robaid + ", @kolicina =" + this.item.kolicina;
    // console.log(sql);
    // this.mojprovider.callwebserviceTrgovine(sql).subscribe((items) => {
    this.storage.getFromStorage(key.keyvalue, null, true).then(element => {
      this.item.invid = element;
      this.getData3().then(x => {
       // this.items = x.items;

        if (x.items.length == 0) {
          //this.nemapodataka = true;
        }
        else {
          //this.nemapodataka = false;
          console.log('nakon spremi kolicinu; ', this.item);
          //loading.dismiss();
          if (typeof x.items[0].errornumber == 'undefined' || x.items[0].errornumber == 0) { // no error
            let elem = <HTMLInputElement>document.querySelector('.some-class input');
            if (elem) { setTimeout(() => { this.searchTerm = ""; elem.focus(); }, 550); }
            // this.items =items;
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
                  if (elem) { setTimeout(() => { this.searchTerm = ""; elem.focus(); }, 550); }

                }
              }]
            });
            alert.present();
            return;

          }
        }
      });
      // },
      //   err => {
      //     console.log("http fail!");
      //     loading.dismiss();
      //     this.connectionAlert();
      //   });

    });
  }



}
