import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ViewController, AlertController } from 'ionic-angular';
//import { mojprovider } from '../../providers/mojprovider/mojprovider';
import { Storage } from '@ionic/storage';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../../providers/core/const-provider';
/**
 * Generated class for the InventuraUnoskolicinePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inventura-off-unoskolicine',
  templateUrl: 'inventura-off-unoskolicine.html',
})
export class InventuraOffUnoskolicinePage extends BasePage {
  item: any = { kolicina: 0 };
  items: any;
  gotovo:any[]=[];
  kolicina=0;
  gotovooriginal:any[]=[];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public storagee: Storage
    , public viewCtrl: ViewController, public constant: ConstProvider, public storage: StorageProvider,
    //, public mojprovider: mojprovider
  ) {
    super();
    //this.item = this.navParams.data;
    console.log('this.item', this.item);
    //this.vecUneseneKolicine();
  }
ionViewDidEnter(){
  let keyi=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffinvid');
  let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffitem');
  
  //this.item=this.mojprovider.getItem();
  this.storage.getFromStorage(key.keyvalue, null, true).then(element => {

    this.item = element;
    //this.item.invid=this.mojprovider.invid;
    this.storage.getFromStorage(keyi.keyvalue, null, true).then(element => {
      this.item.invid = element;
    
  console.log('u unosu kolicine this.item.invid: ', this.item.invid);
  this.kolicina=0;
  console.log('this.gotovo: ',this.gotovo);
  this.bildajgotovo();

  let elem = <HTMLInputElement>document.querySelector('#asdf input');
  if (elem) { setTimeout(() => { elem.focus(); elem.select(); }, 550); }
  //if (elem) { elem.focus(); }
  //if (elem) { elem.select(); }
  console.log('elem', elem);

    });
  });
  
  
}

bildajgotovo(){
  let keyg=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
  
  this.gotovo=[];
  this.gotovooriginal=[];
  this.kolicina=0;
  this.storage.getFromStorage(keyg.keyvalue, null, true).then(val => {
    console.log('ovo je val: ',val);
    if (val) {

      // -------------------- filtrirati gotovo prema robaid --------------------------------
      this.gotovooriginal=val;
      
      val.forEach((element, index) => {
        if(element.robaid==this.item.robaid){
          element.indeks=index;
          this.gotovo.push(element);
          this.kolicina= this.kolicina+parseInt(element.kolicina);
        }
      
      });;
      console.log('this.gotovo iz storagea: ', this.gotovo);

      let elem = <HTMLInputElement>document.querySelector('#asdf input');
      if (elem) { setTimeout(() => { elem.focus(); elem.select(); }, 550); }

    }
  });
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad InventuraOffUnoskolicinePage');
    


    
   // this.vecUneseneKolicine();
  }

  potvrdi() {
  let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffitem');
    
    console.log('this.item.kolicina=',this.item.kolicina);
    if(typeof this.item.kolicina!='undefined'){
    //this.mojprovider.setItem(this.item);
    this.storage.addToStorage(key.keyvalue, null, this.item, true);
    this.viewCtrl.dismiss(1);}
    else{
      let alert = this.alertCtrl.create({
        title: 'Upozorenje!',
        subTitle: 'Unesite količinu!',
        buttons: ['OK']
      });
      alert.present();
    }
  }


  // vecUneseneKolicine() {
  //   let sql = "@action = 4, @invid =" + this.mojprovider.invid + ", @robaid =" + this.item.robaid;
  //   console.log(sql);
  //   this.mojprovider.callwebserviceTrgovine(sql).subscribe((items) => {
  //     this.items = items;
  //     console.log('vec unesene kolicine: ', this.item);
  //   });
  // }




runninggrouptotals() {
    let total = 0;
    if (this.items) {
             this.items.forEach((item) => {
                total += item.kolicina;
             });
    }
    return total;
  }



  delete(item) {
    if(item.poslano==1){
      let alert= this.alertCtrl.create({
        title: 'Ne možete brisati, ova stavka je već poslana na server!',
        buttons: ['OK']
      })
      alert.present();
    }
    else{
  let keyg=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
      
      this.gotovooriginal.splice(item.indeks,1);
      this.storage.addToStorage(keyg.keyvalue, null ,this.gotovooriginal, true).then( element=>{
        this.bildajgotovo();
      });
    }
    
  }
  edit(item){
    if(item.poslano==1){
      let alert= this.alertCtrl.create({
        title: 'Ne možete izmijeniti, ova stavka je već poslana na server!',
        buttons: ['OK']
      })
      alert.present();
    }
    else{
      let alert= this.alertCtrl.create({
        title: 'Upišite ispravnu količinu',
        inputs: [{name: 'kolicina',
                  type: 'number'}],
                  buttons: [
                    {
                      text: 'Ok',
                      role: 'ok',
                      handler: data => {
                        console.log('Ok clicked');
                        if(data.kolicina!=''){
                          this.gotovooriginal[item.indeks].kolicina=data.kolicina;
                          let keyg=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
                          
                          this.storage.addToStorage(keyg.keyvalue, null, this.gotovooriginal, true).then(element =>{
                            this.bildajgotovo();
                          });
                        }
                        else{
                          alert.dismiss();
                        }
                      }
                    }]
      })
      alert.present();
    }

  }



  nazad() {
    this.viewCtrl.dismiss(0);
  }
}
