import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { HrmResursiPregledProvider } from '../../../../../providers/hrm-resursi-pregled';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
import * as Moment from 'moment';
import _ from 'lodash';

@IonicPage()
@Component({ selector: 'page-hrm-resursi-pregled', templateUrl: 'pregled.html' })
export class HrmResursiPregledPage extends BasePage {

    zauzeca: any[];
    group: any[];

    constructor(public navCtrl: NavController, private modalCtrl: ModalController, public navParams: NavParams, public provider: HrmResursiPregledProvider) {
        super();

        var params = navParams.data;
        this
            .getData(params)
            .then(x => {
                this.zauzeca = x.zauzeca;
                this.groupBy();
            });
        
    }

    

    presentFilter() {
        this
            .navCtrl
            .pop();


        // let modal = this
        //     .modalCtrl
        //     .create('HrmResursiPregledFilterPage');
        // modal.present();

        // modal.onDidDismiss(data => {
        //     if (data == null)
        //         return;

        //     this
        //         .getData(data)
        //         .then(x => {
        //             this.zauzeca = x.zauzeca;
        //             this.groupBy();
        //         });
        // })
    }

    presentSettings() {
        let modal = this
            .modalCtrl
            .create('SharedPropertyListPage', { group: this.provider.groupBy });
        modal.present();

        modal.onDidDismiss(data => {
            if (data == null)
                return;

            this.provider.groupBy = data.group;

            this.groupBy();
        })
    }

    groupBy() {
        if (this.provider.groupBy == undefined || this.provider.groupBy == "") {
            this.group = null;
        }
        else {
            this.group = _(this.zauzeca).groupBy(x => {
                if (this.provider.groupBy == "resurs")
                    return x.naziv
                else if (this.provider.groupBy == "osoba")
                    return x.osoba
            }).map((value, key) => ({ resursi: key, drugo: value })).value();
        }
    }

    getData(params) {
        console.log(params);
        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobHRMResursiPregled",
                    "params": {
                        "action": "getZauzeca",
                        "HrResursiId": params.HrResursiId,
                        "VrijemeOd": params.VrijemeOd,
                        "VrijemeDo": params.VrijemeDo
                    },
                    "tablename": "zauzeca"
                }
            ]
        }
        console.log(data);
        return this
            .global
            .getData(data, true);
    }

    formatRazdoblje(item): string {
        var datumOd = item.datumod;
        var datumDo = item.datumdo;
        var momentOd = Moment(datumOd).format("DD.MM.YYYY");
        var momentDo = Moment(datumDo).format("DD.MM.YYYY");

        // <span>{{zauzece?.datumod | date:
        // 'dd.MM.yyyy'}}</span><br>{{zauzece?.vrijemeod}} - {{zauzece?.vrijemedo}}

        if (momentOd == momentDo)
            return "<span>" + momentOd + "</span><br>" + item.vrijemeod + " - " + item.vrijemedo;
        else
            return "<span>" + momentOd + " " + item.vrijemeod + "</span><br><span>" + momentDo + " " + item.vrijemedo + "</span>";

        //return vrijemeOd;
    }
}
