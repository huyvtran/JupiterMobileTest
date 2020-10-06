import {ToastController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

import {GlobalProvider} from './global-provider';
import {ConstProvider} from './const-provider';
import {DataProvider} from './data-provider';

import * as ICore from '../../interfaces/iCore';

@Injectable()
export class ModulesProvider {
    private storage : Storage;

    public static storageRoot : any = [];

    private storageCompany : Array < any >;

    public sync : boolean = false;
    public syncInit : boolean = false;

    public initialized = false;
    public apps : any[];

    public modules : Array < any > = new Array < any > ();
    public granule : Array < any > = new Array < any > ();
    public coremodules : Array < any > = new Array < any > (); //popis root granula na koje korisnik ima pravo (partner, roba, osobe);

    public sveGranule : Array < any > = new Array < any > ();

    public applicationName : string = "";

    public infoModules : Array < {
        title: string,
        component: any,
        color: string,
        icon: string
    } >;

    //private jupiterApps : Array < any > = new Array < any > ();

    constructor(private toastCtrl : ToastController, private constProvider : ConstProvider, private data : DataProvider) {
        this.storage = new Storage([]);
        this.getDataFromStorage();

        //this.populateModules();
        this.populateInfoModules();

        // this     .getServerData()     .subscribe(data => {         this.permission =
        // data.application;     });
    }

    ClearData() {
        ModulesProvider.storageRoot = null;
        this.storageCompany = null;
        this.modules = null;
    }

    InitStorage() {

        var self = this;

        //console.log(self.initialized)
        return new Promise(function (resolve, reject) {

            Promise
                .resolve()
                .then(() => {
                    if (self.initialized == true && ModulesProvider.storageRoot != null) {
                        return ModulesProvider.storageRoot;
                        //return null;
                    } else {
                        return null
                    }
                })
                .then((val) => {
                    if (val != null) {
                        self.setData(val);
                    }
                    return val;
                })
                // ako je value iz nekog razloga null (u pravilu ne bi trebalo biti) dohvati
                // podatke iz baze .then((val) => {     if (val == null || val.length == 0) {
                //      this.populateFromDb();     } })
                .then((val) => {
                    if (val == null || val.length == 0) {
                        if (self.modules == null || self.modules.length == 0) {
                            self.syncInit = true;
                        } else {
                            self.sync = true;
                        }
                        return self
                            .populateFromDb()
                            .then((val) => resolve());
                    }
                })
            //.then((val) => { alert("222"); resolve(); });
        })
    }

    populateFromDb() {
        //console.log("modules from db")
        let self = this;
        return new Promise(function (resolve, reject) {
            self
                .getServerData()
                .then(data => {
                    //console.log("populateNodeData");
                    //console.log(data);
                    if (data != null) {
                        self.setData(data);
                        self.addToStorage(data);
                        self.setStorageRoot(data);
                    }
                    self.sync = false;
                    self.syncInit = false;
                    self.initialized = true;
                })
                .then(() => {
                    resolve()
                })
        })
            .then(function () {
                return;
            });
    }

    setData(data) {
        this.modules = data.application; //.slice(0, 2);
        this.coremodules = data.coremodules;
        this.getSveGranule();
    }

    getSveGranule() {
        this.sveGranule = [];
        this
            .modules
            .forEach(element => {
                element
                    .group
                    .forEach(el => {
                        el
                            .menu
                            .forEach(mnu => {
                                this
                                    .sveGranule
                                    .push(mnu);
                            });
                    });
            });
    }

    getDataFromStorage() {
        //console.log("modules from storage")
        return this
            .storage
            .ready()
            .then(() => {
                return this
                    .storage
                    .get(this.constProvider.coreStorageKeys.modules)
                    .then(val => {
                        let data = JSON.parse(val);

                        if (data != null) {
                            this.setData(data);
                            this.setStorageRoot(data);
                        }
                        
                        this.sync = false;

                        return data;
                    })
                    .then(val => {
                        if (val == null) {
                            ModulesProvider.storageRoot = new Array < any > ();
                        }
                    });
            });

    }

    setStorageRoot(data) {
        if (data != null) {
            ModulesProvider.storageRoot = data;
        }

    }

    init() {
        this.populateInfoModules();
    }

    addToStorage(data) {
        this
            .storage
            .set(this.constProvider.coreStorageKeys.modules, JSON.stringify(data));
    }

    populateInfoModules() {
        this.infoModules = [
            {
                title: 'Roba',
                component: this.constProvider.staticStartPages.infoRoba,
                color: "#4a5f71",
                icon: "cube"
            }, {
                title: 'Partneri',
                component: this.constProvider.staticStartPages.infoPartner,
                color: "#4a5f71",
                icon: "briefcase"
            }, {
                title: 'Osobe',
                component: this.constProvider.staticStartPages.infoOsobe,
                color: "#4a5f71",
                icon: "person"
            }
        ];
    }

    getServerData() {

        let login = GlobalProvider.getJupiterSystemData? GlobalProvider.getJupiterSystemData.user.login : null;
        
        let properties: ICore.IPropertiesCore = {
            showLoader: false
        }

        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobCore",
                    "params": {
                        "action": "getUser",
                        "Login": login
                    },
                    "singlerow": true
                }, {
                    "query": "spMobCore",
                    "params": {
                        "action": "getApplications",
                        "Login": login
                    },
                    "tablename": "application"
                }, {
                    "query": "spMobCore",
                    "params": {
                        "action": "getGroups",
                        "Login": login
                    },
                    "tablename": "group",
                    "reftable": "application",
                    "refkey": "ApplicationId"
                }, {
                    "query": "spMobCore",
                    "params": {
                        "action": "getMenuItem",
                        "Login": login
                    },
                    "tablename": "menu",
                    "reftable": "group",
                    "refkey": "GroupId"
                },  {
                    "query": "spMobCore",
                    "params": {
                        "action": "getMenuPermissions",
                        "Login": login
                    },
                    "tablename": "permissions",
                    "refkey" : "menuId",
                    "reftable" : "menu"
                },{
                    "query": "spMobCore",
                    "params": {
                        "action": "getCoreModules",
                        "Login": login
                    },
                    "tablename": "coremodules"
                }
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
    }

    public presentToastError(message : string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {});

        toast.present();
    }

}