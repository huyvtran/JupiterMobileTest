import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';

import * as ICore from '../../../../../interfaces/iCore';
import * as Moment from 'moment';

/**
 * Generated class for the DetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({selector: 'page-hrm-godisnji-evidencija-det', templateUrl: 'evidencija-det.html'})

export class HrmGodisnjEvidencijaDetPage extends BasePage {

    godina : string;
    details = [];
    moment;

    constructor(public navCtrl : NavController, public navParams : NavParams)
    {
        super();
        this.moment = Moment;
        this.godina = this
            .navParams
            .get('godina');

        this
            .getKronologijaDetails(this.godina)
            .then(x => {
                this.details = x;
                console.log(this.details);
            })
    }

    getKronologijaDetails(godina) {
        let data : ICore.IData = {
            "queries": [
                {
                    "query": "spMobHRMevidencijaGodisnjih",
                    "params": {
                        "action": "getKronologijaDetails",
                        "operaterid": "@@operaterid",
                        "godina": godina
                    },
                    "tablename": "kronologija"
                }, {
                    "query": "spMobHRMevidencijaGodisnjih",
                    "params": {
                        "action": "getKronologijaPreostalo",
                        "operaterid": "@@operaterid",
                        "godina": godina
                    },
                    "tablename": "info",
                    "singlerow": true
                }
            ]
        }
        return this
            .global
            .getData(data);
    }

}
