import {Injectable} from '@angular/core';

import {StorageKeys} from '../../interfaces/core/storagekeys';

@Injectable()
export class ConstProvider {
    public static get version() : string { return "9.0.1" };
    public static get jupiterServerPath() : string { return "http://213.202.75.122:30080/spinmobile/api/" };
    //"http://localhost:25509/api/";
    //"http://213.202.75.122:30080/spinmobiledev/api/";


    public static coreStorageKeys : any = {
        jupiterSystemData: "core.jupiterSystemData.001",
        company: "core.company.001",
        loginData: "core.loginData.001",
        modules: "core.modules.001",
        favorites: "core.favorites.001"
    };


    constructor() {
    }
}