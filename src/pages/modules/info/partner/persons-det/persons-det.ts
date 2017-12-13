import {Component} from '@angular/core';
import {NavParams, IonicPage} from 'ionic-angular';

import {PartnerinfoProvider} from '../../../../../providers/partnerinfo-provider';

declare var window;

@IonicPage()
@Component({
    selector: 'page-partner-persons-det', templateUrl: 'persons-det.html',
    //providers: [PartnerinfoProvider]
})
export class PartnerPersonsDetPage {
    item : any;
    constructor(navParams : NavParams, public partner : PartnerinfoProvider) {
        this.item = navParams.get("item");
    }

    mailto(item) {
        if (item==null)
            return;
        window.location = "mailto:" + item;
     }

     call(item) {
        if (item==null)
            return;
        window.location = "tel:" + item;
     }
}
