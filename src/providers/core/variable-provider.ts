import {Injectable} from '@angular/core';

import {IAppUnlocked} from '../../interfaces/core/app';
import {IDevice} from '../../interfaces/core/device';
import {ILogin} from '../../interfaces/core/login';
import {ICompany} from '../../interfaces/core/company';

@Injectable()
export class VariableProvider {
    public static pagesHistory : Array < string > = new Array < string > ();
    public static serverPath : string = "";
    public static refreshToken : string = "";
    public static accessToken : string = "";
    public static pushRegistrationId: string = "";

    public loaderActive: boolean = false; //load spinner ("učitavanje...")
    public defShowError: boolean = false; //default - prikaz greške u toast kontroli
    
    public trazilicaToastShow: boolean = true;

    public device: IDevice;
    // public static deviceId: string = "";
    // public static deviceModel: string = "";
    // public static devicePlatform: string = "";
    // public static deviceVersion: string = "";
    // public static deviceManufacturer: string = "";
    // public static deviceIsVirtual: string = "";
    // public static deviceSerial: string = "";

    public loginData : ILogin;
    public static jupiterSystemData : any = [];
    public company : ICompany;

    public appUnlocked : Array<IAppUnlocked> = [];
    


    constructor() {
    }
}