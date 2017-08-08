import {Component} from '@angular/core';
import {IonicPage, App, AlertController } from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {GlobalProvider} from '../../../../providers/core/global-provider';
import {VariablesProvider} from '../../../../providers/core/variables-provider';


@IonicPage()
@Component({selector: 'page-core-cc-settings', templateUrl: 'settings.html'})
export class CoreCcSettingsPage {
    constructor(private globalProvider : GlobalProvider, private storage : Storage, private app : App, private alertCtrl : AlertController) {}

    reset(tip) {
        this.resetShowConfirm(tip);
    }

    resetShowConfirm(tip) {
        let message = "Potvrdom ćete morati ponovno unijeti autorizacijske podatke.\nŽelite li svejedno nastaviti?"

        let confirm = this
            .alertCtrl
            .create({
                title: 'Reset',
                message: message,
                buttons: [
                    {
                        text: 'Odustani',
                        handler: () => {
                            ;
                        }
                    }, {
                        text: 'Potvrdi',
                        handler: () => {
                            this.resetConfirmed(tip);
                        }
                    }
                ]
            });
        confirm.present();
    }

    resetConfirmed(tip) {
        this
            .storage
            .forEach((value, key, index) => {
                console.log("key - " + key);
                if ((tip == 'auth' && (key == "refreshToken" || key == "company")) || tip == 'all') {
                    console.log(key);
                    this
                        .storage
                        .remove(key);
                }
            })
            .then(() => {
                VariablesProvider.company = "";
                //GlobalProvider.setRefreshToken("");
                this
                    .app
                    .getRootNav()
                    .setRoot('CoreLoginPage', {}, {
                        animate: true,
                        direction: 'backward'
                    });
            });
    }

    doubleTap() {
        this.closePage();
    }

    closePage() {
        this.globalProvider.closeCC();
    }

}
