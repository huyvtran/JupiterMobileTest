import {Component} from '@angular/core';
import {
    IonicPage,
    NavController
} from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
import * as Moment from 'moment';

@IonicPage()
@Component({selector: 'page-hrm-odsustva-odobravanje', templateUrl: 'odobravanje.html'})
export class HrmOdsustvaOdobravanjePage extends BasePage {
    data : any;
    selectedCnt: number = 0;

    get selectedOptions() {
        if (this.data == null)
            return {};
        return this
            .data
            .zahtjevi
            .filter(opt => opt.checked)
            .map(opt => opt.hrkadroviodsnajavaid)
    }

    constructor(public navCtrl : NavController) {
        super();

        this.getData(true);
    }

    getData(showLoader) {
        return this
        .setDataDef(showLoader)
        .then(x => {
            this.data = x;
            this.selected();
        })
        .catch(ex => this.global.logError(ex, true));
    }

    setDataDef(showLoader) {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobHrmOdsustvaOdobravanjeQuery",
                    "params": {
                        "action": "zahtjevi",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "zahtjevi"
                }
            ]
        }
        return this
            .global
            .getData(dataDef, showLoader);

    }

    formatRazdoblje(item) : string {
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
    }

    check(e) {
        this
            .data.zahtjevi
            .map(opt => opt.checked = e.checked);
        this.selected();
        
    }

    checkSingle(e) {
        this.selected();
    }

    selected() {
        this.selectedCnt = this.selectedOptions.length;
    }

    azur(odobreno, fab) {
        fab.close();
        var ids = this
            .selectedOptions
            .join(",");


        let data : ICore.IData = {
            "queries": [
                {
                    "query": "spMobHrmOdsustvaOdobravanjeAzur",
                    "params": {
                        "action": "update",
                        "operaterid": "@@operaterid",
                        "ids": ids,
                        "odobreno": odobreno
                    }
                }
            ]
        }
        this
            .global
            .getData(data)
            .then(() => this.global.presentToast("Selektirana odsustva su odobrena."))
            .then(() => this.getData(false))
            .catch(ex => this.global.logError(ex, false));
    }

    buttonState() {
        if (this.selectedOptions.length == 0)
            return true;
        return false;
    }

    dataExists(): boolean {
        if (this.data != null && this.data.zahtjevi.length > 0)
            return true;
        return false;
    }

    doRefresh(refresher) {
        setTimeout(() => {
            this.getData(false).then(() => refresher.complete());
         }, 1500);
    }


    presentOdobravanjeDetailPage(resurs) {

     
        // let params = {
        //     "hrresursiid": resurs.hrresursiid,
        //     "resursNaziv": resurs.naziv,
        //     "osoba": resurs.osoba
        // }

        this
            .navCtrl
            .push('HrmOdsustvaOdobravanjeDetPage', {resurs : resurs});
    }
}
