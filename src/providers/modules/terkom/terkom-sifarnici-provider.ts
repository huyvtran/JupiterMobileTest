
import { Injectable } from '@angular/core';

import { StorageProvider } from '../../core/storage-provider';

import { ConstProvider } from '../../core/const-provider';
import { ModulesProvider } from '../../core/modules-provider';
import { VariableProvider } from '../../core/variable-provider';
//shared
import { TerkomDataProvider } from './terkom-data-provider';
import { variable } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class TerkomSifarniciProvider {
    public rute: Array<any>;
    public vrstadok: Array<any>;
    public klaserobe: Array<any>;
    public roba: Array<any>;
    public robaKlMaster: Array<any>
    public nacinplacanja: Array<any>;
    public nacinisporuke: Array<any>;
    public skladista: Array<any>;
    public skladisteId: number = null;
    public nacinPlacanjaId: number = null;
    public nacinIsporukeId: number = null;
    public klasaRobeId: number = null;
    public lokacija: Array<any>; //partner
    public SveLokacije: Array<any>; //partner
    public asortiman: Array<any>;
    public asortimanvrsta: Array<any>;
    public favoritLokacije: Array<any>;
    public robaSearchDataList: Array<any> = [];
    public favoriti: Array<any>;
    public zabraneiupozorenja: Array<any> = [];
    public vrstaObilazaka: Array<any>;

    //zabrane i upozorenja
    public stanjeSkladistaZabrana: number = 0;
    public stanjeSkladistaupozorenje: number = 0;
    public kreditniLimitUpozorenje: number = 0;
    public kreditniLimitZabrana: number = 0;
    public ponovnoSlanjeZabrana: number = 0;
    public ponovnoSlanjeUpozorenje: number = 0;
    public provjeriStanjePrilikomSlanja: number = 0
    public cijenaNulaZabrana: number = 0;
    //terkomVars
    public dohvatUvjeta: number = 0;
    public brojDana: number = 0;
    public prikazinapomenu: number = 0;
    public prikazirazlogpovrata: number = 0;
    public prikazirazlogpovratadetalj: number = 0;
    public multiRazlogPovrata: number = 0;
    //izvjestaji
    public izvjestajiputnika: Array<any> = [];
    public izvjestajilokacije: Array<any> = [];
    selZonaID: any;

    RobaCnt: number = 0; PartneriCnt: number = 0; RuteCnt: number = 0; KlaseCnt: number = 0; AsortimanCnt: number = 0; AsortimanVrstaCnt: number = 0;
    NacinIspCnt: number = 0; NacinPlaCnt: number = 0; VrstaDokCnt: number = 0; FavoritLokacijeCnt: number = 0;


    constructor(private storage: StorageProvider, private variable: VariableProvider,
        private constants: ConstProvider, private dataServis: TerkomDataProvider) {

    }

    initSifarnika() {
        //console.log("init sifarnika");
        //get rute

        return this.loadRute()
            .then((val) => {
                if (this.rute && this.rute.length > 0) {
                    //ako postoji u postavkama zina id postavi je , ako ne uzmi prvu iz baze
                    this.selZonaID = this.rute[0].ruteid;
                }
                return this.loadLokacije()
            })
            .then((val) => {
                return this.loadVrsteDok()
            })
            .then((val) => {
                return this.loadKlaseRobe()
            })
            .then((val) => {
                return this.loadRobe(null)
            })
            .then((val) => {
                return this.loadNacinPlacanja(null)
            })
            .then((val) => {
                return this.loadAsortimanVrsta()
            })
            .then((val) => {
                return this.loadAsortiman()
            })
            .then((val) => {
                return this.loadNacinIsporuke()
            })
            .then((val) => {
                return this.loadFavoriteLokacije()
            })
            .then((val) => {
                return this.loadFavoritRoba()
            })
            .then((val) => {
                return this.loadZabrabeIUpozorenja()
            })
            .then((val) => {
                return this.loadIzvjestaja()
            })
            .then((val) => {
                return this.loadSkladista()
            })
            .then((val) => {
                return this.loadVrstaObilazka()
            })
            .then((val) => console.log("init sifarnika zavrsen"))
            .catch(Error => console.log(Error));
    }


    loadRute(): Promise<any> {

        let key = this.constants.storageKeys.find((r: any) => r.keyname === "rute");
        return new Promise((resolve, reject) => {
            //dohvati sve partnere
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((val) => {
                    this.rute = [];
                    this.rute = val

                    this.RuteCnt = this.rute ? this.rute.length : 0;
                    resolve(this.rute);
                }, (error) => {
                    reject(error);
                });
        });
    }

    loadLokacije(): Promise<any> {
        //dohvati sve lokacije
        return new Promise((resolve, reject) => {
            this.dataServis.getLokacije()
                .then((val) => {

                    if (val && val != null) {
                        this.SveLokacije = val;
                    }

                    this.lokacija = [];
                    //filtriraj po ruta id
                    this.lokacija = this.storage.filterCollection(val, 'ruteid', parseInt(this.selZonaID));

                    this.PartneriCnt = this.lokacija ? this.lokacija.length : 0;
                    //dohvati info koja lokacija je u favoritima

                    this.lokacija.forEach((lok) => {
                        //ako postoji lokacija u favoritima postavi joj indikator favorite = 1
                        let fav = this.storage.filterCollectionSingleValue(this.favoritLokacije, "parstruid", lok.parstruid)
                        if (fav.parstruid === lok.parstruid)
                            lok.favorite = 1;
                        else
                            lok.favorite = 0;
                    });


                    resolve(this.lokacija);
                }, (error) => {
                    reject(error);
                });
        });
    }

    loadVrsteDok(parstruid?): Promise<any> {

        return new Promise((resolve, reject) => {
            this.dataServis.getVrsteDok()
                .then((val) => {

                    this.vrstadok = [];
                    this.vrstadok = val;
                    //TO DO  countati pravi broj dokumenata
                    if (val) {
                        this.vrstadok = this.storage.addPropertyToArrayObject(this.vrstadok, 'broj', 0);
                        //dohvati narudzbe i filtriraj po parstruid i vrsti dok

                        this.dataServis.getAllNarudzbe().then((res) => {
                            this.vrstadok.forEach((item) => {
                                //let array = _.filter(this.narudzbaServis.narudzbe, {'parstruId' : parstruid, 'vrstaDokId' : item.vrstadokid});
                                let array = this.storage.filterMultiCollection(this.dataServis.narudzbe, { 'parstruid': parseInt(parstruid), 'vrstadokid': parseInt(item.vrstadokid) })
                                //console.log(array)
                                item.broj = array ? array.length : 0;
                            });
                        })
                    }

                    this.VrstaDokCnt = this.vrstadok ? this.vrstadok.length : 0;
                    resolve(this.vrstadok);
                }, (error) => {
                    reject(error);
                });
        });
    }


    loadKlaseRobe(): Promise<any> {
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "klase");
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((val) => {
                    this.klaserobe = [];
                    this.klaserobe = val;
                    this.KlaseCnt = this.klaserobe ? this.klaserobe.length : 0;
                    resolve(this.klaserobe);
                }, (error) => {
                    reject(error);
                });
        });
    }

    loadRazlogPovrata(): Promise<any> {
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "razlogpovrata");
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((val) => {
                    resolve(val);
                }, (error) => {
                    reject(error);
                });
        });
    }

    loadRobe(klmasterrobaid?): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dataServis.getRobe()
                .then((val) => {
                    this.roba = [];
                    this.robaKlMaster = [];
                    this.robaKlMaster = this.storage.filterCollection(this.storage.filterCollectionWherePopertyNotEqual(val, 'sifra', '999997'), 'klmasterrobaid', klmasterrobaid);
                    this.roba = val;
                    //console.log(this.roba)
                    this.RobaCnt = this.roba ? this.roba.length : 0;
                    resolve(this.roba);
                }, (error) => {
                    reject(error);
                });
        });

    }



    loadNacinPlacanja(idvrstedok): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dataServis.getNacinPlacanja()
                .then((val) => {

                    this.nacinplacanja = [];
                    this.nacinplacanja = val;
                    this.NacinPlaCnt = this.nacinplacanja ? this.nacinplacanja.length : 0;
                    //dohvati oznaku na osnovi vrtedokid
                    let vrstadok = this.storage.filterCollectionSingleValue(this.vrstadok, 'vrstadokid', idvrstedok);

                    //filtriraj nacine placanja prema oznaci
                    this.nacinplacanja = this.storage.filterCollection(val, 'vrsta', vrstadok.oznaka);

                    resolve(this.nacinplacanja);
                }, (error) => {
                    reject(error);
                });
        });

    }


    loadNacinIsporuke(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dataServis.getNacinIsporuke()
                .then((val) => {
                    this.nacinisporuke = [];
                    this.nacinisporuke = val;
                    this.NacinIspCnt = this.nacinisporuke ? this.nacinisporuke.length : 0;
                    let nacIsp = this.storage.getFirstArrayElement(this.nacinisporuke);
                    this.nacinIsporukeId = nacIsp ? nacIsp.id : null;
                    resolve(this.nacinisporuke);
                }, (error) => {
                    reject(error);
                });
        });

    }

    loadSkladista(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dataServis.getSkladista()
                .then((val) => {
                    this.skladista = [];
                    this.skladista = val;
                    let sklID = this.storage.filterCollectionSingleValue(this.skladista, "glavno", 1);
                    this.skladisteId = sklID ? sklID.skladisteid : null;
                    //console.log(this.skladista)
                    //console.log(this.skladisteId)
                    resolve(this.skladista);
                }, (error) => {
                    reject(error);
                });
        });

    }

    loadVrstaObilazka(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dataServis.getVrstaObilazka()
                .then((val) => {
                    this.vrstaObilazaka = [];
                    this.vrstaObilazaka = val;
                    if (this.vrstaObilazaka != null)
                        this.vrstaObilazaka.forEach(vrsta => {
                            vrsta.ischecked = false;
                        });

                    resolve(this.vrstaObilazaka);
                }, (error) => {
                    reject(error);
                });
        });

    }


    loadAsortiman(): Promise<any> {
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "asortiman");
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((val) => {
                    this.asortiman = [];
                    this.asortiman = val;
                    this.AsortimanCnt = this.asortiman ? this.asortiman.length : 0;
                    resolve(this.asortiman);
                }, (error) => {
                    reject(error);
                });
        });
    }

    loadAsortimanVrsta(): Promise<any> {
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "asortimanvrsta");
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((val) => {
                    this.asortimanvrsta = [];
                    this.asortimanvrsta = val;
                    this.AsortimanVrstaCnt = this.asortimanvrsta ? this.asortimanvrsta.length : 0;
                    resolve(this.asortimanvrsta);
                }, (error) => {
                    reject(error);
                });
        });
    }


    //kod kreiranja nove narudzbe ako je oznaka vrste dokumenta MP selektiraj automatski ID nacina placanja - gotovina
    loadNacinPlacanjaId(vrsta): Promise<any> {
        //console.log(vrsta)
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "nacinplacanja");
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((val) => {
                    let nacPlac;
                    if (vrsta == "MP")
                        nacPlac = this.storage.filterCollectionSingleValue(val, "vrsta", vrsta);
                    else
                        nacPlac = this.storage.getFirstArrayElement(val);
                    this.nacinPlacanjaId = nacPlac ? nacPlac.id : null;
                    resolve(this.nacinPlacanjaId);
                }, (error) => {
                    reject(error);
                });
        });

    }

    loadFavoritRoba(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.dataServis.getRobe()
                .then((val) => {
                    this.favoriti = [];
                    this.favoriti = this.storage.orderItemsBy(this.storage.filterCollectionWherePopertyNotEqual(val, 'poredak', 0), 'poredak', 'asc');
                    //filtriraj robu gdje je poredak <> 0, order by poredak
                    //console.log(this.favoriti);
                    resolve(this.favoriti);
                }, (error) => {
                    reject(error);
                });
        });

    }

    loadFavoriteLokacije(): Promise<any> {
        let key = this.constants.favoriteKey.keyvalue;

        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key)
                .then((val) => {

                    this.favoritLokacije = [];
                    if (val || val == null)
                        //filtriraj favorite od trenutnog usera
                        //this.variable.company ? this.variable.company.operateriid : null;
                        //val = this.storage.filterCollection(val, "userid", ModulesProvider.storageRoot ? ModulesProvider.storageRoot.operateriid : null)
                        val = this.storage.filterCollection(val, "userid", this.variable.company ? this.variable.company.operateriid : null)

                    val.forEach((fav) => {
                        //let userid = fav.userid;
                        //pronađi partnera za parstruid u svim lokacijama
                        fav = this.storage.filterCollectionSingleValue(this.SveLokacije, "parstruid", fav.parstruid)
                        //fav.userid = userid;

                        if (Object.keys(fav).length != 0)
                            this.favoritLokacije.push(fav)
                    });

                    this.FavoritLokacijeCnt = this.favoritLokacije ? this.favoritLokacije.length : 0;
                    resolve(this.favoritLokacije);
                }, (error) => {
                    reject(error);
                });
        });

    }

    loadZabrabeIUpozorenja(): Promise<Array<any>> {
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "pubvars");

        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((val) => {
                    this.zabraneiupozorenja = val;
                    this.stanjeSkladistaZabrana = this.storage.filterCollectionSingleValue(val, 'varime', 'StanjeSkladistaZabrana') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'StanjeSkladistaZabrana').varset) : null;
                    this.stanjeSkladistaupozorenje = this.storage.filterCollectionSingleValue(val, 'varime', 'StanjeSkladistaUpozorenje') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'StanjeSkladistaUpozorenje').varset) : null;
                    this.kreditniLimitZabrana = this.storage.filterCollectionSingleValue(val, 'varime', 'KreditniLimitZabrana') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'KreditniLimitZabrana').varset) : null;
                    this.kreditniLimitUpozorenje = this.storage.filterCollectionSingleValue(val, 'varime', 'KreditniLimitUpozorenje') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'KreditniLimitUpozorenje').varset) : null;
                    this.ponovnoSlanjeZabrana = this.storage.filterCollectionSingleValue(val, 'varime', 'PonovnoSlanjeZabrana') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'PonovnoSlanjeZabrana').varset) : null;
                    this.ponovnoSlanjeUpozorenje = this.storage.filterCollectionSingleValue(val, 'varime', 'PonovnoSlanjeUpozorenje') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'PonovnoSlanjeUpozorenje').varset) : null;
                    this.dohvatUvjeta = this.storage.filterCollectionSingleValue(val, 'varime', 'DohvatUvjeta') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'DohvatUvjeta').varset) : null;
                    this.brojDana = this.storage.filterCollectionSingleValue(val, 'varime', 'DatumKreiranja') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'DatumKreiranja').varset) : null;
                    this.prikazinapomenu = this.storage.filterCollectionSingleValue(val, 'varime', 'PrikaziNapomenuStavke') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'PrikaziNapomenuStavke').varset) : null;
                    this.prikazirazlogpovrata = this.storage.filterCollectionSingleValue(val, 'varime', 'PrikaziRazlogPovrataNaZaglavlju') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'PrikaziRazlogPovrataNaZaglavlju').varset) : null;
                    this.multiRazlogPovrata = this.storage.filterCollectionSingleValue(val, 'varime', 'RazlogPovrataNaDetaljuMulti') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'RazlogPovrataNaDetaljuMulti').varset) : null;
                    this.provjeriStanjePrilikomSlanja = this.storage.filterCollectionSingleValue(val, 'varime', 'ProvjeriStanjeSkladistaPrilikomSlanja') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'ProvjeriStanjeSkladistaPrilikomSlanja').varset) : null
                    this.cijenaNulaZabrana = this.storage.filterCollectionSingleValue(val, 'varime', 'CijenaNulaZabrana') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'CijenaNulaZabrana').varset) : null
                    this.prikazirazlogpovratadetalj = this.storage.filterCollectionSingleValue(val, 'varime', 'PrikaziRazlogPovrataNaDetalju') != undefined ? parseInt(this.storage.filterCollectionSingleValue(val, 'varime', 'PrikaziRazlogPovrataNaDetalju').varset) : null;
                    //console.log(' cijenanulazabrana ' + this.cijenaNulaZabrana)
                    //  console.log(' skladisteupozorenje ' + this.stanjeSkladistaupozorenje)
                    //  console.log(' kreditni limit zabrana' + this.kreditniLimitZabrana)
                    //  console.log(' kreditni limit upozorenje ' + this.kreditniLimitUpozorenje)
                    //  console.log(' ponovnoslanje zabrana ' + this.ponovnoSlanjeZabrana)
                    //  console.log(' ponovno slanje upozorenje ' +this.ponovnoSlanjeUpozorenje)
                    resolve(this.zabraneiupozorenja);
                }, (error) => {
                    reject(error);
                });
        });
    }

    loadIzvjestaja() {
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "izvjestaji");
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((val) => {

                    this.izvjestajilokacije = this.storage.filterCollection(val, 'vrsta', 'Lokacija');
                    this.izvjestajiputnika = this.storage.filterCollection(val, 'vrsta', 'Putnik');

                    resolve(this.izvjestajilokacije);
                }, (error) => {
                    reject(error);
                });
        });
    }


    addFavorite(parstruid): Promise<any> {


        let key = this.constants.favoriteKey.keyvalue;
        let favorite = {
            parstruid: parstruid,
            //userid: this.constants.operaterId
            //userid: ModulesProvider.storageRoot ? ModulesProvider.storageRoot.operateriid : null
            userid: this.variable.company ? this.variable.company.operateriid : null
        }
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key)
                .then((favoriti) => {
                    //console.log(narudzba)
                    if (!favoriti)
                        favoriti = [];
                    this.storage.addItemToArray(favoriti, favorite)
                    return favoriti;
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });
        });

    }

    deleteFavorite(parstruid): Promise<any> {
        let key = this.constants.favoriteKey.keyvalue;
        //let userid = ModulesProvider.storageRoot ? ModulesProvider.storageRoot.operateriid : null;
        let userid = this.variable.company ? this.variable.company.operateriid : null
        //delete
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key)
                .then((favoriti) => {
                    if (favoriti) {

                        var index = this.storage.findArrayIndexMulti(favoriti, { 'parstruid': parstruid, 'userid': userid })
                        favoriti.splice(index, 1);
                    }
                    return favoriti
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }



    searchRoba(term): Promise<any> {

        return new Promise((resolve, reject) => {
            //console.log(this.roba)
            //if(this.roba && this.roba.barcode)
            this.robaSearchDataList = this.roba.filter((v) => {
                if (v.barcode)
                    return v.naziv.toLowerCase().includes(term.toLowerCase()) || v.sifra.toLowerCase().includes(term.toLowerCase()) || v.barcode.toLowerCase().includes(term.toLowerCase())
                else
                    return v.naziv.toLowerCase().includes(term.toLowerCase()) || v.sifra.toLowerCase().includes(term.toLowerCase())
            })

            //makni povratnu iz robe
            this.robaSearchDataList = this.storage.filterCollectionWherePopertyNotEqual(this.robaSearchDataList, 'sifra', '999997')
            if (this.robaSearchDataList)
                resolve(this.robaSearchDataList);
            else
                reject();
        });

    }




}
