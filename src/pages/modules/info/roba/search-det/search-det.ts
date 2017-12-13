import { Component } from '@angular/core';
import { ViewController, IonicPage, Events } from 'ionic-angular';

import { RobainfoProvider } from '../../../../../providers/robainfo-provider';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/ICore';

@IonicPage()
@Component({
  selector: 'page-roba-search-det',
  templateUrl: 'search-det.html',
})
export class RobaSearchDetPage extends BasePage {
  robe : any;
  keyword : string;
  loadMessage : string;

  constructor(private viewCtrl: ViewController, public roba : RobainfoProvider, private events: Events) {
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
                this.robe = x;
            }).catch(ex=> this.global.logError(ex, false));
        } else {
            this.robe = null;
        }
    }

    setDataDef(keyword: string) {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobInfoRoba",
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


    itemTapped(event, roba) {
        this.events.publish('roba:selected', roba);
        //this.viewCtrl.dismiss(partner);
        this.viewCtrl.dismiss().catch(() => {});;
    }
}
