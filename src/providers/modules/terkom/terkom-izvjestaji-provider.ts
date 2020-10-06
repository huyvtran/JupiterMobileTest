
import {Injectable} from '@angular/core';

import _ from 'lodash';

import {GlobalProvider} from '../../core/global-provider';
import {StorageProvider} from '../../core/storage-provider';
import * as ICore from '../../../interfaces/ICore';

import { TerkomSifarniciProvider } from './terkom-sifarnici-provider';
import { TerkomDataProvider } from './terkom-data-provider';
import * as Moment from 'moment';

@Injectable()
export class TerkomIzvjestajiProvider {

    public dnevno : Array<{naziv : string, kolicina: number, vrijednost: number,  robaid: number, vrstadokid : number, vrstadok: string}>;;

    constructor(private global: GlobalProvider, private storage: StorageProvider, private dataServis : TerkomDataProvider, private sifarniciServis: TerkomSifarniciProvider) {

    }


    getDnevnoRealizacija(): Promise<any>{

    	 return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
             .then((val) => {
                //dohvati sve narudzbe
                this.dnevno = [];
                //get roba sume kolicina grupirane po nazivu robe i po vrsti dokumenta
                let item: {naziv : string, kolicina: number, vrijednost: number, robaid: number, vrstadokid : number, vrstadok: string};

                if (val && val.length > 0)
                    val.forEach((nar) => {
                        //dohvati robu iz sifarnika
                        if (nar.stavke.length > 0)
                            nar.stavke.forEach((stavka) => {
                                let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                                let naziv = roba ? roba.naziv : "";
                                let kolicina = stavka ? stavka.kolicina : 0;
                                let vrijednost = ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0)) * (1 + parseFloat(roba ? roba.porezposto : 0) / 100);
                                item = {
                                    kolicina : kolicina,
                                    naziv : naziv,
                                    vrijednost : vrijednost,
                                    robaid : roba.robaid,
                                    vrstadokid : nar.vrstadokid,
                                    vrstadok : ""

                                }
                                //this.kreditniLimitSuma += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0)) * (1 + parseFloat(roba ? roba.porezposto : 0) / 100);
                                this.dnevno.push(item);
                            });

                    });

                //grupiraj po vrstidok i artiklu
                let data = _(this.dnevno).groupBy(x => x.vrstadokid).map((value, key) => ({vrstadokid: key, data: value})).value();

                data.forEach(group => {
                    let vrstadok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', parseInt(group.vrstadokid));

                    //za svaku roba id sumraj kolicine i izracunaj vrijednost
                    group.data = _(group.data).groupBy(x => x.robaid).map((value, key) => ({robaid: key, data: value})).value();

                    group.data.forEach(item => {
                            let kolicina = 0;
                            let vrijednost = 0;
                            item.data.forEach(it => {
                                kolicina += it.kolicina;
                                vrijednost += it.vrijednost;
                                item.naziv = it.naziv;
                            });

                            item.kolicina = kolicina;
                            item.vrijednost = vrijednost;
                            item.vrstadok =  vrstadok ? vrstadok.naziv : null;
                    });

                });

                //console.log(data);



                this.dnevno = data;

                resolve(this.dnevno);
            }, (error) => {
                reject(error);
            });
		});
  	}


    getRealizacijaPutnika(params){


        let data : ICore.IData = {
            "queries": [
            {
                "query": "spmobTerkom_RealizacijaPutnika",
                "params": {
                    "operaterid" : "@@operaterid",
                    "datumOd": params.datod,
                    "datumDo": params.datdo
                }
            }
            ]
        }
        return this
            .global
            .getData(data);

  	}


     getRadnoVrijeme(params){

        let data : ICore.IData = {
            "queries": [
            {
                "query": "spmobTerkom_RadnoVrijeme",
                "params": {
                    "operaterid" : "@@operaterid",
                    "datumOd": params.datod,
                    "datumDo": params.datdo
                }
            }
            ]
        }
        return this
            .global
            .getData(data);

  	}

     getRekapitulacijaPoRobi(params){

        let data : ICore.IData = {
            "queries": [
            {
                "query": "spmobTerkom_RekapitulacijaPoRobi",
                "params": {
                    "operaterid" : "@@operaterid",
                    "datumOd": params.datod,
                    "datumDo": params.datdo
                }
            }
            ]
        }
        return this
            .global
            .getData(data);

    }

    getStanjeSkladista(params){

      let data : ICore.IData = {
          "queries": [
          {
              "query": "spMobTerKom_StanjeSkladistaIzv",
              "params": {

                  "SkladisteId": params.SkladisteId,
                  "KlasaRobeId": params.KlasaRobeId
              }
          }
          ]
      }
      return this
          .global
          .getData(data);

  }

     getPregledObilazaka(params){

        let data : ICore.IData = {
            "queries": [
            {
                "query": "spmobTerKom_PregledObilazaka",
                "params": {
                    "operaterid" : "@@operaterid",
                    "datumOd": params.datod,
                    "datumDo": params.datdo
                }
            }
            ]
        }
        return this
            .global
            .getData(data);

  	}




    getPregledNarudzbiURazdoblju(params){

        let data : ICore.IData = {
            "queries": [
            {
                "query": "spmobTerKom_PregledNarudzbiGla",
                "params": {
                    "operaterid" : "@@operaterid",
                    "datumOd": params.datod,
                    "datumDo": params.datdo
                }
            }
            ]
        }
        return this
            .global
            .getData(data);

  	}


      getStavkeNarudzbiURazdoblju(terkomglaid){

        let data : ICore.IData = {
            "queries": [
            {
                "query": "spmobTerKom_PregledNarudzbiDet",
                "params": {
                    "TerKomGlaId": terkomglaid
                }
            }
            ]
        }
        return this
            .global
            .getData(data);

  	}


    /** Izvjestaji na lokaciji**/
    getRealizacijaPartnera(params){


        let data : ICore.IData = {
            "queries": [
            {
                "query": "spmobTerkom_RealizacijaPartnera",
                "params": {
                    "parstruid": params.parstruid,
                    "datumOd": params.datod,
                    "datumDo": params.datdo
                }
            }
            ]
        }
        return this
            .global
            .getData(data);

  	}

    getFinancijskoStanje(params){


        let data : ICore.IData = {
            "queries": [
            {
                "query": "spmobTerkom_FinStanjePartnera",
                "params": {
                    "parstruid": params.parstruid,
                    "operaterid" : "@@operaterid",
                }
            }
            ]
        }
        return this
            .global
            .getData(data);

  	}

    getOtvoreniRacuni(params){


        let data : ICore.IData = {
            "queries": [
            {
                "query": "spmobTerkom_OtvoreneStavke",
                "params": {
                    "parstruid": params.parstruid,
                    "operaterid" : "@@operaterid",
                }
            }
            ]
        }
        return this
            .global
            .getData(data);

  	}




    getDatePeriod(numDays: number){

        let datumOd: string = Moment(new Date()).subtract(numDays, 'days').toISOString();

        return datumOd;

    }


}
