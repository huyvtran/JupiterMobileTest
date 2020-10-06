import { NgModule, ErrorHandler, Injector, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';


import { IonicStorageModule } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Push } from '@ionic-native/push';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ComponentsModule } from '../components/components.module';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { FileChooser } from '@ionic-native/file-chooser';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";
import { FilePath } from '@ionic-native/file-path';

/***core components - begin***/
import { AppUnlockProvider } from '../providers/core/app-unlock-provider';
import { AppUnlockStorageProvider } from '../providers/core/app-unlock-storage-provider';
import { ConstProvider } from '../providers/core/const-provider';
import { DataProvider } from '../providers/core/data-provider';
import { TimeProvider } from '../providers/core/time-provider';
import { ErrorProvider } from '../providers/core/error-provider';
import { FavoritesProvider } from '../providers/core/favorites-provider';
import { GlobalProvider } from '../providers/core/global-provider';
import { HelpersProvider } from '../providers/core/helpers-provider';
import { HistoryProvider } from '../providers/core/history-provider';
import { ModulesProvider } from '../providers/core/modules-provider';
import { JupiterSystemProvider } from '../providers/core/system-provider';
import { PermissionProvider} from '../providers/core/permission-provider';
import { VariableProvider } from '../providers/core/variable-provider';
import { StorageProvider } from '../providers/core/storage-provider';
/***core components - end***/
import {BasePage} from '../providers/base/base-page';

import { LoginProvider } from '../providers/login/login-provider';
import { PartnerinfoProvider } from '../providers/partnerinfo-provider';
import { OsobeinfoProvider } from '../providers/osobeinfo-provider';
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
import { UtilityIzvidnikProvider } from '../providers/modules/utility/izvidnik/utility-izvidnik-provider';
import { UtilityMobEvProvider } from '../providers/modules/utility/mobilne-evidencije/utility-mobilne-evidencije-provider';
import { InventuraProvider } from '../providers/modules/inventura-provider';
import { GenericFormProvider } from '../providers/modules/utility/generic/generic_form_provider';
import { UtilityDMSService } from '../providers/modules/utility/utility-dms-provider';



/***terkom components - begin***/
import { TerkomKomunikacijaProvider } from '../providers/modules/terkom/terkom-komunikacija-provider';
import { TerkomSifarniciProvider } from '../providers/modules/terkom/terkom-sifarnici-provider';
import { TerkomArtiklProvider } from '../providers/modules/terkom/terkom-artikl-provider';
import { TerkomUserProvider } from '../providers/modules/terkom/terkom-user-provider';
import { TerkomNarudzbaProvider } from '../providers/modules/terkom/terkom-narudzba-provider';
import { TerkomIzvjestajiProvider } from '../providers/modules/terkom/terkom-izvjestaji-provider';
import { TerkomDataProvider } from '../providers/modules/terkom/terkom-data-provider';
import { TerkomPocetakRadaProvider } from '../providers/modules/terkom/terkom-pocetakrada-provider';
import { TerkomEvidencijaPosjetaProvider } from '../providers/modules/terkom/terkom-evidencijaposjeta-provider';
import { TerkomUpitniciProvider } from '../providers/modules/terkom/terkom-upitnici-provider';
import { TerkomObavijestiProvider } from '../providers/modules/terkom/terkom-obavijesti-provider';

/***terkom components - end***/

/***shared components - begin***/
import { SignaturePage } from '../pages/modules/shared/signature/signature/signature';
import { DMSProvider } from '../providers/modules/shared/dms-provider';
/***shared components - end***/

/***terpro components - begin***/
import { TerproKomunikacijaProvider } from '../providers/modules/terpro/terpro-komunikacija-provider';
import { TerproSifarniciProvider } from '../providers/modules/terpro/terpro-sifarnici-provider';
import { TerproArtiklProvider } from '../providers/modules/terpro/terpro-artikl-provider';
import { TerproUserProvider } from '../providers/modules/terpro/terpro-user-provider';
import { TerproNativePluginProvider } from '../providers/modules/terpro/terpro-nativeplugin-provider';
import { TerproNarudzbaProvider } from '../providers/modules/terpro/terpro-narudzba-provider';
import { TerproIzvjestajiProvider } from '../providers/modules/terpro/terpro-izvjestaji-provider';
import { TerproDataProvider } from '../providers/modules/terpro/terpro-data-provider';
import { TerproPocetakRadaProvider } from '../providers/modules/terpro/terpro-pocetakrada-provider';
import { TerproStanjeSkladistaProvider } from '../providers/modules/terpro/terpro-stanjeskladista-provider';
import { TerProZkiProvider } from '../providers/modules/terpro/terpro-zki-provider';
/***terpro components - end***/

/***skladiste components - begin***/
import { SkladistePrijemniListProvider } from  '../providers/modules/skladiste/skladiste-prijemni-list-provider'

import { SkladisteInventuraProvider } from  '../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-provider'
import { SkladisteInventuraStavkaProvider } from  '../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-stavka-provider'
import { SkladisteStavkaIzmjenaProvider } from  '../providers/modules/skladiste/skladiste-inventura/skladiste-stavka-izmjenaprovider'
import { SkladisteStavkaUnosIzmjenaProvider } from  '../providers/modules/skladiste/skladiste-inventura/skladiste-stavka-unos-izmjena-provider'
/***skladiste components - end***/

/***native plugin components - begin***/
import { NativeGeolocationPluginProvider } from '../providers/native/geolocation/geolocation-provider';
import { NativeScreenOrientationProvider } from '../providers/native/screenorientation/screenorientation-provider';
import { NativeNetworkPluginProvider } from '../providers/native/network/network-provider';
import { NativePrintProvider } from '../providers/native/print/nativeprint-provider';
import { PrinterService } from '../providers/native/print/printer-provider';
import { PushNotificationService } from '../providers/native/push/push-provider'
/***native plugin components - end***/



import { StorageRoot } from '../models/storage-root';


@NgModule({
  declarations: [
    MyApp,
    SignaturePage
  ],
  imports: [
      ComponentsModule,
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
      SignaturePadModule,
      BrowserAnimationsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignaturePage
  ],
  providers: [
    /*{ provide: LOCALE_ID, useValue: "hr-HR" },*/
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    BluetoothSerial,
    DecimalPipe,
    /***core providers - begin***/
    AppUnlockProvider,
    AppUnlockStorageProvider,
    ConstProvider,
    DataProvider,
    TimeProvider,
    ErrorProvider,
    FavoritesProvider,
    GlobalProvider,
    HelpersProvider,
    HistoryProvider,
    ModulesProvider,
    JupiterSystemProvider,
    PermissionProvider,
    VariableProvider,
    StorageProvider,
    BasePage,
    /***core providers - end***/
    /***page providers - begin***/
    LoginProvider,
    PartnerinfoProvider,
    OsobeinfoProvider,
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
    UtilityIzvidnikProvider,
    UtilityMobEvProvider,
	  InventuraProvider,
    /***page providers - end***/

    /***page providers terkom - begin***/
    TerkomKomunikacijaProvider,
    TerkomSifarniciProvider,
    TerkomNarudzbaProvider,
    TerkomArtiklProvider,
    TerkomIzvjestajiProvider,
    TerkomUserProvider,
    TerkomDataProvider,
    TerkomPocetakRadaProvider,
    TerkomEvidencijaPosjetaProvider,
    TerkomUpitniciProvider,
    TerkomObavijestiProvider,
    GenericFormProvider,
    /***page providers terkom - end***/

    /***shared providers - begin***/
    DMSProvider,
    /***shared providers - end***/

    /***page providers terpro - begin***/
    TerproKomunikacijaProvider,
    TerproSifarniciProvider,
    TerproNativePluginProvider,
    TerproNarudzbaProvider,
    TerproArtiklProvider,
    TerproIzvjestajiProvider,
    TerproUserProvider,
    TerproDataProvider,
    TerproPocetakRadaProvider,
    TerproStanjeSkladistaProvider,
    TerProZkiProvider,
    /***page providers terpro - end***/

    /***page providers skladiste - begin***/
    SkladistePrijemniListProvider,
    
    SkladisteInventuraProvider,
    SkladisteInventuraStavkaProvider,
    SkladisteStavkaIzmjenaProvider,
    SkladisteStavkaUnosIzmjenaProvider,
    /***page providers skladiste - end***/

    /***native plugin components - begin***/
    NativeGeolocationPluginProvider,
    NativeScreenOrientationProvider,
    NativeNetworkPluginProvider,
    NativePrintProvider,
    PrinterService,
    PushNotificationService,
    /***native plugin components - end***/

    StorageRoot,
    Network,
    Geolocation,
    BarcodeScanner,
    Camera,
    Diagnostic,
    Push,
    UniqueDeviceID,
    Device,
    NativePageTransitions,
    FileChooser,
    UtilityDMSService,
    File,
    FileOpener,
    FilePath,
    PhotoViewer,
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

