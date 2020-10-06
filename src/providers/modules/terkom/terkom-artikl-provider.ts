import { Injectable } from '@angular/core';

import { Response, } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { GlobalProvider } from '../../core/global-provider';
import { StorageProvider } from '../../core/storage-provider';
import * as ICore from '../../../interfaces/ICore';
import * as INarudzba from '../../../interfaces/terkom/INarudzba';
import { ConstProvider } from '../../core/const-provider';

import { TerkomSifarniciProvider } from './terkom-sifarnici-provider';
import { TerkomDataProvider } from './terkom-data-provider';

//dohvat podataka syncanih sa apija
@Injectable()
export class TerkomArtiklProvider {

    public stavke: Array<INarudzba.NarudzbaStavka> = [];
    public stavka: INarudzba.NarudzbaStavka;

    public stavkaID: number = null
    public newArtikl: boolean = false
    public robaId: number = null
    public kolicina: number = 0
    public cijena: number = 0;
    public rabatPosto: number = 0
    public newBrojStavke: number = 0;
    public opis: string = null;

    constructor(private storage: StorageProvider, private sifarniciServis: TerkomSifarniciProvider, private constants: ConstProvider, private global: GlobalProvider, private dataService: TerkomDataProvider) {

    };

    //dohvat sve artikle narudzbe
    getStavke(id: number): Promise<Array<INarudzba.NarudzbaStavka>> {

        let key = this.constants.narudzbaKey.keyvalue;

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
                .then((val) => {

                    this.stavke = [];
                    //dohvati stavke narudzbe
                    if (val) {
                        val = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(val, 'id', id);
                        console.log("val je:",val);
                        console.log("val vrastadokid je:",val.vrstadokid);

                        // this.dokid = val[0].vrstadokid;
                        // console.log("vrstadokid je :", this.dokid);
                        this.stavke = val ? val.stavke : [];


                        if (this.stavke && this.stavke.length > 0) {
                            if (this.sifarniciServis.prikazirazlogpovratadetalj != 1)
                            {

                                this.stavke.forEach((stavka) => {
                                    //dohvati naziv robe
                                    //ako je povratna naknada ne idi usearch robe

                                    this.dataService.getRobe().then((res) => {
                                        let roba = this.storage.filterCollectionSingleValue(res, 'robaid', stavka.robaid);

                                        stavka.naziv = roba ? roba.naziv : null;
                                        stavka.sifra = roba ? roba.sifra : null;
                                        stavka.porezposto = roba ? roba.porezposto : 0;

                                        stavka.iznos = (stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100) + (((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100)) * stavka.porezposto / 100)
                                    })

                                });
                            }
                            else
                            {
                                this.sifarniciServis.loadRazlogPovrata().then((res) => {
                                    this.stavke.forEach((stavka) => {
                                        //dohvati naziv robe
                                        //ako je povratna naknada ne idi usearch robe

                                        this.dataService.getRobe().then((res) => {
                                            let roba = this.storage.filterCollectionSingleValue(res, 'robaid', stavka.robaid);

                                            stavka.naziv = roba ? roba.naziv : null;
                                            stavka.sifra = roba ? roba.sifra : null;
                                            stavka.porezposto = roba ? roba.porezposto : 0;

                                            stavka.iznos = (stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100) + (((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100)) * stavka.porezposto / 100)



                                        })

                                        if (stavka.razlogpovratadetid)
                                        {
                                            if(stavka.razlogpovratadetid.length > 0)
                                            {
                                                stavka.razlogpovratadetstavka = "Razlog povrata: ";
                                            }

                                            stavka.razlogpovratadetid.forEach(povrat => {
                                            let razlogdet1 = this.storage.filterCollectionSingleValue(res, 'mobterkom_razlogpovrataid', Number(povrat))

                                            stavka.razlogpovratadetstavka = stavka.razlogpovratadetstavka ? stavka.razlogpovratadetstavka + ', ' + razlogdet1.opis : razlogdet1.opis;
                                            });

                                        }

                                    });
                                });
                            }

                        }
                    }


                    resolve(this.stavke);
                }, (error) => {
                    reject(error);
                });

        });
    }

    //dohvat 1 stavku iz narudzbe
    getStavka(idnarudzba: number, idstavka: number): Promise<INarudzba.NarudzbaStavka> {
        let key = this.constants.narudzbaKey.keyvalue;

        return new Promise((resolve, reject) => {

            this.storage.getFromStorage(key, null, true)
                .then((val) => {
                    //dohvatinarudzbu
                    if (val)
                        val = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(val, 'id', idnarudzba);

                    this.stavka = <INarudzba.NarudzbaStavka>this.storage.filterCollectionSingleValue(this.stavke, 'id', idstavka);

                    if (this.stavka)
                        //dohvati podatke robe
                        this.dataService.getRobe().then((res) => {
                            let roba = this.storage.filterCollectionSingleValue(res, 'robaid', this.stavka.robaid);
                            this.stavka.jm = roba ? roba.jm : null;
                            this.stavka.dodjm = roba ? roba.dodjm : null;
                            this.stavka.faktor = roba ? roba.faktor : 1;
                            this.stavka.porezposto = roba ? roba.porezposto : 0;

                            this.kolicina = this.stavka.kolicina;
                            this.opis = this.stavka.opis;
                            this.rabatPosto = this.stavka.rabatPosto;

                            resolve(this.stavka);
                        })
                    else
                        resolve(this.stavka);

                }, (error) => {
                    reject(error);
                });

        });

    }

    //iz robe
    getNewStavka(id: number): Promise<INarudzba.NarudzbaStavka> {

        let key = this.constants.storageKeys.find((r: any) => r.keyname === "roba");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

                    if (val)
                        this.stavka = <INarudzba.NarudzbaStavka>this.storage.filterCollectionSingleValue(val, 'robaid', id);
                    //console.log(this.stavka)
                    //napuni stavku
                    if (this.stavka.dodjm) {
                        this.stavka.kolicina = this.stavka.faktor
                        this.kolicina = this.stavka.faktor

                    }
                    else {
                        this.stavka.kolicina = 1
                        this.kolicina = 1;
                    }

                    this.cijena = this.stavka.cijena;


                    resolve(this.stavka);
                }, (error) => {
                    reject(error);
                });
        });
    }

    insertStavka(artikl: INarudzba.NarudzbaStavka, idnarudzba: number): Promise<any> {
        let key = this.constants.narudzbaKey.keyvalue;
        //dohvati sve stavke narudzbe
        return new Promise((resolve, reject) => {
            this.dataService.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        //var narudzba = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(narudzbe, 'id', idnarudzba);
                        //dohvati stavke narudzbe
                        ///this.stavke = narudzba ? narudzba.stavke : [];
                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', artikl.robaid);

                        artikl.narudzbaid = idnarudzba;
                        artikl.id = this.newBrojStavke;
                        artikl.pov_nak_ind = roba ? roba.pov_nak_ind : 0;
                        //dohvati sve stavke narudzbe
                        artikl.opis = this.opis;
                        artikl.pov_nak_sysind = 0;

                        narudzbe.forEach((nar) => {

                            if (nar.id === idnarudzba)
                                this.storage.addItemToArray(nar.stavke, artikl)
                        });
                    }
                    return narudzbe;
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }

    updateStavka(data, artiklStavka: any, idNar: number): Promise<any> {
        let key = this.constants.narudzbaKey.keyvalue;
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataService.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {

                            if (nar.id === idNar && nar.stavke && nar.stavke.length > 0) {
                                nar.stavke.forEach((stavka) => {
                                    if (stavka.id === artiklStavka.id) {
                                        stavka.kolicina = data.ckolicina;
                                        stavka.cijena = this.cijena;
                                        stavka.rabatPosto = this.rabatPosto;
                                        stavka.opis = this.opis != "" ? this.opis : null;
                                        stavka.razlogpovratadetid = data.crazlogpovrataid;
                                    }
                                });
                            }

                        });
                    }
                    return narudzbe
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }

    deleteStavka(id: number, idNar: number): Promise<Response> {

        let key = this.constants.narudzbaKey.keyvalue;
        //dohvati sve stavke narudzbe
        //delete
        return new Promise((resolve, reject) => {
            this.dataService.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.id === idNar && nar.stavke && nar.stavke.length > 0) {
                                //pronađi index
                                var index = this.storage.findArrayIndex(nar.stavke, "id", id)
                                nar.stavke.splice(index, 1);
                            }
                        });
                    }
                    return narudzbe
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }


    getStanjeArtiklaNaSkladistu(robaid, skladisteid) {

        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spmobTerkom_StanjeZalihe",
                    "params": {
                        "robaid": robaid,
                        "skladisteid": skladisteid
                    },
                    "singlerow": true
                }
            ]
        }
        return this
            .global
            .getData(data);
    }

    //provjera svih artikala kod slanja narudzbe
    getStanjeArtikalaNarudzbeNaSkladistu(robaids, skladisteid) {

        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spmobTerkom_StanjeZaliheNarudzbe",
                    "params": {
                        "robaids": robaids,
                        "skladisteid": skladisteid
                    }
                }
            ]
        }
        return this
            .global
            .getData(data);
    }

    getKreditniLimitPartnera(parstruid) {
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spmobTerkom_KreditniLimit",
                    "params": {
                        "parstruid": parstruid
                    },
                    "singlerow": true
                }
            ]
        }
        return this
            .global
            .getData(data);
    }


    getBrojStavkeNarudzbe(): Promise<number> {
        //dohvati zadnju narudzbu iz arraya narudzbi i broj uvecaj za 1
        let key = this.constants.narudzbaKey.keyvalue;

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
                .then((val) => {
                    this.newBrojStavke = this.stavke ? this.stavke.length + 1 : 1;

                    resolve(this.newBrojStavke);
                }, (error) => {
                    reject(error);
                });
        });

    }


    checkCijenaVecaOdNula(cijena: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if(Number(cijena) > 0)
                resolve(true)
            else
                resolve(false)
        });

    }

    getUvjetiPartnera(datumdok, parstruid, partnerid, robaid, pronacinnaplateid, pronacinisporukeid) {


        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spmobTerkom_DohvatUvjeta",
                    "params": {
                        "DatumDok": datumdok,
                        "parstruid": parstruid,
                        "partneriid": partnerid,
                        "robaid": robaid,
                        "pronacinisporukeid": pronacinisporukeid,
                        "pronacinnaplateid": pronacinnaplateid
                    },
                    "singlerow": true
                }
            ]
        }




        return new Observable(observer => {
            setTimeout(() => {
                return this
                    .global
                    .getObservedData(data).map(res => res.json()).subscribe(res => {
                        if (res) {
                            //spremi usera u storage
                            observer.next(res);
                        }
                        else
                            observer.next(false);

                        observer.complete();
                    },
                        (err) => {
                            observer.next(false);
                            this.global.logError(err, false);
                        });
            }, 100);

        });
    }

    getUvjetiPartneraMP(datumdok, vrstadok, skladisteid, parstruid, partnerid, robaid, pronacinnaplateid, pronacinisporukeid) {


      let data: ICore.IData = {
          "queries": [
              {
                  "query": "spmobTerkom_DohvatUvjeta_MP",
                  "params": {
                      "DatumDok": datumdok,
                      "parstruid": parstruid,
                      "partneriid": partnerid,
                      "robaid": robaid,
                      "pronacinisporukeid": pronacinisporukeid,
                      "pronacinnaplateid": pronacinnaplateid,
                      "vrstadok": vrstadok,
                      "skladisteid": skladisteid
                  },
                  "singlerow": true
              }
          ]
      }




      return new Observable(observer => {
          setTimeout(() => {
              return this
                  .global
                  .getObservedData(data).map(res => res.json()).subscribe(res => {
                      if (res) {
                          //spremi usera u storage
                          observer.next(res);
                      }
                      else
                          observer.next(false);

                      observer.complete();
                  },
                      (err) => {
                          observer.next(false);
                          this.global.logError(err, false);
                      });
          }, 100);

      });




  }

}
