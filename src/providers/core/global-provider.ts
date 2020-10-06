import { Injectable } from '@angular/core';
import {
    App,
    Platform,
    ToastController,
    NavController,
    Modal
} from 'ionic-angular';

import { ModulesProvider } from './modules-provider';
import { VariableProvider } from './variable-provider';
import { ConstProvider } from './const-provider';
import { ErrorProvider } from './error-provider';
import { DataProvider } from './data-provider';
import { TimeProvider } from './time-provider';
import { StorageProvider } from './storage-provider';
import * as ICore from '../../interfaces/ICore';


import { Storage } from '@ionic/storage';

import { IAppUnlocked } from '../../interfaces/core/app';
import { ICoreStorageKeys } from '../../interfaces/core/storagekeys';
import { ICompany } from '../../interfaces/core/company';
import { HelpersProvider } from './helpers-provider';
import { HistoryProvider } from './history-provider';

@Injectable()
export class GlobalProvider {
    public get isDevMode(): boolean { return this.helpers.isDevMode() };

    //***const begin*/
    public static get getVersion(): string { return ConstProvider.version };
    //public static get getSpinApiPath() : string {return ConstProvider.spinApiPath};
    public get getCoreStorageKeys(): ICoreStorageKeys { return ConstProvider.coreStorageKeys };
    //***const end*/

    public getApplicationName(): string { return this.modulesProvider.applicationName; }

    //***variables begin */
    //public static get getLoginData() : ILogin { return VariableProvider.loginData };
    public static get getJupiterSystemData(): any { return VariableProvider.jupiterSystemData };
    public get getCompanyData(): ICompany { return this.variableProvider.company };

    //*history*//
    public static get getPagesHistory(): Array<string> { return VariableProvider.pagesHistory };
    public static set setPagesHistory(value) { VariableProvider.pagesHistory = value };
    //***variables end */


    public get getUnlockedApp(): Array<IAppUnlocked> { return this.variableProvider.appUnlocked };
    public set setUnlockedApp(value) { this.variableProvider.appUnlocked = value };

    public modal: Modal;

    private static app: App;

    private backButton = 0;

    constructor(public modulesProvider: ModulesProvider,
        private variableProvider: VariableProvider,
        private time: TimeProvider,
        private data: DataProvider,
        private helpers: HelpersProvider,
        private error: ErrorProvider,
        public app: App, private storage: Storage,
        public toastCtrl: ToastController,
        private platform: Platform,
        private historyProvider: HistoryProvider,
        private storageProvider: StorageProvider,
        private constPovider: ConstProvider) {
        GlobalProvider.app = app;
    }

    //getData(iData: ICore.IData, showLoader?: boolean) : Promise<any> {return this.data.getData(iData, showLoader)}

    // getData (iData: ICore.IData, showLoader?: boolean) : Promise<any> {return this.data.getData(iData, showLoader).toPromise().then(result => {return result.json()})};
    // getDataToken (iData: ICore.IData, showLoader?: boolean,apiEndPoint?: string,jupiterSystem?:boolean, tokenRequired?: boolean) : Promise<any> {return this.data.getData(iData, showLoader, apiEndPoint, jupiterSystem, tokenRequired).toPromise().then(result => {return result.json()})}

    getData(iData: ICore.IData,  iProperties?: ICore.IProperties): Promise<any> { return this.data.getData(iData, iProperties).toPromise().then(result => { return result.json() })};
    getObservedData(iData: ICore.IData,  iProperties?: ICore.IPropertiesCore) { return this.data.getData(iData, iProperties) };
    getDataToken(iData: ICore.IData,  iProperties?: ICore.IPropertiesCore): Promise<any> { return this.data.getData(iData, iProperties).toPromise().then(result => { return result.json() }) }


    getTime(type: string, doDanas?: boolean) {
        return (this.time.getTime(type, doDanas));
    }

    logError(err: any, show?: boolean) {
        this.error.logError(err, show);
    }

    public getSubTitle(): string {

        let companyName = "" //GlobalProvider.company.name;
        let userName = "";

        if (this.getCompanyData != null && this.getCompanyData.name != null)
            companyName = this.getCompanyData.name;

        if (GlobalProvider.getJupiterSystemData != null && GlobalProvider.getJupiterSystemData.user != null && GlobalProvider.getJupiterSystemData.user.name != null)
            userName = GlobalProvider.getJupiterSystemData.user.name;

        if (companyName != null && companyName != "")
            companyName += " - ";
        else
            companyName = "";

        return companyName + userName;
    }

    public getAppModules(): any[] {
        return this.modulesProvider.apps;
        // let data = this.modulesProvider.modules.find(x => x.company == "Spin")[0];

    }

    public getInfoModules(): any { return this.modulesProvider.infoModules; }


    get navCtrl(): NavController {
        return this.app.getActiveNav();
    }

    public pullPage(type: string) {

        try {
            if (this.navCtrl != null && this.navCtrl.canGoBack()) {
                this.navCtrl.pop({});
                return;
            }


            if (this.modal != null) {
                this.modal.dismiss();
                return;
            }

            //ukloni zadnji zapis
            if (GlobalProvider
                .getPagesHistory != null && GlobalProvider
                    .getPagesHistory.length > 1) {
                GlobalProvider
                    .getPagesHistory
                    .pop();
                //zadnji (predzadnji) zapis
                var page = GlobalProvider.getPagesHistory[GlobalProvider.getPagesHistory.length - 1];

                if (page != null) {
                    this
                        .app
                        .getRootNav()
                        .setRoot(page, {}, {
                            animate: true,
                            direction: 'back'
                            // animate: true,
                            // direction: 'forward'
                        })
                }

            } else {
                this.doubleTapToExit();
            }
        } catch (ex) {
            console.log("greška!");
            this.logError(ex, true);
        }

    }

    public pushPage(page: string, params?: any) {
        let self = this;
        let pageArr = page.split(':');
        let pageWithoutModuleId = pageArr[0];
        // if (pageArr.length > 1)
        // {
        //     params = pageArr[1];
        // }

        return new Promise(function (resolve, reject) {
            self
                .app
                .getRootNav()
                .setRoot(pageWithoutModuleId, params, {
                    animate: true,
                    direction: 'forward'
                }).then(() => {
                    // if (!(page=="CoreCcTabsPage" || page == "CoreCcCompanyPage"))
                    // {
                    GlobalProvider.getPagesHistory.push(page);
                    self.historyProvider.pagesLog(page);
                    //}
                    resolve();
                }
                ).catch(ex => reject(ex));
        });
    }


    doubleTapToExit() {
        if (this.backButton == 0) {
            this.backButton++;

            let toast = this
                .toastCtrl
                .create({ message: "Pritisnite još jednom za izlazak.", duration: 1500, position: 'bottom' });

            toast.present();

            setTimeout(() => {
                this.backButton = 0
            }, 1500);
        } else {
            this.platform.exitApp();
        }
    }



    public closeCC() {
        this
            .app
            .getRootNav()
            .setRoot("CoreCcCompanyPage", {}, {
                animate: true,
                direction: 'backward'
            }).then(() => {
                this
                    .storage
                    .remove(this.getCoreStorageKeys.company);
                this.modulesProvider.ClearData();
                this.variableProvider.company = null;
            });
    }

    uIzradi() {
        let message = "Funkcionalnost je u izradi";

        let toast = this
            .toastCtrl
            .create({ message: message, duration: 3000, position: 'bottom' });

        toast.onDidDismiss(() => { });

        toast.present();
    }



    presentToast(message: string) {

        let toast = this
            .toastCtrl
            .create({ message: message, duration: 3000, position: 'bottom' });

        toast.onDidDismiss(() => { });

        toast.present();
    }

    public presentToastError(message: string) {
        let toast = this
            .toastCtrl
            .create({ message: message, duration: 5000, position: 'bottom', cssClass: "toast-error" });

        toast.onDidDismiss(() => {

        });

        toast.present();
    }

    appIsLocked(item): boolean {
        if (this.variableProvider.appUnlocked == null)
            return true;

        var exists = this.variableProvider.appUnlocked.some(x => x.code.trim().toLowerCase() == item.code.trim().toLowerCase()
            && (x.db != null && x.db.toLowerCase() == this.variableProvider.company.db.toLowerCase()))

        if (exists)
            return false;
        else
            return true;
    }


    /***favorites begin*/


    /***favorites end*/
}