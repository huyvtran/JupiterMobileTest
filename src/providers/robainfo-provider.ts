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
export class RobainfoProvider extends HistoryProvider {


    constructor(private xApp : App
        , private xGlobal: GlobalProvider
        , private xStorageProvider: StorageProvider
        , private xConstProvider: ConstProvider
        , private timeProvider: TimeProvider) {

        super(xApp, xGlobal, xStorageProvider, xConstProvider);
        this.storageKey = this.xConstProvider.modulesStorageKeys.infoRobaHistory;
    }

    xSetData(id)
    {
        this.setData(this.getDataDefinition(id), id, null);
    }

    getDataDefinition(id): ICore.IData {

        var vrijemeOd = this.timeProvider.getTime("y").start;
        var vrijemeDo = this.timeProvider.getTime("y").end;

        let data : ICore.IData = {
            "queries": 
            [
               {
                    "query": "spMobInfoRoba",
                    "params": {
                        "action": "getInfo",
                        "id": id
                    },
                    "singlerow": true
                },
               {
                    "query": "spMobInfoRoba",
                    "params": {
                        "action": "getCjenici",
                        "id": id
                    },
                    "tablename": "cjenici"
                    
                } ,
                {
                    "query": "spMobInfoRoba",
                    "params": {
                        "action": "getStanje",
                        "id": id,
                        "operaterid" : "@@operaterid"
                    },
                    "tablename": "stanje"
                    
                },
                 {
                    "query": "spMobInfoRoba",
                    "params": {
                        "action": "getKomerStanje",
                        "id": id,
                        "DatumOd" : vrijemeOd,
                        "DatumDo" : vrijemeDo,
                        "operaterid" : "@@operaterid"
                    },
                    "tablename": "komerstanje"
                    
                },
                 {
                    "query": "spMobInfoRoba",
                    "params": {
                        "action": "getNabava",
                        "id": id,
                        "retired" : "0"
                    },
                    "tablename": "nabava"
                 }
            ]
        }
        return data;
    }
}
