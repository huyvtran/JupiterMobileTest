import { Injectable } from '@angular/core';
import { Response } from '@angular/http';


import { GlobalProvider } from '../../core/global-provider';
import { StorageProvider } from '../../core/storage-provider';

import * as ICore from '../../../interfaces/ICore';
import * as INarudzba from '../../../interfaces/terkom/INarudzba';
import { ConstProvider } from '../../core/const-provider';
//shared
import { TerkomDataProvider } from './terkom-data-provider';
import { TerkomSifarniciProvider } from './terkom-sifarnici-provider';

@Injectable()
export class TerkomNarudzbaProvider {


    public narudzbe: Array<INarudzba.Narudzba> = [];
    public narudzba: INarudzba.Narudzba;
    public NarudzbaID: number;

    public parstruid: number = null;
    public lokacija: string
    public vrstaDokId: number = null;

    public newBrojNarudzbe: number = 0;
    public countNarudzbi: any = []
    public kreditniLimitSuma: number = 0;
    public maxIznosNar: number = 0;
    public stanjeArtikla: number = 0;

    public NeposlaneNarudzbeCnt: number = 0;
    public NeposlaneNarudzbe: Array<INarudzba.Narudzba> = [];

    //objekt za slanje narudzbi
    public narudzbeJson: Array<INarudzba.NarudzbaSync> = [];
    public actionStavke: string = "Det";
    public actionZaglavlje: string = "Gla";

    //maksimalni limit narudzbe ukoliko je MP čitase iz vrstedok tablice
    public MaxLimit: number = 0;
    constructor(private global: GlobalProvider, private storage: StorageProvider,
        private constants: ConstProvider, private dataServis: TerkomDataProvider, private sifarniciServis: TerkomSifarniciProvider) {

    }





    getNarudzbe(): Promise<INarudzba.Narudzba[]> {
        let key = this.constants.narudzbaKey.keyvalue;
        let self = this.sifarniciServis;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
                .then((val) => {
                    this.narudzbe = [];
                    this.narudzbe = val
                    //joinaj se po podatke

                    if (this.narudzbe && this.narudzbe.length > 0)

                        this.narudzbe.forEach((nar) => {
                            let vrstadok = this.storage.filterCollectionSingleValue(self.vrstadok, 'vrstadokid', nar.vrstadokid)
                            let partner = this.storage.filterCollectionSingleValue(self.SveLokacije, 'parstruid', nar.parstruid);
                            let skladiste = this.storage.filterCollectionSingleValue(self.skladista, 'skladisteid', nar.skladisteid);

                            nar.vrstadok = vrstadok ? vrstadok.naziv : null;
                            nar.oznaka = vrstadok ? vrstadok.oznaka : null;
                            nar.partner = partner ? partner.naziv : null;
                            nar.brojstavki = nar.stavke ? nar.stavke.length : 0;
                            nar.iznos = 0;
                            nar.maxiznos = vrstadok ? vrstadok.maxiznos : 0;
                            nar.skladiste = skladiste ? skladiste.naziv : null;
                            //za svaku stavku pojedine narudzbe izracunaj iznos
                            if (nar.stavke.length > 0)
                                nar.stavke.forEach((stavka) => {
                                    //dohvati robu iz sifarnika     
                                    let roba = this.storage.filterCollectionSingleValue(self.roba, 'robaid', stavka.robaid);
                                    //nar.iznos += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0)) * (1 + parseFloat(roba ? roba.porezposto : 0) / 100);
                                    nar.iznos += Number(((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100) + (((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100)) * parseFloat(roba ? roba.porezposto : 0) / 100)).toFixed(2));

                                });
                            else
                                nar.iznos = 0;
                        });
                    //console.log(this.narudzbe)
                    resolve(this.narudzbe);
                }, (error) => {
                    reject(error);
                });
        });
    }
    //obilazak-akcija-izbor page
    getNarudzbeLokacija() {
        let key = this.constants.narudzbaKey.keyvalue;
        let self = this.sifarniciServis;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
                .then((val) => {

                    this.countNarudzbi = [];
                    this.countNarudzbi = this.storage.filterMultiCollection(val, { 'parstruid': this.parstruid, 'vrstadokid': this.vrstaDokId })


                    this.countNarudzbi.forEach((nar) => {
                        let skladiste = this.storage.filterCollectionSingleValue(self.skladista, 'skladisteid', nar.skladisteid);
                        nar.brojstavki = nar.stavke ? nar.stavke.length : 0;
                        nar.skladiste = skladiste ? skladiste.naziv : null;
                    });

                    resolve(this.countNarudzbi);
                }, (error) => {
                    reject(error);
                });
        });
    }

    //dohvat 1 narudzbe
    getNarudzba(id: number): Promise<INarudzba.Narudzba> {
        let self = this.sifarniciServis;
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((val) => {

                    this.narudzba = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(val, 'id', id);
                    //join za pokupiti ostale podatke
                    //console.log(this.narudzba)
                    this.narudzba.iznos = 0;
                    this.dataServis.getLokacije().then((res) => {
                        let partner = this.storage.filterCollectionSingleValue(res, 'parstruid', this.narudzba.parstruid);
                        this.narudzba.partner = partner ? partner.naziv : null;
                        this.narudzba.adresa = partner ? partner.adresa : null;
                        this.narudzba.mjesto = partner ? partner.mjesto : null;
                        this.narudzba.partneriid = partner ? partner.partneriid : null;
                    })
                    let vrstadok = this.storage.filterCollectionSingleValue(self.vrstadok, 'vrstadokid', this.narudzba.vrstadokid)
                    this.narudzba.oznaka = vrstadok ? vrstadok.oznaka : null;

                    this.dataServis.getNacinIsporuke().then((res) => {
                        let isporuka = this.storage.filterCollectionSingleValue(res, 'id', this.narudzba.nacinisporukeid);
                        this.narudzba.nacinisporuke = isporuka ? isporuka.opis : null;
                    })
                    this.dataServis.getNacinPlacanja().then((res) => {
                        let placanje = this.storage.filterCollectionSingleValue(res, 'id', this.narudzba.nacinplacanjaid);
                        this.narudzba.nacinplacanja = placanje ? placanje.opis : null;
                    })

                    this.dataServis.getSkladista().then((res) => {
                        let skladiste = this.storage.filterCollectionSingleValue(res, 'skladisteid', this.narudzba.skladisteid);
                        this.narudzba.skladiste = skladiste ? skladiste.naziv : null;
                    })

                    this.sifarniciServis.loadRazlogPovrata().then((res) => {
                        //multi razlog povrata
                        //za svaki id povrata dohvati opis o loadaj u razlog povrata za prikaz na view
                        if (this.narudzba.razlogpovrataid)
                            this.narudzba.razlogpovrataid.forEach(povrat => {
                                let razlog = this.storage.filterCollectionSingleValue(res, 'mobterkom_razlogpovrataid', Number(povrat))

                                this.narudzba.razlogpovrata = this.narudzba.razlogpovrata ? this.narudzba.razlogpovrata + ', ' + razlog.opis : razlog.opis;
                            });

                    })

                    if (this.narudzba.stavke && this.narudzba.stavke.length > 0)
                        this.narudzba.stavke.forEach((stavka) => {
                            //dohvati robu iz sifarnika     
                            let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                            console.log(Number(((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100) + (((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100)) * parseFloat(roba ? roba.porezposto : 0) / 100)).toFixed(2)))
                            //this.narudzba.iznos += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0)) * (1 + parseFloat(roba ? roba.porezposto : 0) / 100);
                            this.narudzba.iznos += Number(((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100) + (((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100)) * parseFloat(roba ? roba.porezposto : 0) / 100)).toFixed(2))
                        });
                    else
                        this.narudzba.iznos = 0;

                    //join na ostale storage keys

                    resolve(this.narudzba);
                }, (error) => {
                    reject(error);
                });
        });
    }



    getKreditniLimitSuma(parstruid): Promise<number> {

        return new Promise((resolve, reject) => {
            this.getNarudzbe()
                .then((val) => {
                    console.log(val)
                    //dohvati sve narudzbe partnera / parstruid
                    let narudzbe = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterCollection(this.narudzbe, 'prijenosind', 0), 'brojstavki', 0);
                    //console.log(narudzbe)
                    this.kreditniLimitSuma = 0;
                    if (narudzbe && narudzbe.length > 0)
                        narudzbe.forEach((nar) => {
                            console.log(nar)
                            //dohvati robu iz sifarnika     
                            if (nar.stavke.length > 0)
                                nar.stavke.forEach((stavka) => {
                                    let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                                    //this.kreditniLimitSuma += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0)) * (1 + parseFloat(roba ? roba.porezposto : 0) / 100);
                                    this.kreditniLimitSuma += (stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100) + (((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100)) * parseFloat(roba ? roba.porezposto : 0) / 100)
                                    console.log(this.kreditniLimitSuma)
                                });

                        });

                    resolve(this.kreditniLimitSuma);
                    //console.log("kreditni limit suma na uređaju " + this.kreditniLimitSuma)
                }, (error) => {
                    reject(error);
                });
        });

    }

    getStanjeArtikla(robaId): Promise<number> {


        return new Promise((resolve, reject) => {
            this.getNarudzbe()
                .then((val) => {
                    //dohvati sve neposlane narudzbe
                    let narudzbe = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterCollection(this.narudzbe, 'prijenosind', 0), 'brojstavki', 0);
                    let kolicina = 0;
                    //sumiraj količine svih stavki gdje je robaid 

                    if (narudzbe && narudzbe.length > 0)
                        narudzbe.forEach((nar) => {
                            //dohvati robu iz sifarnika     
                            if (nar.stavke.length > 0)
                                nar.stavke.forEach((stavka) => {
                                    if (stavka.robaid === robaId)
                                        kolicina += stavka ? stavka.kolicina : 0;
                                });
                            else
                                kolicina = 0;
                        });

                    this.stanjeArtikla = kolicina

                    resolve(this.stanjeArtikla);
                }, (error) => {
                    reject(error);
                });
        });

    }


    getMaxIznosNarudzbe(narId): Promise<number> {

        let key = this.constants.narudzbaKey.keyvalue;

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
                .then((val) => {
                    this.maxIznosNar = 0;
                    let narudzba = <INarudzba.Narudzba>this.storage.filterCollectionSingleValue(val, 'id', narId);

                    if (narudzba.stavke.length > 0)
                        narudzba.stavke.forEach((stavka) => {
                            //dohvati robu iz sifarnika     
                            let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                            //this.maxIznosNar += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0)) * (1 + parseFloat(roba ? roba.porezposto : 0) / 100);
                            this.maxIznosNar += (stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100) + (((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100)) * parseFloat(roba ? roba.porezposto : 0) / 100)
                        });


                    resolve(this.maxIznosNar);
                }, (error) => {
                    reject(error);
                });
        });
    }


    getNarudzbeCount(): Promise<Response> {

        let key = this.constants.narudzbaKey.keyvalue;

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
                .then((val) => {
                    resolve(val);
                }, (error) => {
                    reject(error);
                });
        });
    }


    save(narudzba: INarudzba.Narudzba): Promise<any> {

        let key = this.constants.narudzbaKey.keyvalue;

        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (!narudzbe)
                        narudzbe = [];
                    this.storage.addItemToArray(narudzbe, narudzba)
                    return narudzbe;
                })
                .then((res) => {
                    return this.storage.addToStorage(key, null, res, true)
                })
                .then((res) => {
                    resolve(narudzba.id)
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }



    update(narudzba: INarudzba.Narudzba, id: number): Promise<Response> {

        let key = this.constants.narudzbaKey.keyvalue;
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.id === id) {
                                nar.nacinisporukeid = narudzba.nacinisporukeid
                                nar.nacinplacanjaid = narudzba.nacinplacanjaid
                                nar.opis = narudzba.opis
                                nar.datumdok = narudzba.datumdok
                                nar.skladisteid = narudzba.skladisteid
                                nar.razlogpovrataid = narudzba.razlogpovrataid
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

    delete(id: number): Promise<Response> {
        let key = this.constants.narudzbaKey.keyvalue;
        //dohvati sve stavke narudzbe
        //delete 
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe && narudzbe.length > 0) {
                        var index = this.storage.findArrayIndex(narudzbe, "id", id)
                        narudzbe.splice(index, 1);
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


    isprazniNarudzbe(): Promise<Response> {
        let key = this.constants.narudzbaKey.keyvalue;
        //dohvati sve stavke narudzbe
        //delete 
        return new Promise((resolve, reject) => {
            this.narudzbe = [];
            this.getNeposlaneNarudzbe();
            resolve(this.storage.addToStorage(key, null, this.narudzbe, true))

        });

    }

    getBrojNarudzbe(): Promise<number> {
        //dohvati zadnju narudzbu iz arraya narudzbi i broj uvecaj za 1
        let key = this.constants.narudzbaKey.keyvalue;

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
                .then((val) => {
                    let narudzba = this.storage.getLastArrayElement(val);
                    this.newBrojNarudzbe = narudzba ? narudzba.id + 1 : 1;
                    resolve(this.newBrojNarudzbe);
                }, (error) => {
                    reject(error);
                });
        });

    }


    getNeposlaneNarudzbe(id?: number): Promise<INarudzba.Narudzba[]> {

        return new Promise((resolve, reject) => {
            this.getNarudzbe()
                .then((val) => {
                    this.NeposlaneNarudzbe = [];
                    this.NeposlaneNarudzbeCnt = 0;
                    //ako je zabrana ponovnog slanja dohvati samo narudzbe koje nisu poslane
                    if (this.sifarniciServis.ponovnoSlanjeZabrana === 1) {
                        //filtriraj sve narudzbe id koje imaju stavke i prijenosind = 0
                        if (this.narudzbe && this.narudzbe.length > 0)
                            this.NeposlaneNarudzbe = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterCollection(this.narudzbe, 'prijenosind', 0), 'brojstavki', 0);

                        //ako potoji id saljem samo jednu narudzbu, filtriraj je u neposlane narudzbe arraya
                        if (id)
                            this.NeposlaneNarudzbe = this.storage.filterCollection(this.NeposlaneNarudzbe, 'id', id);
                    }
                    else {
                        //ako nema zabrane ponovnog slanja dohvati samo narudzbe koje nisu poslane
                        if (this.narudzbe && this.narudzbe.length > 0)
                            this.NeposlaneNarudzbe = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterCollection(this.narudzbe, 'prijenosind', 0), 'brojstavki', 0);

                        //ako postoji id saljem samo jednu narudzbu, filtriraj je u neposlane narudzbe arraya
                        if (id)
                            this.NeposlaneNarudzbe = this.storage.filterCollection(this.storage.filterCollectionWherePopertGreatherThan(this.narudzbe, 'brojstavki', 0), 'id', id);
                    }

                    //filtriraj narudzbe gdje su stavke bez pov_nak_sysind = 1
                    this.NeposlaneNarudzbe.forEach(nar => {
                        //console.log(nar.stavke.length)
                        nar.stavke = this.storage.filterCollection(nar.stavke, 'pov_nak_sysind', 0);
                        nar.posalji = true;
                        //console.log(nar.stavke.length)
                        nar.stavke.forEach(stavka => {
                            stavka.imanastanju = true;

                            let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                            stavka.naziv = roba ? roba.naziv : null;
                            stavka.sifra = roba ? roba.sifra : null;

                        });
                    });
                    this.NeposlaneNarudzbeCnt = this.NeposlaneNarudzbe.length;
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
                        this.NeposlaneNarudzbe = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterCollection(this.narudzbe, 'prijenosind', 0), 'brojstavki', 0);
                        this.NeposlaneNarudzbeCnt = this.NeposlaneNarudzbe.length;
                    }


                    //console.log(this.NeposlaneNarudzbeCnt)
                    resolve(this.NeposlaneNarudzbeCnt);
                }, (error) => {
                    reject(error);
                });
        });
    }

    //slanje narudzbi na servis
    postRequest(): Promise<any> {

        return new Promise((resolve, reject) => {
            //dohvati zaglavlje i stavke narudzbi i kreiraj Json
            this.createBodyRequest()
                .then((res) => {
                    return this.send(res);
                })
                .then((res) => { return this.processResponse(res) })
                .then((res) => resolve(res))
                .catch(Error => {
                    reject(Error)
                })

        });
    }


    createBodyRequest(): Promise<INarudzba.NarudzbaSync[]> {
        //console.log("kreiram json")
        this.narudzbeJson = [];
        return new Promise((resolve, reject) => {

            this.NeposlaneNarudzbe.forEach((nar) => {
                console.log(nar)
                let svestavke = [];
                nar.stavke.forEach((sta) => {
                    if (this.sifarniciServis.prikazirazlogpovratadetalj===1)
                    {
                        let razpov= sta.razlogpovratadetid ? sta.razlogpovratadetid.toString() : null;
 
                        let stavka = <INarudzba.NarudzbaStavka>({
                            action: this.actionStavke,
                            robaid: sta.robaid,
                            cijena: sta.cijena,
                            kolicina: sta.kolicina,
                            opis: sta.opis,
                            razlogpovratadet: razpov,
    
                        });
 
                        svestavke.push(stavka);
                    }
                    else
                    {

                        let stavka = <INarudzba.NarudzbaStavka>({
                            action: this.actionStavke,
                            robaid: sta.robaid,
                            cijena: sta.cijena,
                            kolicina: sta.kolicina,
                            opis: sta.opis,
    
                        });

                        svestavke.push(stavka);
                        
                    }
                    



                });


                let narudzbaZag = new INarudzba.NarudzbaSync();
                narudzbaZag.action = this.actionZaglavlje;
                narudzbaZag.id = nar.id;
                narudzbaZag.operaterid = "@@operaterid"
                //narudzbaZag.terminalid = nar.terminalid;
                narudzbaZag.napomena = nar.opis;
                narudzbaZag.datumdok = nar.datumdok;
                narudzbaZag.parstruid = nar.parstruid;
                narudzbaZag.vrstadokid = nar.vrstadokid;
                narudzbaZag.nacinisporukeid = nar.nacinisporukeid;
                narudzbaZag.nacinplacanjaid = nar.nacinplacanjaid;
                narudzbaZag.skladisteid = nar.skladisteid;
                narudzbaZag.uuid = nar.uuid;
                narudzbaZag.mobterkom_razlogpovrata = nar.razlogpovrataid ? nar.razlogpovrataid.toString() : null;
                narudzbaZag.stavke = svestavke;

                this.narudzbeJson.push(narudzbaZag)
            });
            console.log("select json");
            resolve(this.narudzbeJson);
        });
    }


    insertPovratnaNaknada(id): Promise<Response> {
        //console.log("dodavanje povratne naknade!")
        let key = this.constants.narudzbaKey.keyvalue;
        console.log("insert povratna")
        console.log(id)
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
                .then((val) => {

                    let narudzbe = <Array<INarudzba.Narudzba>>val;
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            console.log(nar)
                            if (nar.id === id) {

                                console.log(nar.stavke)

                                // if (vrstaDok === "VP") {
                                //filtriraj  robu where robaid je ova sa stavki narudzbe i robaid = roba.povnak_robaid
                                //console.log("vp !!")
                                nar.stavke.forEach(stavka => {

                                    let artikl = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', stavka.robaid);
                                    let roba = this.storage.filterCollectionSingleValue(this.sifarniciServis.roba, 'robaid', artikl ? artikl.pov_nak_robaid : null);
                                    console.log(artikl)


                                    if (Object.keys(roba).length != 0) {
                                        let cijena = 0;
                                        //let iznos_porez = 0;

                                        cijena = roba ? roba.cijena : 0;

                                        let orderaneStavke = this.storage.orderItemsBy(nar.stavke, 'id', 'asc');
                                        //dohvati zadnji array element (s najvecim brojem stavke) i uvecaj ga za 1 
                                        let zadnjaStavka = this.storage.getLastArrayElement(orderaneStavke);

                                        let novaStavka: INarudzba.NarudzbaStavka = {
                                            rabatPosto: 0,
                                            cijena: cijena,
                                            kolicina: stavka.kolicina,
                                            robaid: roba.robaid,
                                            id: zadnjaStavka ? Number(zadnjaStavka.id) + 1 : 1,
                                            narudzbaid: nar.id,
                                            pov_nak_sysind: 1
                                        }

                                        //provjeri postoji li u listi stavaka vec povratna 
                                        let povratna = this.storage.filterMultiCollectioSingleValue(nar.stavke, { 'robaid': artikl.pov_nak_robaid, 'cijena': cijena });
                                        nar.stavke.forEach(sta => {
                                            if (sta.robaid === artikl.pov_nak_robaid) {
                                                //console.log("postoji povratna u artiklima")
                                                let kolicina: number = Number(povratna ? povratna.kolicina : 0) + stavka.kolicina

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
                                // }
                            }
                        });
                    }
                    return narudzbe
                })
                .then((res) => {
                    //console.log("povratna  zavrsila")
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }


    deleteWherePovNakInd(id): Promise<Response> {
        //console.log("brišem gdje je pov nak ind = 1")
        let key = this.constants.narudzbaKey.keyvalue;
        //dohvati sve stavke narudzbe
        //delete 
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        narudzbe.forEach((nar) => {
                            if (nar.id === id && nar.stavke && nar.stavke.length > 0) {
                                //pronađi index
                                let povratnestavke = this.storage.filterCollection(nar.stavke, 'pov_nak_sysind', 1);
                                //console.log(povratkestavke)                       
                                if (Object.keys(povratnestavke).length != 0) {
                                    povratnestavke.forEach(stavka => {
                                        var index = this.storage.findArrayIndex(nar.stavke, "id", stavka.id)
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
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }



    send(jsonObject): Promise<Response> {

        let properties: ICore.IPropertiesCore = {
            customApiEndPoint: 'narudzbe'
        }
        //console.log(jsonObject)
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spmobTerkom_Prijenos",
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


    processResponse(res) {
        return new Promise((resolve, reject) => {
            if (res && res.length > 0) {
                this.zakljuciNarudzbu(res)
                    .then((res) => {
                        this.getNarudzbe().then((res) => {
                            this.getNarudzba(this.NarudzbaID);
                        })
                    })

            }
            resolve(res);
        });
    }



    zakljuciNarudzbu(res): Promise<Response> {

        let key = this.constants.narudzbaKey.keyvalue;
        //dohvati sve stavke narudzbe
        //update
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((narudzbe) => {
                    if (narudzbe) {
                        res.forEach(re => {
                            if (re.success === true)
                                narudzbe.forEach((nar) => {
                                    if (nar.id === re.narudzbaID) {
                                        nar.prijenosind = 1
                                    }
                                });
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


    getVrijednostNarudzbe(): Promise<any> {
        let key = this.constants.narudzbaKey.keyvalue;
        let self = this.sifarniciServis;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key, null, true)
                .then((val) => {

                    let narudzbe = [];

                    let ukupnaVrijednost = 0;
                    let vrijednostNeposlanih = 0;

                    narudzbe = val

                    if (narudzbe && narudzbe.length > 0) {
                        narudzbe.forEach((nar) => {

                            nar.iznos = 0;
                            nar.brojstavki = nar.stavke ? nar.stavke.length : 0;
                            //za svaku stavku pojedine narudzbe izracunaj iznos
                            if (nar.stavke.length > 0)
                                nar.stavke.forEach((stavka) => {
                                    //dohvati robu iz sifarnika     
                                    let roba = this.storage.filterCollectionSingleValue(self.roba, 'robaid', stavka.robaid);
                                    //nar.iznos += ((stavka ? stavka.kolicina : 0) * (stavka ? stavka.cijena : 0)) * (1 + parseFloat(roba ? roba.porezposto : 0) / 100);
                                    nar.iznos += Number(((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100) + (((stavka.cijena * stavka.kolicina) * (1 - stavka.rabatPosto / 100)) * parseFloat(roba ? roba.porezposto : 0) / 100)).toFixed(2))
                                });
                            else
                                nar.iznos = 0;
                        });

                        narudzbe.forEach((nar) => {
                            //dohvati robu iz sifarnika     
                            ukupnaVrijednost += nar ? nar.iznos : 0;
                        });

                        let neposlane = this.storage.filterCollectionWherePopertGreatherThan(this.storage.filterCollection(narudzbe, 'prijenosind', 0), 'brojstavki', 0);

                        neposlane.forEach((nar) => {
                            //dohvati robu iz sifarnika     
                            vrijednostNeposlanih += nar ? nar.iznos : 0;
                        });
                    }

                    var vrijednostNarudzbi = {
                        vrijednostNeposlanih: vrijednostNeposlanih,
                        ukupnaVrijednost: ukupnaVrijednost
                    }
                    //console.log(vrijednostNarudzbi)
                    resolve(vrijednostNarudzbi);
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
