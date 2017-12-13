import {Injectable} from '@angular/core';

import {VariableProvider} from './variable-provider';
import {StorageProvider} from './storage-provider';
import {ConstProvider} from './const-provider';
import {IHistory} from '../../interfaces/core/history';
import {ErrorProvider} from './error-provider';

@Injectable()
export class HistoryProvider {
    constructor(private storageProvider: StorageProvider, private constProvider: ConstProvider, private errorProvider: ErrorProvider) {}

    resetHistory(page: string) {
        VariableProvider.pagesHistory = [];
        VariableProvider.pagesHistory.push(page);
    }

    public pagesLog(page: string) {
        try {
            this.storageProvider.getFromStorage(this.getStorageKey(), null, false).then(val => {
                let data: Array<IHistory>;
                if (val == null)
                    data = new Array<IHistory>();
                else 
                    data = val;
                data.push({page: page, db: "spin", time: new Date()})
                this.storageProvider.addToStorage(this.getStorageKey(), null, data, false);
            }).catch(ex => this.errorProvider.logError(ex, false));
        } catch(ex) {
            this.errorProvider.logError(ex, false);
        }
    }

    public getLog() {
        return this.storageProvider.getFromStorage(this.getStorageKey(), null, false);
    }

    public clearLog() {
        return this.storageProvider.addToStorage(this.getStorageKey(), null, null, false);
    }

    public getStorageKey(): string  {
        return this.constProvider.coreStorageKeys.logPages;
    }
}