import { Component } from '@angular/core';
import { IonicPage, App, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { StorageProvider } from '../../../../providers/core/storage-provider';
import { ConstProvider } from '../../../../providers/core/const-provider';
import { GlobalProvider } from '../../../../providers/core/global-provider';
import { VariableProvider } from '../../../../providers/core/variable-provider';
import { NativeScreenOrientationProvider } from '../../../../providers/native/screenorientation/screenorientation-provider';
import { PushNotificationService } from '../../../../providers/native/push/push-provider';



@IonicPage()
@Component({ selector: 'page-core-cc-settings', templateUrl: 'settings.html' })
export class CoreCcSettingsPage {

    public settingsVariables: Array<{ variable: string }>

    constructor(private screenOrientation: NativeScreenOrientationProvider, private storageProvider: StorageProvider,
        private constProvider: ConstProvider,
        private globalProvider: GlobalProvider,
        private storage: Storage,
        private app: App,
        private alertCtrl: AlertController,
        private variableProvider: VariableProvider,
        private platform: Platform,
        private push: PushNotificationService) {

        this.settingsVariables = [
            {
                variable: "islandscape"
            }
        ]
    }

    islandscape: boolean = false;
    isDisabled: boolean = true;
    orientationType: any;
    enablePush: boolean = true;

    key: string = "";
    reset(tip) {
        this.resetShowConfirm(tip);
    }

    selectionChanged(key: string) {

        new Promise((resolve, reject) => {
            this.storageProvider.getFromStorage(this.constProvider.coreStorageKeys.settings, null, false)
                .then((res) => {

                    if (res) {
                        res[key] = this.orientationType
                        return this.storageProvider.addToStorage(this.constProvider.coreStorageKeys.settings, null, res, false)

                    }
                    else
                        return this.storageProvider.addToStorage(this.constProvider.coreStorageKeys.settings, key, this.orientationType, false)


                })
                .then((res) => {

                    this.screenOrientation.changeOrientation();
                }
                    , (error) => {
                        reject(error);
                    });

        });
    }

    ionViewDidEnter() {
        this.setSettingsPropertiesValues(this.settingsVariables);
    }

    resetShowConfirm(tip) {
        let message = "Potvrdom ćete morati ponovno unijeti autorizacijske podatke.\nŽelite li svejedno" +
            " nastaviti?"

        let confirm = this
            .alertCtrl
            .create({
                title: 'Reset',
                message: message,
                buttons: [
                    {
                        text: 'Odustani',
                        handler: () => {
                            ;
                        }
                    }, {
                        text: 'Potvrdi',
                        handler: () => {
                            this.resetConfirmed(tip);
                        }
                    }
                ]
            });
        confirm.present();
    }

    pushEnableChange() {
        try {
            if (this.variableProvider.loginData.pushEnabled) {
                this.push.getPushRegistrationId()
                .then((object) => {
                    console.log(object)

                    if (object) {
                        object.pushRegistrationId = "";
                        object.pushEnabled = true;
                        this.variableProvider.loginData.pushEnabled = true;
                        this.variableProvider.loginData.pushRegistrationId = "";
                        this.push.setPushRegistrationId(object)
                        .then((res) => {
                            this.push.initPush();
                            this.globalProvider.presentToast('Push notifikacije omogućene.')
                        })
                    }
                })
               
            }
            else {
                this.push.getPushRegistrationId()
                    .then((object) => {
                        console.log(object)

                        if (object) {
                            object.pushRegistrationId = "";
                            object.pushEnabled = false;
                            this.variableProvider.loginData.pushEnabled = false;
                            this.variableProvider.loginData.pushRegistrationId = "";
                            this.push.setPushRegistrationId(object)
                                .then((res) => {
                                    this.push.updatePinCoreRegistrationId(object)
                                        .then((res) => this.globalProvider.presentToast('Push notifikacije onemogućene.'))
                                })

                        }
                    })
            }

        }
        catch (error) {
            console.log(error)
        }

    }
    resetConfirmed(tip) {
        this
            .storage
            .forEach((value, key, index) => {
                if ((tip == 'auth' && (key == "refreshToken" || key == "company")) || tip == 'all') {

                    this.push.getPushRegistrationId()
                        .then((object) => {

                            this
                                .storage
                                .remove(key)
                                .then((res) => {
                                    //update pincore pushregistrationid = null

                                })

                            if (object) {
                                object.pushRegistrationId = "";
                                this.push.updatePinCoreRegistrationId(object);
                            }
                        })

                }
            })
            .then(() => {
                this.variableProvider.company = null;
                //GlobalProvider.setRefreshToken("");
                this
                    .app
                    .getRootNav()
                    .setRoot('CoreLoginPage', {}, {
                        animate: true,
                        direction: 'backward'
                    });
            });
    }

    doubleTap() {
        this.closePage();
    }

    closePage() {
        this
            .globalProvider
            .closeCC();
    }

    enableLandscapeOrientation(key: any, value: any) {

        return new Promise((resolve, reject) => {
            this.storageProvider.getFromStorage(this.constProvider.coreStorageKeys.settings, null, false)
                .then((res) => {
                    console.log(res)
                    if (value === true) {
                        this.isDisabled = false;
                    }
                    else {
                        this.isDisabled = true;
                        this.orientationType = null
                    }


                    if (res) {

                        res[key] = value
                        res['landscapeorientation'] = this.orientationType
                        console.log(res)
                        return this.storageProvider.addToStorage(this.constProvider.coreStorageKeys.settings, null, res, false)

                    }
                    else {
                        console.log(value)
                        return this.storageProvider.addToStorage(this.constProvider.coreStorageKeys.settings, key, value, false)
                    }


                })
                .then((res) => {

                    this.screenOrientation.changeOrientation();
                }
                    , (error) => {
                        reject(error);
                    })




        });
    }

    setSettingsPropertiesValues(variables?: any) {

        if (variables)
            variables.forEach((r) => {
                this.storageProvider.getFromStorage(this.constProvider.coreStorageKeys.settings, r.variable, false)
                    .then((res) => {
                        if (res != null && res != undefined) {
                            this[r.variable] = res;
                            if (res === true) {
                                //loadaj iz postavki koja landscape orijentacija je bila odabrana
                                this.isDisabled = false;
                                if (r.variable === "islandscape")
                                    this.setLandscapeOrientation();
                            }
                            else {
                                this.isDisabled = true;
                            }

                        }

                    }
                        , (error) => {
                            this.globalProvider.logError(error, false);
                        });
            });
        this.push.getPushRegistrationId()
            .then((res) => {
                if (res) {
                    this.variableProvider.loginData.pushEnabled = res.pushEnabled;
                }
            })
    }


    setLandscapeOrientation() {
        this.storageProvider.getFromStorage(this.constProvider.coreStorageKeys.settings, 'landscapeorientation', false)
            .then((res) => {

                if (res != null && res != undefined) {
                    this.orientationType = res;

                }

            }
                , (error) => {
                    this.globalProvider.logError(error, false);
                });
    }


}
