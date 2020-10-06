import { ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {GlobalProvider} from '../../core/global-provider';
import * as ICore from '../../../interfaces/ICore';

import * as Moment from 'moment';

@Injectable()
export class SkladistePrijemniListProvider {
    properties : ICore.IProperties = {
        errorMessageCloseButton: false
    }
    properties1 : ICore.IProperties = {
        errorMessageCloseButton: false,
        showLoader : false
    }
    
/*****************************************  GENERAL   *****************************************/ 
    documentType:string = '';
    refreshViewInd:boolean = false;
    customSearchPageResult:any = {}
/*****************************************  PRIJEMNI LIST   *****************************************/
    kreiraniDok : any;

    barcodeSearchString:string = '';
    scanRoba:any = {};


    primkeFilterDatumOd: string = new Date().toISOString();
    primkeFilterDatumDo: string = new Date().toISOString();
    primkeFilterSkladisteId:number;
    primkeFilterSkladisteNaziv:string;
    SearchString:string = '';


    Partner:any = {};
    PrijemniListUnosZapamtiDatum: string = new Date().toISOString();
    PrijemniListUnosZapamtiSkladistePrava:any = {};
    PrijemniListUnosZapamtiOrgShema:any = {};
    PrijemniListUnosZapamtiOdgOsoba:any = {};
    PrijemniListUnosZapamtiVrstadok:any = {};
    PrijemniListUnosIzmjenaSkladisteMinDatum:string = '';
    PrijemniListUnosIzmjenaSkladisteMaxDatum:string = '';


    nabprigla:any = {};
    nabpridet:any = {};
/*****************************************  PRIJEMNI LIST -END   *****************************************/

  constructor(public http: Http, private global: GlobalProvider, private modalCtrl: ModalController) {
  }

  presentSearchModal(searchType : string, trazilicaBrojZnakova:number, cijelaSearchListaOnInit:boolean) {
    this.global.modal = this
    .modalCtrl
    .create("SkladisteSearchModalPage", [searchType, trazilicaBrojZnakova, cijelaSearchListaOnInit] ,{enableBackdropDismiss: false});

    this.global.modal.present();


    this.global.modal.onDidDismiss((searchResult) => {
      if (searchResult == null || searchResult == undefined)
        return; 

      if (searchType=='partneri')
        this.Partner = searchResult;
      else if (searchType=='orgshema')
        this.PrijemniListUnosZapamtiOrgShema = searchResult;
      else if (searchType=='odgosoba')
        this.PrijemniListUnosZapamtiOdgOsoba = searchResult;
      else if (searchType=='skladiste')
        this.PrijemniListUnosZapamtiSkladistePrava = searchResult;

        this.global.modal = null;
    });
  }

  getPrimka(nabpriglaid:number) {


    let dataDef: ICore.IData = {
    "queries": [
        {
            "query": "spMobSkladiste_PrijemniList_getPrimka",
            "params": {
                "nabpriglaid": nabpriglaid
            },
        }]
    }
    return this.global.getData(dataDef, this.properties);
 }
  
  getMojiDokumenti() {

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMobSkladiste_PrijemniList_getMojiDokumenti",
        "params": {
            "operateriid": '@@operateriid'
        },
        // "tablename":"primke"
        }
    ]
    };

    return this.global.getData(dataDef, this.properties);
    }


    getFiltriraniDokumenti() {
    
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMobSkladiste_PrijemniList_getFiltriraniDokumenti",
                "params": {
                    "datumOd": Moment(this.primkeFilterDatumOd).format("YYYY-MM-DD"),
                    "datumDo": Moment(this.primkeFilterDatumDo).format("YYYY-MM-DD"),
                    "skladisteid": this.primkeFilterSkladisteId,
                    "operateriid": '@@operateriid'
                }
            }]
        };
        return this.global.getData(dataDef, this.properties);
    }

    getSkladistaPrava(keyword:string) {
    
        let dataDef: ICore.IData = {
        "queries": [
            {
            "query": "spMobSkladiste_PrijemniList_GetSkladistaPrava",
            "params": {
                "keyword": keyword,
                "operateriid" : '@@operateriid', 
            },
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    getVrstaDok() {
        let dataDef: ICore.IData = {
        "queries": [
            {
            "query": "spMobSkladiste_PrijemniList_getVrstaDok"
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    getPartneri(keyword) {

        let dataDef: ICore.IData = {
        "queries": [
            {
            "query": "spMobSkladiste_PrijemniList_GetPartneri",
            "params": {
                "keyword": keyword
            },
            // "tablename":"primke"
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    getOrgShema(keyword) {
        let dataDef: ICore.IData = {
        "queries": [
            {
            "query": "spMobSkladiste_PrijemniList_GetOrgShema",
            "params": {
                "keyword": keyword,
                "operateriid": '@@operateriid'
            },
            // "tablename":"primke"
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    getOdgOsobe(keyword) {
    
        let dataDef: ICore.IData = {
        "queries": [
            {
            "query": "spMobSkladiste_PrijemniList_GetOdgOsoba",
            "params": {
                "keyword": keyword
            },
            // "tablename":"primke"
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    getRoba(keyword) {
        let dataDef: ICore.IData = {
        "queries": [
            {
            "query": "spMobSkladiste_PrijemniList_GetRoba",
            "params": {
                "keyword": keyword
            },
            // "tablename":"primke"
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    getScanRoba(barcode:string) {
        let dataDef: ICore.IData = {
        "queries": [
            {
            "query": "spMobSkladiste_PrijemniList_GetRobaByScanBarcode",
            "params": {
                "barcode": barcode
            },
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    prijemniListInsert(datum:string, orgshemaid:number, partneriid:number, osobeid:number, vrstadokid:number, opis:string, skladisteid:number, otpremnica:string) {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_Insert",
                "params": {
                    "action" : 0, 
                    "OrgShemaId" : orgshemaid, 
                    "OperateriId" : '@@operateriid', 
                    "PartneriId" : partneriid, 
                    "OsobeId" : osobeid,
                    "VrstaDokId" : vrstadokid,
                    "DatumDok" : Moment(datum).format("YYYY-MM-DD"), 
                    "Opis" : opis, 
                    "SkladisteId" : skladisteid,
                    "Otpremnica" : otpremnica, 
                    "prefix" : '-'
                }
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    prijemniListEdit(nabpriglaid:number, datum:string, orgshemaid:number, partneriid:number, osobeid:number, vrstadokid:number, opis:string, skladisteid:number, otpremnica:string) {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_Edit",
                "params": {
                    "nabpriglaid" : nabpriglaid, 
                    "OrgShemaId" : orgshemaid, 
                    "OperateriId" : '@@operateriid', 
                    "PartneriId" : partneriid, 
                    "OsobeId" : osobeid,
                    "VrstaDokId" : vrstadokid,
                    "DatumDok" : Moment(datum).format("YYYY-MM-DD"), 
                    "Opis" : opis, 
                    "SkladisteId" : skladisteid,
                    "Otpremnica" : otpremnica
                }
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    prijemniListDelete(nabpriglaid:number) {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spmobskladiste_prijemnilist_obrisi",
                "params": {
                    "nabpriglaid" : nabpriglaid 
                }
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    prijemniListZakljuci(nabpriglaid:number) {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spmobskladiste_prijemnilist_zakljuci",
                "params": {
                    "nabpriglaid" : nabpriglaid,
                    "operateriid": '@@operateriid' 
                }
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    prijemniListPonistiZakljucak(nabpriglaid:number) {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_PonistiZakljucak",
                "params": {
                    "nabpriglaid" : nabpriglaid,
                    "operateriid": '@@operateriid' 
                }
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    getPartnerDobavljacPromjenaInd(nabpriglaid:number) {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_GetPrimkaPartnerPromjenaInd",
                "params": {
                    "nabpriglaid" : nabpriglaid 
                }
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }
    

    

    prijemniListStavkaInsert(
        // nabnarglaid:number,
         nabpriglaid:number, robaid:number, kolicina:number,
         napomena:string, kolicinaJMR:number, nabnardetid:number, donosindikator:boolean) {
        
        let properties : ICore.IProperties = {
            errorMessageCloseButton: false
        }
    
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_StavkeInsert",
                "params": {
                    // "nabnarglaid": nabnarglaid,
                    "nabpriglaid" : nabpriglaid,
                    "robaid": robaid,
                    "kolicina": kolicina,
                    "napomena": napomena,
                    "pakkolicina": kolicinaJMR,
                    "nabnardetid": nabnardetid,
                    "donosindikator": donosindikator
                },
        }]
        }
        return this.global.getData(dataDef, this.properties);
    }

    prijemniListStavkaUpdate(nabpridetid:number, robaid:number, kolicina:number, napomena:string, kolicinaJMR:number) {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_StavkeUpdate",
                "params": {
                    "nabpridetid" : nabpridetid,
                    "robaid": robaid,
                    "kolicina": kolicina,
                    "napomena": napomena,
                    "@pakkolicina": kolicinaJMR
                },
        }]
        }
        return this.global.getData(dataDef, this.properties);
    }
    
    prijemniListStavkaDelete(nabpridetid:number) {
        let properties : ICore.IProperties = {
            errorMessageCloseButton: false
        }
    
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_StavkeDelete",
                "params": {
                    "nabpridetid" : nabpridetid,
                },
        }]
        }
        return this.global.getData(dataDef, this.properties);
    }

    
    getSkladisteMinDate() {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_getSkladisteMinDate"
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    getSkladisteMaxDate() {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_getSkladisteMaxDate"
            }
        ]
        };
        return this.global.getData(dataDef, this.properties);
    }

    saveNapomena(nabpriglaid:number, napomena:string) {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_prijemniList_UpdateGlavaOpis",
                "params": {
                    "nabpriglaid": nabpriglaid,
                    "napomena": napomena    
                },
        }]
        }
        return this.global.getData(dataDef, this.properties);
    }

    getStavkaPrimke(nabpridetid:number) {
        //console.log(this.nabpridet.nabpridetid)
    
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_getStavkaPrimke",
                "params": {
                    "nabpridetid": nabpridetid
                },
        }]
        }
        return this.global.getData(dataDef, this.properties);
    }

    getStavkePrimke(nabpriglaid:number) {
        let dataDef: ICore.IData = {
        "queries": [
            {
                "query": "spMobSkladiste_PrijemniList_getStavke",
                "params": {
                    "nabpriglaid": nabpriglaid
                },
        }]
        }
        return this.global.getData(dataDef, this.properties);
    }

    getSifraRobeiJM(robaid:number) {
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobSkladiste_PrijemniList_getSifraRobeiJM",
                    "params": {
                        "robaid": robaid,
                    }
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }

    getJMRoba(robaid:number) {
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobSkladiste_PrijemniList_getJMRoba",
                    "params": {
                        "robaid": robaid,
                    }
                }]
            };
            return this.global.getData(dataDef, this.properties);
    }

    // getDecimalsCount(robaid:number) {
    //     let properties : ICore.IProperties = {
    //         errorMessageCloseButton: true
    //     }
    
    //     let dataDef: ICore.IData = {
    //         "queries": [
    //             {
    //                 "query": "spMobSkladiste_prijemniList_GetDecimals",
    //                 "params": {
    //                     "robaid": robaid
    //                 },
    //         }]
    //     }
    //     return this.global.getData(dataDef, this.properties);
    // }

    getCijena(robaid:number, skladisteid:number) {
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobSkladiste_prijemniList_GetCijena",
                    "params": {
                        "robaid": robaid,
                        "skladisteid": skladisteid
                    },
            }]
        }
        return this.global.getData(dataDef, this.properties);
    }

    getCijenaVidljivaInd() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobSkladiste_PrijemniList_GetCijenaVidljiva",
                    "params": {
                        "@operateriid": '@@operateriid'
                    },
            }]
        }
        return this.global.getData(dataDef, this.properties);
    }

    getPrimkaDonosStavke(partneriid:number) {
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobSkladiste_PrijemniList_DonosStavki",
                    "params": {
                        "partneriid": partneriid,
                        "operateriid": '@@operateriid'
                    },
            }]
        }
        return this.global.getData(dataDef, this.properties);
    }

    // insertPrimkaDonosStavke(nabpriglaid:number, robaid:number, kolicina:number, nabnardetid:number, nabnarglaid:number) {
    //     let properties : ICore.IProperties = {
    //     errorMessageCloseButton: true
    //     }
    
    //     let dataDef: ICore.IData = {
    //         "queries": [
    //             {
    //                 "query": "spMobSkladiste_PrijemniList_DonosStavkiInsert",
    //                 "params": {
    //                     "DonosNabPriGlaId" : nabpriglaid,  
    //                     "DonosRobaId" : robaid,  
    //                     "DonosKolicina" : kolicina,  
    //                     "DonosNabNarDetId" : nabnardetid ,
    //                     "DonosNabNarGlaId" : nabnarglaid,
    //                     "DonosLnNarPriKolicina" : kolicina
    //                 },
    //         }]
    //     }
    //     return this.global.getData(dataDef, this.properties);
    // }

    getDokOperaterLock(nabpriglaid) {
        let dataDef: ICore.IData = {
        "queries": [
            {
            "query": "spMobSkladiste_PrijemniList_getOperaterLockDok",
            "params": {
                "nabpriglaid": nabpriglaid,
                "operateriid": '@@operateriid'
            },
            // "tablename":"primke"
            }
        ]
        };
        return this.global.getData(dataDef, this.properties1);
    }

    lockUnlockDocument(nabpriglaid,action) {

    
        let dataDef: ICore.IData = {
        "queries": [
            {
            "query": "spMobSkladiste_PrijemniList_lockUnlockDocument",
            "params": {
                "nabpriglaid": nabpriglaid,
                "action": action,
                "operateriid": '@@operateriid'
            },
            // "tablename":"primke"
            }
        ]
        };
        return this.global.getData(dataDef, this.properties1);
    }
}



// export interface IPrijemniListUnosIzmjenaParametri {
//     action : number, 
//     OrgShemaId : number, 
//     OperateriId : number, 
//     PartneriId : number, 
//     OsobeId : number,
//     VrstaDokId : number,
//     DatumDok : string, 
//     Opis : string, 
//     SkladisteId : number,
//     Otpremnica : string, 
//     prefix : string
// }
