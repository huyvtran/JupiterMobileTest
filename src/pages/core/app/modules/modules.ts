import {ToastController} from 'ionic-angular';
import {Component} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';

import { GlobalProvider } from '../../../../providers/core/global-provider';
import { VariableProvider } from '../../../../providers/core/variable-provider';
import { PermissionProvider } from '../../../../providers/core/permission-provider';

@IonicPage()
@Component({selector: 'page-core-app-modules', templateUrl: 'modules.html'})
export class CoreAppModulesPage {
    

    constructor(navParams: NavParams
            , private toastCtrl : ToastController
            , public globalProvider: GlobalProvider
            , public variableProvider: VariableProvider
            , private permissionProvider : PermissionProvider) {
        try
        {
            let pars = navParams.data;
            //console.log(pars);
            if (pars != null) 
            {
                this.globalProvider.modulesProvider.granule = pars.item.group;
                this.globalProvider.modulesProvider.applicationName = pars.item.name;
                this.variableProvider.lastAppCode = pars.item.code;
            }            
        }
        catch (ex)
        {
            this.globalProvider.logError(ex);
        }
    }

    startModule(item) {
        let page = item
            .parameter
            .replace('mob:', '');


        if(item.permissions != null){
            this.permissionProvider.ssPermisions = item.permissions;
        }
        else
            this.permissionProvider.ssPermisions = null;
            

        if (item.webapi != null) {
            this.variableProvider.customWebApi = item.webapi;
        } else {
            this.variableProvider.customWebApi = null;
        }

        let parametar: any;
        if (item.mobparametar != null) {
            parametar = JSON.parse(item.mobparametar);
        }
        
        let self = this;
        this.globalProvider.pushPage(page, parametar).catch(ex => {
            this.globalProvider.logError(ex, false);
            let toast = self
                .toastCtrl
                .create({message: "Granula je u izradi", duration: 3000, position: 'bottom'});

            toast.present();
        });
    }
}
