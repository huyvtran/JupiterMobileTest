import {Component} from '@angular/core';
import {ViewController, IonicPage, NavParams} from 'ionic-angular';

import {GlobalProvider} from '../../../providers/core/global-provider'
import {TimeProvider} from '../../../providers/core/time-provider';

@IonicPage()
@Component({selector: 'page-shared-date-filter', templateUrl: 'date-filter.html'})
export class SharedDateFilterPage {
    type:string = '';
    include: any = [];
    exclude: any = [];
    inputvrijeme: any = {};

    doDanas: boolean = false;    

    constructor(public viewCtrl : ViewController, global: GlobalProvider, navParams: NavParams, private time: TimeProvider) {
        try {
            if (navParams.get("type") != null)
                this.type = navParams.get("type");
            if (navParams.get("include") != null)
                this.include = navParams.get("include");
            if (navParams.get("exclude") != null)
                this.exclude = navParams.get("exclude");
            if (navParams.get("inputvrijeme"))
                this.inputvrijeme = navParams.get("inputvrijeme");

        } catch(ex) {
            global.logError(ex, true);
        }
        time.inputvrijeme = this.inputvrijeme;
    }

    getTime(selectedItem) {
        let result = this.time.getTime(selectedItem, this.doDanas);
        this.viewCtrl.dismiss(result);
    }
}