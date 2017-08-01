import { Component } from '@angular/core';
import { Platform, App, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { Storage } from '@ionic/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';

import { GlobalProvider } from '../providers/global-provider';
import { FavoritesProvider } from '../providers/favorites-provider';



@Component({templateUrl: 'app.html', providers: [Keyboard]})
export class MyApp {
    rootPage : any;
    refreshToken : string;
    company : string;


    //public deviceArr : {cordova: string, model: string, platform: string, uuid: string, version: string, manufacturer: string, isVirtual: boolean, serial: string};


    constructor(private platform : Platform, public push : Push, statusBar : StatusBar, private app: App,  private menuCtrl: MenuController, splashScreen : SplashScreen, private keyboard : Keyboard, private globalProvider : GlobalProvider, private favoritesProvider: FavoritesProvider, storage : Storage
        , uniqueDeviceID: UniqueDeviceID
        , device: Device) {
        platform
            .ready()
            .then(() => {
                GlobalProvider.device = {
                    cordova: device.cordova, 
                    isVirtual: device.isVirtual,
                    manufacturer: device.manufacturer, 
                    model: device.model,
                    platform: device.platform,
                    serial: device.serial,
                    uuid: device.uuid,
                    version: device.version
                }
                // Okay, so the platform is ready and our plugins are available. Here you can do
                // any higher level native things you might need.
                statusBar.styleDefault();
                
                // this
                //     .keyboard
                //     .disableScroll(true);

                uniqueDeviceID.get()
                    .then((uuid: any) => console.log("UUID:" + uuid))
                    .catch((error: any) => console.log(error));

                storage
                    .ready()
                    .then(() => {
                        storage
                            .get(GlobalProvider.coreStorageKeys.loginData)
                            .then((val) => {
                                GlobalProvider.loginData = JSON.parse(val);
                            })
                            .then(() => {
                                storage
                                    .get(GlobalProvider.coreStorageKeys.jupiterSystemData)
                                    .then((val) => {
                                        GlobalProvider.jupiterSystemData = JSON.parse(val);
                                    })
                                    .then(() => {
                                        storage
                                            .get(GlobalProvider.coreStorageKeys.company)
                                            .then((val) => {
                                                GlobalProvider.company = JSON.parse(val);
                                            })
                                            .then(() => {
                                                this.setRoot();
                                                setTimeout(() => {
                                                    splashScreen.hide();
                                                }, 1000);
                                                this.setNotifications();
                                            });
                                    })

                            })
                    });

            });

    }

    setRoot() : void {
        //this.rootPage = 'ManagerKpiTabsPage';
        if (GlobalProvider.loginData == null || GlobalProvider.jupiterSystemData == null) {
            this.rootPage = 'CoreLoginPage';
        } else if (GlobalProvider.company == null) {
            this.rootPage = 'CoreCcCompanyPage';
            GlobalProvider.pagesHistory.push('CoreLoginPage');
        } else {
            this.rootPage = 'CoreCcTabsPage';
            GlobalProvider.pagesHistory.push('CoreLoginPage');
            GlobalProvider.pagesHistory.push('CoreCcCompanyPage');
        }
        GlobalProvider.pagesHistory.push(this.rootPage);
    }


    setNotifications() {
        if (this.platform.is('cordova')) {
            this
                .push
                .hasPermission()
                .then((res : any) => {

                    if (res.isEnabled) {
                        console.log('Notifikacije - omogućene');
                    } else {
                        console.log('Notifikacije - onemogućene');
                    }

                });

            // to initialize push notifications

            const options : PushOptions = {
                android: {
                    senderID: '81260403274',
                    forceShow: true,
                    vibrate: true
                },
                ios: {
                    alert: 'true',
                    badge: true,
                    sound: 'false'
                },
                windows: {}
            };

            const pushObject : PushObject = this
                .push
                .init(options);


            pushObject.on('notification').subscribe((notification: any) => {
                //console.log('Received a notification', notification);
            });

            pushObject
                .on('registration')
                .subscribe((registration : any) => {
                    if (registration != null && registration.registrationId !=null)
                        GlobalProvider.pushRegistrationId = registration.registrationId;
                });

            pushObject
                .on('error')
                .subscribe(error => console.error('pushObject', error));

        }
    }


    startJupiterApp(item) {
        this.menuCtrl.close();
        
        this.globalProvider.modulesProvider.granule = item.group;
        this.globalProvider.modulesProvider.applicationName = item.name;

        GlobalProvider.pushPage('CoreAppModulesPage');
        this
            .app
            .getRootNav()
            .setRoot('CoreAppModulesPage', item, {
                animate: true,
                direction: 'forward'
            });
    }

    openPage(item) {
        this.menuCtrl.close();
        var page = item.component;
        if (page != null && page != "") 
        {
            GlobalProvider.pushPage(page);
            this
                .app
                .getRootNav()
                .setRoot(page, item, {
                    animate: true,
                    direction: 'forward'
                });
        } else {
            this.globalProvider.uIzradi();
        }
    }

    openFavoritePage(item) {
        this.menuCtrl.close();
        console.log(item);
        var page = item.page;
        if (page != null && page != "") 
        {
            GlobalProvider.pushPage(page);
            this
                .app
                .getRootNav()
                .setRoot(page, item, {
                    animate: true,
                    direction: 'forward'
                });
        } else {
            this.globalProvider.uIzradi();
        }
    }

}
