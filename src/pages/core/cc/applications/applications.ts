import {Component} from '@angular/core';
import {IonicPage, App, NavController, ToastController, Events, MenuController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {GlobalProvider} from '../../../../providers/global-provider';

@IonicPage()
@Component({selector: 'page-core-cc-applications', templateUrl: 'applications.html'})
export class CoreCcApplicationsPage {

    constructor(private navCtrl : NavController, private app : App, private globalProvider : GlobalProvider, private storage : Storage, private toastCtrl: ToastController,
        private events: Events, private menuCtrl: MenuController) {
        
        this.menuCtrl.enable(true, 'mainMenu');    
        if (GlobalProvider.company == null) {
            this.closePage();
        } else {
            //globalProvider.modulesProvider.getApps();
            globalProvider
                .modulesProvider
                .InitStorage();
        }
    }

    openModule(module) {
        GlobalProvider.pushPage('PartnerSearchPage');
        this
            .app
            .getRootNav()
            .setRoot('PartnerSearchPage', {}, {
                animate: true,
                direction: 'forward'
            });
    }

    startJupiterApp(event, item) {
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


    doubleTap() {
        this.closePage();
    }

    closePage() {
        this.globalProvider.closeCC();
    }

    doRefresh(refresher) {
        this.globalProvider.modulesProvider.sync= true;
        setTimeout(() => {
            this.globalProvider
                .modulesProvider
                .populateFromDb();
            refresher.complete();
        }, 1500);
    }



    uIzradi() {
        let message = "Funkcionalnost je u izradi";
        
        let toast = this
            .toastCtrl
            .create({message: message, duration: 3000, position: 'bottom'});

        toast.onDidDismiss(() => {
            
        });

        toast.present();
    }
}
