import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, MenuController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import { Platform } from 'ionic-angular';

import {GlobalProvider} from '../../../providers/core/global-provider';
import {VariablesProvider} from '../../../providers/core/variables-provider';
import {LoginProvider} from '../../../providers/login/login-provider';



/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({selector: 'page-login', templateUrl: 'login.html'})
export class CoreLoginPage {
    private check : boolean = false;
    private msg : string = "";

    private pin: string;
    private deviceId: string;

    private email: string;
    private password: string;

    constructor(public navCtrl : NavController, public navParams : NavParams, private storage : Storage,
        private toastCtrl : ToastController,
        private platform: Platform,
        //private uniqueDeviceID: UniqueDeviceID,
        private loginProvider: LoginProvider,
        private menuCtrl: MenuController) {

        this.menuCtrl.enable(false, 'mainMenu');
        GlobalProvider.setPagesHistory = []; //isprazni pagesHistory
    }

    ionViewDidLoad() {}

    login() {
        var self = this;
        self.check = true;
        self.msg = "Provjera unesenih podataka...";


        this.getDeviceId().then((val) => {
            this.deviceId = val;
            return this.getToken();
        }).then((val) => {
            return this.getJupiterSystemData();
        }).then((val) => {
            return this.setVariables();
        }).then((val) => {
            self.msg = "startanje...";
            setTimeout(function() {
                GlobalProvider.pushPage('CoreCcCompanyPage');
                self
                    .navCtrl
                    .setRoot('CoreCcCompanyPage', {}, {
                        animate: true,
                        direction: 'forward'
                    });
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
                            self.presentToastError(err._body);
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
                self.msg = "Sinkroniziranje podataka...";
                    self.loginProvider.getJupiterSystemData(self.pin, self.email, self.password)
                        .then((val) => {
                            VariablesProvider.jupiterSystemData = val;
                            resolve();
                        })
                        .catch(err => {
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
                self.storage.set(GlobalProvider.getCoreStorageKeys.loginData, JSON.stringify(GlobalProvider.getLoginData));
                self.storage.set(GlobalProvider.getCoreStorageKeys.jupiterSystemData, JSON.stringify(GlobalProvider.getJupiterSystemData));
                resolve();
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
