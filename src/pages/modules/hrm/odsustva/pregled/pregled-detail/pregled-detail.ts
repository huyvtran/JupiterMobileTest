import { Component } from '@angular/core';
import { NavController, IonicPage, PopoverController, NavParams } from 'ionic-angular';

import { GlobalProvider } from '../../../../../../providers/core/global-provider';

import * as ICore from '../../../../../../interfaces/iCore';

import * as Moment from 'moment';

@IonicPage()
@Component({
    selector: 'page-hrm-odsustva-pregled-detail',
    templateUrl: 'pregled-detail.html'
})
export class HrmOdsustvaPregledDetailPage {
    hrkadroviodsnajavaid: number
    HRPrisutnostiId: number
    item: any = {};
    constructor(public navCtrl: NavController, private global: GlobalProvider, private navParams: NavParams,
        private popoverCtrl: PopoverController) {

        this.hrkadroviodsnajavaid = this.navParams.get('hrkadroviodsnajavaid');
        this.HRPrisutnostiId = this.navParams.get('HRPrisutnostiId');
        console.log(this.hrkadroviodsnajavaid)
        console.log(this.HRPrisutnostiId)
        this
            .getEvidencijaInfo()
            .then(x => this.item = x);

    }



    getEvidencijaInfo() {

        let properties: ICore.IProperties = {
            showLoader: false
        }

        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobHrmOdsustva",
                    "params": {
                        "action": this.HRPrisutnostiId ? "getEvidencijaInfo" : "getNajavaInfo",
                        "id": this.HRPrisutnostiId ? this.HRPrisutnostiId : this.hrkadroviodsnajavaid
                    },
                    "singlerow" : true
                }
            ]
        }
        return this
            .global
            .getData(data, properties);
    }

    getVrijeme(datum, showLoader) {

        let properties: ICore.IProperties = {
            showLoader: false
        }
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobHrmOdsustva",
                    "params": {
                        "action": "getDates",
                        "datum": datum
                    }
                }
            ]
        }
        return this
            .global
            .getData(data, properties);
    }


}
