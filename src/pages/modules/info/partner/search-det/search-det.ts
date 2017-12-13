import { Component } from '@angular/core';
import { ViewController, IonicPage, Events } from 'ionic-angular';

import { PartnerinfoProvider } from '../../../../../providers/partnerinfo-provider';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/ICore';

@IonicPage()
@Component({
  selector: 'page-partner-search-det',
  templateUrl: 'search-det.html',
})
export class PartnerSearchDetPage extends BasePage {
  partneri : any;
  keyword : string;
  loadMessage : string;

  constructor(private viewCtrl: ViewController, public partner : PartnerinfoProvider, private events: Events) {
      super();
  }

  ionViewDidLoad() {
    
  }

    search(event, key) {
        this.keyword = event.target.value;

        if (event.target.value != null && event.target.value.length > 2) {
            this
            .setDataDef(this.keyword)
            .then(x => {                
                this.partneri = x;
            }).catch(ex=> this.global.logError(ex, false));
        } else {
            this.partneri = null;
        }
    }

    setDataDef(keyword: string) {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobInfoPartner",
                    "params": {
                        "Action": "search",
                        "Keyword": keyword,
                    }
                }
            ]
        }
        
        return this
            .global
            .getData(dataDef, true).catch(ex=> this.global.logError(ex, false));

    }


    itemTapped(event, partner) {
        this.events.publish('partner:selected', partner);
        //this.viewCtrl.dismiss(partner);
        this.viewCtrl.dismiss().catch(() => {});;
    }
}
