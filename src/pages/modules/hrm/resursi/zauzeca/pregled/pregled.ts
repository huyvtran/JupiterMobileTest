import {Component} from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams
} from 'ionic-angular';

import {HrmResursiZauzecaProvider} from '../../../../../../providers/hrm-resursi-zauzeca';

import {BasePage} from '../../../../../../providers/base/base-page';
import * as ICore from '../../../../../../interfaces/iCore';
import * as Moment from 'moment'

@IonicPage()
@Component({selector: 'page-hrm-resursi-zauzeca-pregled', templateUrl: 'pregled.html'})
export class HrmResursiZauzecaPregledPage extends BasePage {

    params : IParams;
    data : Array <IResurs> = new Array <IResurs> ();
    paramsStr : string = "";

    get getSelectQuery() : ICore.IQuery {
        return {
            "query": "spMobHRMResursiZauzeca",
            "params": {
                "action": "zauzece",
                "operaterid": "@@operaterid",
                "VrijemeOd": this.params.VrijemeOd,
                "VrijemeDo": this.params.VrijemeDo
            }
        }
    }

    get getSelected() {
        return this
            .data
            .filter(x => x.selected);
    }

    get getSelectedStr() : string {
        return this
            .getSelected
            .map(x => x.hrresursiid)
            .join(",");
    }

    constructor(public navCtrl : NavController, public provider : HrmResursiZauzecaProvider, navParams : NavParams) {
        super();
        this.params = navParams.data;
        this.paramsStr = Moment(this.params.VrijemeOd).format("DD.MM.YYYY HH:mm") + "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;" + Moment(this.params.VrijemeDo).format("DD.MM.YYYY HH:mm")
        
    }


    ionViewWillEnter() {
        this.getData();

      }
    


    presentFilter() {
        this
            .navCtrl
            .pop();
    }

    getData() {
        this
            .setDataDef()
            .then(x => {
                this.data = x;
            });
    }

    setDataDef() {
        let data : ICore.IData = {
            "queries": [this.getSelectQuery]
        }
        return this
            .global
            .getData(data, true);
    }

    setAzurDataDef(action : string, hrResursiZauzeceId?: number) {
        let data : ICore.IData = {
            "queries": [
                {
                    "query": "spMobHrmResursiZauzecaAzur",
                    "params": {
                        "action": action,
                        "HrResursiIds": this.getSelectedStr,
                        "OperaterId": "@@operaterid",
                        "VrijemeOd": this.params.VrijemeOd,
                        "VrijemeDo": this.params.VrijemeDo,
                        "HrResursiZauzeceId": hrResursiZauzeceId,
                        "Memo": this.provider.memo
                    }
                },
                this.getSelectQuery
            ]
        }
        return this
            .global
            .getData(data, true);
    }

    potvrda() {
        this
            .setAzurDataDef("insert")
            .then(x => {
                this.data = x;
            });
    }

    delete(resurs : IResurs) {
        this
            .setAzurDataDef("delete", resurs.hrresursizauzeceid)
            .then(x => {
                this.data = x;
            });
    }

    buttonState() {
        if (this.getSelected.length == 0) 
            return true;
        return false;
    }

    presentPregledPage(resurs) {
        this.global.uIzradi();
        // let params = {
        //     "hrresursiid": resurs.hrresursiid,
        //     "resursNaziv": resurs.naziv,
        //     "osoba": resurs.osoba
        // }

        // this
        //     .navCtrl
        //     .push('HrmResursiZauzecaPregledDetPage', {params});
    }

}

export interface IResurs {
    zauzeto : number;
    hrresursiid : number;
    naziv : string;
    selected : boolean;
    hrresursizauzeceid?: number;
    zauzeo?: string;
}

export interface IParams {
    VrijemeOd : string;
    VrijemeDo : string;
}