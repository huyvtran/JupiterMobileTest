import { Injectable } from '@angular/core';
import { Response } from '@angular/http';


import { GlobalProvider } from '../../core/global-provider';
import { StorageProvider } from '../../core/storage-provider';

import * as ICore from '../../../interfaces/ICore';
import * as INarudzba from '../../../interfaces/terpro/INarudzba';
import * as IPrint from '../../../interfaces/terpro/IPrint';
import { ConstProvider } from '../../core/const-provider';
//shared
import { TerproDataProvider } from './terpro-data-provider';
import { TerproSifarniciProvider } from './terpro-sifarnici-provider';
import { TerproUserProvider } from './terpro-user-provider';
import { TerProZkiProvider } from './terpro-zki-provider';

import _ from 'lodash';
import { VariableProvider } from '../../core/variable-provider';
import { HelpersProvider } from '../../core/helpers-provider';

@Injectable()
export class TerproNarudzbaProvider {


    public narudzbe: Array<INarudzba.Narudzba>;
    public narudzba: INarudzba.Narudzba;
    public pronarudzbeglaid: number;

    public partneriid: number = null;
    public parstruid: number = null;
    public lokacija: string
    public vrstaDokId: number = null;

    public newPronarudzbeglaid: number = null
    public newbrojdok: number = null;
    public newbroj: string = "";
    public countNarudzbi: any = []
    public kreditniLimitSuma: number = 0;
    public maxIznosNar: number = 0;
    public stanjeArtikla: number = 0;

    public NeposlaneNarudzbeCnt: number = 0;
    public NeposlaneNarudzbe: Array<INarudzba.NarudzbaSync> = [];
    public NeFiskaliziraniRacuni: any;
    //objekt za slanje narudzbi

    public narudzbeJson: Array<INarudzba.DokumentSync> = [];
    public actionStavke: string = "Det";
    public actionZaglavlje: string = "Gla";


    //maksimalni limit narudzbe ukoliko je MP čitase iz vrstedok tablice
    public MaxLimit: number = 0;
    constructor(private global: GlobalProvider, private storage: StorageProvider, private variable: VariableProvider, private helper: HelpersProvider,
        private constants: ConstProvider, private dataServis: TerproDataProvider, private zkiService: TerProZkiProvider, private sifarniciServis: TerproSifarniciProvider, private userProvider: TerproUserProvider) {

    }



    getNarudzbe(vrstadokId?): Promise<INarudzba.Narudzba[]> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        let self = this.sifarniciServis;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    //console.log(val)
                    this.narudzbe = [];
                    this.narudzbe = <Array<INarudzba.Narudzba>>val
                    //joinaj se po podatke
                    //filtriraj po vrstadokid
                    if (vrstadokId == 0) {
                        this.narudzbe = this.storage.filterCollection(val, 'status', parseInt(vrstadokId));
                    }
                    else if (vrstadokId != null && vrstadokId != -1)
                        this.narudzbe = this.storage.filterCollection(val, 'vrstadokid', parseInt(vrstadokId));

                    if (this.narudzbe && this.narudzbe.length > 0)

                        this.narudzbe.forEach((nar) => {
                            let vrstadok = this.storage.filterCollectionSingleValue(self.vrstadok, 'vrstadokid', nar.vrstadokid)
                            let partner = this.storage.filterCollectionSingleValue(self.SveLokacije, 'parstruid', nar.parstruid);
                            nar.vrstadok = vrstadok ? vrstadok.opis : null;
                            nar.vrstadokoznaka = vrstadok ? vrstadok.oznaka : null;
                            nar.vrstadokumenta = vrstadok ? vrstadok.opis : null;
                            nar.lokacija = partner ? partner.naziv : null;
                            nar.partner = partner ? partner.naziv_partnera : null;
                            nar.adresa = partner ? partner.adresa : null;
                            nar.mjesto = partner ? partner.mjesto : null;
                            nar.brojstavki = nar.stavke ? nar.stavke.length : 0;
                        });
                    //console.log(this.narudzbe)
                    //order by status
                    this.narudzbe = this.storage.orderItemsBy(this.narudzbe, 'status', 'asc');
                    resolve(this.narudzbe);
                }, (error) => {
                    reject(error);
                });
        });
    }
    //obilazak-akcija-izbor page
    getNarudzbeLokacija() {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //let self = this.sifarniciServis;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

                    this.countNarudzbi = [];
                    this.countNarudzbi = this.storage.filterMultiCollection(val, { 'parstruid': this.parstruid, 'vrstadokid': this.vrstaDokId })


                    this.countNarudzbi.forEach((nar) => {
                        //let skladiste = this.storage.filterCollectionSingleValue(self.skladista, 'skladisteid', nar.skladisteid);
                        nar.brojstavki = nar.stavke ? nar.stavke.length : 0;
                        //nar.skladiste = skladiste ? skladiste.naziv : null;
                    });

                    resolve(this.countNarudzbi);
                }, (error) => {
                    reject(error);
                });
        });
    }

    //dohvat 1 narudzbe
    getNarudzba(id: number): Promise<INarudzba.Narudzba> {

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((val) => {
                    //console.log(val)
                    this.narudzba = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(val, 'pronarudzbeglaid', id);
                    //join za pokupiti ostale podatke
                    //console.log(this.narudzba)
                    this.narudzba.iznos = 0;
                    this.dataServis.getLokacije().then((res) => {
                        let partner = this.storage.filterCollectionSingleValue(res, 'parstruid', this.narudzba.parstruid);
                        this.narudzba.partner = partner ? partner.naziv_partnera : null;
                        this.narudzba.adresa = partner ? partner.adresa : null;
                        this.narudzba.mjesto = partner ? partner.mjesto : null;
                        this.narudzba.lokacija = partner ? partner.naziv : null;
                    })

                    if (this.narudzba.status != null) {
                        this.narudzba.statusnarudzbe = this.getStatusNarudzbe(this.narudzba.status, this.narudzba.storno);
                    }

                    // this.dataServis.getNacinIsporuke().then((res) => {
                    //     let isporuka = this.storage.filterCollectionSingleValue(res, 'id', this.narudzba.nacinisporukeid);
                    //     this.narudzba.nacinisporuke = isporuka ? isporuka.opis : null;
                    // })
                    this.dataServis.getNacinPlacanja().then((res) => {
                        let placanje = this.storage.filterCollectionSingleValue(res, 'id', this.narudzba.nacinplacanjaid);
                        this.narudzba.nacinplacanja = placanje ? placanje.naziv : null;
                    })

                    // this.dataServis.getVrsteDok().then((res) => {
                    //     let vrstaDok = this.storage.filterCollectionSingleValue(res, 'vrstadokid', this.narudzba.vrstadokid);
                    //     this.narudzba.vrstadokoznaka = vrstaDok ? vrstaDok.oznaka : null;
                    //     this.narudzba.vrstadokumenta = vrstaDok ? vrstaDok.opis : null;
                    // })

                    let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', this.narudzba.vrstadokid);
                    this.narudzba.vrstadokoznaka = vrstaDok ? vrstaDok.oznaka : null;
                    this.narudzba.vrstadokumenta = vrstaDok ? vrstaDok.opis : null;

                    // this.dataServis.getSkladista().then((res) => {
                    //     let skladiste = this.storage.filterCollectionSingleValue(res, 'skladisteid', this.narudzba.skladisteid);
                    //     this.narudzba.skladiste = skladiste ? skladiste.naziv : null;
                    // })
                    this.narudzba.iznos_neto = 0;
                    this.narudzba.iznos_rabat = 0;
                    this.narudzba.iznos_osnovica = 0;
                    this.narudzba.iznos_porez = 0;
                    this.narudzba.iznos_ukupno = 0;
                    this.narudzba.odgoda = 0;
                    if (this.narudzba.stavke && this.narudzba.stavke.length > 0) {
                        let odgoda = this.storage.getMaxPropertyValueFromArray(this.narudzba.stavke, 'odgoda');
                        //console.log(odgoda);
                        this.narudzba.odgoda = odgoda ? odgoda.odgoda : 0;
                        let osnovica: number = 0;
                        this.narudzba.stavke.forEach(stavka => {
                            let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                            if (Object.keys(roba).length != 0) {

                                if (this.narudzba.vrstadokoznaka === "VP") {
                                    this.narudzba.iznos_neto += stavka.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina
                                    this.narudzba.iznos_rabat += stavka.iznos_rabat;
                                    this.narudzba.iznos_osnovica += stavka.iznos_osnovica
                                    //TODO: grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                                    //this.narudzba.iznos_porez += stavka.iznos_porez;
                                    this.narudzba.iznos_neto = Math.round(this.narudzba.iznos_neto * 100) / 100;
                                    this.narudzba.iznos_rabat = Math.round(this.narudzba.iznos_rabat * 100) / 100;
                                    this.narudzba.iznos_osnovica = Math.round(this.narudzba.iznos_osnovica * 100) / 100;

                                }
                                //ako je MP
                                else {
                                    this.narudzba.iznos_neto += stavka.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                    //console.log(stavka.iznos_osnovica)
                                    this.narudzba.iznos_rabat += stavka.iznos_rabat;
                                    this.narudzba.iznos_osnovica += stavka.iznos_osnovica //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                    this.narudzba.iznos_porez += stavka.iznos_porez;
                                    this.narudzba.iznos_ukupno += stavka.iznos_osnovica + stavka.kolicina * (roba ? roba.pov_nak_iznos : 0);

                                    this.narudzba.iznos_neto = Math.round(this.narudzba.iznos_neto * 100) / 100
                                    this.narudzba.iznos_rabat = Math.round(this.narudzba.iznos_rabat * 100) / 100
                                    this.narudzba.iznos_osnovica = Math.round(this.narudzba.iznos_osnovica * 100) / 100
                                    this.narudzba.iznos_porez = Math.round(this.narudzba.iznos_porez * 100) / 100
                                    this.narudzba.iznos_ukupno = Math.round(this.narudzba.iznos_ukupno * 100) / 100
                                }

                            }

                        });

                        //za VP grupiraj stavke po poreznoj stopi
                        //grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                        if (this.narudzba.vrstadokoznaka === "VP") {
                            let data = _(this.narudzba.stavke).groupBy(x => x.stopa).map((value, key) => ({ stopa: Number(key), data: value })).value();

                            data.forEach(group => {
                                let osnovicagroup: number = 0;
                                group.data.forEach(item => {
                                    osnovicagroup += item.iznos_osnovica;
                                    osnovicagroup = Math.round(osnovicagroup * 100) / 100;

                                });

                                group.iznos_porez = Math.round(osnovicagroup * group.stopa / 100 * 100) / 100;
                                osnovica += group.iznos_porez;
                                osnovica = Math.round(osnovica * 100) / 100;

                            });
                            this.narudzba.iznos_porez += osnovica;
                            this.narudzba.iznos_ukupno += this.narudzba.iznos_osnovica + this.narudzba.iznos_porez;

                            this.narudzba.iznos_ukupno = Math.round(this.narudzba.iznos_ukupno * 100) / 100;
                            this.narudzba.iznos_porez = Math.round(this.narudzba.iznos_porez * 100) / 100;


                        }

                    }
                    // this.narudzba.stavke.forEach((stavka) => {
                    //     //dohvati robu iz sifarnika
                    //     let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                    //     this.narudzba.iznos += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0));
                    // });
                    else
                        this.narudzba.iznos = 0;

                    //join na ostale storage keys
                    console.log(this.narudzba)
                    resolve(this.narudzba);
                }, (error) => {
                    reject(error);
                });
        });
    }

    getNarudzbaPrint(id: number): Promise<IPrint.Narudzba> {

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((val) => {
                    //console.log(val)
                    let narudzba: IPrint.Narudzba = <IPrint.Narudzba>this.storage.filterCollectionSingleValue(val, 'pronarudzbeglaid', id);

                    //ne gledaj povratnu naknadu
                    //if (narudzba.vrstadokoznaka === "VP"){
                    //console.log("Assdasd")
                    narudzba.stavke = this.storage.filterCollectionWherePopertyNotEqual(narudzba.stavke, 'robaid', 9651)
                    //}
                    //join za pokupiti ostale podatke

                    narudzba.iznos = 0;

                    let partner = this.storage.filterCollectionSingleValue(this.sifarniciServis.SveLokacije, 'parstruid', narudzba.parstruid);

                    narudzba.partner = partner ? partner.naziv_partnera : null;
                    narudzba.partner_adresa = partner ? partner.adresa_partnera : null
                    narudzba.partner_mjesto = partner ? partner.mjesto_partnera : null
                    narudzba.adresa = partner ? partner.adresa : null;
                    narudzba.mjesto = partner ? partner.mjesto : null;
                    narudzba.lokacija = partner ? partner.naziv : null;
                    narudzba.oib = partner ? partner.oib : null;
                    narudzba.telefon = partner ? partner.telefon : null;

                    let placanje = this.storage.filterCollectionSingleValue(this.sifarniciServis.nacinplacanja, 'id', narudzba.nacinplacanjaid);
                    narudzba.nacinplacanja = placanje ? placanje.naziv : null;

                    let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', narudzba.vrstadokid);
                    narudzba.vrstadokoznaka = vrstaDok ? vrstaDok.oznaka : null;
                    narudzba.vrstadok = vrstaDok ? vrstaDok.opis : null

                    narudzba.iznos_neto = 0;
                    narudzba.iznos_rabat = 0;
                    narudzba.iznos_osnovica = 0;
                    narudzba.iznos_porez = 0;
                    narudzba.iznos_ukupno = 0;

                    // if (narudzba.stavke && narudzba.stavke.length > 0) {

                    //     narudzba.stavke.forEach(stavka => {
                    //         let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                    //         if (Object.keys(roba).length != 0) {

                    //             stavka.naziv = roba ? roba.naziv : null;
                    //             stavka.sifra = roba ? roba.sifra : null;

                    //             narudzba.iznos_neto += stavka.iznos_neto + (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;

                    //             stavka.nak_trosarina = roba.nak_trosarina * stavka.kolicina;
                    //             stavka.nak_zbrinjavanje = roba.nak_zbrinjavanje * stavka.kolicina;

                    //             narudzba.iznos_rabat += stavka.iznos_rabat;
                    //             //console.log(stavka.iznos_osnovica)
                    //             narudzba.iznos_osnovica += (stavka.iznos_osnovica + (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina);
                    //             narudzba.iznos_porez += (stavka.iznos_porez)
                    //             narudzba.iznos_ukupno += stavka.iznos_osnovica + (narudzba.vrstadokoznaka === "MP" ? /*(stavka.kolicina * (roba ? roba.pov_nak_iznos : 0))*/ 0 : (stavka.iznos_porez));
                    //         }


                    //     });

                    // }
                    // // this.narudzba.stavke.forEach((stavka) => {
                    // //     //dohvati robu iz sifarnika
                    // //     let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                    // //     this.narudzba.iznos += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0));
                    // // });
                    // else
                    //     narudzba.iznos = 0;


                    if (narudzba.stavke && narudzba.stavke.length > 0) {
                        let odgoda = this.storage.getMaxPropertyValueFromArray(narudzba.stavke, 'odgoda');
                        //console.log(odgoda);
                        this.narudzba.odgoda = odgoda ? odgoda.odgoda : 0;
                        let osnovica: number = 0;
                        narudzba.stavke.forEach(stavka => {
                            let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                            if (Object.keys(roba).length != 0) {
                                stavka.naziv = roba ? roba.naziv : null;
                                stavka.sifra = roba ? roba.sifra : null;

                                if (narudzba.vrstadokoznaka === "VP") {
                                    narudzba.iznos_neto += stavka.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina
                                    narudzba.iznos_rabat += stavka.iznos_rabat;
                                    narudzba.iznos_osnovica += stavka.iznos_osnovica
                                    //TODO: grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                                    //this.narudzba.iznos_porez += stavka.iznos_porez;
                                    narudzba.iznos_neto = Math.round(narudzba.iznos_neto * 100) / 100
                                    narudzba.iznos_rabat = Math.round(narudzba.iznos_rabat * 100) / 100
                                    narudzba.iznos_osnovica = Math.round(narudzba.iznos_osnovica * 100) / 100

                                }
                                //ako je MP
                                else {
                                    stavka.iznos_osnovica = stavka.iznos_osnovica + (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina
                                    stavka.cijena = stavka.cijena + roba.pov_nak_iznos
                                    narudzba.iznos_neto += stavka.iznos_neto //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                    //console.log(stavka.iznos_osnovica)
                                    narudzba.iznos_rabat += stavka.iznos_rabat;
                                    narudzba.iznos_osnovica += stavka.iznos_osnovica //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                    narudzba.iznos_porez += stavka.iznos_porez;
                                    narudzba.iznos_ukupno += stavka.iznos_osnovica //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;

                                    narudzba.iznos_neto = Math.round(narudzba.iznos_neto * 100) / 100
                                    narudzba.iznos_rabat = Math.round(narudzba.iznos_rabat * 100) / 100
                                    narudzba.iznos_osnovica = Math.round(narudzba.iznos_osnovica * 100) / 100
                                    narudzba.iznos_porez = Math.round(narudzba.iznos_porez * 100) / 100
                                    narudzba.iznos_ukupno = Math.round(narudzba.iznos_ukupno * 100) / 100

                                }
                            }
                        });

                        //za VP grupiraj stavke po poreznoj stopi
                        //grupirati po stopi poreza, sumirati iznos osnovice stavki u grupi i na to obracunati porez pa na 2 decimale
                        if (narudzba.vrstadokoznaka === "VP") {
                            let data = _(narudzba.stavke).groupBy(x => x.stopa).map((value, key) => ({ stopa: Number(key), data: value })).value();

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
                            narudzba.iznos_porez += osnovica;
                            narudzba.iznos_ukupno += narudzba.iznos_osnovica + narudzba.iznos_porez;
                            narudzba.iznos_porez = Math.round(narudzba.iznos_porez * 100) / 100
                            narudzba.iznos_ukupno = Math.round(narudzba.iznos_ukupno * 100) / 100
                        }

                    }
                    // this.narudzba.stavke.forEach((stavka) => {
                    //     //dohvati robu iz sifarnika
                    //     let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                    //     this.narudzba.iznos += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0));
                    // });
                    else
                        narudzba.iznos = 0;

                    this.narudzba.stavke.forEach((stavka) => {
                        //dohvati robu iz sifarnika
                        let jmrobe = this.storage.filterCollection(this.sifarniciServis.JMroba, 'povratrobaid', stavka.robaid);
                        //console.log(jmrobe)
                        //ako stavka postoji u ambalazi ne uzimaj je
                        if (jmrobe != null && jmrobe.length > 0) {
                            var index = this.storage.findArrayIndex(narudzba.stavke, "pronarudzbedetid", stavka.pronarudzbedetid)
                            //console.log(index)
                            narudzba.stavke.splice(index, 1);

                        }
                    });



                    //join na ostale storage keys

                    // narudzba.iznos_neto = narudzba.iznos_neto;
                    // narudzba.iznos_osnovica = narudzba.iznos_osnovica;
                    // narudzba.iznos_porez = narudzba.iznos_porez;
                    // narudzba.iznos_rabat = (narudzba.iznos_rabat);
                    // narudzba.iznos_ukupno = (narudzba.iznos_ukupno);
                    //console.log(narudzba)
                    resolve(narudzba);
                }, (error) => {
                    reject(error);
                });
        });
    }


    getStatusNarudzbe(status: number, storno: number = null): string {
        //console.log(storno)
        if (storno === 1)
            return "Storno dokument";

        switch (status) {
            case 0:
                return "**NEOBRAĐEN**";
            case 1:
                return "Otključan dokument";
            case 2:
                return "Zaključen dokument";
            case 3:
                return "Otkazan dokument";
            default:
                return "**NEOBRAĐEN**";
        }
    }

    promovirajDokument(pronarudzbeglaid): Promise<any> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    var date = new Date();
                    let narudzbe = <Array<INarudzba.Narudzba>>val;
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                this.getBrojDokumenta(nar.vrstadokid).then((res) => {
                                    nar.broj = this.newbroj ? this.newbroj : ""
                                    nar.brojdok = this.newbrojdok ? this.newbrojdok : null
                                    nar.status = 1;
                                    nar.datumdok = new Date()
                                    //nar.datumdok = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()))
                                    nar.fiskalnibroj = this.getFiskalniBroj(nar.brojdok, nar.vrstadokid)
                                })
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

    getStanjeArtikla(robaId): Promise<number> {


        return new Promise((resolve, reject) => {
            this.getNarudzbe()
                .then((val) => {
                    //dohvati sve neposlane narudzbe
                    let narudzbe = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterCollectionWherePopertyNotEqual(this.storage.filterCollection(this.narudzbe, 'prijenosind', 0), 'status', 3), 'brojstavki', 0);
                    let kolicina = 0;
                    //sumiraj količine svih stavki gdje je robaid

                    if (narudzbe && narudzbe.length > 0)
                        narudzbe.forEach((nar) => {
                            //dohvati robu iz sifarnika
                            if ((nar.donos === 1 || (nar.vrstadokid != 1 && nar.vrstadokid != 2 && nar.vrstadokid != 3 && nar.vrstadokid != 306)) && nar.stavke.length > 0) {
                                nar.stavke.forEach((stavka) => {
                                    if (stavka.robaid === robaId)
                                        kolicina += stavka ? stavka.kolicina : 0;
                                });
                            }

                            else
                                kolicina += 0;
                        });

                    this.stanjeArtikla = kolicina

                    resolve(this.stanjeArtikla);
                }, (error) => {
                    reject(error);
                });
        });

    }


    dodajVracenuAmbalazu(pronarudzbeglaid): Promise<Response> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

                    let narudzbe = <Array<INarudzba.Narudzba>>val;
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            //pronađi narudžbu
                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid);
                                vrstaDok = vrstaDok ? vrstaDok.oznaka : null

                                if (vrstaDok != null && vrstaDok === "MP") {
                                    resolve(this.insertAmbalazaPovrat(pronarudzbeglaid, "MP"));
                                }
                                else
                                    resolve(this.insertAmbalazaPovrat(pronarudzbeglaid, "VP"));
                            }
                        });

                    }
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }


    ukloniVracenuAmbalazu(pronarudzbeglaid): Promise<Response> {
        //console.log("brišem gdje je pov nak sys ind = 1")
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //delete
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid && nar.stavke && nar.stavke.length > 0) {
                                //pronađi index
                                let ambalaza = this.storage.filterMultiCollection(nar.stavke, { 'pov_nak_sysind': 1, 'pov_nak_ind': 0 });
                                //console.log(povratkestavke)
                                if (Object.keys(ambalaza).length != 0) {
                                    ambalaza.forEach(stavka => {
                                        var index = this.storage.findArrayIndex(nar.stavke, "pronarudzbedetid", stavka.pronarudzbedetid)
                                        nar.stavke.splice(index, 1);
                                    });
                                }

                            }
                        });
                    }
                    return narudzbe
                })
                .then((res) => {
                    //console.log("brisanje gotovo")
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }


    dodajAmbalazu(pronarudzbeglaid, kolicina?: number): Promise<Response> {
        //console.log("dodavanje ambalaze za artikl!!!!")
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    //console.log(val)
                    let narudzbe = <Array<INarudzba.Narudzba>>val;
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {

                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid);
                                vrstaDok = vrstaDok ? vrstaDok.oznaka : null

                                //console.log(nar)
                                //filtriraj  JMrobu where robaid je ova sa stavki narudzbe
                                let noviartikli = [];

                                nar.stavke.forEach(stavka => {
                                    let jmrobe = this.storage.filterCollection(this.sifarniciServis.JMroba, 'robaid', stavka.robaid);
                                    //console.log(jmrobe)
                                    if (jmrobe != null && jmrobe.length > 0) {
                                        jmrobe.forEach(r => {
                                            let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', r.povratrobaid);
                                            let cijena = 0;
                                            let iznos_porez = 0;

                                            if (vrstaDok === "MP") {
                                                cijena = roba ? roba.mp_cijena : 0;
                                                iznos_porez = Math.round((Math.ceil(stavka.kolicina / r.faktor) * cijena - (Math.ceil(stavka.kolicina / r.faktor) * cijena) / (1 + roba.stopa / 100)) * 100) / 100;
                                            }
                                            else {
                                                cijena = roba ? roba.vp_cijena : 0;
                                                iznos_porez = Math.round(Math.ceil(stavka.kolicina / r.faktor) * cijena * (roba.stopa / 100) * 100) / 100;
                                            }


                                            let orderaneStavke = this.storage.orderItemsBy(nar.stavke, 'pronarudzbedetid', 'asc');
                                            //dohvati zadnji array element (s najvecim brojem dokumenta) i uvecaj ga za 1
                                            let zadnjaStavka = this.storage.getLastArrayElement(orderaneStavke);

                                            let novaStavka: INarudzba.NarudzbaStavka = {
                                                jm: r.jm,
                                                cijena: cijena,
                                                faktor: r.faktor,
                                                kolicina: Math.ceil(stavka.kolicina / r.faktor),
                                                kolicina_old: stavka.kolicina,
                                                robaid: r.povratrobaid,
                                                rabat: 0,
                                                nak_zbrinjavanje: 0,
                                                nak_trosarina: 0,
                                                nak_poticaj: 0,
                                                iznos_neto: Math.round(Math.ceil(stavka.kolicina / r.faktor) * cijena * 100) / 100,
                                                iznos_rabat: 0,
                                                iznos_osnovica: Math.round(Math.ceil(stavka.kolicina / r.faktor) * cijena * 100) / 100,
                                                iznos_porez: iznos_porez,
                                                pov_nak_ind: 1,
                                                pov_nak_iznos: 0,
                                                pov_nak_sysind: 1,
                                                pronarudzbedetid: zadnjaStavka ? Number(zadnjaStavka.pronarudzbedetid) + 1 + noviartikli.length : 1,
                                                odgoda: 0,
                                                stopa: roba ? roba.stopa : 0
                                            }


                                            noviartikli.push(novaStavka);
                                            //provjeri postoji li u listi stavaka vec ambalaza

                                            // let ambalaza = this.storage.filterCollectionSingleValue(this.storage.filterCollectionWherePopertGreatherThan(nar.stavke, 'kolicina', 0), 'robaid', r.povratrobaid);

                                            // console.log(ambalaza)

                                            // nar.stavke.forEach(sta => {
                                            //     console.log("foreach stavke  for petlja")
                                            //     //ako postoji uvecaj kolicinu i rekalkuliraj stavke koje imaju
                                            //     if (sta.robaid === r.povratrobaid && sta.pov_nak_ind === 1) {
                                            //         if (sta.kolicina > 0) {
                                            //             console.log(sta.kolicina)
                                            //             //ovo se radi zbog nosiljki i bačvi koje zaokružujemo na cijeli broj
                                            //             let kolicina: number = Number(ambalaza ? ambalaza.kolicina_old / ambalaza.faktor : 0) + stavka.kolicina / r.faktor

                                            //             sta.kolicina = Math.ceil(kolicina);
                                            //             sta.iznos_neto = Math.ceil(kolicina) * cijena;
                                            //             sta.iznos_osnovica = Math.ceil(kolicina) * cijena;

                                            //             if (vrstaDok === "MP") {
                                            //                 sta.iznos_porez = Math.ceil(kolicina) * cijena - (Math.ceil(kolicina) * cijena) / (1 + roba.stopa / 100)
                                            //             }
                                            //             else {
                                            //                 sta.iznos_porez = Math.ceil(kolicina) * cijena * (roba.stopa / 100)
                                            //             }

                                            //             //console.log(sta.iznos_porez)
                                            //         }

                                            //     }
                                            // })


                                            // //console.log(povratna)
                                            // if (Object.keys(ambalaza).length == 0 || (Object.keys(ambalaza).length > 0 && ambalaza.kolicina < 0)) {
                                            //     //insert novu povratnu
                                            //     this.storage.addItemToArray(nar.stavke, novaStavka)
                                            // }

                                            //this.storage.addItemToArray(nar.stavke, novaStavka)
                                        });
                                    }
                                })
                                //console.log(this.narudzba)
                                //console.log(noviartikli)

                                let data = _(noviartikli).groupBy(x => x.robaid).map((value, key) => ({ robaid: Number(key), data: value })).value();

                                data.forEach(group => {
                                    let kolicina: number = 0;
                                    group.data.forEach(item => {
                                        kolicina += item.kolicina;
                                    });

                                    group.kolicina = kolicina;

                                    if (group.data.length > 0) {

                                        group.data[0].kolicina = group.kolicina
                                        group.data[0].iznos_neto = Math.round(Math.ceil(group.data[0].kolicina) * group.data[0].cijena * 100) / 100;
                                        group.data[0].iznos_osnovica = Math.round(Math.ceil(group.data[0].kolicina) * group.data[0].cijena * 100) / 100;

                                        if (vrstaDok === "MP") {
                                            group.data[0].iznos_porez = Math.round((Math.ceil(group.data[0].kolicina) * group.data[0].cijena - (Math.ceil(group.data[0].kolicina) * group.data[0].cijena) / (1 + group.data[0].stopa / 100)) * 100) / 100;
                                        }
                                        else {
                                            group.data[0].iznos_porez = Math.round(Math.ceil(group.data[0].kolicina) * group.data[0].cijena * (group.data[0].stopa / 100) * 100) / 100;
                                        }

                                        this.storage.addItemToArray(nar.stavke, group.data[0])
                                    }

                                });

                                //console.log(data)

                                // noviartikli.forEach(element => {
                                //     let stavka = this.storage.filterCollectionSingleValue(this.storage.filterCollectionWherePopertGreatherThan(nar.stavke, 'kolicina', 0), 'robaid', element.robaid);
                                //     console.log(stavka)
                                //     if (stavka.length > 0) {
                                //         if (stavka.kolicina > 0) {
                                //             console.log(stavka)
                                //             //ovo se radi zbog nosiljki i bačvi koje zaokružujemo na cijeli broj
                                //             //let kolicina: number = Number(ambalaza ? ambalaza.kolicina_old / ambalaza.faktor : 0) + stavka.kolicina / r.faktor

                                //             stavka.kolicina += Math.ceil(kolicina);
                                //             stavka.iznos_neto = Math.ceil(stavka.kolicina) * stavka.cijena;
                                //             stavka.iznos_osnovica = Math.ceil(stavka.kolicina) * stavka.cijena;

                                //             if (vrstaDok === "MP") {
                                //                 stavka.iznos_porez = Math.ceil(stavka.kolicina) * stavka.cijena - (Math.ceil(stavka.kolicina) * stavka.cijena) / (1 + stavka.stopa / 100)
                                //             }
                                //             else {
                                //                 stavka.iznos_porez = Math.ceil(stavka.kolicina) * stavka.cijena * (stavka.stopa / 100)
                                //             }

                                //             //console.log(sta.iznos_porez)
                                //         }

                                //     }
                                //     else
                                //         this.storage.addItemToArray(nar.stavke, element)

                                // });
                                //console.log(nar)
                            }
                        });
                    }

                    return narudzbe
                })
                .then((res) => {
                    //console.log("ambalaza zavrsila")
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }


    dodajAmbalazuBck(pronarudzbeglaid, kolicina?: number): Promise<Response> {
        //console.log("dodavanje ambalaze za artikl!!!!")
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    //console.log(val)
                    let narudzbe = <Array<INarudzba.Narudzba>>val;
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {

                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid);
                                vrstaDok = vrstaDok ? vrstaDok.oznaka : null

                                //console.log(nar)
                                //filtriraj  JMrobu where robaid je ova sa stavki narudzbe

                                nar.stavke.forEach(stavka => {
                                    console.log("foreach stavka !!!")
                                    let jmrobe = this.storage.filterCollection(this.sifarniciServis.JMroba, 'robaid', stavka.robaid);
                                    //console.log(jmrobe)
                                    if (jmrobe != null && jmrobe.length > 0) {
                                        jmrobe.forEach(r => {

                                            let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', r.povratrobaid);
                                            let cijena = 0;
                                            let iznos_porez = 0;

                                            if (vrstaDok === "MP") {
                                                cijena = roba ? roba.mp_cijena : 0;
                                                iznos_porez = Math.round((Math.ceil(stavka.kolicina / r.faktor) * cijena - (Math.ceil(stavka.kolicina / r.faktor) * cijena) / (1 + roba.stopa / 100)) * 100) / 100;
                                            }
                                            else {
                                                cijena = roba ? roba.vp_cijena : 0;
                                                iznos_porez = Math.round(Math.ceil(stavka.kolicina / r.faktor) * cijena * (roba.stopa / 100) * 100) / 100;
                                            }


                                            let orderaneStavke = this.storage.orderItemsBy(nar.stavke, 'pronarudzbedetid', 'asc');
                                            //dohvati zadnji array element (s najvecim brojem dokumenta) i uvecaj ga za 1
                                            let zadnjaStavka = this.storage.getLastArrayElement(orderaneStavke);

                                            let novaStavka: INarudzba.NarudzbaStavka = {
                                                jm: r.jm,
                                                cijena: cijena,
                                                faktor: r.faktor,
                                                kolicina: Math.ceil(stavka.kolicina / r.faktor),
                                                kolicina_old: stavka.kolicina,
                                                robaid: r.povratrobaid,
                                                rabat: 0,
                                                nak_zbrinjavanje: 0,
                                                nak_trosarina: 0,
                                                nak_poticaj: 0,
                                                iznos_neto: Math.round(Math.ceil(stavka.kolicina / r.faktor) * cijena * 100) / 100,
                                                iznos_rabat: 0,
                                                iznos_osnovica: Math.round(Math.ceil(stavka.kolicina / r.faktor) * cijena * 100) / 100,
                                                iznos_porez: iznos_porez,
                                                pov_nak_ind: 1,
                                                pov_nak_iznos: 0,
                                                pov_nak_sysind: 1,
                                                pronarudzbedetid: zadnjaStavka ? Number(zadnjaStavka.pronarudzbedetid) + 1 : 1,
                                                odgoda: 0,
                                                stopa: roba ? roba.stopa : 0
                                            }


                                            //provjeri postoji li u listi stavaka vec ambalaza

                                            let ambalaza = this.storage.filterCollectionSingleValue(this.storage.filterCollectionWherePopertGreatherThan(nar.stavke, 'kolicina', 0), 'robaid', r.povratrobaid);

                                            //console.log(ambalaza)

                                            nar.stavke.forEach(sta => {
                                                //console.log("foreach stavke  for petlja")
                                                //ako postoji uvecaj kolicinu i rekalkuliraj stavke koje imaju
                                                if (sta.robaid === r.povratrobaid) {
                                                    if (sta.kolicina > 0) {
                                                        //ovo se radi zbog nosiljki i bačvi koje zaokružujemo na cijeli broj
                                                        let kolicina: number = Number(ambalaza ? ambalaza.kolicina_old / ambalaza.faktor : 0) + stavka.kolicina / r.faktor

                                                        sta.kolicina = Math.ceil(kolicina);
                                                        sta.iznos_neto = Math.round(Math.ceil(kolicina) * cijena * 100) / 100;
                                                        sta.iznos_osnovica = Math.round(Math.ceil(kolicina) * cijena * 100) / 100;

                                                        if (vrstaDok === "MP") {
                                                            sta.iznos_porez = Math.round((Math.ceil(kolicina) * cijena - (Math.ceil(kolicina) * cijena) / (1 + roba.stopa / 100)) * 100) / 100;
                                                        }
                                                        else {
                                                            sta.iznos_porez = Math.round(Math.ceil(kolicina) * cijena * (roba.stopa / 100) * 100) / 100;
                                                        }

                                                        //console.log(sta.iznos_porez)
                                                    }

                                                }
                                            })


                                            //console.log(povratna)
                                            if (Object.keys(ambalaza).length == 0 || (Object.keys(ambalaza).length > 0 && ambalaza.kolicina < 0)) {
                                                //insert novu povratnu
                                                this.storage.addItemToArray(nar.stavke, novaStavka)
                                            }

                                            //this.storage.addItemToArray(nar.stavke, novaStavka)
                                        });
                                    }
                                })
                                //console.log(this.narudzba)




                            }
                        });
                    }
                    //console.log(narudzbe)
                    return narudzbe
                })
                .then((res) => {
                    //console.log("ambalaza zavrsila")
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }

    insertAmbalazaPovrat(pronarudzbeglaid, vrsta): Promise<Response> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

                    let narudzbe = <Array<INarudzba.Narudzba>>val;
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                //filtriraj  JMrobu where robaid je ova sa stavki narudzbe
                                let noviartikli = [];

                                nar.stavke.forEach(stavka => {
                                    let jmrobe = this.storage.filterCollection(this.sifarniciServis.JMroba, 'robaid', stavka.robaid);
                                    if (jmrobe != null && jmrobe.length > 0) {
                                        jmrobe.forEach(r => {

                                            let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', r.povratrobaid);
                                            let cijena = 0;
                                            let iznos_porez = 0;

                                            if (vrsta === "MP") {
                                                cijena = roba ? roba.mp_cijena : 0;
                                                iznos_porez = Math.round((-1 * Math.ceil(stavka.kolicina / r.faktor) * cijena - (-1 * Math.ceil(stavka.kolicina / r.faktor) * cijena) / (1 + roba.stopa / 100)) * 100) / 100;
                                            }
                                            else {
                                                cijena = roba ? roba.vp_cijena : 0;
                                                iznos_porez = Math.round(-1 * Math.ceil(stavka.kolicina / r.faktor) * cijena * (roba.stopa / 100) * 100) / 100
                                            }


                                            let orderaneStavke = this.storage.orderItemsBy(nar.stavke, 'pronarudzbedetid', 'asc');
                                            //dohvati zadnji array element (s najvecim brojem dokumenta) i uvecaj ga za 1
                                            let zadnjaStavka = this.storage.getLastArrayElement(orderaneStavke);

                                            let novaStavka: INarudzba.NarudzbaStavka = {
                                                jm: r.jm,
                                                cijena: cijena,
                                                faktor: r.faktor,
                                                kolicina: -1 * Math.ceil(stavka.kolicina / r.faktor),
                                                kolicina_old: stavka.kolicina,
                                                robaid: r.povratrobaid,
                                                rabat: 0,
                                                nak_zbrinjavanje: 0,
                                                nak_trosarina: 0,
                                                nak_poticaj: 0,
                                                iznos_neto: Math.round(-1 * Math.ceil(stavka.kolicina / r.faktor) * cijena * 100) / 100,
                                                iznos_rabat: 0,
                                                iznos_osnovica: Math.round(-1 * Math.ceil(stavka.kolicina / r.faktor) * cijena * 100) / 100,
                                                iznos_porez: iznos_porez,
                                                pov_nak_ind: 0,
                                                pov_nak_sysind: 1,
                                                pov_nak_iznos: 0,
                                                pronarudzbedetid: zadnjaStavka ? Number(zadnjaStavka.pronarudzbedetid) + 1 + noviartikli.length : 1,
                                                odgoda: 0,
                                                stopa: roba ? roba.stopa : 0
                                            }

                                            noviartikli.push(novaStavka);


                                            // let vracenaambalaza = this.storage.filterCollectionSingleValue(this.storage.filterCollectionWherePopertLessThan(nar.stavke, 'kolicina', 0), 'robaid', r.povratrobaid);
                                            // //console.log("vracena ambalaza")
                                            // //console.log(vracenaambalaza)
                                            // nar.stavke.forEach(sta => {
                                            //     if (sta.robaid === r.povratrobaid && sta.kolicina < 0) {
                                            //         if (sta.kolicina < 0) {
                                            //             let kolicina: number = -1 * Number(vracenaambalaza ? vracenaambalaza.kolicina_old / vracenaambalaza.faktor : 0) + -1 * stavka.kolicina / r.faktor
                                            //             //console.log(kolicina)
                                            //             //console.log(Math.ceil(kolicina))
                                            //             sta.kolicina = Math.ceil(kolicina);
                                            //             sta.iznos_neto = Math.ceil(kolicina) * cijena;
                                            //             sta.iznos_osnovica = Math.ceil(kolicina) * cijena;

                                            //             if (vrsta === "MP") {
                                            //                 sta.iznos_porez = Math.ceil(kolicina) * cijena - (Math.ceil(kolicina) * cijena) / (1 + roba.stopa / 100)
                                            //             }
                                            //             else {
                                            //                 sta.iznos_porez = Math.ceil(kolicina) * cijena * (roba.stopa / 100)
                                            //             }

                                            //         }

                                            //     }
                                            // })

                                            // //console.log(povratna)
                                            // if (Object.keys(vracenaambalaza).length == 0 || (Object.keys(vracenaambalaza).length > 0 && vracenaambalaza.kolicina > 0)) {
                                            //     //console.log("insert ambalaze")
                                            //     //insert novu povratnu
                                            //     this.storage.addItemToArray(nar.stavke, novaStavka)
                                            // }
                                            // else{
                                            //     //update kolicine na stavkama, samo ako su -
                                            //     vracenaambalaza.forEach(element => {
                                            //         if(element.kolicina < 0){
                                            //             console.log("manja od njule")
                                            //             console.log(element)
                                            //         }


                                            //     });
                                            // }

                                            //this.storage.addItemToArray(nar.stavke, novaStavka)

                                        });
                                    }
                                })

                                //console.log(this.narudzba)
                                //console.log(noviartikli)

                                let data = _(noviartikli).groupBy(x => x.robaid).map((value, key) => ({ robaid: Number(key), data: value })).value();

                                data.forEach(group => {
                                    let kolicina: number = 0;
                                    group.data.forEach(item => {
                                        kolicina += item.kolicina;
                                    });

                                    group.kolicina = kolicina;

                                    if (group.data.length > 0) {

                                        group.data[0].kolicina = group.kolicina
                                        group.data[0].iznos_neto = Math.round(Math.ceil(group.data[0].kolicina) * group.data[0].cijena * 100) / 100;
                                        group.data[0].iznos_osnovica = Math.round(Math.ceil(group.data[0].kolicina) * group.data[0].cijena * 100) / 100;

                                        if (vrsta === "MP") {
                                            group.data[0].iznos_porez = Math.round((Math.ceil(group.data[0].kolicina) * group.data[0].cijena - (Math.ceil(group.data[0].kolicina) * group.data[0].cijena) / (1 + group.data[0].stopa / 100)) * 100) / 100;
                                        }
                                        else {
                                            group.data[0].iznos_porez = Math.round(Math.ceil(group.data[0].kolicina) * group.data[0].cijena * (group.data[0].stopa / 100) * 100) / 100
                                        }

                                        this.storage.addItemToArray(nar.stavke, group.data[0])
                                    }

                                });

                                //console.log(data)

                            }
                            //console.log(nar)
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


    insertPovratnaNaknada(pronarudzbeglaid): Promise<Response> {
        //console.log("dodavanje povratne naknade!")
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

                    let narudzbe = <Array<INarudzba.Narudzba>>val;
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {

                                //console.log(nar.stavke)
                                let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid);
                                vrstaDok = vrstaDok ? vrstaDok.oznaka : null

                                if (vrstaDok === "VP") {
                                    //filtriraj  robu where robaid je ova sa stavki narudzbe i robaid = roba.povnak_robaid
                                    //console.log("vp !!")
                                    nar.stavke.forEach(stavka => {

                                        let artikl = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                                        let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', artikl ? artikl.pov_nak_robaid : null);

                                        if (Object.keys(roba).length != 0) {
                                            let cijena = 0;
                                            //let iznos_porez = 0;

                                            cijena = roba ? roba.vp_cijena : 0;
                                            //iznos_porez = stavka.kolicina * cijena * (roba.stopa / 100)
                                            //console.log(cijena)
                                            //console.log(stavka)
                                            let orderaneStavke = this.storage.orderItemsBy(nar.stavke, 'pronarudzbedetid', 'asc');
                                            //dohvati zadnji array element (s najvecim brojem stavke) i uvecaj ga za 1
                                            let zadnjaStavka = this.storage.getLastArrayElement(orderaneStavke);

                                            let novaStavka: INarudzba.NarudzbaStavka = {
                                                jm: roba ? roba.jm : null,
                                                cijena: cijena,
                                                kolicina: stavka.kolicina,
                                                robaid: roba.robaid,
                                                rabat: 0,
                                                nak_zbrinjavanje: 0,
                                                nak_trosarina: 0,
                                                nak_poticaj: 0,
                                                iznos_neto: Math.round(stavka.kolicina * cijena * 100) / 100,
                                                iznos_rabat: 0,
                                                iznos_osnovica: Math.round(stavka.kolicina * cijena * 100) / 100,
                                                iznos_porez: Math.round(stavka.kolicina * cijena * (roba.stopa / 100) * 100) / 100,
                                                pov_nak_ind: 1,
                                                pov_nak_sysind: 1,
                                                pov_nak_iznos: 0,
                                                pronarudzbedetid: zadnjaStavka ? Number(zadnjaStavka.pronarudzbedetid) + 1 : 1,
                                                odgoda: 0,
                                                stopa: roba ? roba.stopa : 0
                                            }

                                            //provjeri postoji li u listi stavaka vec povratna
                                            let povratna = this.storage.filterMultiCollectioSingleValue(nar.stavke, { 'robaid': roba.robaid, 'cijena': cijena });
                                            nar.stavke.forEach(sta => {
                                                if (sta.robaid === roba.robaid) {
                                                    //console.log("postoji povratna u artiklima")
                                                    let kolicina: number = Number(povratna ? povratna.kolicina : 0) + stavka.kolicina
                                                    sta.iznos_neto = Math.round(kolicina * cijena * 100) / 100,
                                                        sta.iznos_osnovica = Math.round(kolicina * cijena * 100) / 100,
                                                        sta.iznos_porez = Math.round(kolicina * cijena * (roba.stopa / 100) * 100) / 100,
                                                        sta.kolicina = kolicina;
                                                }
                                            })

                                            //console.log(povratna)
                                            if (Object.keys(povratna).length == 0) {
                                                //console.log("insert povratne")
                                                //insert novu povratnu
                                                this.storage.addItemToArray(nar.stavke, novaStavka)
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                    return narudzbe
                })
                .then((res) => {
                    //console.log("povratna  zavrsila")
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }



    getNarudzbeCount(): Promise<Response> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    resolve(val);
                }, (error) => {
                    reject(error);
                });
        });
    }


    save(narudzba: INarudzba.Narudzba): Promise<any> {
        //console.log("save")
        //console.log(narudzba)
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    //console.log(narudzba)
                    if (!narudzbe)
                        narudzbe = [];
                    //this.countNarudzbi =
                    this.storage.addItemToArray(narudzbe, narudzba)
                    return narudzbe;
                })
                .then((res) => {
                    return this.storage.addToStorage(key.keyvalue, null, res, true)
                })
                .then((res) => {
                    resolve(narudzba.pronarudzbeglaid)
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }



    update(narudzba: INarudzba.Narudzba, id: number): Promise<Response> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === id) {
                                nar.nacinplacanjaid = narudzba.nacinplacanjaid
                                nar.opis = narudzba.opis
                                nar.datumdok = narudzba.datumdok
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
    updatePrijenosind(narudzba: INarudzba.Narudzba, id: number): Promise<Response> {

      let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
      //dohvati sve stavke narudzbe
      //update
      return new Promise((resolve, reject) => {
          this.dataServis.getAllNarudzbe()
              .then((narudzbe) => {
                  if (narudzbe) {
                      narudzbe.forEach((nar) => {
                          if (nar.pronarudzbeglaid === id) {
                              nar.prijenosind = narudzba.prijenosind;
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



    updateStornoDokStatus(razlog: string, pronarudzbeglaid: number): Promise<Response> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                nar.storno = 1
                                nar.opis = razlog
                                nar.brojstorno = null
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

    //kod brisanja dokumenata sa donosa vrati status i sve stavke
    resetirajDokument(id: number): Promise<Response> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //delete
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === id) {
                                nar.status = 0
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


    delete(id: number, vrstadokid: number): Promise<Response> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        //delete

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe && narudzbe.length > 0) {

                        let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', vrstadokid);
                        //console.log(vrstaDok)
                        //     //TO DO provjeriti vrstadok id je utvrdo!!!!
                        if (vrstaDok != null && vrstaDok.oznaka === "VP") {
                            //filtriraj narudzbe gdje je vrstadokid  i status = 1
                            let dokumenti = this.storage.filterCollection(this.storage.filterCollection(narudzbe, 'vrstadokid', vrstadokid), 'status', 1);
                            //console.log(dokumenti)
                            //order listu dokumenata po pronarudzbeglaid koloni
                            dokumenti = this.storage.orderItemsBy(dokumenti, 'brojdok', 'asc');

                            console.log(dokumenti)
                            //dohvati zadnji array element (s najvecim brojem dokumenta)
                            let narudzba = this.storage.getLastArrayElement(dokumenti);

                            if (narudzba != null && narudzba.pronarudzbeglaid === id) {
                                var index = this.storage.findArrayIndex(narudzbe, "pronarudzbeglaid", id)
                                narudzbe.splice(index, 1);
                            }
                            else {
                                this.helper.presentToast("Dokument se ne može obrisati, morate prvo obrisati dokument broj: " + narudzba.broj, null, 5000);
                                return null;
                            }
                        }
                        else {
                            var index = this.storage.findArrayIndex(narudzbe, "pronarudzbeglaid", id)
                            narudzbe.splice(index, 1);
                        }

                    }
                    return narudzbe
                })
                .then((res) => {
                    if (res)
                        resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                    else
                        resolve(null)
                }
                    , (error) => {
                        reject(error);
                    });
        });

    }


    otkaziDokument(id: number, vrstadokid: number): Promise<Response> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //delete
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {

                        let narudzba = this.storage.filterCollectionSingleValue(narudzbe, 'pronarudzbeglaid', id)
                        //console.log(narudzba)
                        let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', vrstadokid);
                        //     //console.log(vrstaDok)
                        //     //TO DO provjeriti vrstadok id je utvrdo!!!!
                        if (vrstaDok != null && vrstaDok.oznaka === "VP" && narudzba != null && narudzba.status === 1) {
                            //filtriraj narudzbe gdje je vrstadokid  i status = 1
                            let dokumenti = this.storage.filterCollection(this.storage.filterCollection(narudzbe, 'vrstadokid', vrstadokid), 'status', 1);
                            //console.log(dokumenti)
                            //order listu dokumenata po pronarudzbeglaid koloni
                            dokumenti = this.storage.orderItemsBy(dokumenti, 'brojdok', 'asc');

                            //console.log(dokumenti)
                            //dohvati zadnji array element (s najvecim brojem dokumenta)
                            let narudzba = this.storage.getLastArrayElement(dokumenti);

                            if (narudzba != null && narudzba.pronarudzbeglaid === id)
                                narudzbe.forEach((nar) => {
                                    if (nar.pronarudzbeglaid === id) {
                                        nar.status = 3
                                    }
                                });
                            else {
                                this.helper.presentToast("Dokument se ne može otkazati, morate prvo otkazati dokument broj: " + narudzba.broj, null, 5000);
                                return null;
                            }
                        }
                        else
                            narudzbe.forEach((nar) => {
                                if (nar.pronarudzbeglaid === id) {
                                    nar.status = 3
                                }
                            });

                    }
                    return narudzbe
                })
                .then((res) => {
                    if (res)
                        resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                    else
                        resolve(null)
                }
                    , (error) => {
                        reject(error);
                    });
        });

    }

    deleteWherePovNakInd(pronarudzbeglaid): Promise<Response> {
        //console.log("brišem gdje je pov nak ind = 1")
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //delete
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid && nar.stavke && nar.stavke.length > 0) {
                                //pronađi index
                                let povratnestavke = this.storage.filterCollection(nar.stavke, 'pov_nak_ind', 1);
                                if (Object.keys(povratnestavke).length != 0) {
                                    povratnestavke.forEach(stavka => {
                                        var index = this.storage.findArrayIndex(nar.stavke, "pronarudzbedetid", stavka.pronarudzbedetid)
                                        nar.stavke.splice(index, 1);
                                    });
                                }

                            }
                        });
                    }
                    return narudzbe
                })
                .then((res) => {
                    //console.log("brisanje gotovo")
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }

    //provjera cijena da nisu 0 i * kolicina iznos da nije 0
    checkNarudzaCijene(pronarudzbeglaid): Promise<boolean> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //delete
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid && nar.stavke && nar.stavke.length > 0) {
                                nar.stavke.forEach(stavka => {
                                    if(Number(stavka.cijena) <= 0 || Number(stavka.kolicina) == 0)
                                        resolve(false)
                                });

                            }
                        });
                    }
                    resolve(true)
                }
                , (error) => {
                    console.log(error)
                    reject(false);
                });
          });

    }



    isprazniNarudzbe(): Promise<Response> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //delete
        return new Promise((resolve, reject) => {
            this.narudzbe = [];
            resolve(this.storage.addToStorage(key.keyvalue, null, this.narudzbe, true))

        });

    }


    getBrojDokumenta(vrstadokid: number): Promise<number> {
        //dohvati zadnju narudzbu iz arraya narudzbi i broj uvecaj za 1
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

                    let vrstaDokOznaka = null;
                    let sufix = "";
                    let prefix = "";
                    let vrstadokzadnji = null;

                    try {
                        //filtriraj narudzbe gdje je vrstadokid  i status <> 0
                        let dokumenti = this.storage.filterCollectionWherePopertyNotEqual(this.storage.filterCollectionWherePopertyNotEqual(this.storage.filterCollection(val, 'vrstadokid', vrstadokid), 'status', 0), 'status', 3);
                        //console.log(dokumenti)
                        //order listu dokumenata po pronarudzbeglaid koloni
                        dokumenti = this.storage.orderItemsBy(dokumenti, 'brojdok', 'asc');

                        //console.log(dokumenti)
                        //dohvati zadnji array element (s najvecim brojem dokumenta) i uvecaj ga za 1
                        let narudzba = this.storage.getLastArrayElement(dokumenti);

                        let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', vrstadokid);

                        vrstaDokOznaka = vrstaDok ? vrstaDok.oznaka : null
                        vrstadokzadnji = vrstaDok ? vrstaDok.zadnji : null

                        if (vrstaDokOznaka != null && vrstaDokOznaka === "VP")
                            sufix = "-H";

                        var date = new Date();
                        prefix = date.getFullYear().toString() + "-" + this.userProvider.loginInfo.terminal + "-";
                        let newBrDok = narudzba ? (Number(narudzba.brojdok) + 1).toString() : (Number(vrstadokzadnji) + 1).toString();
                        this.newbrojdok = Number(newBrDok);
                        this.newbroj = prefix + this.pad(Number(this.newbrojdok), 6) + sufix;
                    }
                    catch (error) {
                        this.newbrojdok = Number(this.generateUUID());

                    }


                    resolve(this.newbrojdok);
                }, (error) => {
                    reject(error);
                });
        });

    }

    getIdNovogDokumenta(): Promise<any> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    if (val)
                        //order listu dokumenata po pronarudzbeglaid koloni
                        val = this.storage.orderItemsBy(val, 'pronarudzbeglaid', 'asc');
                    //dohvati zadnji array element (s najvecim brojem dokumenta) i uvecaj ga za 1
                    val = this.storage.getLastArrayElement(val);
                    this.newPronarudzbeglaid = val ? Number(val.pronarudzbeglaid) + 1 : 1;
                    resolve(val);
                }, (error) => {
                    reject(error);
                });
        });
    }


    stornirajDokument(pronarudzbeglaid, razlog: string): Promise<any> {
        //let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {

            this.getNarudzba(pronarudzbeglaid)
                .then((narudzba) => {
                    var date = new Date();

                    //console.log(narudzba)
                    if (narudzba) {
                        narudzba.storno = 1;
                        narudzba.opis = razlog

                        narudzba.pronarudzbeglaid = this.newPronarudzbeglaid;
                        narudzba.status = 1;
                        narudzba.datumdok = new Date()
                        narudzba.datum_zaprimanja = new Date()
                        //narudzba.datumdok =  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()))
                        //narudzba.datum_zaprimanja =  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()))
                        narudzba.prijenosind = 0
                        narudzba.iznos_neto *= -1;
                        narudzba.iznos_osnovica *= -1;
                        narudzba.iznos_porez *= -1;
                        narudzba.iznos_rabat *= -1;

                        //postavi fiskal stvari na prazno
                        narudzba.jir = null;
                        narudzba.kod = null;
                        narudzba.fuuid = null;
                        narudzba.fiskalnibroj = null;
                        narudzba.uuid = this.generateUUID()

                        //za svaku stavku u minus
                        narudzba.stavke.forEach(stavka => {
                            stavka.kolicina *= -1;
                            stavka.iznos_neto *= -1;
                            stavka.iznos_osnovica *= -1;
                            stavka.iznos_porez *= -1;
                            stavka.iznos_rabat *= -1;
                            stavka.pov_nak_iznos *= -1;
                        });

                    }
                    return narudzba
                })
                .then((narudzba) => {
                    this.getBrojDokumenta(narudzba.vrstadokid).then((res) => {
                        narudzba.broj = this.newbroj ? this.newbroj : ""
                        narudzba.brojstorno = narudzba.broj + ' -S'
                        narudzba.brojdok = this.newbrojdok ? this.newbrojdok : null
                        narudzba.fiskalnibroj = this.getFiskalniBroj(narudzba.brojdok, narudzba.vrstadokid)
                        resolve(narudzba)
                    })

                }
                    , (error) => {
                        reject(error);
                    });

        });
    }

    getFinData(pronarudzbeglaid: number): Promise<INarudzba.NarudzbaFinData> {
        //dohvati fin data
        //console.log("fin data")
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    let finData: INarudzba.NarudzbaFinData = null;
                    let narudzbe = <Array<INarudzba.Narudzba>>val;
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                let odgoda = this.storage.getMaxPropertyValueFromArray(nar.stavke, 'odgoda');
                                odgoda = odgoda ? odgoda.odgoda : 0;

                                let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid);

                                let osnovica: number = 0;
                                //console.log(nar)
                                nar.iznos_neto = 0;
                                nar.iznos_rabat = 0;
                                nar.iznos_osnovica = 0;
                                nar.iznos_porez = 0;
                                nar.iznos_ukupno = 0;
                                nar.stavke.forEach(stavka => {
                                    let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                                    if (Object.keys(roba).length != 0) {

                                        if (vrstaDok.oznaka === "VP") {
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
                                            nar.iznos_ukupno += stavka.iznos_osnovica;

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
                                if (vrstaDok.oznaka === "VP") {
                                    let data = _(nar.stavke).groupBy(x => x.stopa).map((value, key) => ({ stopa: Number(key), data: value })).value();

                                    data.forEach(group => {
                                        let osnovicagroup: number = 0;
                                        group.data.forEach(item => {
                                            osnovicagroup += item.iznos_osnovica;
                                            osnovicagroup = Math.round(osnovicagroup * 100) / 100
                                            //console.log(osnovicagroup)
                                        });

                                        group.iznos_porez = Math.round(osnovicagroup * group.stopa / 100 * 100) / 100;
                                        osnovica += group.iznos_porez;
                                        osnovica = Math.round(osnovica * 100) / 100
                                        //console.log(osnovica)

                                    });
                                    nar.iznos_porez += osnovica;
                                    nar.iznos_ukupno += nar.iznos_osnovica + nar.iznos_porez;
                                    nar.iznos_porez = Math.round(nar.iznos_porez * 100) / 100
                                    nar.iznos_ukupno = Math.round(nar.iznos_ukupno * 100) / 100

                                    //console.log("iznos poreza " + nar.iznos_porez)
                                    //console.log("iznos ukupno " + nar.iznos)
                                }



                                // let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid);
                                // vrstaDok = vrstaDok ? vrstaDok.oznaka : null
                                // console.log(narudzbe)
                                // let odgoda = this.storage.getMaxPropertyValueFromArray(nar.stavke, 'odgoda');
                                // //console.log(odgoda);
                                // odgoda = odgoda ? odgoda.odgoda : 0;
                                // let iznos_neto = 0;
                                // let iznos_rabat = 0;
                                // let iznos_osnovica = 0;
                                // let iznos_porez = 0;
                                // let iznos_ukupno = 0;


                                // nar.stavke.forEach(stavka => {
                                //     let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                                //     if (Object.keys(roba).length != 0) {
                                //         iznos_neto += stavka.iznos_neto // + (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                //         //console.log(iznos_neto)
                                //         iznos_rabat += stavka.iznos_rabat;
                                //         iznos_osnovica += stavka.iznos_osnovica //+ (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                //         iznos_porez += stavka.iznos_porez;
                                //         iznos_ukupno += stavka.iznos_osnovica + (vrstaDok === "MP" ? /*(stavka.kolicina * (roba ? roba.pov_nak_iznos : 0))*/ 0 : stavka.iznos_porez);
                                //     }

                                // });


                                //console.log(nar)

                                finData = {
                                    odgoda: odgoda,
                                    iznos_neto: nar.iznos_neto,
                                    iznos_osnovica: nar.iznos_osnovica,
                                    iznos_porez: nar.iznos_porez,
                                    iznos_rabat: nar.iznos_rabat,
                                    iznos_ukupno: nar.iznos_ukupno
                                }

                                //console.log(finData)
                            }
                            else
                                this.narudzba.iznos = 0;
                        });
                    }
                    resolve(finData)
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }

    //ne koristi se
    recalcZaglavljeData(pronarudzbeglaid: number): Promise<Response> {
        //dohvati fin data

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

                    let narudzbe = <Array<INarudzba.Narudzba>>val;
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                let vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', nar.vrstadokid);
                                vrstaDok = vrstaDok ? vrstaDok.oznaka : null
                                //console.log(vrstaDok)
                                let odgoda = this.storage.getMaxPropertyValueFromArray(nar.stavke, 'odgoda');
                                //console.log(odgoda);
                                odgoda = odgoda ? odgoda.odgoda : 0;
                                let iznos_neto = 0;
                                let iznos_rabat = 0;
                                let iznos_osnovica = 0;
                                let iznos_porez = 0;
                                let iznos_ukupno = 0;
                                nar.stavke.forEach(stavka => {
                                    let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);

                                    if (Object.keys(roba).length != 0) {
                                        iznos_neto += stavka.iznos_neto + (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                        //console.log(iznos_neto)
                                        iznos_rabat += stavka.iznos_rabat;
                                        iznos_osnovica += stavka.iznos_osnovica + (roba ? roba.pov_nak_iznos : 0) * stavka.kolicina;
                                        iznos_porez += stavka.iznos_porez;
                                        iznos_ukupno += stavka.iznos_osnovica + (vrstaDok === "MP" ? (stavka.kolicina * (roba ? roba.pov_nak_iznos : 0)) : stavka.iznos_porez);
                                    }

                                });

                                nar.odgoda = odgoda;
                                nar.iznos_neto = iznos_neto;
                                nar.iznos_osnovica = iznos_osnovica;
                                nar.iznos_porez = iznos_porez;
                                nar.iznos_rabat = iznos_rabat;
                                nar.iznos_ukupno = iznos_ukupno;

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


    zakljuciDokument(pronarudzbeglaid, finData: INarudzba.NarudzbaFinData): Promise<Response> {
        //console.log(pronarudzbeglaid)
        //console.log("zakljuci")
        //console.log(finData)
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        var date = new Date();
                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                nar.status = nar.vrstadokid === 78 ? 1 : 2
                                nar.iznos_neto = finData ? finData.iznos_neto : 0
                                nar.iznos_rabat = finData ? finData.iznos_rabat : 0
                                nar.iznos_osnovica = finData ? finData.iznos_osnovica : 0
                                nar.iznos_ukupno = finData ? finData.iznos_ukupno : 0
                                nar.odgoda = finData ? finData.odgoda : 0
                                nar.iznos_porez = finData ? finData.iznos_porez : 0
                                nar.datum_zaprimanja = new Date()
                                //nar.datum_zaprimanja =  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()))
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

    getFiskalniBroj(brojDok: number, vrstadokid: number): string {
        //console.log(brojDok)
        let sufix = '1';
        let vrstaDok = null;

        // try {

        //     vrstaDok = this.storage.filterCollectionSingleValue(this.sifarniciServis.vrstadok, 'vrstadokid', vrstadokid);
        //     //console.log(vrstaDok)
        //     //TO DO provjeriti vrstadok id je utvrdo!!!!
        //     if (vrstaDok != null && vrstaDok.oznaka === "VP")
        //         sufix = '2';
        // }
        // catch (error) {

        // }

        let broj = brojDok + '/' + this.userProvider.loginInfo.oznakatrgovine + '/' + sufix
        return broj;
    }


    pad(num: number, size: number): string {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }


    //slanje dokumenta na servis
    fiskalizirajDokument(pronarudzbeglaid: number): Promise<any> {
        let iznos = null;
        let brojdok = null;
        let datum = null;
        return new Promise((resolve, reject) => {
            //dohvati zaglavlje i stavke narudzbi i kreiraj Json

            this.getNarudzba(pronarudzbeglaid)
                .then((nar) => {
                    //console.log(nar)
                    return this.createBodyRequestRacuni(nar)
                })
                .then((res) => {
                    //console.log("send racun")
                    iznos = res.iznos_neto;
                    brojdok = res.brojdok;
                    datum = res.datum_zaprimanja;
                    return this.sendRacun(res);
                })
                // .then((res) => {
                //     console.log(res)
                //     return this.processResponse(res, pronarudzbeglaid)
                // })
                .then((res) => {
                   // console.log("update")

                    return this.updateRacunStatus(res, pronarudzbeglaid)
                })
                .then((res) => resolve(res))
                .catch(err => {
                    //console.log("greska")
                    //console.log(err)

                    let response;
                    //ako nije uspjela fiskalizacija izracunaj rucno ZKI

                    if (err._body != null && typeof err._body === "string") {
                        let json = this.isJson(err._body)
                        if (json)
                            response = JSON.parse(err._body);
                        else
                            response = err._body;
                    }

                    let res: { Success: Boolean, Kod: string } = {
                        Success: false,
                        Kod: "0d022ebf711eccb0bade18241783779354b"
                    };

                    //ako su greške return fejk response sa ZKI jem kako bi mogli zakljuciti i izdati račun.
                    let oib = this.userProvider.loginInfo.oib;
                    let poslovniProstor = this.userProvider.loginInfo.oznakatrgovine;
                    let naplatniUredjaj = this.userProvider.loginInfo.kasa;

                    if (response && response.Success === true && response.Kod != null && response.Kod != "") {
                        res.Kod = response.Kod;
                    }
                    else
                        this.zkiService.calculateZKI(oib, brojdok, poslovniProstor, naplatniUredjaj, iznos, datum)
                            .then((val) => {
                                res.Kod = val as string;
                            })
                            .catch((err) => {
                                res.Kod = "0d022ebf711eccb0bade18241783779354b";
                            })

                    // if (response && response.Success === false && (response.Kod === null || response.Kod === "")) {

                    //     this.zkiService.calculateZKI(oib, brojdok, poslovniProstor, naplatniUredjaj, iznos, datum)
                    //         .then((val) => {
                    //             res.Kod = val as string;
                    //         })
                    //         .catch((err) => {
                    //             res.Kod = "0d022ebf711eccb0bade18241783779354b";
                    //         })
                    // }
                    // else if (response && response.Success === true && response.Kod != null && response.Kod != "") {
                    //     res.Kod = response.Kod;
                    // }
                    // if (response && response.Success === false && (response.Kod === null || response.Kod === "")) {
                    //     res.Kod = "0d022ebf711eccb0bade18241783779354b";
                    // }
                    // else {
                    //     res.Kod = "0d022ebf711eccb0bade18241783779354b";
                    //     //ako nema koda znaci da je nesto drugo poslo po zlu
                    //     // if(response)
                    //     //     this.global.logError(response, true)
                    //     // this.global.logError("Dogodila se greška!",true)
                    // }


                    return this.updateRacunStatus(res, pronarudzbeglaid)


                })
                .then((res) => resolve(res))

        });
    }


    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }


    //slanje narudzbi na servis
    postRequest(): Promise<any> {
        let rezult: any
        return new Promise((resolve, reject) => {
            //dohvati zaglavlje i stavke narudzbi i kreiraj Json
            this.createBodyRequestDokumenti()
                .then((res) => {
                    //console.log("send")
                    return this.sendDocuments(res)
                        .catch(Err => this.global.logError(Err, false))
                })
                .then((rez) => {
                    //console.log("rez update")
                    rezult = rez;
                    return this.updateDokumentStatus(rez)

                })
                .then((res) => resolve(rezult))
                .catch(Error => {
                    reject(Error)
                })

        });
    }



    createBodyRequestDokumenti(): Promise<INarudzba.DokumentSync[]> {
        //console.log("kreiram json")

        this.narudzbeJson = [];

        return new Promise((resolve, reject) => {

            this.NeposlaneNarudzbe.forEach((narudzba) => {
                let svestavke = [];
                narudzba.stavke.forEach((sta) => {
                    let stavka = <INarudzba.DokumentStavka>({
                        action: this.actionStavke,
                        robaid: sta.robaid,
                        cijena: sta.cijena,
                        kolicina: sta.kolicina,
                        rabat: sta.rabat,
                        iznos_netoDet: sta.iznos_neto,
                        iznos_rabatDet: sta.iznos_rabat,
                        iznos_osnovicaDet: sta.iznos_osnovica,
                        iznos_porezDet: sta.iznos_porez,
                        opisDet: sta.opis,
                        pov_nak_ind: sta.pov_nak_ind,
                        pov_nak_sysind: sta.pov_nak_sysind,
                        odgodaDet: sta.odgoda,
                        terProID: "TerProGlaid",
                        rabat1: sta.rabat1,
                        rabat2: sta.rabat2,
                        rabat3: sta.rabat3,
                        rabat4: sta.rabat4,
                        rabat5: sta.rabat5
                    });

                    svestavke.push(stavka);
                });


                let narudzbaZag = <INarudzba.DokumentSync>({
                    action: this.actionZaglavlje,
                    id: narudzba.pronarudzbeglaid,
                    datumdok: narudzba.datumdok,
                    datum_zaprimanja: narudzba.datum_zaprimanja,
                    parstruid: narudzba.parstruid,
                    opis: narudzba.opis,
                    vrstadokid: narudzba.vrstadokid,
                    nacinplacanjaid: narudzba.nacinplacanjaid,
                    operateriid: "@@operaterid",
                    broj: narudzba.broj,
                    brojdok: narudzba.brojdok,
                    uuid: narudzba.uuid,
                    prijenosind: narudzba.prijenosind,
                    broj_ispisa: narudzba.broj_ispisa,
                    storno: narudzba.storno,
                    generacija: narudzba.generacija,
                    odgoda: narudzba.odgoda,
                    iznos_neto: narudzba.iznos_neto,
                    iznos_osnovica: narudzba.iznos_osnovica,
                    iznos_porez: narudzba.iznos_porez,
                    iznos_rabat: narudzba.iznos_rabat,
                    novidokid: narudzba.narudzbeid,
                    //novo VP
                    vrijemekreiranja: narudzba.datumdok,
                    fiskalnibroj: narudzba.fiskalnibroj,
                    deviceuuid: this.variable.device.uuid,
                    stavke: svestavke
                });


                this.narudzbeJson.push(narudzbaZag)
            });

            resolve(this.narudzbeJson);
        });
    }


    createBodyRequestRacuni(narudzba: INarudzba.Narudzba): Promise<INarudzba.NarudzbaSync> {
        //console.log("kreiram json")
        //console.log(narudzba)
        let narudzbaZag = new INarudzba.NarudzbaSync();
        let ukupno = 0;
        return new Promise((resolve, reject) => {

            if (narudzba != null) {
                let svestavke = [];
                narudzba.stavke.forEach((sta) => {
                    let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', sta.robaid);
                    let stavka = <INarudzba.NarudzbaStavka>({
                        robaid: sta.robaid,
                        cijena: sta.cijena,
                        kolicina: sta.kolicina,
                        rabat: sta.rabat,
                        nak_zbrinjavanje: sta.nak_zbrinjavanje,
                        nak_trosarina: sta.nak_trosarina,
                        nak_poticaj: sta.nak_poticaj,
                        iznos_neto: sta.iznos_neto,
                        iznos_rabat: sta.iznos_rabat,
                        iznos_osnovica: sta.iznos_osnovica,
                        iznos_porez: sta.iznos_porez,
                        opis: sta.opis,
                        pov_nak_ind: sta.pov_nak_ind,
                        prometglaid: sta.pronarudzbeglaid,
                        pov_nak_sysind: sta.pov_nak_sysind,
                        pov_nak_iznos: sta.pov_nak_iznos,
                        odgoda: sta.odgoda,
                        rabat1: sta.rabat1,
                        rabat2: sta.rabat2,
                        rabat3: sta.rabat3,
                        rabat4: sta.rabat4,
                        rabat5: sta.rabat5,
                        mpcijena: sta.cijena + roba.pov_nak_iznos,
                        iznosstavkespdv: sta.iznos_osnovica + (roba ? roba.pov_nak_iznos : 0) * sta.kolicina

                    });


                    ukupno += Math.round((sta.iznos_osnovica + (roba ? roba.pov_nak_iznos : 0) * sta.kolicina) * 100) / 100;

                    svestavke.push(stavka);
                });



                narudzbaZag.pronarudzbeglaid = narudzba.pronarudzbeglaid;
                narudzbaZag.datumdok = narudzba.datumdok;
                narudzbaZag.datum_zaprimanja = narudzba.datum_zaprimanja;
                narudzbaZag.parstruid = narudzba.parstruid;
                narudzbaZag.opis = narudzba.opis;
                narudzbaZag.vrstadokid = narudzba.vrstadokid;
                narudzbaZag.nacinplacanjaid = narudzba.nacinplacanjaid;
                narudzbaZag.operaterid = "@@operaterid"
                narudzbaZag.broj = narudzba.broj
                narudzbaZag.brojdok = narudzba.brojdok
                narudzbaZag.uuid = narudzba.uuid
                narudzbaZag.prijenosind = narudzba.prijenosind
                narudzbaZag.broj_ispisa = narudzba.broj_ispisa
                narudzbaZag.storno = narudzba.storno
                narudzbaZag.status = narudzba.status
                narudzbaZag.narudzbeid = narudzba.narudzbeid
                narudzbaZag.generacija = narudzba.generacija
                narudzbaZag.odgoda = narudzba.odgoda
                narudzbaZag.iznos_neto = narudzba.iznos_neto
                narudzbaZag.iznos_osnovica = narudzba.iznos_osnovica
                narudzbaZag.iznos_porez = narudzba.iznos_porez
                narudzbaZag.iznos_rabat = narudzba.iznos_rabat
                narudzbaZag.fiskalnibroj = narudzba.fiskalnibroj
                //narudzbaZag.terminalid = nar.terminalid;
                //novo MP
                narudzbaZag.brojstavaka = narudzba.stavke.length
                narudzbaZag.ukupniiznosspdv = ukupno

                narudzbaZag.stavke = svestavke;
            }

            resolve(narudzbaZag);
        });
    }


    sendRacun(jsonObject): Promise<Response> {
        let properties: ICore.IPropertiesCore = {
            showLoader: false,
            errorMessageResponse: true,
            customApiEndPoint: "fiskal"
        }
        //console.log(jsonObject)
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "xxx",
                    "params": {
                        "narudzba": jsonObject
                    }
                }
            ]
        }
        return this
            .global
            .getData(data, properties);

    }


    sendDocuments(jsonObject): Promise<Response> {

        let properties: ICore.IPropertiesCore = {
            customApiEndPoint: 'narudzbe'
        }
        //console.log(jsonObject)
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobTerPro_Prijenos",
                    "params": {
                        "narudzbe": jsonObject
                    }
                }
            ]
        }
        return this
            .global
            .getData(data, properties);

    }




    // processResponse(res) {
    //     console.log("rezultat")
    //     console.log(res)
    //     return new Promise((resolve, reject) => {
    //         if(res && res.length > 0) {
    //             return this.updateDokumentStatus(res)
    //                 .then((res) => {
    //                     this.getNarudzba(this.pronarudzbeglaid);
    //                 })

    //         }
    //         else {
    //             console.log("greška ")
    //         }
    //         resolve(res);
    //     });
    // }

    updateDokumentStatus(res): Promise<Response> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        res.forEach(re => {
                            if (re.success === true)
                                narudzbe.forEach((nar) => {
                                    if (nar.pronarudzbeglaid === re.narudzbaID) {
                                        nar.prijenosind = 1
                                    }
                                });
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



    //ovo je metoda kad se posalje narudzba na server
    updateRacunStatus(res, pronarudzbeglaid): Promise<any> {
        //console.log(res)
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        if (res && res.Success) {
                            //console.log(1111111)
                            narudzbe.forEach((nar) => {
                                if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                    nar.status = 2
                                    nar.prijenosind = 1;
                                    nar.kod = res.Kod;
                                    nar.jir = res.JIR;
                                    nar.fiskalnibroj = res.FiskalniBroj;
                                    nar.datum_zaprimanja = res.Datumivrijeme;
                                    nar.fuuid = res.fUUID;
                                }
                            });
                        }
                        else if (res && res.Success === false && res.Kod != null && res.Kod != "") {
                            //ako je success false ali ima kod
                            //console.log(22222)
                            narudzbe.forEach((nar) => {
                                if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                    nar.status = 2
                                    nar.prijenosind = 0;
                                    nar.kod = res.Kod;
                                }
                            });
                        }
                        else {
                            //console.log(3333333)
                            return null;
                        }


                        return narudzbe
                    }
                })
                .then((res) => {
                    //console.log(res)
                    //ako je res null znaci da ne treba zakljuciti dok niti ga printati
                    if (res != null)
                        resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                    else
                        resolve(false)
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }

    updateNarudzbaBrojIspisa(pronarudzbeglaid): Promise<any> {
        //console.log(res)
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "narudzbe");
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {

                        narudzbe.forEach((nar) => {
                            if (nar.pronarudzbeglaid === pronarudzbeglaid) {
                                nar.broj_ispisa += 1
                            }
                        });
                    }
                    return narudzbe
                })
                .then((res) => {
                    //console.log(res)
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))

                }
                    , (error) => {
                        reject(error);
                    });

        });
    }

    getNeposlaneNarudzbe(id?: number): Promise<INarudzba.NarudzbaSync[]> {
        //console.log("get neposlane")
        return new Promise((resolve, reject) => {
            this.getNarudzbe()
                .then((val) => {
                    this.NeposlaneNarudzbe = [];
                    this.NeposlaneNarudzbeCnt = 0;

                    //filtriraj sve narudzbe id koje imaju stavke i prijenosind = 0
                    if (this.narudzbe && this.narudzbe.length > 0) {
                        //this.NeposlaneNarudzbe = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterMultiCollection(this.narudzbe, { 'prijenosind': 0, 'status': 2 }), 'brojstavki', 0);

                        this.NeposlaneNarudzbe = this.storage.filterCollectionWherePopertyNotEqual(this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterMultiCollection(this.narudzbe, { 'prijenosind': 0, 'status': 2 }), 'brojstavki', 0), 'vrstadokid', 78);

                        this.NeFiskaliziraniRacuni = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterMultiCollection(this.narudzbe, { 'prijenosind': 0, 'status': 2, 'vrstadokid': 78 }), 'brojstavki', 0);

                    }

                    //ako postoji id saljem samo jednu narudzbu, filtriraj je u neposlane narudzbe arraya
                    if (id)
                        this.NeposlaneNarudzbe = this.storage.filterCollection(this.NeposlaneNarudzbe, 'pronarudzbeglaid', id);

                    this.NeposlaneNarudzbeCnt = this.NeposlaneNarudzbe.length + this.NeFiskaliziraniRacuni.length;


                    //console.log(this.NeposlaneNarudzbe)
                    resolve(this.NeposlaneNarudzbe);
                }, (error) => {
                    reject(error);
                });
        });
    }

    getKomunikacijaNeposlaneNarudzbe(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getNarudzbe()
                .then((val) => {
                    this.NeposlaneNarudzbeCnt = 0;
                    //ako je zabrana ponovnog slanja dohvati samo narudzbe koje nisu poslane

                    //filtriraj sve narudzbe id koje imaju stavke i prijenosind = 0
                    if (this.narudzbe && this.narudzbe.length > 0) {
                        this.NeposlaneNarudzbe = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterMultiCollection(this.narudzbe, { 'prijenosind': 0, 'status': 2 }), 'brojstavki', 0);
                        this.NeposlaneNarudzbeCnt = this.NeposlaneNarudzbe.length;
                    }


                    //console.log(this.NeposlaneNarudzbeCnt)
                    resolve(this.NeposlaneNarudzbeCnt);
                }, (error) => {
                    reject(error);
                });
        });
    }


    getNefiskaliziraniRacuni(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getNarudzbe()
                .then((val) => {
                    let brojNefiskaliziranihRacuna: number = 0;
                    //filtriraj sve narudzbe id koje imaju stavke i prijenosind = 0
                    if (this.narudzbe && this.narudzbe.length > 0) {
                        let racuni = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterMultiCollection(this.narudzbe, { 'prijenosind': 0, 'status': 2, 'vrstadokid': 78 }), 'brojstavki', 0);
                        //console.log(racuni)
                        brojNefiskaliziranihRacuna = racuni.length;
                    }

                    resolve(brojNefiskaliziranihRacuna);
                }, (error) => {
                    reject(error);
                });
        });
    }

    getUkupnoZakljuceniDokumentiCnt(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getNarudzbe()
                .then((val) => {
                    let broj: number = 0;
                    //filtriraj sve narudzbe id koje imaju stavke i prijenosind = 0
                    if (this.narudzbe && this.narudzbe.length > 0) {
                        let dokumenti = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterCollection(this.narudzbe, 'status', 2), 'brojstavki', 0);
                        broj = dokumenti.length;
                    }


                    //console.log(this.NeposlaneNarudzbeCnt)
                    resolve(broj);
                }, (error) => {
                    reject(error);
                });
        });
    }


    generateUUID() {
        //dohvati zadnju narudzbu iz arraya narudzbi i broj uvecaj za 1

        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        return uuid;
    }




}
