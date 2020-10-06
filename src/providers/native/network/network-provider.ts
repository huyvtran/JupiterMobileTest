import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';

import { Platform } from 'ionic-angular';

/*
  Generated class for the NativePluginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class NativeNetworkPluginProvider {

    longitude: number; latitude: number;
    onDevice : boolean;

  constructor(public http: Http, public platform: Platform, private network: Network) { 
    //console.log('Hello NativePluginService Provider');
    this.onDevice = this.platform.is('cordova');
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
