import {Storage} from '@ionic/storage';
import {Injectable} from '@angular/core';
import {App} from 'ionic-angular';

import {GlobalProvider} from './core/global-provider';
import {StorageProvider} from './core/storage-provider';

import * as ICore from '../interfaces/ICore';
import { ConstProvider } from './core/const-provider';

@Injectable()
export class HistoryProvider {
    public storageKey: string;

    private storageData : Array <any>;
    public items : any = {};

    public loading : boolean = false;
    public naziv : string = "...";



    constructor(private app : App
        , private global: GlobalProvider
        , private storageProvider: StorageProvider
        , private constProvider: ConstProvider) {
    }

    public setData(iData, id, searchItem) {
        this.loading = true;
        this.naziv = "...";
        

        Promise
            .resolve()
            .then((val) => {
                if (val == null) {
                    this
                        .getServerData(iData)
                        .then(data => {
                            this.setMainData(data, id);
                        })
                }
            })
            .then(() => {
                this.addSerchDataToStorage(searchItem);
            })
            .then(() => {
                this.getDataFromStorage();
            })
            .then(() => this.loading = false);
    }

    clearData() {
        this.storageData = new Array <any> ();
    }

    getStorageKey(): string {
        return this.storageKey;
    }

    getDataFromStorage() {
        this.storageProvider.getFromStorage(this.getStorageKey(), null, true)
            .then(val => {
                let data = val;
                return data;
            }).then(val => {
                if (val == null) {
                    this.clearData();
                } 
                else {
                    //this.sortData(val);
                    this.storageData = val;
                }
            }).catch(ex => this.global.logError(ex, true));
    }

    sortData(data) {
        if (data != null) {
            this.storageData = data.sort(function (a, b) {
                var date1 = new Date(a.vrijemepretrage);
                var date2 = new Date(b.vrijemepretrage);
                return date1 < date2;
            }).slice(0,10);
        }
    }

    getItemFromData(data, id) {
        let filterData = this.filterStorageData(data, id);
        if (filterData.length > 0) {
            return filterData[0];
        }
        return null;
    }

    setMainData(data, id) {
        this.items = data;
    }

    addSerchDataToStorage(searchData) {
        if (searchData != null && searchData.id != null) {
            let checkData = this.filterStorageData(this.storageData, searchData.id);
            if (checkData == null || checkData.length == 0) {
                //push
                this
                    .storageData
                    .push(searchData);
                
                //sortiraj i uzmi prvih 10 zapisa
                this.sortData(this.storageData);
    
                this.storageProvider.addToStorage(this.getStorageKey(), null, this.storageData);
            }
        }
        
    }

    filterStorageData(obj, id) {
        //return obj.filter(x => x.partneriid == id);
        return obj.filter(x => x.id == id);
    }

    getServerData(data) {
        return this
            .global
            .getData(data);
     
    }
}
