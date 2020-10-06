import { Injectable } from '@angular/core';

import {GlobalProvider} from '../../core/global-provider';
import {StorageProvider} from '../../core/storage-provider';

import * as INarudzba from '../../../interfaces/terpro/INarudzba';
import {ConstProvider} from '../../core/const-provider';


//dohvat podataka syncanih sa apija
@Injectable()
export class TerproDataProvider {

//shared metode između klasa narudzbeprovider i sifarnici provider
public narudzbe : Array<INarudzba.Narudzba> = [];

constructor( private global: GlobalProvider, private storage: StorageProvider,
    private constants : ConstProvider){        
}



    getAllNarudzbe(): Promise<Array<INarudzba.Narudzba>> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
                 
    	 return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {
                 this.narudzbe =  [];
                 this.narudzbe = <Array<INarudzba.Narudzba>>val          
                resolve(this.narudzbe);
            }, (error) => {
                reject(error);
            }); 
		});
    }


    getRobe(): Promise<any>{
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "roba");
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
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "vrstadokumenta");
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

         let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "partneri");
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
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "nacinplacanja");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {            
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
		});

    }

    getJMRoba(): Promise<any> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "jmroba");
                 
    	 return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
		});
    }

    getUgovori(): Promise<any> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "ugovori");
                 
    	 return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
		});
    }

    getBrojStavkeNarudzbe(pronarudzbeglaid): Promise<any> {
         let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
            
        return new Promise((resolve, reject) => {
           this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    if(val) 
                        val = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(val,'pronarudzbeglaid', pronarudzbeglaid);           
                        val =  val?  val.stavke : []; 
                        //order listu dokumenata po pronarudzbeglaid koloni
                        val  = this.storage.orderItemsBy(val, 'pronarudzbedetid', 'asc'); 
                        //dohvati zadnji array element (s najvecim brojem dokumenta) i uvecaj ga za 1 
                        val = this.storage.getLastArrayElement(val);
                        val = val? Number(val.pronarudzbedetid) + 1 : 1;    
                        //console.log(val)
                resolve(val);
            }, (error) => {
                reject(error);
            }); 
        });
    }
   

}
