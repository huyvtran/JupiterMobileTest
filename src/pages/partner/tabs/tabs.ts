import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

// import { PartnerInfoPage } from '../info/info';
// import { PartnerLocationPage } from '../location/location';
// import { PartnerFinancePage } from '../finance/finance';
// import { PartnerPersonsPage } from '../persons/persons';
// import { PartnerRecordsPage } from '../records/records';

import { PartnerinfoProvider } from '../../../providers/partnerinfo-provider';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class PartnerTabsPage {
  tab1Root = 'PartnerInfoPage';
  tab2Root = 'PartnerFinancePage';
  tab3Root = 'PartnerPersonsPage';
  tab4Root = 'PartnerLocationPage';
  tab5Root = 'PartnerRecordsPage';

  constructor(private partner: PartnerinfoProvider) {
    
  }
}
