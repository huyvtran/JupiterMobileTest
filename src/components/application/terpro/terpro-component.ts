
import { Component, Input } from '@angular/core';
import { AlertController , NavController} from 'ionic-angular';
import { GlobalProvider } from '../../../providers/core/global-provider';
import { FavoritesProvider } from '../../../providers/core/favorites-provider';

import {TerproSifarniciProvider} from '../../../providers/modules/terpro/terpro-sifarnici-provider';
import { ConstProvider } from '../../../providers/core/const-provider';
import {TerproUserProvider} from '../../../providers/modules/terpro/terpro-user-provider';
import {TerproNarudzbaProvider} from '../../../providers/modules/terpro/terpro-narudzba-provider';

@Component({
  selector: 'terpro-component',
  templateUrl: 'terpro-component.html'
})
export class TerproComponent {
  
  sinkroniziran : number = 0;
  danas = new Date();
  syncDate : Date;

  ukupnoNarudzbiCnt : number = 0;
  neposlanihNarudzbiCnt : number = 0;
  ukupnoZakljucenihDokCnt : number = 0;
  nefiskaliziranihDokCnt : number = 0;

  constructor(private sifarniciServis: TerproSifarniciProvider, private globalProvider: GlobalProvider, private favoritesProvider: FavoritesProvider, 
              private config : ConstProvider, private user :TerproUserProvider, private narudzbeService : TerproNarudzbaProvider, private navCtrl: NavController, private alertCtrl:AlertController,) {
    
      sifarniciServis.initSifarnika()
        .then((res) => this.init())
        .then((res) => this.checkDates())
  }

  init(){
    
        return this.user.getUserInfo()
        .then((res) => {
            //console.log(res)
    
            return this.syncDate = res? res.syncDate : null;

           
        })
        .then(() => {
            return this.narudzbeService.getNarudzbeCount().then((res) =>{
              let data : any = res;

              if(data && data.length > 0) {
          
                  this.ukupnoNarudzbiCnt =  data.length;
              }
              else
                  this.ukupnoNarudzbiCnt = 0;
            })
        })
        .then((res) => this.narudzbeService.getKomunikacijaNeposlaneNarudzbe().then((res) => {
            this.neposlanihNarudzbiCnt = res;
        }))
        .then((res) => this.narudzbeService.getNefiskaliziraniRacuni().then((res) => {
            this.nefiskaliziranihDokCnt = res;
        }))
        .then((res) => this.narudzbeService.getUkupnoZakljuceniDokumentiCnt().then((res) => {
            this.ukupnoZakljucenihDokCnt = res;
        }))
        .catch(Error => console.log(Error.message))
   
  }


   checkDates(){
        //  console.log("did load");

        //  console.log(this.syncDate)
        if(this.syncDate != null)
        {
            //console.log(this.dateDiffInDays(this.danas, new Date(this.syncDate)))
            if(this.dateDiffInDays(this.danas, new Date(this.syncDate)) < 0){
                this.sinkroniziran = 0;
                this.presentConfirm();
            }
            else{
                this.sinkroniziran = 1;
            }
        }
        else
        {
            this.sinkroniziran = 0;
            this.presentConfirm();
        }
            
    }


   dateDiffInDays(a, b) {
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        // Discard the time and time-zone information.
        var utc1 = Date.UTC(a.getFullYear(),a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }


    presentConfirm() {
        let alert = this.alertCtrl.create({
            title: 'Niste sinkronizirali podatke',
            message: 'Želite li ih sinkronizirati sada?',
            buttons: [
            {
                text: 'Odustani',
                role: 'cancel',
                handler: () => {

                }
            },
            {
                text: 'U redu',
                handler: () => {
                    this.globalProvider.pushPage("TerproKomunikacijaPage");
                    //this.navCtrl.push("TerproKomunikacijaPage");
                }
            }
            ]
        });
        alert.present();
    }

}
