import { Component } from '@angular/core';
import { ViewController, IonicPage, Events } from 'ionic-angular';

import { RobainfoProvider } from '../../../providers/robainfo-provider';

import {BaseSearchPage} from '../../../providers/base/base-search-page';
import * as ICore from '../../../interfaces/ICore';

@IonicPage()
@Component({
  selector: 'page-search-roba',
  templateUrl: 'roba.html',
})
export class SearchRobaPage extends BaseSearchPage {
    loadMessage : string;

    constructor(private viewCtrl: ViewController, public provider : RobainfoProvider, private events: Events) {
        super();
        this.action = "roba";
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
            this.global.pushPage('RobaTabsPage');
        } else {
            this
                .viewCtrl
                .dismiss(item);
        }
        

        
    }
}