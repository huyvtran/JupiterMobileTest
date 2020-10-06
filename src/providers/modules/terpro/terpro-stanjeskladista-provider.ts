
import { Injectable } from '@angular/core';

import { StorageProvider } from '../../core/storage-provider';

import { ConstProvider } from '../../core/const-provider';
import * as INarudzba from '../../../interfaces/terpro/INarudzba';
//shared
import { TerproDataProvider } from './terpro-data-provider';

@Injectable()
export class TerproStanjeSkladistaProvider {

    stanjeArtikla: number = 0;
    key: {
        keyname: string,
        keyvalue: string
    }
    constructor(private storage: StorageProvider,
        private constants: ConstProvider, private dataServis: TerproDataProvider) {
        this.key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "stanjeskladista");
    }



    getUkupnoStanjeArtiklaNaSkladistu(robaid?): Promise<number> {


        return new Promise((resolve, reject) => {
            //dohvati sva stanja artikla
            this.storage.getFromStorage(this.key.keyvalue, null, true)
                .then((val) => {

                    let stanje = this.storage.filterCollectionSingleValue(val, 'robaid', robaid);

                    this.stanjeArtikla = stanje ? stanje.kolicina : 0;
                    console.log(this.stanjeArtikla)
                    resolve(this.stanjeArtikla);
                }, (error) => {
                    reject(error);
                });
        });
    }


    getRaspolozivoStanjeArtiklaNaSkladistu(robaid?): Promise<number> {


        return new Promise((resolve, reject) => {
            //dohvati sva stanja artikla
            this.storage.getFromStorage(this.key.keyvalue, null, true)
                .then((val) => {
                    let raspolozivaKolicina : number = 0;
                    let narudzbe : Array<INarudzba.Narudzba> = [];
                    let kolicinNaSkladistu = (this.storage.filterCollectionSingleValue(val, 'robaid', robaid)).kolicina;
                    let narucenaKolicina : number = 0;
                    //dohvati sumu kolicina svih dokumenata na uređaju koji imaju status 0 i 1 - dakle sve nezaključene dokumente

                    this.dataServis.getAllNarudzbe().then((res) => {
                        //filtriraj samo sa statusom 0 i 1
                        narudzbe = <Array<INarudzba.Narudzba>>this.storage.filterCollectionWherePopertyNotEqual(res, 'status', '2');
                        console.log("nezakljucene narudzbe" + narudzbe)

                        narudzbe.forEach(nar => {
                            nar.stavke.forEach(stavka => {
                                //za odabrani artikl sumiraj kolicine u trenutno neisporucenim narudzbama
                                if(stavka.robaid === robaid)
                                    narucenaKolicina += stavka.kolicina;
                            });
                        });
                    })


                    raspolozivaKolicina = kolicinNaSkladistu - narucenaKolicina;

                    resolve(raspolozivaKolicina);
                }, (error) => {
                    reject(error);
                });
        });
    }


    setStanjeArtiklaNaSkladistu(robaid: number, kolicina: number, akcija: string = "dodaj"): Promise<any> {
        return new Promise((resolve, reject) => {
            //dohvati sva stanja artikla
            this.storage.getFromStorage(this.key.keyvalue, null, true)
                .then((val) => {

                    if (val) {
                        val.forEach(roba => {
                            //ako postoji roba
                            if (roba.robaid === robaid) {
                                if (akcija === "dodaj")
                                    roba.kolicina += kolicina;
                                else
                                    roba.kolicina -= kolicina;
                            }
                        });

                        //Spremi u storage
                    }

                    resolve(this.storage.addToStorage(this.key.keyvalue, null, val , true))
                
                }, (error) => {
                    reject(error);
                });
        });
    }



}
