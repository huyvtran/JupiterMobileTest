import {Injectable} from '@angular/core';

import {ConstSharedProvider} from '../shared/shared-provider';

import {IStorageKeys} from '../../interfaces/core/storagekeys';

@Injectable()
export class ConstProvider extends ConstSharedProvider {
    public static get version() : string { return "9.0.7" };
    //public get spinApiGen() : string { return "http://213.202.75.115:40080/gen/api/" };
    public get spinApiCore() : string { return "http://213.202.75.115:40080/core/api/" };


    public isDevMode: boolean = true;

    dataRetryNumber: number = 1;


    public static coreStorageKeys : IStorageKeys = {
        jupiterSystemData: "core.jupiterSystemData.001",
        company: "core.company.001",
        loginData: "core.loginData.001",
        modules: "core.modules.001",
        favorites: "core.favorites.001",
        appUnlocked: "core.appUnlocked.001",
        logPages: "core.logPages.001"
    };

    public coreStorageKeys : IStorageKeys = {
        jupiterSystemData: "core.jupiterSystemData.001",
        company: "core.company.001",
        loginData: "core.loginData.001",
        modules: "core.modules.001",
        favorites: "core.favorites.001",
        appUnlocked: "core.appUnlocked.001",
        logPages: "core.logPages.001"
    };
}