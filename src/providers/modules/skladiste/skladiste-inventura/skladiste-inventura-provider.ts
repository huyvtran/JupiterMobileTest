import { Injectable } from '@angular/core';

import * as ICore from '../../../../interfaces/iCore'
import { GlobalProvider } from '../../../core/global-provider';
import { ToastOptions, ToastController } from 'ionic-angular';

@Injectable()
export class SkladisteInventuraProvider{
    public sveinventure: any = [];
    public inventuraid: any;
    public naslov: string;
    public indpolica: any;
    public skladisteid: any;
    public disableKeyboardListener:boolean = false;
    public pageListenFunc: Function;
    public indimei : any;

    
    properties : ICore.IProperties = {
        errorMessageCloseButton: false
    }

    constructor (private global: GlobalProvider, private toastCtrl: ToastController){

    }

    //dohvacanje inventura
    getInventure() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_InventuraGla_Grid",
                "params": {
                    "operateriid": '@@operateriid'
                },  
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }

    //dohvacanje defaultnih vrijednosti inventure
    getInventureDefaults() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_Inventura_Defaults",
                "params": {
                    "operateriid": "@@operateriid"
                },
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }

    localToast(message: string, cssClass?: string, duration?: number, showCloseButton: boolean = false) {
        console.log(message);
        if (duration == null || duration == 0)
            duration = 1500;

        let toastOptions: ToastOptions = {};

        toastOptions.message = message;
        toastOptions.duration = showCloseButton ? null : duration;
        toastOptions.position = 'bottom';
        toastOptions.cssClass = cssClass;
        toastOptions.showCloseButton = showCloseButton;
        toastOptions.closeButtonText = "Ok";

        let toast = this
            .toastCtrl
            .create(toastOptions);

        toast.present();
    }
}