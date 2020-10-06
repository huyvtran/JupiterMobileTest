import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams ,ToastController, AlertController, IonicPage} from 'ionic-angular';


import {BasePage} from '../../../../../providers/base/base-page';


import {TerkomKomunikacijaProvider} from '../../../../../providers/modules/terkom/terkom-komunikacija-provider';
import {TerkomSifarniciProvider} from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import {TerkomNarudzbaProvider} from '../../../../../providers/modules/terkom/terkom-narudzba-provider';
import {TerkomUserProvider} from '../../../../../providers/modules/terkom/terkom-user-provider';
import {TerkomEvidencijaPosjetaProvider} from '../../../../../providers/modules/terkom/terkom-evidencijaposjeta-provider';
import { TerkomUpitniciProvider } from '../../../../../providers/modules/terkom/terkom-upitnici-provider';

/*
  Generated class for the Komunikacija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-terkom-komunikacija',
  templateUrl: 'komunikacija.html'
})
export class TerkomKomunikacijaPage  extends BasePage{
  terminalId: number;
  data: any;
  text: string = "Dohvat podataka..."
  syncDate : Date
  syncActive : boolean = false;

  constructor(public alertCtrl: AlertController , public navCtrl: NavController, 
  			public navParams: NavParams,
  			public loading : LoadingController, public toastCtrl : ToastController, private komunikacijaservice : TerkomKomunikacijaProvider,
        private sifarniciService: TerkomSifarniciProvider, private narudzbeService : TerkomNarudzbaProvider, private userProvider: TerkomUserProvider,
        private evidencijaPosjetaService : TerkomEvidencijaPosjetaProvider, private upitniciServis : TerkomUpitniciProvider) {

    super()

      this.getUserSyncData();

  }


  ionViewWillEnter() { 
      this.sifarniciService.initSifarnika()
        .then((res) => this.narudzbeService.getKomunikacijaNeposlaneNarudzbe())
        .catch(err => this.global.logError(err, false))
  }


  getUserSyncData(){
    return this.userProvider.getUserInfo()
        .then((res) => {   
            this.syncDate = res ? res.syncDate : null;
        })
  }

  syncData(refresher){

     if(!this.variable.hasInternet){
        //console.log("nema interneta")
        this.syncActive = false;
        this.global.presentToast("Nemate interneta!");
        if(refresher)
          refresher.complete();
      }
      else{
          if(this.narudzbeService.NeposlaneNarudzbeCnt > 0){
                let alert = this.alertCtrl.create({
                  title: 'Imate nedovršene narudžbe koje ćete izgubiti!',
                  message: 'Želite li nastaviti sa sinkronizacijom podataka?',
                  buttons: [
                    {
                      text: 'Odustani',
                      role: 'cancel',
                      handler: () => {
                        this.syncActive = false;
                        if(refresher)
                          refresher.complete();      
                      }},
                    {
                      text: 'Nastavi',
                      handler: () => { 
                         this.syncPodataka(refresher);
                      }}]
              });
              alert.present();  
          }
          else{
                this.syncPodataka(refresher);
          }
      }      
   }

  syncWithButton(){
    this.syncActive = true;
    this.syncData(null);
  }


   private syncPodataka(refresher){
      this.komunikacijaservice.getSifarniciData()
                .then((val) => {
                    this.data = val
                    return this.komunikacijaservice.saveToStorage(this.data)
                })
                .then((val) => {
                    //osvjezi sifarnike
                    this.syncActive = false;
                    return this.sifarniciService.initSifarnika() 
                })
                //obrisi narudzbe priliko sinkronizacije
                .then((val) => { return this.narudzbeService.isprazniNarudzbe()})
                .then((val) => { return this.evidencijaPosjetaService.isprazniPosjet()})
                .then((val) => { return this.upitniciServis.isprazniUpitnike()})
                .then((val) => { return this.userProvider.setSyncDate()})
                .then(() => this.getUserSyncData())
                .then((val) =>  {
                    this.global.presentToast("Uspješna sinkronizacija");
                    if(refresher)
                      refresher.complete()})     
                .catch((err) => { 
                    this.syncActive = false;
                    this.global.logError(err, true);
                    //this.global.presentToast("Dogodila se greška. Pokušajte ponovno");
                    if(refresher)
                      refresher.complete()
                })
   }

}
