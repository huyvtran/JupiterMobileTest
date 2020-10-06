import { Injectable } from '@angular/core';
import { GlobalProvider } from '../core/global-provider';
import { StorageProvider } from '../core/storage-provider';
import * as ICore from '../../interfaces/ICore';
import * as IInvetura from '../../interfaces/modules/IInvetura';

import { ConstProvider } from '../core/const-provider';
import { ToastOptions, ToastController } from 'ionic-angular';

@Injectable()
export class InventuraProvider {

    public pageListenFunc: Function;
    public disableKeyboardListener:boolean = false;
    public SearchString: string = '';

    // selectedTabIndex: number = 0;
    indeksO: number = 0;
    indeksP: number = 0;
    public osinventuraglaid: number;
    public osinventuranaziv: string;
    public osbarcodepubvar: number = 10;
    public listImovina: Array<IInvetura.InventuraStavka> = [];
    public listImovinaO: Array<IInvetura.InventuraStavka> = [];
    public listImovinaP: Array<IInvetura.InventuraStavka> = [];
    public listImovinaA: Array<IInvetura.InventuraStavka> = [];
    public stavke: Array<IInvetura.StavkaModel> = [];
    private tempIdList: number[];
    private tempKolicinaList: number[];

    public tabBadgeOcekivana: number = 0;
    public tabBadgePopisana: number = 0;

    public inventuraList: Array<IInvetura.Inventura> = [];

    keyInv = this.constants.inventuraStorageKeys.find((r: any) => r.keyname === "inventura");
    keyImo = this.constants.inventuraStorageKeys.find((r: any) => r.keyname === "imovina");

    constructor(private global: GlobalProvider, private storage: StorageProvider,
         private constants: ConstProvider, private toastCtrl: ToastController) {
    }

    getInventure(): Promise<IInvetura.Inventura[]> {

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((val) => {
                    this.inventuraList = [];
                    if (val != null) {
                        val.forEach(inventura => {
                            if (inventura.checked == 'true')
                                this.inventuraList.push(inventura);
                        });
                    }
                })
                .then((res) => {
                    resolve(this.inventuraList)
                }
                    , (error) => {
                        reject(error);
                    });
        });
    }
    getInvStavke(osInventuraGlaId: number): Promise<any> {

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((val) => {

                    val = <IInvetura.Inventura>this.storage.filterCollectionSingleValue(val, 'osinventuraglaid', osInventuraGlaId);

                    this.listImovina = val.imovina;

                    resolve(this.listImovina);
                }, (error) => {
                    reject(error);
                });
        });
    }
    getInvStavkeBoth(osInventuraGlaId: number): Promise<any> {

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((val) => {

                    val = <IInvetura.Inventura>this.storage.filterCollectionSingleValue(val, 'osinventuraglaid', osInventuraGlaId);
                    this.listImovinaO = [];
                    this.listImovinaP = [];
                    this.tabBadgeOcekivana = 0;
                    this.tabBadgePopisana = 0;
                    this.indeksO = 0;
                    this.indeksP = 0;

                    if (val != null) {
                        for (let i: number = 0; i < val.imovina.length; i++) {
                            let imIt = val.imovina[i];

                            if (imIt.smjestajnakolicina > imIt.popisanakolicina) {
                                this.listImovinaO[this.indeksO] = imIt;
                                this.tabBadgeOcekivana++;
                                this.indeksO++;
                            }
                            if (imIt.popisanakolicina > 0) {
                                this.listImovinaP[this.indeksP] = imIt;
                                this.tabBadgePopisana++;
                                this.indeksP++;
                            }
                        }

                    }

                    resolve(this.listImovinaO);
                }, (error) => {
                    reject(error);
                });
        });
    }
    getAllImovina(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyImo.keyvalue, null, true)
                .then((val) => {

                    this.listImovinaA = [];

                    if (val != null) {
                        this.listImovinaA = val;
                    }

                    resolve(this.listImovinaA);
                }, (error) => {
                    reject(error);
                });
        });
    }
    setAllImovinaOcekivano(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyImo.keyvalue, null, true)
                .then((imovine) => {
                    if (imovine) {
                        imovine.forEach((imovina) => {
                            this.listImovinaO.forEach((ocekivana) => {
                                if (imovina.osimovinaid == ocekivana.osimovinaid) {
                                    imovina.ocekivano = "";
                                    imovina.osinventuradetid = ocekivana.osinventuradetid;
                                }
                            })
                        });
                    }
                    return imovine;
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(this.keyImo.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });
        });
    }
    setAllImovinaPronadjeno(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.SetTempList()
                .then((res) => {
                    if (res) {
                        this.storage.getFromStorage(this.keyImo.keyvalue, null, true)
                            .then((imovine) => {
                                if (imovine) {
                                    imovine.forEach((imovina) => {
                                        let index = this.tempIdList.indexOf(imovina.osimovinaid);
                                        if (index != null) {
                                            if (index > -1) {
                                                imovina.pronadjeno = "DA";
                                                imovina.evidentirano = this.tempKolicinaList[index];
                                            }
                                            else {
                                                imovina.pronadjeno = "";
                                                imovina.evidentirano = 0;
                                            }
                                        }
                                    });
                                }
                                return imovine;
                            })
                            .then((res) => {
                                resolve(this.storage.addToStorage(this.keyImo.keyvalue, null, res, true))
                            }
                                , (error) => {
                                    reject(error);
                                });
                    }
                })
        });
    }
    SetTempList(): Promise<any> {
        this.tempIdList = [];
        this.tempKolicinaList = [];

        return new Promise((resolve, reject) => {
            this.listImovinaP.forEach((popisana) => {
                if (popisana.osimovinaid != null) {
                    this.tempIdList.push(popisana.osimovinaid);
                    this.tempKolicinaList.push(popisana.popisanakolicina);
                }
            })

            resolve(true);
        });
    }
    updateStavka(kolicinaHlp: string, item?, popisanaKolicina?: number, novaStavka?: IInvetura.InventuraStavka): Promise<any> {
        console.log('uosao u update')
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((inventure) => {
                    if (inventure) {
                        inventure.forEach((inventura) => {
                            if (inventura.osinventuraglaid === this.osinventuraglaid && inventura.imovina && inventura.imovina.length > 0) {
                                if (kolicinaHlp == 'newOne') {
                                    novaStavka.vrijemepromjene = new Date();
                                    inventura.imovina.push(novaStavka);
                                    this.newItemAlert(novaStavka);
                                }
                                else
                                    inventura.imovina.forEach((stavka) => {
                                        if (stavka.osinventuradetid === item.osinventuradetid && stavka.osimovinaid === item.osimovinaid
                                            && stavka.guid === item.guid) {
                                            switch (kolicinaHlp) {
                                                case ('scanOne'):
                                                    stavka.popisanakolicina = +stavka.popisanakolicina + 1;
                                                    if (stavka.popisanakolicina > stavka.smjestajnakolicina)
                                                        this.countAlert(stavka);
                                                    else
                                                        this.localToast("Pronađena je imovina inventurnog broja '" + stavka.invbroj + "'");
                                                    break;
                                                case ('scanAll'):
                                                    if (stavka.osinventuradetid != null) {
                                                        stavka.popisanakolicina = stavka.smjestajnakolicina;
                                                    }
                                                    break;
                                                case ('removeOne'):
                                                    stavka.popisanakolicina = +stavka.popisanakolicina - 1;
                                                    break;
                                                case ('removeAll'):
                                                    if (stavka.osinventuradetid != null) {
                                                        stavka.popisanakolicina = 0;
                                                    }
                                                    else if (stavka.osimovinaid != null) {
                                                        var index = this.storage.findArrayIndex(inventura.imovina, "osimovinaid", stavka.osimovinaid);
                                                        inventura.imovina.splice(index, 1);
                                                    }
                                                    else {
                                                        var index = this.storage.findArrayIndex(inventura.imovina, "guid", stavka.guid);
                                                        inventura.imovina.splice(index, 1);
                                                    }
                                                    break;
                                                case ('scanEnterNumber'):
                                                    if (popisanaKolicina != stavka.popisanakolicina) {
                                                        stavka.popisanakolicina = popisanaKolicina;

                                                        if (stavka.popisanakolicina > stavka.smjestajnakolicina)
                                                            this.countAlert(stavka);
                                                    }
                                                    break;
                                                default:
                                                    break;
                                            }
                                            stavka.vrijemepromjene = new Date();
                                        }
                                    });
                            }
                        });
                    }
                    return inventure
                })
                .then((res) => {
                    console.log(res);
                    resolve(this.storage.addToStorage(this.keyInv.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });
        });
    }
    resetInventura(inventuraId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((inventure) => {
                    if (inventure) {
                        inventure.forEach((inventura) => {
                            if (inventura.osinventuraglaid === inventuraId && inventura.imovina && inventura.imovina.length > 0) {
                                inventura.imovina.forEach((stavka) => {
                                    if (stavka.osinventuradetid != null) {
                                        stavka.popisanakolicina = 0;
                                    }
                                    else {
                                        var index = this.storage.findArrayIndex(inventura.imovina, "osinventuradetid", null);
                                        var spliceHlp = inventura.imovina.length - index;
                                        inventura.imovina.splice(index, spliceHlp);
                                    }
                                });
                            }
                        });
                    }
                    return inventure
                })
                .then((res) => {
                    console.log(res);
                    resolve(this.storage.addToStorage(this.keyInv.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });
        });
    }

    sendInvToDb(inventuraId: number): Promise<any> {
        var promises = [];
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((inventure) => {
                    if (inventure) {
                        inventure.forEach((inventura) => {
                            if (inventura.osinventuraglaid === inventuraId && inventura.imovina && inventura.imovina.length > 0) {
                                inventura.imovina.forEach(stavka => {
                                    promises.push(this.createJson(stavka, inventura.mobosinventuraglaid));
                                });
                            }
                        });
                        return Promise.all(promises);
                    }
                })
                .then((res) => {
                    // console.log(res);
                    if (res) {
                        this.sendImovina(res)
                            .then((res) => {
                                if (res["Success"] == true) {
                                    this.confirmInv(inventuraId)
                                        .then((res) => {
                                            if (res) {
                                                return this.resetInventura(inventuraId);
                                            }
                                        })
                                        .then((res) => {
                                            if (res) {
                                                resolve("success");
                                            }
                                        })
                                }
                            })
                            .catch((err) => console.log(err))
                    }
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }
    confirmInv(inventuraId: number): Promise<any> {
        let dateNow = new Date();

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((inventure) => {
                    if (inventure) {
                        inventure.forEach((inventura) => {
                            if (inventura.osinventuraglaid === inventuraId && inventura.imovina && inventura.imovina.length > 0) {
                                inventura.vrijemezavrsetka = dateNow;
                            }
                        });
                    }
                    return inventure
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(this.keyInv.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });
        });
    }
    unCheckInventure(): Promise<Response> {
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((inventure) => {
                    if (inventure) {
                        inventure.forEach((inventura) => {
                            inventura.checked = "false";
                            inventura.mobosinventuraglaid = null;
                        });
                    }
                    return inventure
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(this.keyInv.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });
        });
    }
    checkInventure(list1: number[], list2: number[]): Promise<Response> {
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((inventure) => {
                    if (inventure) {
                        inventure.forEach((inventura) => {
                            let index: number = list1.indexOf(inventura.osinventuraglaid);
                            if (index > -1) {
                                inventura.checked = "true";
                                inventura.mobosinventuraglaid = list2[index];
                            }
                        });
                    }
                    return inventure
                })
                .then((res) => {
                    resolve(this.storage.addToStorage(this.keyInv.keyvalue, null, res, true))
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }
    setInvCountFromStorage(): Promise<string> {
        var checkedInvCount: number = 0;
        var availableInvCount: number = 0;
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyInv.keyvalue, null, true)
                .then((inventure) => {
                    if (inventure) {
                        inventure.forEach((inventura) => {
                            availableInvCount++;
                            if (inventura.checked == 'true') {
                                checkedInvCount++;
                            }
                        });

                        resolve(checkedInvCount + '/' + availableInvCount);
                    }
                    else
                        resolve("0/0");
                })
        });
    }
    setImoCountFromStorage(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyImo.keyvalue, null, true)
                .then((imovina) => {
                    if (imovina) {
                        resolve(imovina.length);
                    }
                    else
                        resolve("0");
                })
        });
    }
    sendImovina(jsonObject): Promise<Response> {

        let properties: ICore.IPropertiesCore = {
            customApiEndPoint: "insertMultiple"
        }
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobUtiInvAzur",
                    "params": {
                        "items": jsonObject

                    }
                }
            ]
        }
        return this
            .global
            .getData(data, properties);

    }

    createJson(stavka, mobosinventuraglaid: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let modelItem = new IInvetura.StavkaModel;
            modelItem.action = "updateInventuraDet";
            modelItem.kolicina = stavka.popisanakolicina;
            modelItem.mobosinventuraglaid = mobosinventuraglaid;
            modelItem.osimovinaid = stavka.osimovinaid;
            modelItem.osinventuradetid = stavka.osinventuradetid;
            modelItem.vrijemeunosa = stavka.vrijemepromjene;
            modelItem.memo = stavka.memo;

            resolve(modelItem);
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

    countAlert(item) {
        if (item.osinventuradetid != null)
            this.localToast("Za inventurni broj '" + item.invbroj + "' evidentirana je veća količina ("
                + item.popisanakolicina + ") od očekivane (" + item.smjestajnakolicina + ")");
        else
            this.newItemAlert(item);
    }
    newItemAlert(item) {
        if (item.osimovinaid != null) {
            this.localToast("Evidentirana je neočekivana imovina inventurnog broja '" + item.invbroj + "'");
        }
    }

    localToast(message: string, cssClass?: string, duration?: number, showCloseButton: boolean = false) {
        console.log(message);
        if (duration == null || duration == 0)
            duration = 1500;

        let toastOptions: ToastOptions = {};

        toastOptions.message = message;
        toastOptions.duration = showCloseButton ? null : duration;
        toastOptions.position = 'bottom';
        toastOptions.cssClass = cssClass;
        toastOptions.showCloseButton = showCloseButton;
        toastOptions.closeButtonText = "Ok";

        let toast = this
            .toastCtrl
            .create(toastOptions);

        toast.present();
    }
}