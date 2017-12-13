import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';
import {PartnerinfoProvider} from '../../../../../providers/partnerinfo-provider';
@IonicPage()
@Component({
  selector: 'page-partner-location-det',
  templateUrl: 'location-det.html',
  //providers: [PartnerinfoProvider]
})
export class PartnerLocationDetPage {
  item: any;
  constructor(navParams: NavParams, public partner : PartnerinfoProvider) {
    this.item = navParams.get("item")
  }
}
