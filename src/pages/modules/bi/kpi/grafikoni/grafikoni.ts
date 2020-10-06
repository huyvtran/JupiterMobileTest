import {Component} from '@angular/core';
import {NavController, IonicPage} from 'ionic-angular';

import {ManagerKpiProvider} from '../../../../../providers/managerkpi-provider';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

@IonicPage()
@Component({selector: 'page-manager-kpi-grafikoni', templateUrl: 'grafikoni.html'})
export class ManagerKpiGrafikoniPage extends BasePage {
    cards : any;

    constructor(public navCtrl : NavController, public managerKpiProvider: ManagerKpiProvider) {
        super();

        this.getData();
    }

    setDataDef() {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spKPIMobSetQuery",
                    "params": {
                        "Action": "0",
                        "OperateriId": "@@OperaterId"
                    },
                    "tablename": "set"
                }, {
                    "query": "spKPIMobSetQuery",
                    "params": {
                        "Action": "1",
                        "OperateriId": "@@OperaterId"
                    },
                    "tablename": "grafikon",
                    "refkey": "manpoksetid",
                    "reftable": "set"

                }
            ]
        }
        return this
            .global
            .getData(dataDef);

    }

    getData() {
        //this.cards = [];
        this
            .setDataDef()
            .then(x => {
                this.cards = x;
            });
    }

    startModule(item, datumDo) {
        this.navCtrl.push('ManagerKpiGrafPage', item);

    }
}
