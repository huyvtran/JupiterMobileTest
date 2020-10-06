import {Storage} from '@ionic/storage';
import {Injectable} from '@angular/core';
import {App} from 'ionic-angular';

import {GlobalProvider} from './core/global-provider';
import {StorageProvider} from './core/storage-provider';

import * as ICore from '../interfaces/ICore';
import { ConstProvider } from './core/const-provider';
import { HistoryProvider } from './history-provider';

@Injectable()
export class PartnerinfoProvider extends HistoryProvider {


    constructor(private xApp : App
        , private xGlobal: GlobalProvider
        , private xStorageProvider: StorageProvider
        , private xConstProvider: ConstProvider) {

        super(xApp, xGlobal, xStorageProvider, xConstProvider);
        this.storageKey = this.xConstProvider.modulesStorageKeys.infoPartnersHistory;
    }

    xSetData(id)
    {
        this.setData(this.getDataDefinition(id), id, null);
    }

    getDataDefinition(id): ICore.IData {
        let data : ICore.IData = {
            "queries": 
            [
               {
                    "query": "spMobInfoPartner",
                    "params": {
                        "action": "getInfo",
                        "id": id
                    },
                    "singlerow": true
                },
                {
                    "query": "spMobInfoPartner",
                    "params": {
                        "action": "getOsobe",
                        "id": id
                    },
                    "tablename": "osobe"
                    
                },
                {
                    "query": "spMobInfoPartner",
                    "params": {
                        "action": "getLokacije",
                        "id": id
                    },
                    "tablename": "lokacije"
                    
                },
                {
                    "query": "spMobInfoPartner",
                    "params": {
                        "action": "getBiljeske",
                        "id": id
                    },
                    "tablename": "biljeske"
                }
            ]
        }
        return data;
    }
}
