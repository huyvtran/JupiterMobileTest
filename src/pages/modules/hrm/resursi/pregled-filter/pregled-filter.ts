import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    PopoverController
} from 'ionic-angular';

import { HrmResursiPregledProvider } from '../../../../../providers/hrm-resursi-pregled';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

@IonicPage()
@Component({ selector: 'page-hrm-resursi-pregled-filter', templateUrl: 'pregled-filter.html' })
export class HrmResursiPregledFilterPage extends BasePage {

    // private init: boolean; resurs:string; params:any = {   resurs:'' };

    get selectedOptions() {
        return this
            .provider
            .filterResursi
            .filter(opt => opt.checked)
            .map(opt => opt.hrresursiid)
    }

    // maxDate:Date = new Date();
    constructor(public navCtrl: NavController, public navParams: NavParams, public provider: HrmResursiPregledProvider, private popoverCtrl: PopoverController) {
        super();

        if (this.provider.filterResursi.length == 0) {
            this
                .getData()
                .then(x => this.provider.filterResursi = x.resursi).catch((ex) => this.global.logError(ex));
        }
    }

    getData() {
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobHRMResursiPregled",
                    "params": {
                        "action": "multiselectResursi"
                    },
                    "tablename": "resursi"
                }
            ]
        }

        return this
            .global
            .getData(data);

    }

    prikazi() {
        var resursiSelected = this
            .selectedOptions
            .join(",");

        let params = {
            HrResursiId: resursiSelected,
            VrijemeOd: this.provider.vrijemeOd,
            VrijemeDo: this.provider.vrijemeDo
        }


        this.navCtrl.push('HrmResursiPregledPage', params);

        // this
        //     .viewCtrl
        //     .dismiss(params);
        // this     .navCtrl     .push('HrmResursiHistoryPage', {params});
    }

    check() {
        this.provider.filterCheckAll = !this.provider.filterCheckAll;
        return this
            .provider
            .filterResursi
            .map(opt => opt.checked = this.provider.filterCheckAll)
    }

    presentPopover(myEvent) {
        let popover = this
            .popoverCtrl
            .create('SharedDateFilterPage');
        popover.present({ ev: myEvent });

        popover.onDidDismiss((data) => {
            if (data != null) 
            {
                this.provider.vrijemeOd = data.start;
                this.provider.vrijemeDo = data.end;
            }
        })
    }

    buttonState() {
        if (this.selectedOptions.length == 0)
            return true;
        return false;
    }

    // dismiss() {
    //     this
    //         .viewCtrl
    //         .dismiss();
    // }
}
