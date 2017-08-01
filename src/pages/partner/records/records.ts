import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { GlobalProvider } from '../../../providers/global-provider';
import { PartnerinfoProvider } from '../../../providers/partnerinfo-provider';


@IonicPage()
@Component({
  selector: 'page-parter-records',
  templateUrl: 'records.html'
})
export class PartnerRecordsPage {

  constructor(public navCtrl: NavController, private partner : PartnerinfoProvider, private globalProvider: GlobalProvider) {

  }

}
