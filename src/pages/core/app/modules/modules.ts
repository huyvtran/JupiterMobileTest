import {ToastController} from 'ionic-angular';
import {Component} from '@angular/core';
import {IonicPage, App} from 'ionic-angular';

import {GlobalProvider} from '../../../../providers/core/global-provider';

@IonicPage()
@Component({selector: 'page-core-app-modules', templateUrl: 'modules.html'})
export class CoreAppModulesPage {
    constructor(private app : App, private globalProvider : GlobalProvider, private toastCtrl : ToastController) {}

    startModule(item) {
        let parameter = item
            .parameter
            .replace('mob:', '');
        let module = this
            .globalProvider
            .modulesProvider
            .register
            .filter(x => x.parameter == parameter)
        if (module.length > 0) {
            var page = module[0].page;
            GlobalProvider.pushPage(page);
        } else {
            let toast = this
                .toastCtrl
                .create({message: "Granula je u izradi", duration: 3000, position: 'bottom'});

            toast.present();
        }
    }
}
