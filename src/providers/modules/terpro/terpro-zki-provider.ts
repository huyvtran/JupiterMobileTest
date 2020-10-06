import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';


declare var cordova: any;
/*
  Generated class for the ZkiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TerProZkiProvider {

  constructor( private platform : Platform) {
    console.log('Hello ZkiServiceProvider Provider');
  }


  calculateZKI(oib, brojRacuna, poslovniProstor, naplatniUredaj, iznos, datum) {
    return new Promise((resolve, reject) => {

      this.platform.ready().then(() => {
        if(this.platform.is('mobile')){
          cordova.plugins.ZKIPlugin.calculateZKI(oib, brojRacuna, poslovniProstor, naplatniUredaj, iznos, datum, function (success) {
            resolve(success);
          }, function (error) {
            reject(error);
          });
        }else
          console.log("nismo na mobitelu!")
      
      });

    });
  }

}
