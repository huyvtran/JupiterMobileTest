import {Component} from '@angular/core';
import {NavParams, IonicPage} from 'ionic-angular';

import {CrmFinancijePregledProvider} from '../../../../../providers/crm-financije-pregled-provider';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';


@IonicPage()
@Component({selector: 'page-crm-financije-pregled-zadnje-det', 
    templateUrl: 'pregled-zadnje-det.html'
    })
export class CrmFinancijePregledZadnjeDetPage extends BasePage {

    akcija: string;
    title: string;
    data: any;
    brojstavaka: number = 0;

    constructor(private navParams: NavParams, private provider: CrmFinancijePregledProvider)
    {
        super();
        
        this.akcija = this
            .navParams
            .get('akcija');

        var titlePrefix = "Zadnje uplate - "
        if (this.akcija == "kupac") {
            this.title = titlePrefix + "kupac"
        } else if (this.akcija == "dobavljac") {
            this.title = titlePrefix + "dobavljač"
        }

        this.setData();
    }

    setData() {
        this
        .getData()
        .then(x => {
            this.data = x;
            this.brojstavaka = x.promet.length;
        })
        .catch(ex => this.global.logError(ex, true));
    }

    getData() {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobCrmFinancijskiPregledZadnjaUplataDubina",
                    "params": {
                        "action": this.akcija,
                        "partneriid": this.provider.partnerid
                    },
                    "tablename": "promet"
                }
            ]
        }
        return this
            .global
            .getData(dataDef);

    }

}
