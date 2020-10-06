import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { OsobeinfoProvider } from '../../../../../providers/osobeinfo-provider';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class OsobeTabsPage {
  tab1Root = 'OsobaInfoPage';
  tab2Root = 'OsobaFirmaPage';
  constructor(public osoba: OsobeinfoProvider) {
    
  }
}
