import { Injectable } from '@angular/core';

import { ConstProvider } from '../../core/const-provider';
import { TerkomDataProvider } from './terkom-data-provider';
import { TerkomSifarniciProvider } from './terkom-sifarnici-provider';
import { StorageProvider } from '../../core/storage-provider';

import { Response, } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { GlobalProvider } from '../../core/global-provider';
import * as ICore from '../../../interfaces/ICore';

import _ from 'lodash';

@Injectable()
export class TerkomObavijestiProvider {

    obavijestiCnt: number = 0;
    obavijestiNeprocitaneCnt: number = 0;
    obavijestiLokacijaCnt: number = 0;
    obavijestiLokacijaNeprocitaneCnt: number = 0;
    obavijesti: Array<any> = [];

    constructor(public constants: ConstProvider,
        private sifarniciServis: TerkomSifarniciProvider,
        private dataServis: TerkomDataProvider,
        private storage: StorageProvider,
        private global: GlobalProvider, ) { }

    //dohvati posjet za parstrud ako postoji u storageu

    getObavijesti(parstruid?, partneriid?) {
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "obavijesti");
        let self = this.sifarniciServis;
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((val) => {
                    this.obavijesti = [];
                    this.obavijesti = val;
                    this.obavijestiNeprocitaneCnt = this.storage.filterCollection(this.obavijesti, "procitano", 0).length;
                    this.obavijestiCnt = this.obavijesti ? this.obavijesti.length : 0;
                    if (this.obavijesti)
                        this.obavijesti.forEach((obavijest) => {
                            let partner = null;
                            //dohvati prvi red obavijesti 
                            var lines = obavijest.obavijest.split('\n');

                            if (lines) {
                                obavijest.obavijest = ""
                                lines.forEach(element => {

                                    obavijest.obavijest += element + '<br/>';
                                });
                            }

                            obavijest.featured = lines.length > 1 ? lines[0] + ' ...' : lines[0];

                            if (obavijest.partneriid)
                                partner = this.storage.filterCollectionSingleValue(self.SveLokacije, 'parstruid', obavijest.partneriid);
                            else if (obavijest.parstruid)
                                partner = this.storage.filterCollectionSingleValue(self.SveLokacije, 'parstruid', obavijest.parstruid);

                            obavijest.lokacija = partner ? partner.naziv : null;
                            obavijest.partner = partner ? partner.nazivpartnera : null;
                        });

                    //ako postoji parstruid i partneriid filtriraj obavijesti lokacije
                    let filtriranoParstru = []
                    let filtriranoPartner = []

                    filtriranoParstru = this.storage.filterMultiCollection(this.obavijesti, { "parstruid": parstruid })
                    filtriranoPartner = this.storage.filterMultiCollection(this.obavijesti, { "partneriid": partneriid, "parstruid": null })

                    if (partneriid || parstruid) {
                        this.obavijesti = []
                        this.obavijesti = filtriranoPartner.concat(filtriranoParstru)
                    }

                    this.obavijestiLokacijaCnt = this.obavijesti ? this.obavijesti.length : 0;
                    this.obavijestiLokacijaNeprocitaneCnt = this.storage.filterCollection(this.obavijesti, "procitano", 0).length;;

                    this.obavijesti = this.storage.orderItemsBy(this.obavijesti, 'procitano', 'asc')
                    console.log(this.obavijesti)
                    resolve(this.obavijesti);
                }, (error) => {
                    reject(error);
                });
        });
    }


    updateStorageObavijest(obavijestId: number): Promise<any> {
        let key = this.constants.storageKeys.find((r: any) => r.keyname === "obavijesti");

        //update
        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key.keyvalue)
                .then((obavijesti) => {
                    if (obavijesti) {
                        obavijesti.forEach((obavijest) => {
                            if (obavijest.mobterkom_obavijestioperateriid === Number(obavijestId)) {
                                obavijest.procitano = 1;
                            }
                        });
                    }
                    return obavijesti
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(key.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });

    }



    azurirajObavijest(obavijestId) {

        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobTerkom_ObavijestProcitana",
                    "params": {
                        "MobTerkom_ObavijestiOperateriID": obavijestId
                    },
                    "singlerow": true
                }
            ]
        }

        return new Observable(observer => {
            setTimeout(() => {
                return this
                    .global
                    .getObservedData(data)
                        .map(res => res.json())
                        .subscribe(res => {
                            if (res) {
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
