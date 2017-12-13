import { Component } from '@angular/core';
import { ViewController, IonicPage, Events } from 'ionic-angular';

import { OsobainfoProvider } from '../../../../../providers/osobainfo-provider';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/ICore';

@IonicPage()
@Component({
  selector: 'page-osoba-search-det',
  templateUrl: 'search-det.html',
})
export class OsobaSearchDetPage extends BasePage {
  osobe : any;
  keyword : string;
  loadMessage : string;

  constructor(private viewCtrl: ViewController, public osoba : OsobainfoProvider, private events: Events) {
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
                this.osobe = x;
            }).catch(ex=> this.global.logError(ex, false));
        } else {
            this.osobe = null;
        }
    }

    setDataDef(keyword: string) {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobInfoOsoba",
                    "params": {
                        "Action": "search",
                        "ime": keyword,
                    }
                }
            ]
        }
        
        return this
            .global
            .getData(dataDef, true).catch(ex=> this.global.logError(ex, false));

    }


    itemTapped(event, osoba) {
        this.events.publish('osoba:selected', osoba);
        //this.viewCtrl.dismiss(partner);
        this.viewCtrl.dismiss().catch(() => {});;
    }
}
