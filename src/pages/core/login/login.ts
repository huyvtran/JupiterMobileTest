import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, MenuController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import { Platform } from 'ionic-angular';

import {GlobalProvider} from '../../../providers/core/global-provider';
import {VariableProvider} from '../../../providers/core/variable-provider';
import {LoginProvider} from '../../../providers/login/login-provider';



@IonicPage()
@Component({selector: 'page-login', templateUrl: 'login.html'})
export class CoreLoginPage {
    private check : boolean = false;
    private msg : string = "";

    private pin: string;
    private deviceId: string;

    private login: string;

    constructor(public navCtrl : NavController, public navParams : NavParams, private storage : Storage,
        private toastCtrl : ToastController,
        private platform: Platform,
        //private uniqueDeviceID: UniqueDeviceID,
        private loginProvider: LoginProvider,
        private menuCtrl: MenuController,
        public global: GlobalProvider,
        private variableProvider: VariableProvider) {

        this.menuCtrl.enable(false, 'mainMenu');
        GlobalProvider.setPagesHistory = []; //isprazni pagesHistory
    }

    ionViewDidLoad() {}

    ok() {
        var self = this;
        self.check = true;
        self.msg = "Provjera unesenih podataka...";


        this.getDeviceId().then((val) => {
            console.log("step 1");
            this.deviceId = val;
            return this.getToken();
        }).then((val) => {
            console.log("step 2");
            return this.getJupiterSystemData();
        }).then((val) => {
            console.log("step 3");
            return this.setUnlockedApps();
        }).then((val) => {
            console.log("step 4");
            return this.setVariables();
        }).then((val) => {
            console.log("step 5");
            self.msg = "startanje...";
            setTimeout(function() {
                self.global.pushPage('CoreCcCompanyPage');
            }, 2000);
        });


    }

    // checkAuthServerData() {
    //     //šalje pin, deviceId
    //     //dobija refresh token,
    //     var self = this;
    //     return new Promise(function(resolve, reject) {
    //         setTimeout(function() {
    //             self.msg = "Sinkroniziranje podataka...";
    //             resolve();
    //         }, 1000);
    //     }).then(function() {
    //             return "1111 end";
    //     });
    // }


    getDeviceId() {
        let self = this;
        var val;
        return new Promise(function(resolve, reject) {
            if (self.platform.is('cordova')) {
                //val = self.uniqueDeviceID.get().then(val => resolve());
            } else {
                //val = '00000000-0000-0000-0000-000000000000';
                val = '';
            }
            resolve();
        }).then(function() {
            return val;
        });
    }

    //****step 1
    //dohvat refresh i access tokena
    getToken() {
        //šalje pin, deviceId
        //dobija refresh token,
        let self = this;
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                self.msg = "Sinkroniziranje podataka...";

                //refresh token iz storage-a
                // var rToken = localStorage.getItem('refreshToken');
                // alert(rToken);
                // if(rToken === null || rToken === undefined)
                // {
                   self.loginProvider.getToken(self.pin, self.deviceId)
                        .then((val) => {
                            resolve();
                        })
                        .catch(err => {
                            self.check = false;
                        });
                        // .then(() => rToken = localStorage.getItem('refreshToken')) //.subscribe(res => window.localStorage.setItem('authTestToken', res));
                        // .then(() => {
                        //         if(rToken){
                        //             this.loginProvider.setAccessToken();
                        //         }
                        // });
                //}


                //resolve();
            }, 1000);
        }).then(function() {
                return ;
        });

    }

    //****step 2
    //provjera prava  JupiterSystem i dohvat firmi na koje imam
    getJupiterSystemData() {
        let self = this;
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                self.msg = "Jupiter System - provjera prava...";
                    self.loginProvider.getJupiterSystemData(self.pin, self.login)
                        .then(() => {
                            resolve();
                        })
                        .catch(err => {
                            self.check = false;
                            
                            if(err == "Error")
                                return;
                            let errMsg;
                            if (err._body == null)
                                errMsg = err;
                            else
                                errMsg = err._body;
                            
                            self.presentToastError(errMsg);
                        });
            }, 1000);
        }).then(function() {
                return ;
        });
    }

    //****step 3
    //snimanje varijabla
    setVariables() {
        var self = this;
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                self.msg = "Finaliziranje...";
                self.storage.set(self.global.getCoreStorageKeys.loginData, JSON.stringify(self.variableProvider.loginData));
                self.storage.set(self.global.getCoreStorageKeys.jupiterSystemData, JSON.stringify(GlobalProvider.getJupiterSystemData));
                resolve();
            }, 1000);
        }).then(function() {
            return "OK";
        });
    }

    //****step 4
    //set unlocked apps (ako se korisnik već ranije logirao s istim podacima)
    setUnlockedApps() {
        var self = this;
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                self.msg = "Provjera core podataka...";
                self.loginProvider.getUnlockedApps()
                    .then(() => resolve())
                    .catch(err => {
                        self.check = false;
                        
                        if(err == "Error")
                            return;
                        let errMsg;
                        if (err._body == null)
                            errMsg = err;
                        else
                            errMsg = err._body;
                        
                        self.presentToastError(errMsg);
                    });
            }, 1000);
        }).then(function() {
                return "OK";
        });
    }


    promiseTimeout = function(ms, promise) {
        // Create a promise that rejects in <ms> milliseconds
        let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in '+ ms + 'ms.')
            }, ms)
        })

        // Returns a race between our timeout and the passed in promise
        return Promise.race([
            promise,
            timeout
        ])
    }

     presentToastError(message: string) {
        this.check = false;
        this.msg = "";
        
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {
            
        });

        toast.present();
    }


}
