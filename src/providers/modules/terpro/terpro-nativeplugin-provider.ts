import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';

import { Platform } from 'ionic-angular';

/*
  Generated class for the NativePluginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class TerproNativePluginProvider {

	longitude: number; latitude: number;
  onDevice : boolean;

  headerDefMPRacunTablica = [

    {nazivKolone:"Naziv", leftpadding: 0, red: 1},
    {nazivKolone:"Kolicina", leftpadding: 20, red: 1},
    {nazivKolone:"JM", leftpadding: 8, red: 1},
    {nazivKolone:"PDV", leftpadding: 10, red: 1},
    {nazivKolone:"Cijena", leftpadding: 7, red: 1},
    {nazivKolone:"Sifra", leftpadding: 0, red: 2},
    {nazivKolone:"Rabat", leftpadding: 45, red: 2},
    {nazivKolone:"Iznos", leftpadding: 7, red: 2},
  ]

  constructor(public http: Http, public platform: Platform, private network: Network , private geolocation: Geolocation) { 
    //console.log('Hello NativePluginService Provider');
    this.onDevice = this.platform.is('cordova');
  }

  getLocation(){
  	 return new Promise((resolve, reject) => {
        var posOptions = {
            enableHighAccuracy: true,
            timeout: 10000
        };

    	this.geolocation.getCurrentPosition(posOptions).then((resp) => {
    	 		//console.log("logiram")
        
    	 		
          if(resp && resp.coords) {
            this.longitude = resp.coords.longitude;
            this.latitude = resp.coords.latitude;
            resolve(resp);
          }
          else
            resolve(Error)

  		}).catch((error) => {
  			resolve(error)
  		  console.log('Error getting location', error);
  		});
         
	  });

  }

  isOnline(): boolean {

    if(this.onDevice && this.network.type){
      return this.network.type !== "none";
    } else {
      return navigator.onLine; 
    }
  }
 
  isOffline(): boolean {

    if(this.onDevice && this.network.type){
      return this.network.type === "none";
    } else {
      return !navigator.onLine;   
    }
  }

}
