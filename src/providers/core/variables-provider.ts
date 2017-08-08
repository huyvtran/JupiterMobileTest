import {Injectable} from '@angular/core';

@Injectable()
export class VariablesProvider {
    public static pagesHistory : Array < string > = new Array < string > ();
    public static serverPath : string = "";
    public static refreshToken : string = "";
    public static accessToken : string = "";
    public static pushRegistrationId: string = "";


    public static device: any;
    // public static deviceId: string = "";
    // public static deviceModel: string = "";
    // public static devicePlatform: string = "";
    // public static deviceVersion: string = "";
    // public static deviceManufacturer: string = "";
    // public static deviceIsVirtual: string = "";
    // public static deviceSerial: string = "";

    public static loginData : any = [];
    public static jupiterSystemData : any = [];
    public static company : any = [];
    


    constructor() {
    }
}