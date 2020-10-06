import { Component } from '@angular/core';
import { IonicPage, ModalController, ToastController, MenuController, Platform } from 'ionic-angular';

import { VariableProvider } from './../../../../providers/core/variable-provider';
import { IStaticStartPages } from './../../../../interfaces/core/iStaticStartPages';
import { GlobalProvider } from '../../../../providers/core/global-provider';
import { AppUnlockProvider } from '../../../../providers/core/app-unlock-provider'
import { FavoritesProvider } from '../../../../providers/core/favorites-provider';

import { BasePage } from '../../../../providers/base/base-page';
import { ConstProvider } from '../../../../providers/core/const-provider';
import { ModulesProvider } from '../../../../providers/core/modules-provider';
import { NativeScreenOrientationProvider } from '../../../../providers/native/screenorientation/screenorientation-provider';

@IonicPage()
@Component({ selector: 'page-core-cc-applications', templateUrl: 'applications.html' })
export class CoreCcApplicationsPage extends BasePage {

    startPages: IStaticStartPages

    constructor(
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private menuCtrl: MenuController,
        private globalProvider: GlobalProvider,
        private variableProvider: VariableProvider,
        private favoritesProvider: FavoritesProvider,
        private constant: ConstProvider,
        appUnlockProvider: AppUnlockProvider,
        private screenOrientation: NativeScreenOrientationProvider,
        private platform: Platform,
        private modulesProvider: ModulesProvider) {
        super();
        //historyProivder.resetHistory("CoreCcTabsPage");

        this.startPages = constant.staticStartPages;
        this.menuCtrl.enable(true, 'mainMenu');

        appUnlockProvider.getDataFromStorage();


        if (this.globalProvider.getCompanyData == null) {
            this.closePage();
        } else {
            //globalProvider.modulesProvider.getApps();
            //ako nema interneta dohvati apps, module i granule iz storagea
            if (variableProvider.hasInternet)
                globalProvider
                    .modulesProvider
                    .InitStorage().then(() => {
                        this.favoritesProvider.init()
                        this.screenOrientation.changeOrientation();
                    });
            else
                this.modulesProvider.getDataFromStorage()
                    .then(() => this.screenOrientation.changeOrientation())

        }
    }

    openInfoModule(module) {
        if (this.globalProvider.modulesProvider.coremodules &&
            this.globalProvider.modulesProvider.coremodules.some(x => x.page && x.page.toLowerCase() === module.toLowerCase())) {
            this.globalProvider.pushPage(module);
        } else {
            this.globalProvider.presentToast("Nemate prava pristupa ovoj granuli. Obratite se svom Jupiter Software administratoru.");
        }
    }

    startJupiterApp(event, item) {
        //if (this.globalProvider.isDevMode == false && this.appIsLocked(item) == true) {
        if (this.appIsLocked(item) == true) {
            this.unlockApp(item);
        }
        else {

            this.variableProvider.customWebApi = item.webapi;

            //resetiram vrijednosti; u suprotnom su vidljive stare vrijednosti dok se novi modul ne učita
            this.globalProvider.modulesProvider.granule = null;
            this.globalProvider.modulesProvider.applicationName = '...';
            this.globalProvider.pushPage('CoreAppModulesPage', { item }).then(() => {

            });
        }
    }

    appIsLocked(item): boolean {
        try {
            if (this.globalProvider.getUnlockedApp == null)
                return true;


            var exists = this.globalProvider.getUnlockedApp.some(x => x.code.trim().toLowerCase() == item.code.trim().toLowerCase()
                && (x.db != null && x.db.toLowerCase() == this.variable.company.db.toLowerCase()))

            if (exists)
                return false;
            else
                return true;
        } catch (ex) {
            this.global.logError(ex, false);
            return true;
        }

    }


    doubleTap() {
        this.closePage();
    }

    closePage() {
        this.globalProvider.closeCC();
    }


    doRefresh(refresher) {
        this.globalProvider.modulesProvider.sync= true;


        setTimeout(() => {
            

            if(this.variableProvider.hasInternet)
                this.globalProvider
                    .modulesProvider
                    .populateFromDb().then(() => refresher.complete());
            else
                this.globalProvider.modulesProvider
                    .getDataFromStorage()
                    .then(() => refresher.complete())
         }, 1500);
    }



    uIzradi() {
        let message = "Funkcionalnost je u izradi";

        let toast = this
            .toastCtrl
            .create({ message: message, duration: 3000, position: 'bottom' });

        toast.onDidDismiss(() => {

        });

        toast.present();
    }

    unlockApp(item) {
        this.globalProvider.modal = this
            .modalCtrl
            .create('CoreCcApplicationUnlockPage', { item: item });
        this.globalProvider.modal.present();

        this.globalProvider.modal.onDidDismiss(data => {
            if (data != null && data.valid == true) {
                let toast = this
                    .toastCtrl
                    .create({ message: "Aplikacija je otključana!", duration: 2000, position: 'bottom' });
                toast.present();
            }
            this.globalProvider.modal = null;
        })
    }


}
