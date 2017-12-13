import {ToastController} from 'ionic-angular';
import {Component} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';

import {GlobalProvider} from '../../../../providers/core/global-provider';

@IonicPage()
@Component({selector: 'page-core-app-modules', templateUrl: 'modules.html'})
export class CoreAppModulesPage {
    constructor(navParams: NavParams, private toastCtrl : ToastController, public globalProvider: GlobalProvider) {
        try
        {
            let pars = navParams.data;
            if (pars != null) 
            {
                this.globalProvider.modulesProvider.granule = pars.item.group;
                this.globalProvider.modulesProvider.applicationName = pars.item.name;
            }            
        }
        catch (ex)
        {
            this.globalProvider.logError(ex);
        }
            
    }

    startModule(item) {
        let parameter = item
            .parameter
            .replace('mob:', '');
        
        let self = this;
        this.globalProvider.pushPage(parameter).catch(ex => {
            this.globalProvider.logError(ex, false);
            let toast = self
                .toastCtrl
                .create({message: "Granula je u izradi", duration: 3000, position: 'bottom'});

            toast.present();
        });
    }
}
