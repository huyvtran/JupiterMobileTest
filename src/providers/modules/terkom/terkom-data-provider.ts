import { Injectable } from '@angular/core';

import {GlobalProvider} from '../../core/global-provider';
import {StorageProvider} from '../../core/storage-provider';

import * as INarudzba from '../../../interfaces/terkom/INarudzba';
import {ConstProvider} from '../../core/const-provider';


//dohvat podataka syncanih sa apija
@Injectable()
export class TerkomDataProvider {

//shared metode između klasa narudzbeprovider i sifarnici provider
public narudzbe : Array<INarudzba.Narudzba> = [];

constructor( private global: GlobalProvider, private storage: StorageProvider,
    private constants : ConstProvider){        
}


    getDataFromStorage(key) {
        return this.storage.getFromStorage(key, null, true)
            .catch(ex => this.global.logError(ex, true));
    }

    getAllNarudzbe(): Promise<Array<INarudzba.Narudzba>> {
        let key = this.constants.narudzbaKey.keyvalue;
                 
    	 return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
             .then((val) => {
                 this.narudzbe =  [];
                 this.narudzbe = val          
                resolve(this.narudzbe);
            }, (error) => {
                reject(error);
            }); 
		});
    }


    getRobe(): Promise<any>{
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "roba");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {            
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
		});
    }

    getVrsteDok(): Promise<any> {
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "vrstadokumenta");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {              
                    resolve(val);
                }, (error) => {
                    reject(error);
                }); 
        });
    }

    

    getLokacije(): Promise<any> {

         let key = this.constants.storageKeys.find((r: any) => r.keyname === "partneri");
    	 return new Promise((resolve, reject) => {
             this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {                       
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
		});
  	}


    getNacinPlacanja(): Promise<any>{
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "nacinplacanja");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {            
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
		});

    }
   

    getNacinIsporuke(): Promise<any>{
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "nacinisporuke");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => { 
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
		});

    }

    getSkladista(): Promise<any>{
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "skladista");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => { 
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
		});

    }

    getVrstaObilazka(): Promise<any>{
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "vrstaobilaska");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => { 
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
		});

    }

}
