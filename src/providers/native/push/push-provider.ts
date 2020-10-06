import { Injectable, ViewChild } from '@angular/core';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { Platform, Events, AlertController, Nav } from 'ionic-angular';
import { VariableProvider } from '../../core/variable-provider';
import { Diagnostic } from '@ionic-native/diagnostic';
import { StorageProvider } from '../../core/storage-provider';
import { ConstProvider } from '../../core/const-provider';
import * as ICore from '../../../interfaces/ICore';
import { GlobalProvider } from '../../core/global-provider';
@Injectable()
export class PushNotificationService {

    @ViewChild(Nav) navCtrl: Nav;
    private pushObject: PushObject

    constructor(private push: Push, private platform: Platform, private global: GlobalProvider, private variable: VariableProvider, private storage: StorageProvider, private constrProvider: ConstProvider, private diagnostic: Diagnostic, private alertCtrl: AlertController) {

        //this.initPush();
    }

    initPush() {
        console.log("init called")
        // to initialize push notifications
        // pozovi inicijalizaciju ako  ima interneta, ako je enebled od strane korisnika (default true)
        // ako ne postoji pushregistrationid
        console.log(this.variable.loginData)

        //provjeri u storage sa regID
        this.getPushRegistrationId()
            .then((object) => {
                console.log(object)

                if('pushEnabled' in object)
                {
                    if(object.pushEnabled)
                        this.init(object);
                }
                else{
                    object.pushEnabled = true;
                    this.init(object);
                }
                    
                
            })
        //if (this.variable.hasInternet && this.variable.loginData.pushEnabled && this.variable.loginData.pushRegistrationId == "")



    }

    init(object){
        //ako u storageu push nije enablean ne radi nista, ako je enablean init
        if (this.variable.hasInternet && object && object.pushEnabled) {
            if (this.platform.is('cordova')) {
                this
                    .push
                    .hasPermission()
                    .then((res: any) => {

                        if (res.isEnabled) {
                            console.log('Notifikacije - omogućene');
                        } else {
                            console.log('Notifikacije - onemogućene');
                        }

                    });

                const options: PushOptions = {
                    android: {
                        forceShow: true,
                        vibrate: true,
                        clearBadge: true
                    },
                    ios: {
                        alert: 'true',
                        badge: true,
                        sound: 'true',
                        clearBadge: true
                    },
                    windows: {}
                };

                this.pushObject = this
                    .push
                    .init(options);

                this.pushObject.on('notification').subscribe((notification: any) => {

                    //console.log(notification);
                    // if (notification.additionalData.foreground) {
                    //     // if application open, show popup
                    //     let confirmAlert = this.alertCtrl.create({
                    //         title: notification.title,
                    //         message: notification.message,
                    //         buttons: [{
                    //             text: 'Ignoriraj',
                    //             role: 'cancel'
                    //         }, {
                    //             text: 'Pregled',
                    //             handler: () => {
                    //                 //TODO: Your logic here
                    //                 this.navCtrl.push(notification.additionalData.page);
                    //             }
                    //         }]
                    //     });
                    //     confirmAlert.present();
                    // } else {
                    //     //if user NOT using app and push notification comes
                    //     //TODO: Your logic on click of push notification directly
                    //     this.navCtrl.push(notification.additionalData.page);
                    //     console.log('Push notification clicked');
                    // }

                });


                this.pushObject
                    .on('registration')
                    .subscribe((registration: any) => {
                        //console.log(registration)

                        if (registration != null && registration.registrationId != null) {
                            //VariableProvider.pushRegistrationId = registration.registrationId;

                            //provjeri u storage sa regID
                            this.getPushRegistrationId()
                                .then((object) => {
                                    //console.log(object)
                                    //ako ne postoji registrationId spremi ga u storage, variable provider, update pincore
                                    if (object && registration.registrationId != object.pushRegistrationId) {
                                        this.variable.loginData.pushRegistrationId = registration.registrationId;
                                        this.variable.loginData.pushEnabled = true;
                                        object.pushRegistrationId = registration.registrationId;
                                        object.pushEnabled = true;
                                        this.setPushRegistrationId(object);
                                        this.updatePinCoreRegistrationId(object);
                                    }
                                })
                        }

                    });

                //hendlanje grešanja ukoliko FCM servis pošalje
                this.pushObject
                    .on('error')
                    .subscribe(error => console.error('pushObject', error));

            }
        }
    }

    //sprema pushRegistrationId u storage
    setPushRegistrationId(loginData) {
        console.log("setam u storage");
        //console.log(loginData);
        return this.storage.addToStorage(this.constrProvider.coreStorageKeys.loginData, null, loginData, false);
    }

    getPushRegistrationId() {
        return this.storage.getFromStorage(this.constrProvider.coreStorageKeys.loginData, null, false);

    }

    //sprema pushRegistrationId na server u pincore tablicu
    updatePinCoreRegistrationId(jsonObject): Promise<any> {
        console.log("updateam pincore");
        //console.log(jsonObject)
        let properties: ICore.IPropertiesCore = {
            spinApiEndPoint: 'generic',
            errorMessageResponse: true
        }

        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spPinCoreAzur",
                    "params": {
                        "action": "updatePushReg",
                        "refreshToken": jsonObject.refreshToken,
                        "PushRegistrationId": jsonObject.pushRegistrationId
                    }
                }
            ]
        }

        try {
            return this
                .global
                .getData(data, properties);
        }
        catch (err) {

        }

    }

}




