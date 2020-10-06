import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';

import { Platform } from 'ionic-angular';

/*
  Generated class for the NativePluginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class NativeGeolocationPluginProvider {

	longitude: number; latitude: number;
    onDevice : boolean;
  constructor(public http: Http, public platform: Platform, private geolocation: Geolocation) { 
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

  
  getLocationIzvidnik() : Promise<any>{
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


}
