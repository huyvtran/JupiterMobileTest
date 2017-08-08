import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Push } from '@ionic-native/push';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/***core components - begin***/
import { GlobalProvider } from '../providers/core/global-provider';
import { ModulesProvider } from '../providers/core/modules-provider';
import { FavoritesProvider } from '../providers/core/favorites-provider';
/***core components - end***/

import { LoginProvider } from '../providers/login/login-provider';
import { PartnerinfoProvider } from '../providers/partnerinfo-provider';
import { EvidencijaProvider } from '../providers/evidencija-provider';
import { ManagerKpiProvider } from '../providers/managerkpi-provider';




import { StorageRoot } from '../models/storage-root';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    //IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false }),
    //IonicModule.forRoot(MyApp,{preloadModules: true, scrollAssist: false, autoFocusAssist: false}),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ModulesProvider,
    GlobalProvider,
    FavoritesProvider,
    LoginProvider,
    PartnerinfoProvider,
    EvidencijaProvider,
    ManagerKpiProvider,
    StorageRoot,
    BarcodeScanner,
    Camera,
    Diagnostic,
    Push,
    UniqueDeviceID,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
