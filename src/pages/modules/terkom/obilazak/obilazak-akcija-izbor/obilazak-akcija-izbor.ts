import { Component } from '@angular/core';
import { NavParams, ViewController,IonicPage, ItemSliding, AlertController, ToastController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import {TerkomNarudzbaProvider} from '../../../../../providers/modules/terkom/terkom-narudzba-provider';
import {TerkomSifarniciProvider} from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';

/*
  Generated class for the ObilazakAkcijaIzbor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-obilazak-akcija-izbor',
  templateUrl: 'obilazak-akcija-izbor.html'
})
export class TerkomObilazakAkcijaIzborPage extends BasePage{
  lokacija : string;
	data : any = []
  vrstaDok : string;
  constructor(private toastCtrl:ToastController , private sifarniciService: TerkomSifarniciProvider, public navParams: NavParams, public narudzbeService : TerkomNarudzbaProvider, public viewCtrl : ViewController, private alertCtrl: AlertController) 
  {
      super()
      this.lokacija = this.navParams.get('lokacija');
      this.vrstaDok = this.navParams.get('vrstaDok');
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObilazakAkcijaIzborPage');
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }


  createNarudzba(){
  	this.data.id = null;
  	this.viewCtrl.dismiss(this.data);
  }

  editNarudzba(id){
  	//console.log(id);
  	this.data.id = id;
  	this.viewCtrl.dismiss(this.data);
  }


  deleteNarudzba(slidingItem: ItemSliding,id){
    let alert = this.alertCtrl.create({
      title: 'Želite obrisati narudžbu?',
      buttons: [
      {
        text: 'Odustani',
        handler: () => {
          slidingItem.close();
        }
      },
      {

        text: 'Obriši',
        handler: () => {
          //delete  narudzbe
          this.narudzbeService.delete(id).then((res) => {
                slidingItem.close();  
                this.presentToast("Narudžba uspješno obrisana"); 
                //console.log("parstruid " + this.narudzbeService.parstruid );
                this.narudzbeService.getNarudzbeLokacija()
                .then((res) => this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid))
                .then((res)=> this.narudzbeService.getNarudzbe())
                .then((res)=> {
                  console.log("zavrseno")
                })
      
            }).catch((err) => {
              this.global.logError(err, false);
              this.global.logError("Greška prilikom brisanja!", true);
              slidingItem.close();
              //this.presentToast("Greška prilikom brisanja!");
            });  

        }
      }]
    });
    // now present the alert on top of all other content
    alert.present();

  
  }


  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


}
