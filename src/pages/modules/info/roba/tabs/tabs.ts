import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { RobainfoProvider } from '../../../../../providers/robainfo-provider';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class RobaTabsPage {
  tab1Root = 'RobaInfoPage';
  tab2Root = 'RobaCjenikPage';
  tab3Root = 'RobaNabavaPage';
  tab4Root = 'RobaStanjePage';
  tab5Root = 'RobaKomStanjePage';
  constructor(public roba: RobainfoProvider) {
    
  }
}
