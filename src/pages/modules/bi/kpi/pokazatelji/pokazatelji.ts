import {Component} from '@angular/core';
import {NavController, IonicPage} from 'ionic-angular';
import {ManagerKpiProvider} from '../../../../../providers/managerkpi-provider';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/ICore';

@IonicPage()
@Component({selector: 'page-manager-kpi-pokazatelji', templateUrl: 'pokazatelji.html'})
export class ManagerKpiPokazeteljiPage extends BasePage {
    items : any;
    tip: string = "fav";
    dataAction: number = 0;

    constructor(public navCtrl : NavController,  private managerKpiProvider : ManagerKpiProvider) {
        super();
        var dat : Date = new Date();
        dat.setDate(dat.getDate() - 1);
        managerKpiProvider.datum = dat.toISOString();

        
        this.getData(0);
    }

    setDataDef(action) {
        this.dataAction = action;
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spManPortFavMobQuery",
                    "params": {
                        "Action": action,
                        "OperateriId": "@@OperaterId",
                        "datum": this.managerKpiProvider.datum
                    }
                }
            ]
        }

        return this
            .global
            .getData(dataDef);

    }

    getBroj (item) {
      return item  
    }

    getBackgroundImage(item) {
        if (item.invert == 1)
            return "url('assets/images/gauge-inverted.svg')";
        else
            return "url('assets/images/gauge.svg')";
    }

    getPokazateljBoja(item) {
        if (item.pokazateljboja == 'darkbrown')
            return "white";
        if (item.pokazateljboja == 'lightred')
            return "red";
        return item.pokazateljboja;
    }


    pokazateljiView(action: number) {
        this.getData(action);
    }

    getData(action: number) {
        this.items = [];
        this
        .setDataDef(action)
        .then(x => {
            this.items = x;
        });
    }

  startModule(item) {
        this.navCtrl.push('ManagerKpiTrendPage', item);

    }


    refreshPokazatelji() {
        this.getData(this.dataAction);
    }


}
