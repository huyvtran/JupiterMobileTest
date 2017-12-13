import {Injectable} from '@angular/core';


import {GlobalProvider} from './../core/global-provider';
import {VariableProvider} from './../core/variable-provider';
import * as ICore from '../../interfaces/iCore';

//import {LoginPin, LoginSystem, LoginAzurUser} from '../../interfaces/core/login';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {AppUnlockStorageProvider} from '../core/app-unlock-storage-provider';

@Injectable()
export class LoginProvider {

    refreshToken : string;

    constructor(private variableProvider: VariableProvider, private global: GlobalProvider, private appUnlockStorageProvider: AppUnlockStorageProvider) {}

    getToken (pin : string, deviceId : string) {
        var value : any;
        return this
            .getTokenData(pin,deviceId)
            .then(res => {
                value = res;
                this.variableProvider.loginData = value;   
            });
    }

    getTokenData(pin : string, deviceId : string) {
        var self = this;
        //var value : any;
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spPinCoreAzur",
                    "params": {
                        "action": "unlock",
                        "pushRegistrationId": VariableProvider.pushRegistrationId,
                        "pin" : pin,
                        "refreshToken" :null,
                        "DeviceCordova" :self.variableProvider.device.cordova,
                        "DeviceIsVirtual" : self.variableProvider.device.isVirtual,
                        "DeviceManufacturer":self.variableProvider.device.manufacturer,
                        "DeviceModel" : self.variableProvider.device.model,
                        "DeviceSerial" : self.variableProvider.device.serial,
                        "DeviceUuid":self.variableProvider.device.uuid,
                        "DeviceVersion": self.variableProvider.device.version
                    },
                    "singlerow": true
                }
            ]
        }
        return this
            .global
            .getDataToken(dataDef, true,"auth",null,false);

    }

    getJupiterSystemData(pin: string, login: string) {
        var self = this;
        var value : any;


         return this
            .getJupiterSystem(pin, login)
            .then(res => {
                value = res;
                if (value.user == null || (value.company == null || value.company.length == 0))
                    throw new Error("Neispravni Jupiter Software login podaci. Molim kontaktirajte vašeg Jupiter Software administratora.");
                else {
                    VariableProvider.jupiterSystemData = value;
                    console.log("getJuptierSystemData");
                    console.log(value);
                }
            })
            .then(() => {
                if (value.user != null)
                    self.updateUser(pin, value.user.login, value.user.name);
            })
            .catch((err) =>  {
                throw new Error(err.message);
            });
    }


     getJupiterSystem(pin: string, login: string) {

        let dataDef : ICore.IData = {
            "queries": [
                 {
                    "query": "spMobLoginQuery",
                    "params": {
                        "action": "getUser",
                        "login": login
                    },
                    "tablename" : "user",
                    "singlerow": true
                },
                {
                    "query": "spMobLoginQuery",
                    "params": {
                        "action": "getTvrtke",
                        "login": login
                    },
                    "tablename" : "company"
                },
                 
            ]
        }
        return this
            .global
            .getDataToken(dataDef, true,null,true,true);

    }

    updateUser(pin: string, login: string, name: string) {

        return this
            .updateUserData(pin,login,name)
            .then(res => {
                console.log("uspješan user update")
            });
    }


    updateUserData(pin: string, login: string, name: string){
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spPinCoreAzur",
                    "params": {
                        "action": "updateUser",
                        "pushRegistrationId": VariableProvider.pushRegistrationId,
                        "pin" : pin,
                        "refreshToken" : this.variableProvider.loginData.refreshToken,
                        "DeviceCordova" :this.variableProvider.device.cordova,
                        "DeviceIsVirtual" : this.variableProvider.device.isVirtual,
                        "DeviceManufacturer":this.variableProvider.device.manufacturer,
                        "DeviceModel" : this.variableProvider.device.model,
                        "DeviceSerial" : this.variableProvider.device.serial,
                        "DeviceUuid":this.variableProvider.device.uuid,
                        "DeviceVersion": this.variableProvider.device.version,
                        "login" : login,
                        "name" : name
                    },
                    "singlerow": true
                }
            ]
        }

        //  let dataDef : ICore.IData = {
        //     "queries": [
        //         {
        //             "query": "spPinCoreAzur",
        //             "params": {
        //                 "action": "updateUser",
        //                 "pin": pin,
        //                 "login" : login,
        //                 "name" : name
        //             }
        //         }
        //     ]
        // }
        return this
            .global
            .getDataToken(dataDef,true,"updateUser",false,true);
    }

    getUnlockedApps() {
        var refreshToken = this.variableProvider.loginData.refreshToken; 
        
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spPinCoreQuery",
                    "params": {
                        "Action": "getUnlocked",
                        "RefreshToken": refreshToken
                    },
                    "tablename" : "apps"
                }
            ]
        }

        return this.global.getDataToken(dataDef,false,"generic",false,true).then(val => {
            if (val != null && val.apps != null) {
                this.appUnlockStorageProvider.addToStorage(val.apps).then(() => {
                    this.appUnlockStorageProvider.getDataFromStorage();
                });
            }
        });
    }
}