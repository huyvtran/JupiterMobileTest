
import { Injectable } from '@angular/core';

import { GlobalProvider } from '../../core/global-provider';
import { StorageProvider } from '../../core/storage-provider';
import * as ICore from '../../../interfaces/ICore';

import { ConstProvider } from '../../core/const-provider';
import * as INarudzba from '../../../interfaces/terpro/INarudzba';

import { TerproDataProvider } from './terpro-data-provider';
import { TerproNarudzbaProvider } from './terpro-narudzba-provider';
import { TerproSifarniciProvider } from './terpro-sifarnici-provider';

import _ from 'lodash';


@Injectable()
export class TerproKomunikacijaProvider {

    constructor(private global: GlobalProvider, private storage: StorageProvider,
        private constants: ConstProvider, private dataServis: TerproDataProvider,
        private narudzbeService: TerproNarudzbaProvider,
        private sifarniciService: TerproSifarniciProvider) {

    }


    getSifarniciData() {
        let properties: ICore.IProperties = {
            errorMessageType: 'alert'
        }
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "robe",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "roba"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "partneri",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "partneri"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "rute",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "rute"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "klase"
                    },
                    "tablename": "klase"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "ugovori",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "ugovori"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "vrstadok",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "vrstadokumenta"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "nacinplac"
                    },
                    "tablename": "nacinplacanja"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "stanje",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "stanjeskladista"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "jmroba"
                    },
                    "tablename": "jmroba"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "footer"
                    },
                    "tablename": "footer"
                },
                {
                    "query": "spMobTerPro_DonosDok",
                    "params": {
                        "action": "glava",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "narudzbe"
                },
                {
                    "query": "spMobTerPro_Donos",
                    "params": {
                        "Action": "VezaRobaPartner",
                    },
                    "tablename": "vezarobapartner"
                },
                
                //login user data
                {
                    "query": "spMobTerPro_Login",
                    "params": {
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "user"
                },
                {
                    "query": "spRptDocPartner",
                    "params": {

                    },
                    "singlerow": true,
                    "tablename": "firma"
                }

            ]
        }
        return this
            .global
            .getData(data, properties);

    }


    saveToStorage(data: any) {
        var promises = []
        console.log(data)
        this.constants.terProStorageKeys.forEach(element => {
            if (data[element.keyname])
                promises.push(this.storage.addToStorage(element.keyvalue, null, data[element.keyname], true))
        });

        return Promise.all(promises);
    }


    alterNarudzbeTable(): Promise<any> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    var date = new Date();
                    if (narudzbe)
                        narudzbe.forEach(nar => {
                            let narudzba = <INarudzba.Narudzba>nar;
                            //console.log(nar)
                            //dodaj kolone koje cemo trebati
                            //narudzba.datum_zaprimanja =  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())),
                            narudzba.datum_zaprimanja = new Date(),
                            narudzba.uuid = this.narudzbeService.generateUUID(),
                            narudzba.brojdok = Number(nar.brojdok)
                            narudzba.prijenosind = 0,
                            narudzba.broj_ispisa = 0
                            narudzba.fiskalnibroj = ""
                            narudzba.donos = 1
                            narudzba.storno = 0
                            narudzba.fuuid = ""
                            narudzba.narudzbeid = nar.pronarudzbeglaid

                            narudzba.kod = null
                            narudzba.jir = null

                            narudzba.iznos_neto = 0;
                            narudzba.iznos_osnovica = 0;
                            narudzba.iznos_porez = 0;
                            narudzba.iznos_rabat = 0;
                            narudzba.iznos_ukupno = 0;
                            narudzba.odgoda = 0;
                        });

                    return narudzbe;
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }


    // alterStavkaTable(): Promise<any> {

    //     let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

    //     return new Promise((resolve, reject) => {

    //         this.dataServis.getUgovori()
    //             .then((res) => {
    //                 let ugovori = res;

    //                 this.dataServis.getAllNarudzbe()
    //                     .then((narudzbe) => {

    //                         if (narudzbe)
    //                             narudzbe.forEach(nar => {
    //                                 let narudzba = <INarudzba.Narudzba>nar;
    //                                 //dodaj kolone koje cemo trebati
    //                                 narudzba.stavke.forEach(stavka => {
    //                                     stavka.rabat = 0;
    //                                     stavka.odgoda = 0;
    //                                     stavka.pov_nak_sysind = 0;

    //                                     let ugovor = this.storage.filterCollectionSingleValue(this.storage.filterCollection(ugovori, 'parstruid', narudzba.parstruid), 'robaid', stavka.robaid);
    //                                     let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciService.vrstadok, 'vrstadokid', narudzba.vrstadokid);
    //                                     narudzba.vrstadokoznaka = vrstaDok ? vrstaDok.oznaka : null;

    //                                     let roba = this.storage.filterCollectionSingleValue(this.sifarniciService.roba, 'robaid', stavka.robaid);

    //                                     stavka.jm = roba ? roba.jm : null;
    //                                     stavka.stopa = roba ? roba.stopa : 0;
    //                                     //stavka.faktor = roba ? roba.faktor : 1;
    //                                     stavka.dod_jm = roba ? roba.dod_jm : null;

    //                                     if (nar.vrstadokoznaka === "VP" || nar.vrstadokoznaka === "NAR") {
    //                                         stavka.cijena = roba ? roba.vp_cijena : 0;
    //                                         if (Object.keys(ugovor).length != 0) {
    //                                             stavka.cijena = ugovor ? ugovor.cijena : 0;
    //                                             stavka.rabat = ugovor ? ugovor.rabat : 0;
    //                                             stavka.odgoda = ugovor ? ugovor.odgoda : 0;
    //                                         }

    //                                     }
    //                                     else if (nar.vrstadokoznaka === "MP") {
    //                                         stavka.cijena = roba ? roba.mp_cijena : 0;
    //                                     }


    //                                     //recalc
    //                                     stavka.nak_poticaj = (roba ? roba.nak_poticaj : 0) * stavka.kolicina;
    //                                     stavka.nak_trosarina = (roba ? roba.nak_trosarina : 0) * stavka.kolicina;
    //                                     stavka.nak_zbrinjavanje = (roba ? roba.nak_zbrinjavanje : 0) * stavka.kolicina;
    //                                     stavka.iznos_neto = Number((stavka.cijena * stavka.kolicina).toFixed(2));
    //                                     stavka.iznos_rabat = stavka.iznos_neto * stavka.rabat/100;

    //                                      let naknade: number = stavka.nak_poticaj + stavka.nak_trosarina + stavka.nak_zbrinjavanje;
    //                                     if (nar.vrstadokoznaka === "VP") {
    //                                         stavka.iznos_rabat = (stavka.iznos_neto - naknade) * stavka.rabat / 100;
    //                                     }

    //                                     stavka.iznos_osnovica = stavka.iznos_neto - stavka.iznos_rabat;

    //                                     if (nar.vrstadokoznaka === "MP")
    //                                         stavka.iznos_porez = stavka.iznos_osnovica - stavka.iznos_osnovica / (1 + roba.stopa / 100);
    //                                     else
    //                                         stavka.iznos_porez = stavka.iznos_osnovica * roba.stopa / 100;

    //                                     if (roba.pov_nak_ind === 1) {
    //                                         stavka.pov_nak_iznos = 0.5 * stavka.kolicina;
    //                                     }
    //                                     //console.log(stavka)
    //                                 });
    //                             });

    //                         return narudzbe;
    //                     })
    //                     .then((res) => {
    //                         resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
    //                     }
    //                         , (error) => {
    //                             reject(error);
    //                         });

    //             })
    //             .catch(err => reject(err))


    //     });

    // }
    alterStavkaTable(): Promise<any> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {

            this.dataServis.getUgovori()
                .then((res) => {
                    let ugovori = res;

                    this.dataServis.getAllNarudzbe()
                        .then((narudzbe) => {

                            if (narudzbe)
                                narudzbe.forEach(nar => {
                                    let narudzba = <INarudzba.Narudzba>nar;
                                    //dodaj kolone koje cemo trebati
                                    narudzba.stavke.forEach(stavka => {
                                        stavka.rabat = 0;
                                        stavka.odgoda = 0;
                                        stavka.pov_nak_sysind = 0;

                                        let tip: number = 0;

                                        let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciService.vrstadok, 'vrstadokid', narudzba.vrstadokid);

                                        if (vrstaDok != null && vrstaDok.oznaka === "MP")
                                            tip = 1;

                                        let ugovor = this.storage.filterCollectionSingleValue(this.storage.filterMultiCollection(ugovori, { 'parstruid': narudzba.parstruid, 'tip': tip }), 'robaid', stavka.robaid);
                                        narudzba.vrstadokoznaka = vrstaDok ? vrstaDok.oznaka : null;

                                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciService.roba, 'robaid', stavka.robaid);

                                        stavka.jm = roba ? roba.jm : null;
                                        stavka.stopa = roba ? roba.stopa : 0;
                                        //stavka.faktor = roba ? roba.faktor : 1;
                                        stavka.dod_jm = roba ? roba.dod_jm : null;

                                        if (nar.vrstadokoznaka === "VP") {
                                            stavka.cijena = roba ? roba.vp_cijena : 0;
                                            if (Object.keys(ugovor).length != 0) {
                                                if (ugovor.cijena != 0 && ugovor.cijena != null)
                                                    stavka.cijena = ugovor.cijena;
                                                if (ugovor.rabat != 0 && ugovor.rabat != null)
                                                    stavka.rabat = ugovor.rabat;
                                                if (ugovor.odgoda != 0 && ugovor.odgoda != null)
                                                    stavka.odgoda = ugovor.odgoda;
                                                if (ugovor.rabat1 != 0 && ugovor.rabat1 != null)
                                                    stavka.rabat1 = ugovor ? ugovor.rabat1 : 0;
                                                if (ugovor.rabat2 != 0 && ugovor.rabat2 != null)
                                                    stavka.rabat2 = ugovor ? ugovor.rabat2 : 0;
                                                if (ugovor.rabat3 != 0 && ugovor.rabat3 != null)
                                                    stavka.rabat3 = ugovor ? ugovor.rabat3 : 0;
                                                if (ugovor.rabat4 != 0 && ugovor.rabat4 != null)
                                                    stavka.rabat4 = ugovor ? ugovor.rabat4 : 0;
                                                if (ugovor.rabat5 != 0 && ugovor.rabat5 != null)
                                                    stavka.rabat5 = ugovor ? ugovor.rabat5 : 0;

                                            }

                                            stavka.nak_poticaj = Math.round((roba ? roba.nak_poticaj : 0) * stavka.kolicina * 100) / 100;
                                            stavka.nak_trosarina = Math.round((roba ? roba.nak_trosarina : 0) * stavka.kolicina * 100) / 100;
                                            stavka.nak_zbrinjavanje = Math.round((roba ? roba.nak_zbrinjavanje : 0) * stavka.kolicina * 100) / 100;

                                            stavka.iznos_neto = Math.round((stavka.cijena * stavka.kolicina) * 100) / 100;

                                            let naknade: number = stavka.nak_poticaj + stavka.nak_trosarina + stavka.nak_zbrinjavanje;

                                            stavka.iznos_rabat = Math.round(((stavka.iznos_neto - naknade) * stavka.rabat / 100) * 100) / 100;

                                            stavka.iznos_osnovica = Math.round((stavka.iznos_neto - stavka.iznos_rabat) * 100) / 100;

                                            //TODO: grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                                            stavka.iznos_porez = Math.round(stavka.iznos_osnovica * roba.stopa / 100 * 100) / 100;

                                            if (roba.pov_nak_ind === 1) {
                                                stavka.pov_nak_iznos = 0.5 * stavka.kolicina;
                                            }
                                            else
                                                stavka.pov_nak_iznos = 0;
                                        }
                                        else if (nar.vrstadokoznaka === "MP") {
                                            stavka.cijena =  roba ? roba.mp_cijena : 0;
                                            stavka.iznos_neto = Math.round((stavka.cijena * stavka.kolicina) * 100) / 100;
                                            stavka.iznos_rabat = Math.round((stavka.iznos_neto * stavka.rabat / 100) * 100) / 100;

                                            stavka.iznos_osnovica = Math.round((stavka.iznos_neto - stavka.iznos_rabat) * 100) / 100;

                                            stavka.iznos_porez = Math.round((stavka.iznos_osnovica - stavka.iznos_osnovica / (1 + roba.stopa / 100)) * 100) / 100;

                                            if (roba.pov_nak_ind === 1) {
                                                stavka.pov_nak_iznos = 0.5 * stavka.kolicina;
                                            }
                                            else
                                                stavka.pov_nak_iznos = 0;

                                            stavka.rabat1 = 0
                                            stavka.rabat2 = 0
                                            stavka.rabat3 = 0
                                            stavka.rabat4 = 0
                                            stavka.rabat5 = 0
                                        }



                                        //stavka.nak_poticaj = (roba ? roba.nak_poticaj : 0) * stavka.kolicina;
                                        //stavka.nak_trosarina = (roba ? roba.nak_trosarina : 0) * stavka.kolicina;
                                        //stavka.nak_zbrinjavanje = (roba ? roba.nak_zbrinjavanje : 0) * stavka.kolicina;
                                        // stavka.iznos_neto = Number((stavka.cijena * stavka.kolicina).toFixed(2));
                                        // stavka.iznos_rabat = stavka.iznos_neto * stavka.rabat / 100;


                                        // stavka.iznos_osnovica = stavka.iznos_neto - stavka.iznos_rabat;

                                        // if (nar.vrstadokoznaka === "MP")
                                        //     stavka.iznos_porez = stavka.iznos_osnovica - stavka.iznos_osnovica / (1 + roba.stopa / 100);
                                        // else
                                        //     stavka.iznos_porez = stavka.iznos_osnovica * roba.stopa / 100;

                                        // if (roba.pov_nak_ind === 1) {
                                        //     stavka.pov_nak_iznos = 0.5 * stavka.kolicina;
                                        // }
                                        //console.log(stavka)
                                    });



                                });

                            return narudzbe;
                        })
                        .then((res) => {
                            resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                        }
                            , (error) => {
                                reject(error);
                            });

                })
                .catch(err => reject(err))


        });

    }
}
