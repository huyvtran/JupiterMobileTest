import {VariableProvider} from './variable-provider';

import {Storage} from '@ionic/storage';
import {Injectable} from '@angular/core';

import { StorageValueProvider } from './storage-value-provider';

@Injectable()
export class StorageProvider extends StorageValueProvider {

    constructor(private storage : Storage, private variable: VariableProvider) {
        super();
        // this.initStorage();
    }
    
    // private initStorage() {
    //     if (this.storage == null) {
    //         this.storage = new Storage([]);
    //     }
    // }

    //****begin public methods
    public addToStorage(storageKey: string, key: string, value: any, includeDbName?: boolean) {
        let sKey: string = this.getFullStorageKey(storageKey, includeDbName);
        return this
            .storage
            .ready()
            .then(() => {
                return this.storage.get(sKey)
                    .then(val => {
                        if (val != null) {
                            let valObj = JSON.parse(val);
                            if (key == null)
                                valObj = value;
                            else
                                valObj[key] = value;
                            return valObj;
                        } else {
                            if (key == null)
                                return value;
                            else 
                                return {["" + key.toLowerCase() + ""]: value}
                        }
                    }).then(val => {
                        if (val != null)
                            val = JSON.stringify(val);

                        return this
                            .storage
                            .set(sKey, val);
                    });
            });
    }

    public getFromStorage(storageKey : string, key?: string, includeDbName?: boolean): Promise<any> {
        let sKey: string = this.getFullStorageKey(storageKey, includeDbName);
        //console.log("getFromStorage");
        //console.log(sKey);
        return this.storage
            .ready()
            .then(() => {
                return this.getValueFromStorage(sKey);
            })
            .then(val => {
                val = JSON.parse(val);
                if (key != null)
                {   
                    try {
                        return JSON.parse(val[key]);
                    } catch(ex) {
                        return val[key];
                    }
                } else {
                    return val;
                }
            })
            .then((val) => {
                return val;
            })
    }
    //****end public methods


    private getValueFromStorage(key) {
        return this.storage.get(key)
        .then((val) => {
            return val;
        })
    }

    
    private getFullStorageKey(storageKey: string, includeDbName?: boolean): string {
        let dbName: string = "";
        if (includeDbName != false)
            dbName = this.getDbPrefix();
        
            return dbName + storageKey;
    }

    private getDbPrefix(): string {
        return this.variable.company.db.toLowerCase() +  ".";
    }
}