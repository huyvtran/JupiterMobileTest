import { Injectable } from '@angular/core';

import { Response } from '@angular/http';

import { GlobalProvider } from '../../core/global-provider';
import { StorageProvider } from '../../core/storage-provider';
import * as ICore from '../../../interfaces/ICore';
import * as INarudzba from '../../../interfaces/terpro/INarudzba';
import { ConstProvider } from '../../core/const-provider';

import { TerproDataProvider } from './terpro-data-provider';
import { TerproNarudzbaProvider } from './terpro-narudzba-provider';
import { TerproSifarniciProvider } from './terpro-sifarnici-provider';
import { TerproUserProvider } from './terpro-user-provider';
//dohvat podataka syncanih sa apija
@Injectable()
export class TerproArtiklProvider {

    public stavke: Array<INarudzba.NarudzbaStavka> = [];
    public stavka: INarudzba.NarudzbaStavka;

    public stavkaID: number = null
    public newArtikl: boolean = false
    public robaId: number = null
    public kolicina: number = 0
    public cijena: number = 0;
    public rabatPosto: number = 0
    public newBrojStavke: number = 0;
    constructor(private storage: StorageProvider, private constants: ConstProvider,
        private global: GlobalProvider, private dataService: TerproDataProvider,
        private sifarniciService: TerproSifarniciProvider, private narudzbaService: TerproNarudzbaProvider,
        private userProvider: TerproUserProvider) {
    };

    //dohvat sve artikle narudzbe
    getStavke(id: number): Promise<Array<INarudzba.NarudzbaStavka>> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {

            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

                    this.stavke = [];
                    //dohvati stavke narudzbe
                    if (val) {
                        val = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(val, 'pronarudzbeglaid', id);
                        this.stavke = val ? val.stavke : [];

                        if (this.stavke && this.stavke.length > 0) {
                            this.stavke.forEach((stavka) => {
                                //dohvati naziv robe
                                this.dataService.getRobe().then((res) => {
                                    let roba = this.storage.filterCollectionSingleValue(res, 'robaid', stavka.robaid);
                                    stavka.naziv = roba ? roba.naziv : null;
                                    stavka.sifra = roba ? roba.sifra : null;
                                })

                            });

                        }
                    }
                    //console.log(this.stavke)

                    resolve(this.stavke);
                }, (error) => {
                    reject(error);
                });

        });
    }

    //dohvat 1 stavku iz narudzbe
    getStavka(idnarudzba: number, idstavka: number): Promise<INarudzba.NarudzbaStavka> {
        //console.log(this.stavke)
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {

            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    //dohvatinarudzbu                
                    if (val)
                        val = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(val, 'pronarudzbeglaid', idnarudzba);

                    this.stavka = <INarudzba.NarudzbaStavka>this.storage.filterCollectionSingleValue(this.stavke, 'pronarudzbedetid', idstavka);

                    if (this.stavka)
                        //dohvati podatke robe
                        this.dataService.getRobe().then((res) => {
                            let roba = this.storage.filterCollectionSingleValue(res, 'robaid', this.stavka.robaid);
                            this.stavka.jm = roba ? roba.jm : null;
                            this.stavka.stopa = roba ? roba.stopa : 0;
                            this.stavka.faktor = roba ? roba.faktor : 1;
                            this.stavka.dod_jm = roba ? roba.dod_jm : null;
                            this.kolicina = this.stavka.kolicina;
                            this.rabatPosto = this.stavka.rabat;
                            //console.log(this.stavka)
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

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "roba");
        return new Promise((resolve, reject) => {

            this.dataService.getUgovori()
                .then((res) => {
                    let ugovori = res;
                    this.storage.getFromStorage(key.keyvalue, null, true)
                        .then((val) => {

                            if (val)
                                this.stavka = <INarudzba.NarudzbaStavka>this.storage.filterCollectionSingleValue(val, 'robaid', id);


                            //napuni stavku
                            this.rabatPosto = 0;
                            this.stavka.rabat = 0;
                            this.stavka.odgoda = 0;
                            let tip: number = 0;

                            let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciService.vrstadok, 'vrstadokid', this.narudzbaService.vrstaDokId);

                            if (vrstaDok != null && vrstaDok.oznaka === "MP")
                                tip = 1;

                            let ugovor = this.storage.filterCollectionSingleValue(this.storage.filterMultiCollection(ugovori, { 'parstruid': this.narudzbaService.parstruid, 'tip': tip }), 'robaid', this.stavka.robaid);

                            let roba = this.storage.filterCollectionSingleValue(this.sifarniciService.roba, 'robaid', this.stavka.robaid);

                            if (vrstaDok != null && (vrstaDok.oznaka === "VP" || vrstaDok.oznaka === "NAR")) {
                                this.cijena = roba ? roba.vp_cijena : 0;

                                if (Object.keys(ugovor).length != 0) {
                                    if (ugovor.cijena != 0 && ugovor.cijena != null)
                                        this.cijena = ugovor.cijena;
                                    if (ugovor.rabat != 0 && ugovor.rabat != null)
                                        this.rabatPosto = ugovor.rabat;
                                    if (ugovor.odgoda != 0 && ugovor.odgoda != null)
                                        this.stavka.odgoda = ugovor.odgoda;
                                    if (ugovor.rabat1 != 0 && ugovor.rabat1 != null)
                                        this.stavka.rabat1 = ugovor ? ugovor.rabat1 : 0;
                                    if (ugovor.rabat2 != 0 && ugovor.rabat2 != null)
                                        this.stavka.rabat2 = ugovor ? ugovor.rabat2 : 0;
                                    if (ugovor.rabat3 != 0 && ugovor.rabat3 != null)
                                        this.stavka.rabat3 = ugovor ? ugovor.rabat3 : 0;
                                    if (ugovor.rabat4 != 0 && ugovor.rabat4 != null)
                                        this.stavka.rabat4 = ugovor ? ugovor.rabat4 : 0;
                                    if (ugovor.rabat5 != 0 && ugovor.rabat5 != null)
                                        this.stavka.rabat5 = ugovor ? ugovor.rabat5 : 0;

                                }
                            }
                            else if (vrstaDok != null && vrstaDok.oznaka === "MP") {
                                this.cijena = roba ? roba.mp_cijena : 0;
                                this.rabatPosto = 0;
                                this.stavka.odgoda = 0;

                                //     this.stavka.odgoda
                                // if (Object.keys(ugovor).length != 0 && this.userProvider.loginInfo.rabatump) {
                                //     if (ugovor.cijena != 0) {
                                //         this.cijena = ugovor.cijena;
                                //     }
                                //     this.rabatPosto = ugovor.rabat;
                                //     this.stavka.odgoda = ugovor.odgoda;
                                // }

                                this.stavka.rabat1 = 0;
                                this.stavka.rabat2 = 0;
                                this.stavka.rabat3 = 0;
                                this.stavka.rabat4 = 0;
                                this.stavka.rabat5 = 0;
                            }

                            if (this.stavka.dod_jm) {
                                this.stavka.kolicina = this.stavka.faktor
                                this.kolicina = this.stavka.faktor

                            }
                            else {
                                this.stavka.kolicina = 1
                                this.kolicina = 1;
                            }


                            //console.log(this.stavka)

                            resolve(this.stavka);
                        }, (error) => {
                            reject(error);
                        });
                })
                .catch(err => reject(err))

        });
    }

    insertStavka(artikl: INarudzba.NarudzbaStavka, idnarudzba: number): Promise<any> {
        //console.log("insert")
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe

        return new Promise((resolve, reject) => {
            this.dataService.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        var narudzba = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(narudzbe, 'pronarudzbeglaid', idnarudzba);
                        //dohvati stavke narudzbe
                        this.stavke = narudzba ? narudzba.stavke : [];
                        artikl.pronarudzbeglaid = idnarudzba;
                        artikl.pronarudzbedetid = this.newBrojStavke;
                        //dohvati sve stavke narudzbe
                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciService.roba, 'robaid', artikl.robaid);
                        let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciService.vrstadok, 'vrstadokid', narudzba.vrstadokid);
                        //console.log(roba)

                        artikl.dod_jm = roba ? roba.dod_jm : null;
                        artikl.jm = roba ? roba.jm : null;
                        artikl.nak_poticaj = Math.round( roba.nak_poticaj * artikl.kolicina * 100) / 100;
                        artikl.nak_trosarina = Math.round(roba.nak_trosarina * artikl.kolicina * 100) / 100;
                        artikl.nak_zbrinjavanje = Math.round(roba.nak_zbrinjavanje * artikl.kolicina * 100) / 100;
                        artikl.stopa = roba ? roba.stopa : 0;

                        if (vrstaDok.oznaka === "VP") {

                            artikl.iznos_neto = Math.round((artikl.cijena * artikl.kolicina) * 100) / 100;

                            let naknade: number = artikl.nak_poticaj + artikl.nak_trosarina + artikl.nak_zbrinjavanje;

                            artikl.iznos_rabat = Math.round(((artikl.iznos_neto - naknade) * artikl.rabat / 100) * 100) / 100;

                            artikl.iznos_osnovica = Math.round((artikl.iznos_neto - artikl.iznos_rabat) * 100) / 100;

                            //TODO: grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                            artikl.iznos_porez = Math.round(artikl.iznos_osnovica * roba.stopa / 100 * 100) / 100;

                            artikl.pov_nak_iznos = 0;

                        }
                        else if (vrstaDok.oznaka === "MP") {

                            artikl.iznos_neto = Math.round((artikl.cijena * artikl.kolicina) * 100) / 100;
                            artikl.iznos_rabat = Math.round((artikl.iznos_neto * artikl.rabat / 100) * 100) / 100;

                            artikl.iznos_osnovica = Math.round((artikl.iznos_neto - artikl.iznos_rabat) * 100) / 100;

                            artikl.iznos_porez = Math.round((artikl.iznos_osnovica - artikl.iznos_osnovica / (1 + roba.stopa / 100)) * 100) / 100;

                            if (roba.pov_nak_ind === 1) {
                                artikl.pov_nak_iznos = 0.5 * artikl.kolicina;
                            }
                            else
                                artikl.pov_nak_iznos = 0;
                        }

                        // artikl.iznos_neto = artikl.cijena * artikl.kolicina;
                        // artikl.iznos_rabat = artikl.iznos_neto * artikl.rabat / 100;

                        // let naknade: number = artikl.nak_poticaj + artikl.nak_trosarina + artikl.nak_zbrinjavanje;



                        // if (vrstaDok != null && vrstaDok.oznaka === "VP")
                        //     artikl.iznos_rabat = (artikl.iznos_neto - naknade) * artikl.rabat / 100
                        // artikl.iznos_osnovica = artikl.iznos_neto - artikl.iznos_rabat;
                        // artikl.iznos_porez = artikl.iznos_osnovica * roba.stopa / 100;
                        // artikl.pov_nak_iznos = 0;
                        // if (vrstaDok != null && vrstaDok.oznaka === "MP") {
                        //     artikl.pov_nak_iznos = roba.pov_nak_iznos * artikl.kolicina;
                        //     artikl.iznos_porez = artikl.iznos_osnovica - artikl.iznos_osnovica / (1 + roba.stopa / 100)
                        // }

                        console.log(artikl)
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === idnarudzba)
                                this.storage.addItemToArray(nar.stavke, artikl)
                        });
                    }
                    return narudzbe;
                })
                .then((res) => {
                    //console.log("insert gotov")
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }

    updateStavka(kolicina, id: number, idNar: number): Promise<any> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataService.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {

                            if (nar.pronarudzbeglaid === idNar && nar.stavke && nar.stavke.length > 0) {
                                nar.stavke.forEach((stavka) => {

                                    if (stavka.pronarudzbedetid === id) {
                                        stavka.kolicina = kolicina;
                                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciService.roba, 'robaid', stavka.robaid);

                                        stavka.nak_poticaj = roba.nak_poticaj * stavka.kolicina;
                                        stavka.nak_trosarina = roba.nak_trosarina * stavka.kolicina;
                                        stavka.nak_zbrinjavanje = roba.nak_zbrinjavanje * stavka.kolicina;

                                        let naknade: number = stavka.nak_poticaj + stavka.nak_trosarina + stavka.nak_zbrinjavanje;

                                        let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciService.vrstadok, 'vrstadokid', nar.vrstadokid);
                                        if (vrstaDok.oznaka === "VP") {

                                            stavka.iznos_neto = Math.round((stavka.cijena * stavka.kolicina) * 100) / 100;

                                            let naknade: number = stavka.nak_poticaj + stavka.nak_trosarina + stavka.nak_zbrinjavanje;

                                            stavka.iznos_rabat = Math.round(((stavka.iznos_neto - naknade) * stavka.rabat / 100) * 100) / 100;

                                            stavka.iznos_osnovica = Math.round((stavka.iznos_neto - stavka.iznos_rabat) * 100) / 100;

                                            //TODO: grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                                            stavka.iznos_porez = Math.round(stavka.iznos_osnovica * roba.stopa / 100 * 100) / 100;

                                            stavka.pov_nak_iznos = 0;

                                        }
                                        else if (vrstaDok.oznaka === "MP") {

                                            stavka.iznos_neto = Math.round((stavka.cijena * stavka.kolicina) * 100) / 100;
                                            stavka.iznos_rabat = Math.round((stavka.iznos_neto * stavka.rabat / 100) * 100) / 100;

                                            stavka.iznos_osnovica = Math.round((stavka.iznos_neto - stavka.iznos_rabat) * 100) / 100;

                                            stavka.iznos_porez = Math.round((stavka.iznos_osnovica - stavka.iznos_osnovica / (1 + roba.stopa / 100)) * 100) / 100;

                                            if (roba.pov_nak_ind === 1) {
                                                stavka.pov_nak_iznos = 0.5 * stavka.kolicina;
                                            }
                                        }

                                        // stavka.iznos_neto = stavka.cijena * stavka.kolicina;
                                        // stavka.iznos_rabat = stavka.iznos_neto * stavka.rabat / 100;





                                        // if (vrstaDok != null && vrstaDok.oznaka === "VP")
                                        //     stavka.iznos_rabat = (stavka.iznos_neto - naknade) * stavka.rabat / 100
                                        // stavka.iznos_osnovica = stavka.iznos_neto - stavka.iznos_rabat;
                                        // stavka.iznos_porez = stavka.iznos_osnovica * roba.stopa / 100;
                                        // stavka.pov_nak_iznos = 0;
                                        // if (vrstaDok != null && vrstaDok.oznaka === "MP") {
                                        //     stavka.pov_nak_iznos = roba.pov_nak_iznos * stavka.kolicina;
                                        //     stavka.iznos_porez = stavka.iznos_osnovica - stavka.iznos_osnovica / (1 + roba.stopa / 100)
                                        // }
                                    }

                                });
                            }

                        });
                    }


                    return narudzbe
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }

    //kod brisanja donesenih stavki postavi indikator da su obrisane ali ne uklanjaj fizicki
    resetStavka(id: number, idNar: number): Promise<Response> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //delete 
        return new Promise((resolve, reject) => {
            this.dataService.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === idNar && nar.stavke && nar.stavke.length > 0) {
                                //pronađi index
                                var index = this.storage.findArrayIndex(nar.stavke, "pronarudzbedetid", id)
                                nar.stavke.splice(index, 1);
                            }
                        });
                    }
                    return narudzbe
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }


    deleteStavka(id: number, idNar: number): Promise<Response> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //delete 
        return new Promise((resolve, reject) => {
            this.dataService.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === idNar && nar.stavke && nar.stavke.length > 0) {
                                //pronađi index
                                var index = this.storage.findArrayIndex(nar.stavke, "pronarudzbedetid", id)
                                nar.stavke.splice(index, 1);
                            }
                        });
                    }
                    return narudzbe
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
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


    getBrojStavkeNarudzbe(pronarudzbeglaid): Promise<Response> {
        //dohvati zadnju narudzbu iz arraya narudzbi i broj uvecaj za 1
        //let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe

        return new Promise((resolve, reject) => {
            this.dataService.getBrojStavkeNarudzbe(pronarudzbeglaid)
                .then((broj) => {
                    if (broj) {
                        this.newBrojStavke = broj;
                        //console.log(broj)
                    }
                    resolve(broj);
                }
                    , (error) => {
                        reject(error);
                    });

        });

        // return new Promise((resolve, reject) => {
        //    this.storage.getFromStorage(key.keyvalue, null, true)
        //         .then((val) => {
        //             if(val) 
        //                 val = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(val,'pronarudzbeglaid', pronarudzbeglaid);           

        //                 let stavke =  val?  val.stavke : []; 

        //                 //order listu dokumenata po pronarudzbeglaid koloni
        //                 stavke  = this.storage.orderItemsBy(stavke, 'pronarudzbedetid', 'desc'); 
        //                 console.log("stavke "stavke)
        //                 //dohvati zadnji array element (s najvecim brojem dokumenta) i uvecaj ga za 1 
        //                 let stavka = this.storage.getLastArrayElement(stavke);
        //                 console.log("stavka" + stavka)
        //                 this.newBrojStavke = stavka? Number(stavka.pronarudzbedetid) + 1 : 1;    

        //         resolve(this.newBrojStavke);
        //     }, (error) => {
        //         reject(error);
        //     }); 
        // });

    }

}
