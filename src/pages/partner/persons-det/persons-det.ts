import {Component} from '@angular/core';
import {NavParams, IonicPage} from 'ionic-angular';

import {GlobalProvider} from '../../../providers/core/global-provider';
import {PartnerinfoProvider} from '../../../providers/partnerinfo-provider';

@IonicPage()
@Component({
    selector: 'page-partner-persons-det', templateUrl: 'persons-det.html',
    //providers: [PartnerinfoProvider]
})
export class PartnerPersonsDetPage {
    item : any;
    constructor(navParams : NavParams, private partner : PartnerinfoProvider, private globalProvider: GlobalProvider) {
        this.item = navParams.get("item");
    }
}
