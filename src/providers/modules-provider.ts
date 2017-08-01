import {ToastController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Storage} from '@ionic/storage';

import {GlobalProvider} from './global-provider';
//import _ from 'lodash';

//import {GlobalProvider} from './global-provider';

@Injectable()
export class ModulesProvider {
    private storage : Storage;

    public storageRoot : any = [];
    private storageCompany : Array <any>;

    public sync: boolean = false;
    public syncInit: boolean = false;


    public apps : any[];

    public modules : Array<any> = new Array<any> ();
    public granule : Array<any> = new Array<any> ();
    public applicationName : string = "";



    public register : Array <{parameter: string, page: string}> = 
        [
            {
                parameter: 'HrmProfilDetalji',
                page: 'PartnerSearchPage'
            }, {
                parameter: 'HrmProfilGodisnji',
                page: 'PartnerSearchPage'
            }, {
                parameter: 'HrmProfilOsnovnaSredstva',
                page: 'PartnerSearchPage'
            }, {
                parameter: 'HrmOdsustvaPopis',
                page: 'HrmOdsustvaPage'
            }, {
                parameter: 'HrmOdsustvaNajava',
                page: 'PartnerSearchPage'
            }, {
                parameter: 'HrmDjelatniciImenik',
                page: 'HrmImenikPage'
            }, {
                parameter: 'MercurBarcodeScanner',
                page: 'TestBarcodePage'
            }, {
                parameter: 'ToolsBugshooter',
                page: 'TestBugshooterPage'
            }, {
                parameter: 'ManagerKpi',
                page: 'ManagerKpiTabsPage'
            }
        ]


    public infoModules : Array < {
        title: string,
        component: any,
        color: string,
        icon: string
    } >;

    //private jupiterApps : Array < any > = new Array < any > ();

    constructor(private http : Http, private toastCtrl: ToastController) {
        this.storage = new Storage([]);
        this.getDataFromStorage();

        
        //this.populateModules();
        this.populateInfoModules();

        // this
        //     .getServerData()
        //     .subscribe(data => {
        //         this.permission = data.application;
        //     });
    }

    ClearData() {
            this.storageRoot = null;
            this.storageCompany = null;
            this.modules = null;
    }

    InitStorage() {
        Promise
            .resolve()
            .then(() => {
                if (this.storageRoot != null) {
                    return this.storageRoot;
                    //return null;
                }
            })
            .then((val) => {
                if (val != null) {
                    this.setData(val);
                }
                return val;
            })
            // ako je value iz nekog razloga null (u pravilu ne bi trebalo biti) dohvati
            // podatke iz baze
            // .then((val) => {
            //     if (val == null || val.length == 0) {
            //         this.populateFromDb();
            //     }
            // })
            .then((val) => {
                if (val == null || val.length == 0) {
                    if (this.modules == null || this.modules.length == 0) {
                        this.syncInit = true;
                    }
                    else 
                    {
                        this.sync = true;
                    }
                    this.populateFromDb();
                }
            });
    }

    populateFromDb() {
        this
            .getServerData()
            .then(data => {
                if (data != null) {
                    this.modules = data.application;
                    this.addToStorage(data);
                    this.setStorageRoot(data);
                }
                this.sync = false;
                this.syncInit = false;
            })
    }

    setData(data) {
        this.modules = data.application; //.slice(0, 2);
    }



    getDataFromStorage() {
        this
            .storage
            .ready()
            .then(() => {
                return this
                    .storage
                    .get(GlobalProvider.coreStorageKeys.modules)
                    .then(val => {
                        let data = JSON.parse(val);
                        this.setStorageRoot(data);
                        return data;
                    })
                    .then(val => {
                        if (val == null) {
                            this.storageRoot = new Array <any> ();
                        }
                    });
            });

    }

    setStorageRoot(data) {
        if (data != null) {
            this.storageRoot = data;
        }

    }

    init() {
        this.populateInfoModules();
    }

    addToStorage(data) {
        this
            .storage
            .set(GlobalProvider.coreStorageKeys.modules, JSON.stringify(data));
    }


    populateInfoModules() {
        this.infoModules = [
            {
                title: 'Roba',
                component: '',
                color: "#4a5f71",
                icon: "cube"
            }, {
                title: 'Partneri',
                component: 'PartnerSearchPage',
                color: "#4a5f71",
                icon: "briefcase"
            }, {
                title: 'Osobe',
                component: '',
                color: "#4a5f71",
                icon: "person"
            }
        ];
    }

    
    getServerData() {
        let opt : RequestOptions
        let headers : Headers = new Headers

        let login = GlobalProvider.jupiterSystemData.user.login;

        let body = {
            "Db": GlobalProvider.company.db,
            "AccessToken": "",
            "Login": login
        };

        let data = JSON.stringify(body);
        opt = new RequestOptions({headers: headers});
        
        headers.set('Content-Type', 'application/json');

        var url = GlobalProvider.loginData.serverPath + 'jupitermodules/get';
        var response = this
            .http
            .post(url, data, opt)
            .toPromise()
            .then(result => result.json())
            .catch(err => {
                this.presentToastError(err._body);
            });

        return response;

    }

        public presentToastError(message: string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {
            
        });

        toast.present();
    }

}