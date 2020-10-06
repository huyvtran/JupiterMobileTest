import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

import {GlobalProvider} from './../core/global-provider';
import {ConstProvider} from './const-provider';
import {VariableProvider} from './../core/variable-provider';
import * as ICore from '../../interfaces/iCore';
import {DataProvider} from './data-provider';

//import {LoginPin, LoginSystem, LoginAzurUser} from '../../interfaces/core/login';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';


@Injectable()
export class JupiterSystemProvider {


    public  jupiterSystemData : any = [];

    constructor(private variableProvider: VariableProvider, private data : DataProvider, private global: GlobalProvider, private storage : Storage) {
        //storage = new Storage([]);
        this.getDataFromStorage();
        console.log('init jupiter systen providera')
    }

    

    getJupiterSystemData(pin: string, login: string) {
        var self = this;
        var value : any;

        if(login == null)
            login  =  GlobalProvider.getJupiterSystemData? (GlobalProvider.getJupiterSystemData.user? GlobalProvider.getJupiterSystemData.user.login : null) : null;


        //kod prvog logiranja postavi varijablu login u provideru za svaki sljedeci poziv 

    

         return this
            .getJupiterSystem(pin, login)
            .then(res => {
                value = res;
                console.log("getJupiterSystem");
                console.log(value);
                if (value  && value.user == null ) //|| (value.company == null || value.company.length == 0)
                    throw new Error("Neispravni Jupiter Software login podaci. Molim kontaktirajte vašeg Jupiter Software administratora.");
                else {
                    //postavi vrijednost u variable provider 
                    VariableProvider.jupiterSystemData = value;
                    this.setStorageRoot(value);
                    console.log("getJuptierSystemData");
                    console.log(value);
                }
            })
            .then(() => {
                if (value  && value.user != null){
                    console.log(value.user)
                    self.updateUser(pin, value.user.login, value.user.name);
                    return value;
                }
                    
            })
            .catch((err) =>  {
                //throw new Error(err.message);
            });
    }


     getJupiterSystem(pin: string, login: string) {

        let properties: ICore.IPropertiesCore = {
            jupiterSystem: true
        }


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
            .data
            .getData(dataDef, properties)
            .toPromise()
            .then(result => {
                return result.json()
            })
            .catch((errr) => (console.log("error")));

        // return this
        //     .global
        //     .getDataToken(dataDef, true, null, null, true, true);

    }

    updateUser(pin: string, login: string, name: string) {

        return this
            .updateUserData(pin,login,name)
            .then(res => {
                console.log("uspješan user update")
            });
    }


    updateUserData(pin: string, login: string, name: string){

        let properties: ICore.IPropertiesCore = {
            spinApiEndPoint: 'updateUser'
        }


        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spPinCoreAzur",
                    "params": {
                        "action": "updateUser",
                        "pushRegistrationId": this.variableProvider.loginData.pushRegistrationId,
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

       
        return this
            .global
            .getDataToken(dataDef, properties);
    }


    getDataFromStorage() {
        console.log("system from storage")
        return this
            .storage
            .ready()
            .then(() => {
                return this
                    .storage
                    .get(ConstProvider.coreStorageKeys.jupiterSystemData)
                    .then(val => {
                        let data = JSON.parse(val);
                        console.log(data);
                        this.setStorageRoot(data);
                        return data;
                    })
                    .then(val => {
                        if (val == null) {
                            this.jupiterSystemData = new Array < any > ();
                        }
                    });
            });

    }

    setStorageRoot(data) {
        if (data != null) {
            this.jupiterSystemData = data;
        }

    }

   setData(data) {
        VariableProvider.jupiterSystemData = data;
    }

    addToStorage(data) {
        this
            .storage
            .set(ConstProvider.coreStorageKeys.jupiterSystemData, JSON.stringify(data));
    }


    populateFromDb(){
        console.log("system from db")
        let self = this;
        return new Promise(function (resolve, reject) {
            self
                .getJupiterSystemData(null,null)
                .then(data => {
                    //console.log("populateNodeData");
                    console.log(data);
                    if (data != null) {
                        self.setStorageRoot(data);
                        self.setData(data);
                        self.addToStorage(data);
                    } 

                })
                .then(() => {
                    resolve()
                })
        })
        .then(function () {
            return;
        });
        
            
    }

    
}