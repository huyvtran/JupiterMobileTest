import { NativeNetworkPluginProvider } from './../providers/native/network/network-provider';
import { Component, enableProdMode , NgZone} from '@angular/core';
import { Platform, NavController, App, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { Storage } from '@ionic/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';

import { GlobalProvider } from '../providers/core/global-provider';
import { VariableProvider } from '../providers/core/variable-provider';
import { FavoritesProvider } from '../providers/core/favorites-provider';
import { ModulesProvider } from '../providers/core/modules-provider';
import { NativeScreenOrientationProvider } from '../providers/native/screenorientation/screenorientation-provider';

import _ from 'lodash';
import { PushNotificationService } from '../providers/native/push/push-provider';

// this is the magic wand
enableProdMode();

@Component({templateUrl: 'app.html'})
export class MyApp {
    rootPage : any;
    refreshToken : string;
    company : string;

    

    constructor(private network: Network
        , private zone : NgZone,private platform : Platform, private events : Events,private pushService: PushNotificationService, public push : Push, statusBar : StatusBar
        , private app: App
        , private menuCtrl: MenuController
        , splashScreen : SplashScreen
        , private global : GlobalProvider
        , public favoritesProvider: FavoritesProvider
        , public modulesProvider: ModulesProvider
        , storage : Storage
        , uniqueDeviceID: UniqueDeviceID
        , device: Device
        , private variableProvider: VariableProvider
        , private networkProvider: NativeNetworkPluginProvider
        , private screenorientationProvider : NativeScreenOrientationProvider) {
        
            


        platform
            .ready()
            .then(() => {

              


                platform.registerBackButtonAction(() => {
                    // get current active page
                    //let view = this.navCtrl.getActive();
                    global.pullPage('backButton');
                    //alert(this.navCtrl.canGoBack());
                    //alert(view.component.name);
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

                this.listenToEvents();

                this.network.onDisconnect().subscribe(() => {
                    this.events.publish('connection:disconnected');
                });

                this.network.onConnect().subscribe(() => {                  
                    this.events.publish('connection:connected', this.network.type);
                });

                if(this.networkProvider.isOffline()){
                    this.variableProvider.hasInternet = 0;
                }
                else{
                    this.variableProvider.hasInternet = 1;
                }

                 //handle screen orientation
                 this.handleScreenOrientation();

                variableProvider.device = {
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
                            .get(this.global.getCoreStorageKeys.loginData)
                            .then((val) => {
                                console.log(val)
                                this.variableProvider.loginData = JSON.parse(val);
                            })
                            .then(() => {
                                storage
                                    .get(this.global.getCoreStorageKeys.jupiterSystemData)
                                    .then((val) => {
                                        VariableProvider.jupiterSystemData = JSON.parse(val);
                                    })
                                    .then(() => {
                                        storage
                                            .get(this.global.getCoreStorageKeys.company)
                                            .then((val) => {
                                                this.variableProvider.company = JSON.parse(val);
                                            })
                                            .then(() => {
                                                this.setRoot();
                                                setTimeout(() => {
                                                    splashScreen.hide();
                                                }, 1000);
                                                //this.setNotifications();
                                            });
                                    })

                            })
                    });

            });

    }



    handleScreenOrientation(){
        
        this.screenorientationProvider.isTablet = false;

        if(this.platform.is('core'))
            return;

        if (this.platform.is('ipad') || this.platform.is('phablet') || this.platform.is('tablet')) {
            this.screenorientationProvider.isTablet = true;
        }
            // if(this.global.isLandscapeOrientation('islandscape'))
            //     this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
            //this.screenOrientation.unlock();
        
    }


    listenToEvents() {
        this.events.subscribe('connection:connected', (type) => {
            console.log("connected");
            this.zone.run(() => {
                this.variableProvider.hasInternet = 1;
            });           
        });

        this.events.subscribe('connection:disconnected', () => {
            console.log("disconnected");
             this.zone.run(() => {
                this.variableProvider.hasInternet = 0;
            }); 
            
        });
   
  }
    



    get getVersion(): string {return GlobalProvider.getVersion};

    get navCtrl(): NavController {
        return this.app.getActiveNav();
    }

    setRoot() : void {
        //this.rootPage = 'HrmOdsustvaPage';
        //this.rootPage = 'HrmResursiZauzecaFilterPage';
        
        if (this.variableProvider.loginData == null || GlobalProvider.getJupiterSystemData == null) {
            this.rootPage = 'CoreLoginPage';
        } else if (this.global.getCompanyData == null) {
            this.rootPage = 'CoreCcCompanyPage';
            this.pushService.initPush();
            //GlobalProvider.getPagesHistory.push('CoreLoginPage');
        } else {
            this.rootPage = 'CoreCcTabsPage';
            this.pushService.initPush();
            //global.getPagesHistory.push('CoreLoginPage');
            //global.getPagesHistory.push('CoreCcCompanyPage');
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
            });

            pushObject
                .on('registration')
                .subscribe((registration : any) => {
                    console.log(registration)
                        
                });

            pushObject
                .on('error')
                .subscribe(error => console.error('pushObject', error));

        }
    }


    startJupiterApp(item) {
        console.log("startJupiterApp");
        console.log(item);
        this.menuCtrl.close();

        if (this.global.appIsLocked(item) == true) {
            this.global.presentToast("Aplikacija je zaključana!")
        } 
        else
        {
            this.global.modulesProvider.granule = null;
            this.global.modulesProvider.applicationName = '...';
            this.global.pushPage('CoreAppModulesPage', {item}).then(() => {

            });
        }


        // this
        //     .app
        //     .getRootNav()
        //     .setRoot('CoreAppModulesPage', item, {
        //         animate: true,
        //         direction: 'forward'
        //     });
    }

    // appIsLocked(item): boolean {
    //     return this.appUnlockProvider.appIsLocked(item);
    // }

    openPage(item) {
        this.menuCtrl.close();
        var page = item.component;

       


        if (page != null && page != "") 
        {

            if (this.modulesProvider.coremodules &&
                this.modulesProvider.coremodules.some(x => x.page && x.page.toLowerCase() === page.toLowerCase())) {
                    this.global.pushPage(page);
            } else {
                this.global.presentToast("Nemate prava pristupa ovoj granuli. Obratite se svom Jupiter Software administratoru.");
            }

            //  this
            //     .app
            //     .getRootNav()
            //     .setRoot(page, item, {
            //         animate: true,
            //         direction: 'forward'
            //     });
        } else {
            this.global.uIzradi();
        }
    }

    openFavoritePage(item) {
        console.log(item);
        this.menuCtrl.close();
        var page = item.parameter;
        if (page != null && page != "") 
        {
            this.global.pushPage(_.replace(page, "mob:", ""));
            // this
            //     .app
            //     .getRootNav()
            //     .setRoot(page, item, {
            //         animate: true,
            //         direction: 'forward'
            //     });
        } else {
            this.global.uIzradi();
        }
    }

}
