import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { PartnerinfoProvider } from '../../../../../providers/partnerinfo-provider';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class PartnerTabsPage {
  tab1Root = 'PartnerInfoPage';
  tab3Root = 'PartnerPersonsPage';
  tab4Root = 'PartnerLocationPage';
  tab5Root = 'PartnerRecordsPage';

  constructor(public partner: PartnerinfoProvider) {
    
  }
}
