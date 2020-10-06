import { Component } from '@angular/core';
import { ViewController, IonicPage, Events } from 'ionic-angular';

import { OsobeinfoProvider } from '../../../providers/osobeinfo-provider';

import {BaseSearchPage} from '../../../providers/base/base-search-page';
import * as ICore from '../../../interfaces/ICore';

@IonicPage()
@Component({
  selector: 'page-search-osobe',
  templateUrl: 'osobe.html',
})
export class SearchOsobePage extends BaseSearchPage {
    loadMessage : string;

    constructor(private viewCtrl: ViewController, public provider : OsobeinfoProvider, private events: Events) {
        super();
        this.action = "osoba";
        provider.clearData();
        provider.getDataFromStorage();
    }

    detailItem(item) {
        let id: number = item.id;

        this
            .provider
            .setData(this.provider.getDataDefinition(id), id, item);


        if (this.viewCtrl.isOverlay == false)
        {
            this.global.pushPage('OsobeTabsPage');
        } else {
            this
                .viewCtrl
                .dismiss(item);
        }
        

        
    }
}