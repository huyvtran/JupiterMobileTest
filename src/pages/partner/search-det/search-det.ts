import { Component } from '@angular/core';
import { ViewController, IonicPage, Events } from 'ionic-angular';

import { PartnerinfoProvider } from '../../../providers/partnerinfo-provider';

@IonicPage()
@Component({
  selector: 'page-partner-search-det',
  templateUrl: 'search-det.html',
})
export class PartnerSearchDetPage {
  partneri : any;
  keyword : string;
  loadMessage : string;

  constructor(private viewCtrl: ViewController, private partner : PartnerinfoProvider, private events: Events) {
  }

  ionViewDidLoad() {
    
  }

  search(event, key) {
        this.keyword = event.target.value;

        if (event.target.value != null && event.target.value.length > 2) {
            this.partner
                .findPartner(event.target.value)
                .subscribe(data => {
                    this.partneri = data;
                }, err => {
                    this.loadMessage = "";
                }, () => this.loadMessage = "" /*() => loader.dismiss()*/);
        } else {
            this.partneri = null;
        }
    }


    itemTapped(event, partner) {
        this.events.publish('partner:selected', partner);
        //this.viewCtrl.dismiss(partner);
        this.viewCtrl.dismiss();
    }
}
