import { Component } from '@angular/core';
import { ViewController, IonicPage, NavParams } from 'ionic-angular';

import {BasePage} from '../../../providers/base/base-page';
import * as ICore from '../../../interfaces/iCore';

@IonicPage()
@Component({
  selector: 'page-shared-trazilica-autocomplete',
  
  templateUrl: 'trazilica-autocomplete.html',
})
export class SharedTrazilicaAutocompletePage extends BasePage {
  items : any;
  keyword : string;
  loadMessage : string;
  action: string;

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
      super();
  }

  ionViewDidLoad() {
    this.action = this.navParams.get('action');
  }

  search(event, key) {
        this.keyword = event.target.value;

        if (event.target.value != null && event.target.value.length > 2) {
            this
            .setDataDef(this.keyword)
            .then(x => {                
                this.items = x;
            }).catch(ex=> this.global.logError(ex, true));
        } else {
            this.items = null;
        }
    }

    setDataDef(keyword: string) {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobTrazilica",
                    "params": {
                        "action": this.action,
                        "keyword": keyword
                    }
                }
            ]
        }
        
        return this
            .global
            .getData(dataDef, true).catch(ex=> this.global.logError(ex, true));

    }


    itemTapped(event, item) {
        this.viewCtrl.dismiss(item);
        // this.events.publish('partner:selected', partner);
        // //this.viewCtrl.dismiss(partner);
        // this.viewCtrl.dismiss().catch(() => {});;
    }
}
