import { NgModule, ErrorHandler, Injector } from '@angular/core';
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
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

/***core components - begin***/
import { AppUnlockProvider } from '../providers/core/app-unlock-provider';
import { AppUnlockStorageProvider } from '../providers/core/app-unlock-storage-provider';
import { ConstProvider } from '../providers/core/const-provider';
import { DataProvider } from '../providers/core/data-provider';
import { DateProvider } from '../providers/core/date-provider';
import { ErrorProvider } from '../providers/core/error-provider';
import { FavoritesProvider } from '../providers/core/favorites-provider';
import { GlobalProvider } from '../providers/core/global-provider';
import { HelpersProvider } from '../providers/core/helpers-provider';
import { HistoryProvider } from '../providers/core/history-provider';
import { ModulesProvider } from '../providers/core/modules-provider';
import { VariableProvider } from '../providers/core/variable-provider';
import { StorageProvider } from '../providers/core/storage-provider';

/***core components - end***/

import { LoginProvider } from '../providers/login/login-provider';
import { PartnerinfoProvider } from '../providers/partnerinfo-provider';
import { OsobainfoProvider } from '../providers/osobainfo-provider';
import { RobainfoProvider } from '../providers/robainfo-provider';
import { ManagerKpiProvider } from '../providers/managerkpi-provider';
import { HrmOdsustvaProvider } from '../providers/hrm-odsustva-provider';
import { HrmResursiPregledProvider } from '../providers/hrm-resursi-pregled';
import { HrmResursiZauzecaProvider } from '../providers/hrm-resursi-zauzeca';
import { HrmOdsustvaNajavaProvider } from '../providers/hrm-odsustva-najava-provider';
import { BiAnalizaProdajeProvider } from '../providers/bi-analiza-prodaje-provider';
import { BiAnalizaNabaveProvider } from '../providers/bi-analiza-nabave-provider';
import { BiAnalizaTijekaNovcaProvider } from '../providers/bi-analiza-tijeka-novca-provider';
import { BiAnalizaKupacaProvider } from '../providers/bi-analiza-kupaca-provider';
import { CrmSharedProvider } from '../providers/crm-shared';
import { CrmFinancijePregledProvider } from '../providers/crm-financije-pregled-provider';





import { StorageRoot } from '../models/storage-root';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
      BrowserModule,
      HttpModule,
      IonicModule.forRoot(MyApp,
      {
          tabsHideOnSubPages: true,
          monthNames: ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj','Srpanj', 'Kolovoz', 'Rujan','Listopad', 'Studeni', 'Prosinac' ],
          scrollPadding: false,
          scrollAssist: true,
          autoFocusAssist: false
      }),
      //IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false }),
      //IonicModule.forRoot(MyApp,{preloadModules: true, scrollAssist: false, autoFocusAssist: false}),
      IonicStorageModule.forRoot(),
      BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    /***core providers - begin***/
    AppUnlockProvider,
    AppUnlockStorageProvider,
    ConstProvider,
    DataProvider,
    DateProvider,
    ErrorProvider,
    FavoritesProvider,
    GlobalProvider,
    HelpersProvider,
    HistoryProvider,
    ModulesProvider,
    VariableProvider,
    StorageProvider,
    /***core providers - end***/
    /***page providers - begin***/
    LoginProvider,
    PartnerinfoProvider,
    OsobainfoProvider,
    RobainfoProvider,
    ManagerKpiProvider,
    HrmOdsustvaProvider,
    HrmResursiPregledProvider,
    HrmResursiZauzecaProvider,
    HrmOdsustvaNajavaProvider,
    BiAnalizaProdajeProvider,
    BiAnalizaNabaveProvider,
    BiAnalizaTijekaNovcaProvider,
    BiAnalizaKupacaProvider,
    CrmSharedProvider,
    CrmFinancijePregledProvider,
    /***page providers - end***/
    StorageRoot,
    BarcodeScanner,
    Camera,
    Diagnostic,
    Push,
    UniqueDeviceID,
    Device,
    NativePageTransitions,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
//export class AppModule {}
export class AppModule {
  static injector: Injector;
  constructor(injector?: Injector) {
      AppInjector = injector;
      //AppModule.injector = injector;
  }
}

export let AppInjector: Injector;

