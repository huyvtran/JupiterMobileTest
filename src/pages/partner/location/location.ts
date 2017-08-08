import {Component} from '@angular/core';
import {NavController, IonicPage} from 'ionic-angular';

import {GlobalProvider} from '../../../providers/core/global-provider';
import {PartnerinfoProvider} from '../../../providers/partnerinfo-provider';
import {PartnerLocationDetPage} from '../location-det/location-det';

@IonicPage()
@Component({selector: 'page-partner-location', templateUrl: 'location.html'})
export class PartnerLocationPage {
  modifiedData : any;
  term : string = '';

  constructor(private navCtrl : NavController, private partner : PartnerinfoProvider, private globalProvider : GlobalProvider) {
    //this.partner.InitStorage(118);

  }

  // this is run whenever the (ionInput) event is fired
  searchFn(ev : any) {
    this.term = ev.target.value;
  }

  detailItem(item : any) {
    this
      .navCtrl
      .push(PartnerLocationDetPage, {item});
  }
}
