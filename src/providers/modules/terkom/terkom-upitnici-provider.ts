import { Injectable } from '@angular/core';

import { ConstProvider } from '../../core/const-provider';
import { TerkomDataProvider } from './terkom-data-provider';
import {StorageProvider} from '../../core/storage-provider';
import { GlobalProvider } from '../../core/global-provider';

import {TerkomNarudzbaProvider} from '../../modules/terkom/terkom-narudzba-provider';
import * as IUpitniciOdgovori from '../../../interfaces/terkom/IUpitniciOdgovori';
import * as ICore from '../../../interfaces/ICore';

@Injectable()
export class TerkomUpitniciProvider {

    //varjable za dohvat podataka za inicijalni prikaz
    upitnici : Array<any>
    pitanja : Array<any>
    odgovori: Array<any>
    odgovoriSvi : Array<any>

    popunjeniUpitniciLokacijeCnt : number;
    
    odgovoreniUpitnici : Array<any> = [];
    odgovorenaPitanjaIDs : Array<any> = [];
    
    odgovorenaPitanja : Array<any> = [];


    //slanje upitnicka
    upitniciJson  : Array<IUpitniciOdgovori.IUpitniciSync> = [];
  	constructor(public constants:ConstProvider, 
                private dataServis : TerkomDataProvider, 
                private storage : StorageProvider,
                private narudzbeService : TerkomNarudzbaProvider,
                private global: GlobalProvider) {}
	

    //dohvat svih upitnika
    getUpitnici(): Promise<any>{
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "upitnici");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {  
                 this.upitnici = val;    
                 //console.log(this.upitnici)
                 //ako array odgovorenih upitnika nije prazan setaj property answered = true na odgovorene upitnike
                if(this.odgovoreniUpitnici.length > 0)
                {
                    var odgovoreniIDs = JSON.parse("[" + this.odgovoreniUpitnici + "]");
                    //protrci kroz popis upitnika  i dodaj answere true za sve  koji su u storaeu
                    if(this.upitnici)
                        this.upitnici.forEach(upitnik => {
                                if(odgovoreniIDs.indexOf(upitnik.tkupitnikid) !== -1) {
                                    //postoji, postavi na ture
                                    upitnik.answered = true;
                                    
                                }
                        });
                               
                }

                //console.log(this.upitnici);
                resolve(this.upitnici);
            }, (error) => {
                reject(error);
            }); 
		});
    }

    //dohvat svih pitanja za upitnik
    getPitanja(upitnikId): Promise<any>{
        //console.log(this.odgovorenaPitanja)
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "pitanja");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {  
                 this.pitanja = this.storage.filterCollection(val, 'tkupitnikid', upitnikId)

                if(this.odgovorenaPitanjaIDs.length > 0)
                {
                    //za svako odgovoreno pitanje idi po odgovor

                    var odgovoreniIDs = JSON.parse("[" + this.odgovorenaPitanjaIDs + "]");
                    //protrci kroz popis pitanja i dodaj answered true za sve  koja su u storageu
                    if(this.pitanja)
                        this.pitanja.forEach(pitanje => {
                            //console.log(pitanje)

                            let odgovor = this.storage.filterCollectionSingleValue(this.odgovorenaPitanja,'tkpitanjeid', pitanje.tkpitanjeid)

                            if(Object.keys(odgovor).length != 0){
                                let answer = null;
                                let answerIDs : Array<any> = [];
                                if(odgovor.odgovorid){
                                    //filtriraj odgovore gdje je odgovorid od pitanja
                                    let data = this.storage.filterCollectionSingleValue(this.odgovoriSvi,'tkodgovorid',odgovor.odgovorid)
                                    if(data){
                                        answer = data.odgovor;
                                        answerIDs.push(odgovor.odgovorid)
                                    }                            
                                }
                                else if (odgovor.odgovorid == null)
                                {
                                    if(typeof odgovor.odgovor == "string")
                                        answer = odgovor.odgovor;
                                    else{
                                        //za svaki id u listi dohvati vrijednost odgovora
                                        let values: Array<any> = [];
                                        odgovor.odgovor.forEach(id => {
                                            let data = this.storage.filterCollectionSingleValue(this.odgovoriSvi,'tkodgovorid',id)
                                            if(data){
                                                 values.push(data.odgovor);
                                                 answerIDs.push(id)
                                            }
                                               
                                        });
                                        answer = values.join(", ");
                                    }
                                }
                                    
                                if(answer){
                                    pitanje.odgovor = answer;
                                    pitanje.odgovorIDs = answerIDs;
                                }
                                    
                                
                            }
                           
                            if(odgovoreniIDs.indexOf(pitanje.tkpitanjeid) !== -1) {
                                    //postoji, postavi na true
                                    pitanje.answered = true;    
                            }  
                    })
                }
      
                resolve(this.pitanja);
            }, (error) => {
                reject(error);
            }); 
		});
    }

    //dohvat svih odgovora za pitanje
    getOdgovori(pitanjeId, tipPitanja?): Promise<any>{
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "odgovori");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {  
                 this.odgovori = this.storage.filterCollection(val, 'tkpitanjeid', pitanjeId)        
                 if(tipPitanja === 3){
                     this.odgovori.forEach(odgovor => {
                            odgovor.checked = false;
                     });   
                 }
                    
                resolve(this.odgovori);
            }, (error) => {
                reject(error);
            }); 
		});
    }


     getOdgovoriSvi(): Promise<any>{
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "odgovori");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
             .then((val) => {    
                this.odgovoriSvi = val;
                    
                resolve(this.odgovoriSvi);
            }, (error) => {
                reject(error);
            }); 
		});
    }

  	


      /* Section za odgovore na upitnike i rad sa storageom*/



    //dohvat broj ispunjenih upitnika za parstru
    getCountOdgovoreneUpitnikeZaParstru(): Promise<any>{
       
        let key = this.constants.odgovoriUpitniciKey.keyvalue;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
             .then((val) => {  
                 //console.log(val)  
                 //console.log(this.narudzbeService.parstruid)
                this.odgovoreniUpitnici = [];
                //sve od lokacije
                let podaci : IUpitniciOdgovori.IUpitniciOdgovor = this.storage.filterCollectionSingleValue(val, 'parstruid', this.narudzbeService.parstruid);  
                //console.log(podaci)
                if(Object.keys(podaci).length == 0)
                    podaci = null;
                else{
                    podaci.upitnici.forEach(upitnik => {
                        //console.log(upitnik)
                        this.odgovoreniUpitnici.push(upitnik.tkupitnikid);
                    });
                }

                let count =  podaci ? podaci.upitnici.length : 0;
                //console.log(this.odgovoreniUpitnici)

                resolve(count);
            }, (error) => {
                reject(error);
            }); 
		});
    }

    //dohvat odgovorenih pitanja za upitnik
    getOdgovorenaPitanjaZaUpitnik(upitnikId): Promise<any>{
       
        let key = this.constants.odgovoriUpitniciKey.keyvalue;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
             .then((val) => {    
                this.odgovorenaPitanjaIDs = [];
                this.odgovorenaPitanja = [];
                //sve od lokacije
                let podaci : IUpitniciOdgovori.IUpitniciOdgovor = this.storage.filterCollectionSingleValue(val, 'parstruid', this.narudzbeService.parstruid);  
                //console.log(podaci)

                if(Object.keys(podaci).length == 0)
                    podaci = null;
                else{
                    //filtriraj upitnike da dobijemo pitanja
                    let pitanja : IUpitniciOdgovori.IUpitnik  = <IUpitniciOdgovori.IUpitnik>this.storage.filterCollectionSingleValue(podaci.upitnici,'tkupitnikid',upitnikId);


                    if(Object.keys(pitanja).length == 0)
                        podaci = null;
                    else{
                        pitanja.pitanja.forEach(pitanje => {
                            this.odgovorenaPitanja.push(pitanje)
                            this.odgovorenaPitanjaIDs.push(pitanje.tkpitanjeid);
                        });
                    }
                }

                resolve(this.odgovorenaPitanjaIDs.length);
            }, (error) => {
                reject(error);
            }); 
		});
    }

    
    //dohvat odgovora na pitanje
    getOdgovorZaPitanje(upitnikId,pitanjeId): Promise<any>{
       
        let result;
        let key = this.constants.odgovoriUpitniciKey.keyvalue;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
             .then((val) => {    
                let result: any;
                //sve od lokacije
                let podaci : IUpitniciOdgovori.IUpitniciOdgovor = this.storage.filterCollectionSingleValue(val, 'parstruid', this.narudzbeService.parstruid);  
                //console.log(podaci)

                if(Object.keys(podaci).length == 0)
                    result = null;
                else{
                    //filtriraj upitnike da dobijemo pitanja
                    let pitanja : IUpitniciOdgovori.IUpitnik  = <IUpitniciOdgovori.IUpitnik>this.storage.filterCollectionSingleValue(podaci.upitnici,'tkupitnikid',upitnikId);


                    if(Object.keys(pitanja).length == 0)
                        result = null;
                    else{
                        //filtriraj pitanja da dobijemo odgovor
                        let odgovor : IUpitniciOdgovori.IPitanja = <IUpitniciOdgovori.IPitanja>this.storage.filterCollectionSingleValue(pitanja.pitanja, 'tkpitanjeid', pitanjeId)

                        if(Object.keys(odgovor).length == 0)
                            result = null;
                        else{
                            //dohvati vrijednost odgovora gdje je odgovoriID ili direktno vrijednost odgovor ako nema odgovorid
                            this.getOdgovori(pitanjeId,odgovor.tkpitanjevrstaid)
                                .then((res) => {
                                    //pronađi odgovor po id.u
                                    if(odgovor.odgovor == null){
                                        let answer = this.storage.filterCollectionSingleValue(this.odgovori,'tkodgovorid',odgovor.odgovorid)

                                        //console.log(answer)
                                        if(Object.keys(answer).length == 0)
                                            result = null;
                                        else{
                                            result =  answer.odgovor;
                                        }
                                    }
                                    else if(odgovor.odgovorid == null)
                                        result = odgovor.odgovor;
                                })
                        }
                    }
                }
                //console.log(result)
                resolve(result);
            }, (error) => {
                reject(error);
            }); 
		});
    }




   
    //spremi odgovor na pitanje
    saveOdgovor(upitnikId: number, pitanjeId: number,  tipPitanja: number, answer?: any,answerId?: number,): Promise<any> {
               
        let key = this.constants.odgovoriUpitniciKey.keyvalue;

        let odgovor : IUpitniciOdgovori.IUpitniciOdgovor = {
            parstruid: this.narudzbeService.parstruid,
            upitnici: [{
                    tkupitnikid : upitnikId,
                    pitanja: [{
                        tkpitanjeid : pitanjeId,
                        tkpitanjevrstaid : tipPitanja,
                        odgovor: answer,
                        odgovorid : answerId
                    }]
            }]

        }

        return new Promise((resolve, reject) => {
            let referencaParstruIdData : IUpitniciOdgovori.IUpitniciOdgovor;
            let referencaUpitnikaData : IUpitniciOdgovori.IUpitnik;
            //let referencaPitanjaData : Array<IUpitniciOdgovori.IPitanja>;

            this.dataServis.getDataFromStorage(key)
                .then((val) => {

                    let parsTruUpitniciData : Array<IUpitniciOdgovori.IUpitniciOdgovor> = val;   
                    
                    if (parsTruUpitniciData && parsTruUpitniciData.length > 0){
                        //filtriraj upiptnike ako postoji za parstruid
                        let postojiParstrud : boolean = false;
                        let postojiUpitnik : boolean = false;
                        let postojiPitanje : boolean = false;
                        parsTruUpitniciData.forEach(parstruData => {
                   
                            //ako postoje podaci taj parstrud dohvati ih
                            if(parstruData.parstruid === this.narudzbeService.parstruid){

                                referencaParstruIdData = parstruData;
                                //console.log("postoji parstru")
                                postojiParstrud = true;
                                //provjeri postoji li upitnik pod poslanim ID.em
                                referencaParstruIdData.upitnici.forEach(upitnik => {
                                    if(upitnik.tkupitnikid === upitnikId){
                                        referencaUpitnikaData = upitnik
                                        //console.log("postoji upitnik")
                                        postojiUpitnik = true;
                                        //postoji upitnik, pretraži pitanja
                                        referencaUpitnikaData.pitanja.forEach(pitanje => {
                                           
                                            if(pitanje.tkpitanjeid === pitanjeId){
                                                //console.log("postoji pitanje")
                                                //azuriraj podatke pitanja
                                                pitanje.odgovor = answer,
                                                pitanje.odgovorid = answerId
                                                postojiPitanje = true;
                                            }
                                             else{
                                                //ne postoji upitnik dodaj ga dolje
                                                if(!postojiPitanje)                     
                                                    postojiPitanje = false;
                                            }
                                        });
                                    }
                                    else{
                                        //ne postoji upitnik dodaj ga dolje
                                        if(!postojiUpitnik)                     
                                            postojiUpitnik = false;
                                    }
                                });                        
                            }
                            else{
                                //ne postoji parstru i dodaj ga dolje
                                if(!postojiParstrud)                     
                                    postojiParstrud = false;
                            }
                        })
                        
                        if(postojiParstrud && postojiUpitnik && !postojiPitanje){
                            //dodaj pitanje u listu pitanja za upitnik
                            this.storage.addItemToArray(referencaUpitnikaData.pitanja, odgovor.upitnici[0].pitanja[0])
                        }

                        if(postojiParstrud && !postojiUpitnik){
                            //dodaj upitnik u upitnike za taj parstru i sve skupa u storage
                            this.storage.addItemToArray(referencaParstruIdData.upitnici, odgovor.upitnici[0])
                        }
                            //dodaj parstru listu upitnika i pitanja
                        if(!postojiParstrud)
                            this.storage.addItemToArray(parsTruUpitniciData, odgovor)                    
                    }
                    else{
                        parsTruUpitniciData = [];
                        this.storage.addItemToArray(parsTruUpitniciData, odgovor)
                    }
                    
                    return parsTruUpitniciData;
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                , (error) => {
                    reject(error);
                });
        });

    }


    isprazniUpitnike(): Promise<any> {
        let key = this.constants.odgovoriUpitniciKey.keyvalue;
        //dohvati sve upitnike koji su odgovoreni
        return new Promise((resolve, reject) => {
                let podaci = [];
                resolve(this.storage.addToStorage(key, null, podaci, true))
        })
   

    }



    /* End Section za odgovore na upitnike  */
  	


    /* SLANJE UPITNIKA */


     //slanje narudzbi na servis
    postRequest(upitnikId): Promise<any> {

        return new Promise((resolve, reject) => {
            //dohvati zaglavlje i stavke narudzbi i kreiraj Json
            this.createBodyRequest(upitnikId)
                .then((res) => {
                    return this.send(res);
                })
                .then((res) => {return this.processResponse(res,upitnikId)})
                .then((res) => resolve(res))
                .catch(Error => {
                    reject(Error)
                })

        });
    }


     createBodyRequest(upitnikId): Promise<any>{
      //console.log("kreiram json")
      
      this.upitniciJson = [];
      return new Promise((resolve, reject) => {

        let sviOdgovori = [] ;

        this.pitanja.forEach((pitanje) => {
           
           if(pitanje.answered){
                let odgovor = <IUpitniciOdgovori.IPitanja>({
                    tkpitanjeid : pitanje.tkpitanjeid,
                    odgovor : pitanje.odgovorIDs.length > 0 ? pitanje.odgovorIDs.toString() : pitanje.odgovor,
                    action : "DET",
                    upitnikID : "tkUpitnik_RezultatID"
            
                });

                sviOdgovori.push(odgovor);
           }
            

        });

        let upitnikZag = <IUpitniciOdgovori.IUpitniciSync>({
           action : "GLA",
           operaterid : "@@operaterid",
           parstruid : this.narudzbeService.parstruid,
           tkupitnikid : upitnikId,
           stavke : sviOdgovori
        });



        this.upitniciJson.push(upitnikZag)

        console.log(this.upitniciJson)
        resolve(this.upitniciJson);
      });
    }



     send(jsonObject): Promise<any>{
        let properties: ICore.IPropertiesCore = {
            customApiEndPoint : 'narudzbe'
        }
       //console.log(jsonObject)
        let data : ICore.IData = {
            "queries": [
                {
                    "query": "spmobTerkom_PrijenosUpitnika",
                    "params": {
                        "narudzbe": jsonObject
                    }
                }
            ]
        }
        return this
            .global
            .getData(data,properties);

    }

    processResponse(res,upitnikid){
        console.log(res)
       return new Promise((resolve, reject) => {
            if(res && res.length > 0)
            {           
                let rezultat = this.storage.getFirstArrayElement(res);
                 this.zakljuciUpitnik(rezultat,upitnikid)
                .then((res) => {
                       //osvjezi podatke za upitnike za taj parstru
                       this.getOdgovorenaPitanjaZaUpitnik(upitnikid).then((res) => {
                        //dohvati listu svih odgovora
                        this.getOdgovoriSvi()
                            .then((res) => {
                                //dohvati pitanja za odabrani upitnik sa pripadajucim odgovorima
                                this.getPitanja(upitnikid)
                            })
                        
                    })
                })
                
            }    
            resolve(res);
        });
    }


    zakljuciUpitnik(res, upitnikid): Promise<any> {
        console.log(upitnikid)
         let key = this.constants.odgovoriUpitniciKey.keyvalue;

        //dohvati upitnikid i orbisi ga iz storagea
        return new Promise((resolve, reject) => {
                this.dataServis.getDataFromStorage(key)
                .then((val) => {

                    let parsTruUpitniciData : Array<IUpitniciOdgovori.IUpitniciOdgovor> = val;   
                    
                    if (parsTruUpitniciData && parsTruUpitniciData.length > 0){
                        //filtriraj upiptnike ako postoji za parstruid

                        parsTruUpitniciData.forEach(parstruData => {
                   
                            //ako postoje podaci taj parstrud dohvati ih
                            if(parstruData.parstruid === this.narudzbeService.parstruid){

                                console.log("postoji parstru")

                                //provjeri postoji li upitnik pod poslanim ID.em
                                parstruData.upitnici.forEach(upitnik => {
                                    if(upitnik.tkupitnikid === upitnikid){
                   
                                        console.log("postoji upitnik")

                                        var index = this.storage.findArrayIndex(parstruData.upitnici,'tkupitnikid',upitnikid )
                                        if(parstruData.upitnici)
                                           parstruData.upitnici.splice(index, 1);
                                    }
                                   
                                });                        
                            }
                           
                        })
                                    
                    }

                    return parsTruUpitniciData;
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                , (error) => {
                    reject(error);
                });

        });
    }


	
}
