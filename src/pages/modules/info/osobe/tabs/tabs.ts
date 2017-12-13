import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { OsobainfoProvider } from '../../../../../providers/osobainfo-provider';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class OsobaTabsPage {
  tab1Root = 'OsobaInfoPage';
  tab2Root = 'OsobaFirmaPage';
  constructor(public osoba: OsobainfoProvider) {
    
  }
}
