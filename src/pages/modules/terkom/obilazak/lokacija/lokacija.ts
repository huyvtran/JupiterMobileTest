import { Component } from '@angular/core';
import { NavParams , ViewController, IonicPage, LoadingController} from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/ICore';

import { TerkomNarudzbaProvider } from '../../../../../providers/modules/terkom/terkom-narudzba-provider';
/*
  Generated class for the Lokacija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-lokacija',
  templateUrl: 'lokacija.html'
})
export class TerkomLokacijaPage  extends BasePage{
	lokacija : any = []
  zahtjev : string = "";

  constructor(public navParams: NavParams, public viewCtrl: ViewController, private loading: LoadingController, public narudzbaServis : TerkomNarudzbaProvider) {
    super();
  	this.lokacija = this.navParams.get('data');
  	//console.log(this.lokacija);
  }

  ionViewWillEnter(){
  		//console.log("asd")
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LokacijaPage');
  }


  sendZahtjev(){

      if(this.zahtjev != null && this.zahtjev != ""){
          let loading = this.loading.create({
            content: 'Loading...'
          });


          loading.present().then(() => {

              this.send().then((val) => {
                  setTimeout(() => {
                    this.resetValues();
                      loading.dismiss();
                      this.global.presentToast("Zahtjev uspješno predan.")
                  }, 1000);

              })
              .catch((err) => {
                  setTimeout(() => {
                      loading.dismiss();
                  }, 1000);
                  this.global.logError(err, false);
              })

          });
      }
      else
      {
          this.global.presentToast("Upišite koji je vaš zahtjev!")
      }

  }

   send() {

        let data : ICore.IData = {
            "queries": [
        {
            "query": "spMobTerkom_Zahtjev",
            "params": {
                "action" : "INS",
                "operaterid" : "@@operaterid",
                "parstruid" : this.narudzbaServis.parstruid,
                "datum" : 	 new Date().toISOString(),
                "poruka" : this.zahtjev
            }
        }
      ]
        }
        return this
            .global
            .getData(data);

  }

  resetValues(){
    this.zahtjev = "";
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }

}
