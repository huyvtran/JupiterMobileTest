import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';

import * as ICore from '../../../../../interfaces/iCore';

@IonicPage()
@Component({selector: 'page-hrm-godisnji-evidencija', templateUrl: 'evidencija.html'})
export class HrmGodisnjiEvidencijaPage extends BasePage {

    tekucaGodina = {};
    kronologija = [];
    aktualnegodine = [];
    constructor(public navCtrl : NavController, public navParams : NavParams)
    {
        super();
        this
            .getEvidencija()
            .then(x => {
                this.tekucaGodina = x.tekucagodina;
            })

        this
            .getKronologija()
            .then(x => {
                this.kronologija = x.kronologija;
                this.aktualnegodine = x.aktualnegodine;
            })
    }

    openDetailView(godina) {
        this
            .navCtrl
            .push('HrmGodisnjEvidencijaDetPage', {godina});
    }

    getEvidencija() {
        let data : ICore.IData = {
            "queries": [
                {
                    "query": "spMobHRMevidencijaGodisnjih",
                    "params": {
                        "action": "getEvidencija",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "tekucaGodina",
                    "singlerow": true
                }
            ]
        }
        return this
            .global
            .getData(data, true);
    }

    getGodinaInfo(godina: number): string {
        if (this.aktualnegodine.find(x => x.godina == godina && x.starigodisnji == true))
            return "stari";
        else if (this.aktualnegodine.find(x => x.godina == godina && x.starigodisnji == false))
            return "novi";
        else
            return "stari"

    }

    getKronologija() {
        let data : ICore.IData = {
            "queries": [
                {
                    "query": "spMobHRMevidencijaGodisnjih",
                    "params": {
                        "action": "getKronologija",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "kronologija"
                },
                {
                    "query": "spMobHRMevidencijaGodisnjih",
                    "params": {
                        "action": "getAktualneGodine",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "aktualnegodine"
                }

            ]
        }
        return this
            .global
            .getData(data, true);
    }
}
