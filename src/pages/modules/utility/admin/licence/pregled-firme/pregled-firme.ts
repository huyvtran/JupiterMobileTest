import {Component} from '@angular/core';
import {NavController, IonicPage, NavParams, ToastController} from 'ionic-angular';
import { BasePage } from '../../../../../../providers/base/base-page';

import * as ICore from '../../../../../../interfaces/iCore';

@IonicPage()
@Component({selector: 'page-admin-pregled-firme', templateUrl: 'pregled-firme.html'})
export class AdminPregledFirmePage extends BasePage {
    tvrtke : any = [];
    term : string = '';


    constructor(private toastCtrl: ToastController, private navCtrl: NavController) {
        super();

        // this
        //     .getData()
        //     .then(data => {
        //         if (data != null)
        //             this.tvrtke = data.tvrtke;
        //     });
    }

    ionViewWillEnter(){
        this
        .getData()
        .then(data => {
            if (data != null)
                this.tvrtke = data.tvrtke;
        });
    }

    getData() {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobAdminQuery",
                    "params": {
                        "action": "tvrtke"
                    },
                    "tablename": "tvrtke"
                },

                {
                    "query": "spMobAdminQuery",
                    "params": {
                        "Action": "licence"
                    },
                    "tablename": "licence",
                    "refkey": "serverid",
                    "reftable": "tvrtke"

                }
            ]
        }
        return this
            .global
            .getData(dataDef);

    }

    searchFn(ev : any) {
        this.term = ev.target.value;
    }


    pregledLicenci(item: any) {
        console.log(item);
        this
        .navCtrl
        .push('AdminPregledLicenciPage', {tvrtka: item});
    }


}
