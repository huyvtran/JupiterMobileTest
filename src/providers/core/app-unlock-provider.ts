import { Injectable } from '@angular/core';

import { GlobalProvider } from './global-provider';
import { VariableProvider } from './variable-provider';
import { ConstProvider } from './const-provider';
import { StorageProvider } from './storage-provider';

import * as ICore from '../../interfaces/iCore';
import { ErrorProvider } from './error-provider';
import { HelpersProvider } from './helpers-provider';
import { AppUnlockStorageProvider } from './app-unlock-storage-provider';

@Injectable()
export class AppUnlockProvider extends AppUnlockStorageProvider {

    //private jupiterApps : Array < any > = new Array < any > ();

    constructor(private variableProvider: VariableProvider
        , storageProvider: StorageProvider
        , constProvider: ConstProvider
        , errorProvider: ErrorProvider
        , private helpersProvider: HelpersProvider
        , private global: GlobalProvider) {

        super(variableProvider, storageProvider, constProvider, errorProvider);
    }



    unlockApp(pin: string, appCode: string) {
        var self = this;
        return new Promise(function (resolve, reject) {

            self
                .unlockAppData(pin, appCode)
                .then((value) => {
                    if (value != null) {
                        self.addToStorage(value);
                        self.variableProvider.appUnlocked = value;
                    }
                    resolve();
                })
                .catch(err => {
                    //reject(self.errorProvider.getErrorMessage(err));
                    reject();
                });
        })


    }

    unlockAppData(pin: string, appCode: string) {
        var self = this;

        var deviceId: string = self.variableProvider.device.uuid;
        if (this.helpersProvider.isDevMode() == true)
            deviceId = '1111';

        let properties: ICore.IPropertiesCore = {
            spinApiEndPoint: 'unlockapp'
        }

        //var value : any;
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spPinAppAzur",
                    "params": {
                        "Action": "unlock",
                        "db": self.variableProvider.company.db,
                        "pin": pin,
                        "appCode": appCode,
                        "deviceuuid": deviceId
                    }
                }
            ]
        }
        return this
            .global
            .getDataToken(dataDef, properties);

    }
}