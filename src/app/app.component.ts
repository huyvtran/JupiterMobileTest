import { Component } from '@angular/core';
import { Platform, NavController, App, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { Storage } from '@ionic/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';

import { GlobalProvider } from '../providers/core/global-provider';
import { VariablesProvider } from '../providers/core/variables-provider';
import { FavoritesProvider } from '../providers/core/favorites-provider';



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

                platform.registerBackButtonAction(() => {
                    // get current active page
                    let view = this.navCtrl.getActive();
                    console.log(this.navCtrl);
                    alert(this.navCtrl.canGoBack());
                    alert(view.component.name);
                    // if (view.component.name == "TabsPage") {
                    //     //Double check to exit app
                    //     if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                    //         this.platform.exitApp(); //Exit from app
                    //     } else {
                    //         let toast = this.toastCtrl.create({
                    //             message:  'Press back again to exit App?',
                    //             duration: 3000,
                    //             position: 'bottom'
                    //         });
                    //         toast.present();
                    //         lastTimeBackPress = new Date().getTime();
                    //     }
                    // } else {
                    //     // go to previous page
                    //     this.nav.pop({});
                    // }
                });

                VariablesProvider.device = {
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
                            .get(GlobalProvider.getCoreStorageKeys.loginData)
                            .then((val) => {
                                VariablesProvider.loginData = JSON.parse(val);
                            })
                            .then(() => {
                                storage
                                    .get(GlobalProvider.getCoreStorageKeys.jupiterSystemData)
                                    .then((val) => {
                                        VariablesProvider.jupiterSystemData = JSON.parse(val);
                                    })
                                    .then(() => {
                                        storage
                                            .get(GlobalProvider.getCoreStorageKeys.company)
                                            .then((val) => {
                                                VariablesProvider.company = JSON.parse(val);
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


    get getVersion(): string {return GlobalProvider.getVersion};

    get navCtrl(): NavController {
        return this.app.getActiveNav();
    }

    setRoot() : void {
        //this.rootPage = 'ManagerKpiTabsPage';
        if (GlobalProvider.getLoginData == null || GlobalProvider.getJupiterSystemData == null) {
            this.rootPage = 'CoreLoginPage';
        } else if (GlobalProvider.getCompanyData == null) {
            this.rootPage = 'CoreCcCompanyPage';
            GlobalProvider.getPagesHistory.push('CoreLoginPage');
        } else {
            this.rootPage = 'CoreCcTabsPage';
            GlobalProvider.getPagesHistory.push('CoreLoginPage');
            GlobalProvider.getPagesHistory.push('CoreCcCompanyPage');
        }
        GlobalProvider.getPagesHistory.push(this.rootPage);
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
                        VariablesProvider.pushRegistrationId = registration.registrationId;
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
