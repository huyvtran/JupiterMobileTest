import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { InventuraProvider } from '../../../../../providers/modules/inventura-provider'
import * as ICore from '../../../../../interfaces/iCore';
import { BasePage } from '../../../../../providers/base/base-page';
import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../../providers/core/const-provider';

@IonicPage()
@Component({
    selector: 'page-utility-inventura-sinkronizacija-modal',
    templateUrl: 'sinkronizacija-modal.html',
})
export class UtilityInventuraSinkronizacijaModalPage extends BasePage {

    dataList: Array<any>;
    checkedList: number[] = [];
    public inventura: Array<any>;
    public allImovina: Array<any>;

    constructor(private view: ViewController, private invProvider: InventuraProvider
        , private constants: ConstProvider, private storage: StorageProvider) {
        super();

        this.getData();
    }
    // ionViewDidLoad() {
    //     this.getData();
    // }
    dismiss(doDismiss: string) {
        this.view.dismiss(doDismiss);
    }

    getData() {
        this.checkedList = [];
        this.getAllInventure().then(dataDef => {
            console.log(dataDef)
            if (dataDef != null) {
                this.dataList = dataDef.openinventure;
                this.dataList.forEach(inv => {
                    if (inv.checked == "true") {
                        this.checkedList.push(inv.osinventuraglaid);
                    }
                });
            }
            else {
                this.setKeys().then(() => {
                    let key = this.constants.inventuraStorageKeys.find((r: any) => r.keyname === "inventura");
                    this.storage.addToStorage(key.keyvalue, null, '', true).then(() => {
                        this.dismiss('false');
                    });
                });

            }
        });
    }
    setKeys(): Promise<any> {
        return this.tryCreateImoKey().then(() => {
            return this.tryCreateInvKey().then(() => {
                return this.deleteMyInventure().then(() => {
                    return this.invProvider.unCheckInventure();
                });
            });
        });
    }
    checkPerson(item){
        this.invProvider.localToast("Inventuru je paralelno preuzeo operater(i) '" + item.drzedrugi + "'")
    }
    startConfirm() {
        this.confirm().then((res) => {
            if (res) {
                this.dismiss('false');
            }
        });
    }
    confirm(): Promise<any> {
        var promises = [];
        var promises2 = [];
        var returnIdList: number[] = [];

        return this.setKeys()
            .then((res) => {
                if (res) {
                    
                    this.checkedList.forEach(id => {
                        promises.push(this.setMyInventure(id).then((res) => {
                             returnIdList.push(res.id);
                        }))
                    });
                }
                return Promise.all(promises);
            })
            .then((res) => {
                if (res) {
                    promises2.push(this.invProvider.checkInventure(this.checkedList, returnIdList));
                    return Promise.all(promises2);
                }
            })
            .catch(err => console.log(err))
    }

    tryCreateInvKey(): Promise<any> {
        let key = this.constants.inventuraStorageKeys.find((r: any) => r.keyname === "inventura");
        return this.syncInventuraData()
            .then((res) => {
                if (res)
                    return this.inventura = res.inventura
            })
            .then((res) => {
                //spremi u storage podatke sa servisa
                return this.storage.addToStorage(key.keyvalue, null, this.inventura, true)
            })
            .catch(err => console.log(err))

    }
    tryCreateImoKey(): Promise<any> {
        let key = this.constants.inventuraStorageKeys.find((r: any) => r.keyname === "imovina");
        return this.syncAllImovinaData()
            .then((res) => {
                if (res) {
                    return this.allImovina = res.allimovina
                }
            })
            .then((res) => {
                //spremi u storage podatke sa servisa
                return this.storage.addToStorage(key.keyvalue, null, this.allImovina, true)
            })
            .catch(err => console.log(err))
    }
    updateSelectedList(event, item) {
        if (event.checked == true) {
            this.checkedList.push(item.osinventuraglaid);
        }
        else {
            let tempIndex = this.checkedList.indexOf(item.osinventuraglaid);
            this.checkedList.splice(tempIndex, 1);
        }
    }

    //#region Data

    syncInventuraData() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobUtiInvQuery",
                    "params": {
                        "action": "getAllInv",
                        "operateriid": "@@operateriid"
                    },
                    "tablename": "inventura"
                },
                {
                    "query": "spMobUtiInvQuery",
                    "params": {
                        "action": "getSpecificInv"
                    },
                    "tablename": "imovina",
                    "refkey": "OSInventuraGlaId",
                    "reftable": "inventura"
                }
            ]
        }

        return this.global.getData(dataDef);
    }
    getAllInventure() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobUtiInvQuery",
                    "params": {
                        "action": "getAllInv",
                        "operateriid": "@@operateriid"
                    },
                    "tablename": "openinventure"
                }
            ]
        }

        return this.global.getData(dataDef);
    }
    setMyInventure(id: number) {
        let properties: ICore.IPropertiesCore = {
    
        }
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobUtiInvAzur",
                    "params": {
                        "action": "setMyInv",
                        "operateriid": "@@operateriid",
                        "osinventuraglaid": id
                    },
                    "singlerow": true
                }
            ]
        }
        return this
            .global
            .getData(data, properties);

    }
    deleteMyInventure() {
        let properties: ICore.IPropertiesCore = {
      
        }
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobUtiInvAzur",
                    "params": {
                        "action": "deleteMyInv",
                        "operateriid": "@@operateriid"
                    },
                    "singlerow": true
                }
            ]
        }
        return this
            .global
            .getData(data, properties);
    }
    syncAllImovinaData() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobUtiInvQuery",
                    "params": {
                        "action": "getAllImovina",
                    },
                    "tablename": "allimovina"
                }
            ]
        }

        return this.global.getData(dataDef);
    }

    //#endregion

}
