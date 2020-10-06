
import { Injectable } from '@angular/core';

import { StorageProvider } from '../../core/storage-provider';

import { ConstProvider } from '../../core/const-provider';
//shared
import { TerproDataProvider } from './terpro-data-provider';
import * as IFirma from '../../../interfaces/terpro/IFirma';

@Injectable()
export class TerproSifarniciProvider {
    public rute: Array<any>;
    public vrstadok: Array<any>;
    public klaserobe: Array<any>;
    public roba: Array<any>;
    public JMroba: Array<any>;
    public robaKlMaster: Array<any>
    public nacinplacanja: Array<any>;
    public stanjeRobe: Array<any>;
    public ugovori: Array<any>;
    public nacinPlacanjaId: number = null;
    public klasaRobeId: number = null;
    public lokacija: Array<any>; //partner
    public SveLokacije: Array<any>; //partner
    public firma: IFirma.IFirma
    public robaSearchDataList: Array<any> = [];

    selZonaID: any;

    RobaCnt: number = 0; PartneriCnt: number = 0; RuteCnt: number = 0; KlaseCnt: number = 0;
    NacinPlaCnt: number = 0; VrstaDokCnt: number = 0; NarudzbeCnt: number = 0;


    constructor(private storage: StorageProvider,
        private constants: ConstProvider, private dataServis: TerproDataProvider) {

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
                return this.loadJMRobe()
            })
            .then((val) => {
                return this.narudzbeCnt();
            })
            .then((val) => {
                return this.loadStanjeRobe();
            })
            .then((val) => {
                return this.getFirmaInfo();
            })
            .then((val) => console.log("init sifarnika zavrsen"))
            .catch(Error => console.log(Error));
    }


    loadRute(): Promise<any> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "rute");
        return new Promise((resolve, reject) => {
            //dohvati sve partnere
            this.storage.getFromStorage(key.keyvalue, null, true)
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

    getFirmaInfo(): Promise<any> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "firma");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

                    this.firma = <IFirma.IFirma>val;
                    //console.log(this.firma)
                    resolve(this.firma);
                }, (error) => {
                    reject(error);
                });
        });

    }

    getFooterInfo(vrstadokid): Promise<any> {

        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "footer");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    let footer;
                    console.log(val)
                    if(val)
                        footer = this.storage.filterCollectionSingleValue(val,'vrstadokid', vrstadokid)

                    console.log(footer)
                    var lines = footer.tekst? footer.tekst.split('\n') : null;
            
                    if (lines) {
                        footer.tekst = ""
                        lines.forEach(element => {

                            footer.tekst += element + '\n'.repeat(1);
                        });
                    }

                    resolve(footer);
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
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "klase");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
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

    loadRobe(klmasterrobaid?): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dataServis.getRobe()
                .then((val) => {
                    val = this.storage.orderItemsBy(val, 'sifra', 'asc');
                    this.roba = [];
                    this.robaKlMaster = [];
                    this.robaKlMaster = this.storage.filterCollection(val, 'klmasterrobaid', klmasterrobaid);
                    this.roba = val;
                    //console.log(this.roba)
                    
                    this.RobaCnt = this.roba ? this.roba.length : 0;
                    resolve(this.roba);
                }, (error) => {
                    reject(error);
                });
        });

    }


    loadStanjeRobe(): Promise<any> {
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "stanjeskladista");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    this.stanjeRobe = [];
                    this.stanjeRobe = val;
                    //console.log(val)
                    resolve(this.stanjeRobe);
                }, (error) => {
                    reject(error);
                });
        });

    }


    loadJMRobe(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dataServis.getJMRoba()
                .then((val) => {
                    this.JMroba = [];
                    this.JMroba = val;

                    resolve(this.JMroba);
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
                    //let vrstadok = this.storage.filterCollectionSingleValue(this.vrstadok, 'vrstadokid', idvrstedok);

                    //filtriraj nacine placanja prema oznaci
                    //this.nacinplacanja = this.storage.filterCollection(val, 'vrsta', vrstadok.oznaka);
                    //console.log(this.nacinplacanja)
                    resolve(this.nacinplacanja);
                }, (error) => {
                    reject(error);
                });
        });

    }



    //kod kreiranja nove narudzbe ako je oznaka vrste dokumenta MP selektiraj automatski ID nacina placanja - gotovina
    loadNacinPlacanjaId(vrsta): Promise<any> {
        //console.log(vrsta)
        let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "nacinplacanja");
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
                    let nacPlac;
                    if (vrsta == "MP")
                        nacPlac = this.storage.filterCollectionSingleValue(val, "naziv", "Gotovina");
                    else
                        nacPlac = this.storage.getFirstArrayElement(val);
                    this.nacinPlacanjaId = nacPlac ? nacPlac.id : null;
                    resolve(this.nacinPlacanjaId);
                }, (error) => {
                    reject(error);
                });
        });

    }



    searchRoba(term): Promise<any> {

        return new Promise((resolve, reject) => {
          

            this.robaSearchDataList = this.roba.filter((v) => {
                if (v.barcode)
                    return v.naziv.toLowerCase().includes(term.toLowerCase()) || v.sifra.toLowerCase().includes(term.toLowerCase()) || v.barcode.toLowerCase().includes(term.toLowerCase())
                else
                    return v.naziv.toLowerCase().includes(term.toLowerCase()) || v.sifra.toLowerCase().includes(term.toLowerCase())
            })
            if (this.robaSearchDataList) {
                this.robaSearchDataList = this.storage.orderItemsBy(this.robaSearchDataList, 'sifra', 'asc')
                resolve(this.robaSearchDataList);
            }
            else
                reject();
        });

    }


    narudzbeCnt() {
        return new Promise((resolve, reject) => {
            this.dataServis.getAllNarudzbe()
                .then((val) => {
                    this.NarudzbeCnt = 0;

                    if (val) {
                        this.NarudzbeCnt = val ? val.length : 0;
                    }
                    resolve(this.NarudzbeCnt);
                }, (error) => {
                    reject(error);
                });
        });
    }




}
