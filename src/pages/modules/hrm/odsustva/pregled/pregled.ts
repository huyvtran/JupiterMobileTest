import { Component } from '@angular/core';
import { NavController, IonicPage, PopoverController } from 'ionic-angular';

import { GlobalProvider } from '../../../../../providers/core/global-provider';

import * as ICore from '../../../../../interfaces/iCore';

import * as Moment from 'moment';

@IonicPage()
@Component({
    selector: 'page-hrm-odsustva-pregled',
    templateUrl: 'pregled.html'
})
export class HrmOdsustvaPregledPage {
    dataInitialized: boolean = false;
    dates: Date[] = [];
    data: any[] = [];
    public selectedDate: string;

    private selectedMonth: string;

    tip: string;

    evidencijaSource;
    najavaSource;

    viewTitle;

    maxDate: string;

    constructor(public navCtrl: NavController, private global: GlobalProvider,
        private popoverCtrl: PopoverController) {

        this.maxDate= String(Moment().year() + 1)

        try {
            this.tip = "najava";
            this.selectedDate = Moment().format("YYYY-MM-DDT00:00:00");
            this.selectedMonth = Moment().startOf('month').add('days', 1).toISOString();
            this.getDates(true)
        } catch (ex) {
            this.global.logError(ex);
        }

    }



    getData(datum) {

        let properties: ICore.IProperties = {
            showLoader: false
        }

        let data: ICore.IData = {
            "queries": [
                {
                    "query": "spMobHrmOdsustva",
                    "params": {
                        "action": "getOdsustva",
                        "datum": datum
                    }
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

    getDates(showLoader) {
        this.getVrijeme(this.selectedMonth, showLoader).then(x => {
            this.dates = x.map(v => v.datum);
            this.data = x;
            this.dataInitialized = true;
        });
    }


    onDateChange(e) {
        this.selectedDate = e;

        this.getData(e).then(x => {
            this.evidencijaSource = x.table2;
            this.najavaSource = x.table3;

            console.log(this.najavaSource);

        })
    }

    onMonthChange(e) {
        this.selectedDate = Moment(this.selectedMonth).startOf("month").format("YYYY-MM-DDT00:00:00");
        this.getDates(false);
    }

    presentPopover(myEvent) {
        var exclude = ["group2", "group3", "group4"]
        let popover = this
            .popoverCtrl
            .create('SharedDateFilterPage', { exclude: exclude });

        popover.present({ ev: myEvent });

        popover.onDidDismiss((data) => {
            let dateStr = Moment(data.start).format("YYYY-MM-DDT00:00:00");

            if (Moment(data.start).format("YYYY-MM") != Moment(this.selectedMonth).format("YYYY-MM")) {
                this.selectedMonth = Moment(data.start).startOf("month").format("YYYY-MM-DDT00:00:00");
            }
            this.selectedDate = dateStr;
        })
    }


    detailItem(item: any, source: string) {
        console.log(item);

        if (source === "evidencija")
            this
                .navCtrl
                .push('HrmOdsustvaPregledDetailPage', { HRPrisutnostiId: item.id });
        else
            this
                .navCtrl
                .push('HrmOdsustvaPregledDetailPage', { hrkadroviodsnajavaid: item.id });
 
    }


}
