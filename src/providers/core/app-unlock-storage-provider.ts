import {Injectable} from '@angular/core';

import {VariableProvider} from './variable-provider';
import {ConstProvider} from './const-provider';
import {StorageProvider} from './storage-provider';
import {IAppUnlocked} from '../../interfaces/core/app';

import {ErrorProvider} from './error-provider';


@Injectable()
export class AppUnlockStorageProvider {
    
    //private jupiterApps : Array < any > = new Array < any > ();

    constructor(private variableProviderEx: VariableProvider
        , private storageProviderEx: StorageProvider
        , private constProviderEx: ConstProvider
        , private errorProviderEx: ErrorProvider) {
        
    }




    getDataFromStorage() {
        this.storageProviderEx.getFromStorage(this.constProviderEx.coreStorageKeys.appUnlocked, null, false).then(val => {
            let data: Array<IAppUnlocked> = val;
            this.variableProviderEx.appUnlocked = data;
            return data;
        }).catch(ex => this.errorProviderEx.logError(ex, true));
    }


    addToStorage(data: Array<IAppUnlocked>) {
        return this.storageProviderEx.addToStorage(this.constProviderEx.coreStorageKeys.appUnlocked, null, data, false);
    }
}