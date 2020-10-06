import {Component} from '@angular/core';
import { IonicPage, ToastController, NavController } from 'ionic-angular';
//import _ from 'lodash';

import {BasePage} from '../../../../providers/base/base-page';
import * as ICore from '../../../../interfaces/iCore';

declare var window;

@IonicPage({priority: 'high'})
@Component({selector: 'page-hrm-imenik', templateUrl: 'imenik.html'})
export class HrmImenikPage extends BasePage {
    term : string = '';

    private imenik : Array < any > = new Array < any > ();
    
    constructor(private toastCtrl: ToastController, private navCtrl: NavController) {
        super();

        this
            .getData()
            .then(data => {
                if (data != null)
                    this.imenik = data.djelatnici;
            });
    }
    getData() {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobHrmImenik",
                    "params": {
                        "action": "getAll"
                    },
                    "tablename": "djelatnici"
                }
            ]
        }
        return this
            .global
            .getData(dataDef);

    }

    reviver(key, value) : any
    {
        if ('djelatnik' === key) {
            return value.toLowerCase();
            // return value.replace(/\w\S*/g, function(txt){return
            // txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
        return value;
    }

    searchFn(ev : any) {
        this.term = ev.target.value;
    }

    call(item) {
         window.location = "tel:" + item.mobitel;
    }

    public presentToastError(message : string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {});
    }

    detailItem(item: any) {
        console.log(item);
        this
        .navCtrl
        .push('HrmImenikDetPage', {hrkadroviid: item.hrkadroviid});
    }

}
