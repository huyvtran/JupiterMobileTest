import { TimeProvider } from './core/time-provider';
import {Storage} from '@ionic/storage';
import {Injectable} from '@angular/core';
import {App} from 'ionic-angular';

import {GlobalProvider} from './core/global-provider';
import {StorageProvider} from './core/storage-provider';

import * as ICore from '../interfaces/ICore';
import { ConstProvider } from './core/const-provider';
import { HistoryProvider } from './history-provider';

@Injectable()
export class OsobeinfoProvider extends HistoryProvider {


    constructor(private xApp : App
        , private xGlobal: GlobalProvider
        , private xStorageProvider: StorageProvider
        , private xConstProvider: ConstProvider
        , private timeProvider: TimeProvider) {

        super(xApp, xGlobal, xStorageProvider, xConstProvider);
        this.storageKey = this.xConstProvider.modulesStorageKeys.infoOsobeHistory;
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
                    "query": "spMobInfoOsoba",
                    "params": {
                        "action": "osobaInfo",
                        "id": id
                    },
                    "singlerow": true
                },
               {
                    "query": "spMobInfoOsoba",
                    "params": {
                        "action": "osobaFirme",
                        "id": id
                    },
                    "tablename": "firme"
                    
                } 
            ]
        }
        return data;
    }
}
