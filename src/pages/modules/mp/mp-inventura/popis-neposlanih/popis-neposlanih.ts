import { Component } from '@angular/core';

import { NavController, AlertController, ViewController, IonicPage } from 'ionic-angular';

//import { mojservis } from '../../providers/mojservis';
import { Storage } from '@ionic/storage';
import { ItemSliding } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../../providers/core/const-provider';

@IonicPage()
@Component({
  selector: 'page-popis-neposlanih',
  templateUrl: 'popis-neposlanih.html'
})
export class PopisNeposlanihPage extends BasePage {

  items: any;
  neposlanih;
  gotovooriginal;

  constructor(public navCtrl: NavController
    //,private mojservis: mojservis
    , public storagee: Storage, public alertCtrl: AlertController, public viewCtrl: ViewController, public constant: ConstProvider, public storage: StorageProvider) {
      super();
  }


  deleteitem(item, slidingItem: ItemSliding) {
    if(item.poslano==1){
      let alert= this.alertCtrl.create({
        title: 'Ne možete brisati, ova stavka je već poslana na server!',
        buttons: ['OK']
      })
      alert.present();
    }
    else{
      
        let index = this.gotovooriginal.indexOf(item);
    
        if(index > -1){
          this.gotovooriginal.splice(index,1);
        }
        let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
      
      this.storage.addToStorage(key.keyvalue, null, this.gotovooriginal, true).then( element=>{
        this.dohvatiGotovo();
        //this.brojineposlane();
        if(this.neposlanih==0){
          this.navCtrl.pop();
        }
      });
      try{
        slidingItem.close();
      }catch(error){
        //
      }
    }
    
  }

  brojineposlane() {
    this.neposlanih = 0;
    this.items.forEach(element => {
      if (element.poslano == 0) {
        this.neposlanih++;
      }
    });
  }

  obrisisve(){
    let alert = this.alertCtrl.create({
      title: 'Jeste li sigurni da želite obrisati sve stavke?',
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
            this.gotovooriginal=this.gotovooriginal.filter(item => item.poslano!=0);
            this.brojineposlane();
            this.navCtrl.pop();
            let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
            
            this.storage.addToStorage(key.keyvalue, null, this.gotovooriginal, true).then( element=>{
            });
            console.log('Da clicked');
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirmePage');
    this.dohvatiGotovo();

  }
  dohvatiGotovo(){
    let key=this.constant.storageKeys.find(item => item.keyname == 'inventuraoffgotovo');
    
    this.storage.getFromStorage(key.keyvalue, null, true).then(val => {
      if (val) {
        // val.forEach((element, index) => {
          
        //     element.indeks=index;
        //     this.gotovo.push(element);
        //     this.kolicina= this.kolicina+parseInt(element.kolicina);
          
        
        // });
        this.items = val;
        console.log('this.gotovo iz storagea: ', this.items);
        this.brojineposlane();
        this.gotovooriginal = val;
      }
    });
  }



}
