import { Injectable } from '@angular/core';

import { ConstProvider } from '../../core/const-provider';
import { TerkomDataProvider } from './terkom-data-provider';
import {StorageProvider} from '../../core/storage-provider';


import {TerkomNarudzbaProvider} from '../../modules/terkom/terkom-narudzba-provider';

@Injectable()
export class TerkomEvidencijaPosjetaProvider {

    posjetCnt : number = 0;
    posjet : any = [];
    
  	constructor(public constants:ConstProvider, private dataServis : TerkomDataProvider, private storage : StorageProvider, private narudzbeService : TerkomNarudzbaProvider) {}
	
    //dohvati posjet za parstrud ako postoji u storageu
    getPosjet(): Promise<any>{
       
        let key = this.constants.evidencijaposjetaKey.keyvalue;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
             .then((val) => {    
      
                this.posjet = this.storage.filterCollectionSingleValue(val, 'parstruid', this.narudzbeService.parstruid);  
              
                if(Object.keys(this.posjet).length != 0)
                    this.posjetCnt = 1
                else{
                     this.posjetCnt = 0;
                     this.posjet = null
                }
                   
                resolve( this.posjet);
            }, (error) => {
                reject(error);
            }); 
		});
    }


   
    //spremi posjet lokalno - id.eve razloga obilaska
    save(data: any, napomena: string, azuriranje: boolean): Promise<any> {
        
        let key = this.constants.evidencijaposjetaKey.keyvalue;
        let posjet = {
            parstruid: this.narudzbeService.parstruid,
            //userid: this.constants.operaterId
            selected: data,
            napomena: napomena,
            azuriranje: azuriranje
        }


        
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key)
                .then((posjeti) => {
                        
                    if (posjeti && posjeti.length > 0){
                        //filtriraj posjete ako postoji za parstruid
                        let postoji : boolean = false;
                        posjeti.forEach(posjet => {
                            //ako postoji posjet az taj parstrud update selected array
                            if(posjet.parstruid === this.narudzbeService.parstruid){
                                posjet.selected = data;
                                posjet.napomena = napomena;
                                posjet.azuriranje = azuriranje;
                                postoji = true;
                            }
                            else{
                                //ne postoji posjet i dodaj ga dolje
                                if(!postoji)                     
                                    postoji = false;
                            }
                        })
 
                        if(!postoji)
                            this.storage.addItemToArray(posjeti, posjet)

                    }
                    else{
  
                        posjeti = [];
                        this.storage.addItemToArray(posjeti, posjet)
           
                    }
                    
                    return posjeti;
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                , (error) => {
                    reject(error);
                });
        });

    }


    isprazniPosjet(parstruid?): Promise<any> {
        let key = this.constants.evidencijaposjetaKey.keyvalue;
        //dohvati sve posjete
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key)
                .then((posjeti) => {
                    //ukloni poslani
   
                    var index = this.storage.findArrayIndex(posjeti,'parstruid',parstruid )

                    if(posjeti)
                        posjeti.splice(index, 1);

                    if(!parstruid){
                        this.posjet = [];
                        this.posjetCnt = 0;
                        posjeti = []
                    }

                    resolve(this.storage.addToStorage(key, null, posjeti, true))
                })

        });

    }

  	
	
}
