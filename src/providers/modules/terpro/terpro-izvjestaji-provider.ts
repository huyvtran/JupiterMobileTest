
import { Injectable } from '@angular/core';

import _ from 'lodash';

import { GlobalProvider } from '../../core/global-provider';
import { StorageProvider } from '../../core/storage-provider';
import * as ICore from '../../../interfaces/ICore';
import * as INarudzba from '../../../interfaces/terpro/INarudzba';
import * as IPrint from '../../../interfaces/terpro/IPrint';

import { TerproSifarniciProvider } from './terpro-sifarnici-provider';
import { TerproDataProvider } from './terpro-data-provider';
import { TerproUserProvider } from './terpro-user-provider';


@Injectable()
export class TerproIzvjestajiProvider {

    public narudzbe: Array<INarudzba.Narudzba>;
    public stanjeSkladista: Array<{ sifra: string, naziv: string, ulaz: number, svi: number, robaid: number, zakljuceni: number, raspolozivo: number }>;
    public kartica: Array<{ tip: string, broj: string, kolicina: number, zak: number, status: string }>;
    public realizacija: any;
    constructor(private global: GlobalProvider,
        private storage: StorageProvider,
        private dataServis: TerproDataProvider,
        private sifarniciServis: TerproSifarniciProvider,
        private userProvider: TerproUserProvider) {

    }


    getStanjeSkladista(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((val) => {
                    //dohvati sve narudzbe
                    this.stanjeSkladista = [];

                    let stavke = []
                    if (val && val.length > 0)

                        val.forEach((nar) => {

                            //dohvati sve stavke narudzbi
                            nar.stavke.forEach(stavka => {
                                stavka.status = nar.status
                                stavka.vrstadokid = nar.vrstadokid


                                // var index = this.storage.findArrayIndex(nar.stavke, "robaid", 9651)
                                // console.log(index)
                                // nar.stavke.splice(index, 1);

                            });

                            stavke = stavke.concat(nar.stavke)
                        });

                    stavke = this.storage.filterCollectionWherePopertyNotEqual(stavke, 'robaid', 9651)
                    //console.log(stavke)

                    //ubaci na listu stanja i sve one koji nisu na dokumentima
                    if(this.sifarniciServis.stanjeRobe && this.sifarniciServis.stanjeRobe.length > 0)
                        this.sifarniciServis.stanjeRobe.forEach(roba => {
                            var index = this.storage.findArrayIndex(stavke, "robaid", roba.robaid)

                            if (index < 0)
                                stavke.push(roba)
                            //narudzba.stavke.splice(index, 1);

                        });
                    console.log(stavke)

                    //stavke = this.storage.union(stavke,this.sifarniciServis.stanjeRobe)

                    //grupiraj po robiid
                    let data = _(stavke).groupBy(x => x.robaid).map((value, key) => ({ robaid: Number(key), data: value })).value();


                    console.log(data)
                    data.forEach(group => {

                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', group.robaid);
                        let zakljuceni: number = 0;
                        //za svaku roba id sumraj kolicine
                        let kolicina = 0;
                        group.data.forEach(item => {

                            if (item.status != null)
                                kolicina += item.kolicina;
                            if (item.status === 2 && item.vrstadokid > 10)
                                zakljuceni += item.kolicina;
                        });
                        group.naziv = roba.naziv;
                        group.sifra = roba.sifra;
                        group.zakljuceni = zakljuceni;
                        group.svi = kolicina;
                        group.ulaz = Object.keys(this.storage.filterCollectionSingleValue(this.sifarniciServis.stanjeRobe, 'robaid', group.robaid)).length != 0 ? parseInt(this.storage.filterCollectionSingleValue(this.sifarniciServis.stanjeRobe, 'robaid', Number(group.robaid)).kolicina) : 0
                        group.raspolozivo = group.ulaz - group.zakljuceni;
                    });

                    data = this.storage.orderItemsBy(data, "sifra", "asc")
                    this.stanjeSkladista = data;

                    //console.log(this.stanjeSkladista)
                    resolve(this.stanjeSkladista);
                }, (error) => {
                    reject(error);
                });
        });
    }

    getStanjeSkladistaKartica(robaid: number): Promise<any> {

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((val) => {
                    //dohvati sve narudzbe
                    this.kartica = []
                    let karticaItem: { tip: string, broj: string, kolicina: number, zak: number, status: string }
                    //prvo dohvati stanje sa skladista

                    karticaItem = {
                        tip: 'PS',
                        broj: 'ULAZ NA KAMION',
                        zak: this.storage.filterCollectionSingleValue(this.sifarniciServis.stanjeRobe, 'robaid', robaid) != undefined ? parseInt(this.storage.filterCollectionSingleValue(this.sifarniciServis.stanjeRobe, 'robaid', Number(robaid)).kolicina) : 0,
                        kolicina: this.storage.filterCollectionSingleValue(this.sifarniciServis.stanjeRobe, 'robaid', robaid) != undefined ? parseInt(this.storage.filterCollectionSingleValue(this.sifarniciServis.stanjeRobe, 'robaid', Number(robaid)).kolicina) : 0,
                        status: ''
                    }

                    this.kartica.push(karticaItem)


                    this.narudzbe = [];
                    this.narudzbe = <Array<INarudzba.Narudzba>>val
                    let stavke = []

                    if (this.narudzbe && this.narudzbe.length > 0)

                        this.narudzbe.forEach((nar) => {

                            //dohvati sve stavke narudzbi
                            nar.stavke.forEach(stavka => {

                                if (stavka.robaid === robaid && nar.vrstadokid > 0) {

                                    let vrstadok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid)

                                    stavka.vrstadok = vrstadok ? vrstadok.oznaka : null;
                                    stavka.zakljuceni = nar.status === 2 && nar.vrstadokid > 10 ? stavka.kolicina : 0;
                                    stavka.status = nar.status === 2 && nar.vrstadokid > 10 ? 1 : 0;
                                    stavka.vrstadokid = nar.vrstadokid
                                    stavka.broj = nar.broj

                                }
                            });

                            stavke = stavke.concat(nar.stavke)
                        });

                    //filtriraj stavke gdje je robaid

                    stavke = this.storage.filterCollection(stavke, 'robaid', robaid);

                    stavke.forEach(stavka => {
                        karticaItem = {
                            tip: stavka.vrstadok,
                            broj: stavka.broj,
                            kolicina: stavka.kolicina,
                            zak: stavka.zakljuceni,
                            status: stavka.status
                        }

                        this.kartica.push(karticaItem)
                    });



                    this.kartica = this.storage.orderItemsBy(this.kartica, 'status', 'asc');
                    //this.stanjeSkladista = data;

                    resolve(this.kartica);
                }, (error) => {
                    reject(error);
                });
        });
    }

    getRealizacija(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((val) => {
                    //dohvati sve narudzbe
                    this.stanjeSkladista = [];
                    console.log(val)
                    val = this.storage.filterCollection(val, 'status', 2)

                    if (val && val.length > 0)

                        val.forEach((nar) => {

                            this.dataServis.getLokacije().then((res) => {
                                let partner = this.storage.filterCollectionSingleValue(res, 'parstruid', nar.parstruid);
                                nar.partner = partner ? partner.naziv_partnera : null;
                                nar.adresa = partner ? partner.adresa : null;
                                nar.mjesto = partner ? partner.mjesto : null;
                                nar.lokacija = partner ? partner.naziv : null;
                            })


                            let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid);
                            nar.vrstadokoznaka = vrstaDok ? vrstaDok.oznaka : null;
                            nar.vrstadokumenta = vrstaDok ? vrstaDok.opis : null;

                            nar.iznos_neto = 0;
                            nar.iznos_rabat = 0;
                            nar.iznos_osnovica = 0;
                            nar.iznos_porez = 0;
                            nar.iznos_ukupno = 0;

                            if (nar.stavke && nar.stavke.length > 0) {

                                let osnovica: number = 0;
                                nar.stavke.forEach(stavka => {
                                    let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                                    if (Object.keys(roba).length != 0) {

                                        if (nar.vrstadokoznaka === "VP") {
                                            nar.iznos_neto += stavka.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina
                                            nar.iznos_rabat += stavka.iznos_rabat;
                                            nar.iznos_osnovica += stavka.iznos_osnovica
                                            //TODO: grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                                            //this.narudzba.iznos_porez += stavka.iznos_porez;

                                            nar.iznos_neto = Math.round(nar.iznos_neto * 100) / 100
                                            nar.iznos_rabat = Math.round(nar.iznos_rabat * 100) / 100
                                            nar.iznos_osnovica = Math.round(nar.iznos_osnovica * 100) / 100


                                        }
                                        //ako je MP
                                        else {
                                            nar.iznos_neto += stavka.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                            //console.log(stavka.iznos_osnovica)
                                            nar.iznos_rabat += stavka.iznos_rabat;
                                            nar.iznos_osnovica += stavka.iznos_osnovica //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                            nar.iznos_porez += stavka.iznos_porez;
                                            nar.iznos_ukupno += stavka.iznos_osnovica + stavka.kolicina * (roba ? roba.pov_nak_iznos : 0);
                                            nar.iznos_neto = Math.round(nar.iznos_neto * 100) / 100
                                            nar.iznos_rabat = Math.round(nar.iznos_rabat * 100) / 100
                                            nar.iznos_osnovica = Math.round(nar.iznos_osnovica * 100) / 100
                                            nar.iznos_porez = Math.round(nar.iznos_porez * 100) / 100
                                            nar.iznos_ukupno = Math.round(nar.iznos_ukupno * 100) / 100
                                        }

                                    }

                                });

                                //za VP grupiraj stavke po poreznoj stopi
                                //grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                                if (nar.vrstadokoznaka === "VP") {
                                    let data = _(nar.stavke).groupBy(x => x.stopa).map((value, key) => ({ stopa: Number(key), data: value })).value();

                                    data.forEach(group => {
                                        let osnovicagroup: number = 0;
                                        group.data.forEach(item => {
                                            osnovicagroup += item.iznos_osnovica;
                                            osnovicagroup = Math.round(osnovicagroup * 100) / 100
                                        });

                                        group.iznos_porez = Math.round(osnovicagroup * group.stopa / 100 * 100) / 100
                                        osnovica += group.iznos_porez;
                                        osnovica = Math.round(osnovica * 100) / 100
                                    });
                                    //console.log(nar)
                                    nar.iznos_porez += osnovica;
                                    nar.iznos_ukupno += nar.iznos_osnovica + nar.iznos_porez;
                                    nar.iznos_porez = Math.round(nar.iznos_porez * 100) / 100
                                    nar.iznos_ukupno = Math.round(nar.iznos_ukupno * 100) / 100
                                }

                            }
                            // this.narudzba.stavke.forEach((stavka) => {
                            //     //dohvati robu iz sifarnika     
                            //     let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                            //     this.narudzba.iznos += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0));
                            // });
                            else
                                nar.iznos = 0;
                            //nar.iznos_neto = 0;

                            //dohvati sve stavke narudzbi
                            // nar.stavke.forEach(stavka => {
                            //     //console.log(stavka.iznos_neto)
                            //     nar.iznos_neto += stavka.iznos_neto;
                            // });

                        });

                    this.realizacija = val;

                    resolve(this.realizacija);
                }, (error) => {
                    reject(error);
                });
        });
    }

    //podaci za printanje


    getMPStatistika(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((val) => {
                    //dohvati sve narudzbe
                    this.narudzbe = [];
                    this.narudzbe = <Array<INarudzba.Narudzba>>val

                    val = this.storage.filterCollection(val, 'status', 2)

                    if (val && val.length > 0)

                        val.forEach((nar) => {

                            let partner = this.storage.filterCollectionSingleValue(this.sifarniciServis.SveLokacije, 'parstruid', nar.parstruid);
                            nar.partner = partner ? partner.naziv_partnera : null;
                            nar.adresa = partner ? partner.adresa : null;
                            nar.mjesto = partner ? partner.mjesto : null;
                            nar.lokacija = partner ? partner.naziv : null;

                            let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid);
                            nar.vrstadokoznaka = vrstaDok ? vrstaDok.oznaka : null;
                            nar.vrstadokumenta = vrstaDok ? vrstaDok.opis : null;


                            nar.iznos_neto = 0;
                            nar.iznos_rabat = 0;
                            nar.iznos_osnovica = 0;
                            nar.iznos_porez = 0;
                            nar.iznos_ukupno = 0;

                            if (nar.stavke && nar.stavke.length > 0) {

                                let osnovica: number = 0;
                                nar.stavke.forEach(stavka => {
                                    let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                                    if (Object.keys(roba).length != 0) {

                                        if (nar.vrstadokoznaka === "VP") {
                                            nar.iznos_neto += stavka.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina
                                            nar.iznos_rabat += stavka.iznos_rabat;
                                            nar.iznos_osnovica += stavka.iznos_osnovica
                                            //TODO: grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                                            //this.narudzba.iznos_porez += stavka.iznos_porez;
                                            nar.iznos_neto = Math.round(nar.iznos_neto * 100) / 100
                                            nar.iznos_rabat = Math.round(nar.iznos_rabat * 100) / 100
                                            nar.iznos_osnovica = Math.round(nar.iznos_osnovica * 100) / 100
                                        }
                                        //ako je MP
                                        else {
                                            nar.iznos_neto += stavka.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                            //console.log(stavka.iznos_osnovica)
                                            nar.iznos_rabat += stavka.iznos_rabat;
                                            nar.iznos_osnovica += stavka.iznos_osnovica //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                            nar.iznos_porez += stavka.iznos_porez;
                                            nar.iznos_ukupno += stavka.iznos_osnovica + stavka.kolicina * (roba ? roba.pov_nak_iznos : 0);

                                            nar.iznos_neto = Math.round(nar.iznos_neto * 100) / 100
                                            nar.iznos_rabat = Math.round(nar.iznos_rabat * 100) / 100
                                            nar.iznos_osnovica = Math.round(nar.iznos_osnovica * 100) / 100
                                            nar.iznos_porez = Math.round(nar.iznos_porez * 100) / 100
                                            nar.iznos_ukupno = Math.round(nar.iznos_ukupno * 100) / 100

                                        }

                                    }

                                });

                                //za VP grupiraj stavke po poreznoj stopi
                                //grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                                if (nar.vrstadokoznaka === "VP") {
                                    let data = _(nar.stavke).groupBy(x => x.stopa).map((value, key) => ({ stopa: Number(key), data: value })).value();

                                    data.forEach(group => {
                                        let osnovicagroup: number = 0;
                                        group.data.forEach(item => {
                                            osnovicagroup += item.iznos_osnovica;
                                            osnovicagroup = Math.round(osnovicagroup * 100) / 100
                                        });

                                        group.iznos_porez = Math.round(osnovicagroup * group.stopa / 100 * 100) / 100;
                                        osnovica += group.iznos_porez;
                                        osnovica = Math.round(osnovica * 100) / 100

                                    });
                                    console.log(nar)
                                    nar.iznos_porez += osnovica;
                                    nar.iznos_ukupno += nar.iznos_osnovica + nar.iznos_porez;
                                    nar.iznos_porez = Math.round(nar.iznos_porez * 100) / 100
                                    nar.iznos_ukupno = Math.round(nar.iznos_ukupno * 100) / 100

                                }

                            }
                            // this.narudzba.stavke.forEach((stavka) => {
                            //     //dohvati robu iz sifarnika     
                            //     let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                            //     this.narudzba.iznos += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0));
                            // });
                            else
                                nar.iznos = 0;
                            //nar.iznos_neto = 0;
                            //dohvati sve stavke narudzbi
                            // nar.stavke.forEach(stavka => {
                            //     let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                            //     nar.iznos_neto += nar.vrstadokoznaka === "MP" ? (stavka.iznos_neto + (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina) : 0
                            // });

                        });
                    console.log(val)
                    resolve(val);
                }, (error) => {
                    reject(error);
                });
        });
    }


    getAmbalazaSub(pronarudzbeglaid): Promise<any> {

        //dohvati sve stavke narudzbe

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {

                    let narudzba = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(narudzbe, 'pronarudzbeglaid', pronarudzbeglaid);


                    //ne gledaj povratnu naknadu
                    narudzba.stavke = this.storage.filterCollectionWherePopertyNotEqual(narudzba.stavke, 'robaid', 9651)
                    //console.log(povratkestavke)                       


                    //console.log(_.includes(narudzba.stavke, 1))
                    let stavke = [];
                    narudzba.stavke.forEach(stavka => {
                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                        // if (narudzba.vrstadokoznaka === "MP") {
                        //     stavka.iznos_osnovica = stavka.iznos_osnovica + (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                        //     stavka.cijena = stavka.cijena + roba.pov_nak_iznos
                        // }


                        if (Object.keys(roba).length != 0) {

                            stavka.naziv = roba ? roba.naziv : null;
                            stavka.sifra = roba ? roba.sifra : null;
                        }
                        let jmrobe = this.storage.filterCollection(this.sifarniciServis.JMroba, 'povratrobaid', stavka.robaid);
                        if (jmrobe != null && jmrobe.length > 0)
                            stavke.push(stavka)
                    })

                    let data = _(stavke).groupBy(x => x.robaid).map((value, key) => ({ robaid: Number(key), data: value })).value();
                    console.log(data)
                    if (data)
                        data.forEach(group => {

                            let vraceno: number = 0;
                            //za svaku roba id sumraj kolicine + i munis za svaki artikl
                            let izdano: number = 0;
                            let razlika: number = 0;
                            let mpc: number = 0;
                            let iznos: number = 0
                            let naziv: string = ""
                            let sifra: string = ""
                            group.data.forEach(item => {
                                //console.log(item)
                                if (item.kolicina > 0)
                                    izdano += item.kolicina;
                                else if (item.kolicina < 0)
                                    vraceno += item.kolicina;
                                else
                                    razlika += item.kolicina

                                mpc = item.cijena;
                                iznos += item.iznos_osnovica
                                naziv = item.naziv
                                sifra = item.sifra
                            });

                            group.izdano = izdano;
                            group.vraceno = vraceno;
                            group.razlika = izdano + vraceno;
                            group.mpc = mpc;
                            group.iznos = iznos;
                            group.naziv = naziv;
                            group.sifra = sifra;

                        });

                    resolve(data)
                }
                    , (error) => {
                        reject(error);
                    });
        })
    }

    rekapitulacijaMP(pronarudzbeglaid): Promise<any> {

        //dohvati sve stavke narudzbe

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {

                    let narudzba = <IPrint.Narudzba>this.storage.filterCollectionSingleValue(narudzbe, 'pronarudzbeglaid', pronarudzbeglaid);

                    narudzba.stavke = this.storage.filterCollectionWherePopertyNotEqual(narudzba.stavke, 'robaid', 9651)

                    narudzba.stavke.forEach(stavka => {
                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                        if (Object.keys(roba).length != 0) {
                            stavka.stopa_naziv = roba ? roba.stopa_naziv : null;
                        }

                    })

                    let data = _(narudzba.stavke).groupBy(x => x.stopa).map((value, key) => ({ stopa: Number(key), data: value })).value();
                    let ukupno: number = 0;
                    //console.log(data)
                    if (data)

                        data.forEach(group => {

                            let vraceno: number = 0;
                            //za svaku roba id sumraj kolicine + i munis za svaki artikl
                            let iznos_neto: number = 0;
                            let iznos_rabat: number = 0;
                            let iznos_osnovica: number = 0;
                            let iznos_ukupno: number = 0
                            let iznos_porez: number = 0;
                            let osnovica_porez: number = 0;
                            let kolicina: number = 0;
                            let pov_nak_iznos: number = 0;
                            let stopa_naziv: string = ""
                            group.data.forEach(item => {
                                let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', item.robaid);

                                if (Object.keys(roba).length != 0) {
                                    iznos_neto += Math.round((item.iznos_neto + (roba ? roba.pov_nak_iznos : 0) * item.kolicina) * 100) / 100;

                                    iznos_rabat += item.iznos_rabat;
                                    iznos_osnovica += Math.round((item.iznos_osnovica + (roba ? roba.pov_nak_iznos : 0) * item.kolicina) * 100) / 100;
                                                             
                                    iznos_porez += Math.round((item.iznos_osnovica - item.iznos_osnovica / (1 + roba.stopa / 100)) *100) /100;
                                    osnovica_porez += Math.round((item.iznos_osnovica / (1 + roba.stopa / 100) ) * 100) / 100;
                                    kolicina = item.kolicina
                                    stopa_naziv = item.stopa_naziv
                                    pov_nak_iznos += item.pov_nak_iznos

                                }

                            });
                   
                            group.stopa_naziv = stopa_naziv;
                            ukupno = Number(iznos_osnovica) // Number(iznos_porez.toFixed(2)) + Number(osnovica_porez.toFixed(2))
                            group.osnovica_porez = osnovica_porez;
                            group.iznos_porez = iznos_porez;
                            group.iznos_neto = iznos_neto;


                        });

                    data.ukupno = ukupno;
                    console.log(data)
                    resolve(data)
                }
                    , (error) => {
                        reject(error);
                    });
        })
    }


    rekapitulacijaVP(pronarudzbeglaid): Promise<any> {

        //dohvati sve stavke narudzbe

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    let osnovica: number = 0;

                    let narudzba = <IPrint.Narudzba>this.storage.filterCollectionSingleValue(narudzbe, 'pronarudzbeglaid', pronarudzbeglaid);
                    //narudzba.stavke = this.storage.filterCollectionWherePopertyNotEqual(narudzba.stavke, 'robaid', 9651)

                    //console.log(narudzba)
                    narudzba.stavke.forEach(stavka => {
                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                        if (Object.keys(roba).length != 0) {
                            stavka.stopa_naziv = roba ? roba.stopa_naziv : null;
                        }

                    })

                    // let iznos_neto = 0;
                    // let iznos_rabat = 0;
                    // let iznos_osnovica = 0;
                    // let iznos_porez = 0;
                    // //narudzba.iznos_ukupno = 0;
                    // narudzba.stavke.forEach(stavka => {
                    //     let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                    //     if (Object.keys(roba).length != 0) {
                    //         stopa_naziv = roba ? roba.stopa_naziv : null;
                    //         iznos_neto += stavka.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina
                    //         iznos_rabat += stavka.iznos_rabat;
                    //         iznos_osnovica += stavka.iznos_osnovica
                    //     }

                    // })
                    let data = _(narudzba.stavke).groupBy(x => x.stopa).map((value, key) => ({ stopa: Number(key), data: value })).value();
                    let stopa_naziv: string = ""
                    data.forEach(group => {
                        let iznos_neto = 0;
                        let iznos_rabat = 0;
                        let iznos_osnovica = 0;
                        let iznos_porez = 0;
                        let osnovicagroup: number = 0;
                        group.data.forEach(item => {
                            osnovicagroup += item.iznos_osnovica;
                            stopa_naziv = item.stopa_naziv;
                            iznos_neto += item.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina
                            iznos_rabat += item.iznos_rabat;
                            iznos_osnovica += item.iznos_osnovica
                            osnovicagroup = Math.round(osnovicagroup * 100) / 100 ;
                            iznos_neto = Math.round(iznos_neto * 100) / 100 ;
                            iznos_rabat = Math.round(iznos_rabat * 100) / 100 ;
                            iznos_osnovica = Math.round(iznos_osnovica * 100) / 100 ;
                        });
        
                        //let broj = osnovicagroup * group.stopa / 100
                        
                        group.iznos_porez = Math.round((osnovicagroup * group.stopa / 100) * 100)  / 100;
                        osnovica += group.iznos_porez;
                        osnovica = Math.round(osnovica * 100) / 100 ;
                        group.stopa_naziv = stopa_naziv;
                        group.iznos_neto = iznos_neto;
                        group.iznos_osnovica = iznos_osnovica;
                        group.iznos_ukupno = group.iznos_osnovica + group.iznos_porez;
                    });

                    narudzba.iznos_porez = osnovica;
                    data.ukupno = narudzba.iznos_osnovica + narudzba.iznos_porez;
                    //console.log(data)
                    resolve(data)
                }
                    , (error) => {
                        reject(error);
                    });
        })
    }

    povratnaNaknadaMP(pronarudzbeglaid): Promise<any> {

        //dohvati sve stavke narudzbe

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {

                    let narudzba = <IPrint.Narudzba>this.storage.filterCollectionSingleValue(narudzbe, 'pronarudzbeglaid', pronarudzbeglaid);
                    let data = { komada: 0, iznos: 0 }
                    narudzba.stavke.forEach(stavka => {
                        let roba = this.storage.filterMultiCollection(this.sifarniciServis.roba, { 'robaid': stavka.robaid, 'pov_nak_ind': 1 });

                        if (Object.keys(roba).length != 0) {
                            data.komada += stavka.kolicina;
                            data.iznos += stavka.kolicina * 0.5;
                        }

                    })

                    console.log(data)

                    resolve(data)
                }
                    , (error) => {
                        reject(error);
                    });
        })
    }

    povratnaNaknadaVP(pronarudzbeglaid): Promise<any> {

        //dohvati sve stavke narudzbe

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {

                    let narudzba: IPrint.Narudzba = <IPrint.Narudzba>this.storage.filterCollectionSingleValue(narudzbe, 'pronarudzbeglaid', pronarudzbeglaid);

                    narudzba.stavke = this.storage.filterCollection(narudzba.stavke, 'robaid', 9651)
                    narudzba.stavke.forEach(stavka => {
                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                        if (Object.keys(roba).length != 0) {

                            stavka.naziv = roba ? roba.naziv : null;
                            stavka.sifra = roba ? roba.sifra : null;
                        }
                    });

                    //console.log(narudzba)

                    resolve(narudzba)
                }
                    , (error) => {
                        reject(error);
                    });
        })
    }

}
