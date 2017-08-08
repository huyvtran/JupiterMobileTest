import {Component} from '@angular/core';
import {IonicPage, ToastController, App } from 'ionic-angular';

import {GlobalProvider} from '../../../../providers/core/global-provider';

@IonicPage()
@Component({selector: 'page-core-cc-tools', templateUrl: 'tools.html'})
export class CoreCcToolsPage {
    constructor(private globalProvider : GlobalProvider, private toastCtrl: ToastController, private app: App) {}

    uIzradi() {
        let message = "Funkcionalnost je u izradi";
        
        let toast = this
            .toastCtrl
            .create({message: message, duration: 3000, position: 'bottom'});

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

    openBugShooter() {
                this
            .app
            .getRootNav()
            .setRoot('TestBugshooterPage', {}, {
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

}
