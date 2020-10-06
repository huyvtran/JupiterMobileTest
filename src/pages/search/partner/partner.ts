import { Component } from '@angular/core';
import { ViewController, IonicPage, Events } from 'ionic-angular';

import { PartnerinfoProvider } from '../../../providers/partnerinfo-provider';

import {BaseSearchPage} from '../../../providers/base/base-search-page';
import * as ICore from '../../../interfaces/ICore';

@IonicPage()
@Component({
  selector: 'page-search-partner',
  templateUrl: 'partner.html',
})
export class SearchPartnerPage extends BaseSearchPage {
    loadMessage : string;

    constructor(private viewCtrl: ViewController, public partner : PartnerinfoProvider, private events: Events) {
        super();
        this.action = "partner";
        partner.clearData();
        partner.getDataFromStorage();
    }

    detailItem(item) {
        let id: number = item.id;

        this
            .partner
            .setData(this.partner.getDataDefinition(id), id, item);


        if (this.viewCtrl.isOverlay == false)
        {
            this.global.pushPage('PartnerTabsPage');
        } else {
            this
                .viewCtrl
                .dismiss(item);
        }
        

        
    }
}