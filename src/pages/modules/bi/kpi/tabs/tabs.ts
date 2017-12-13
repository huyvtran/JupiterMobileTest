import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class ManagerKpiTabsPage {

  tab1Root = 'ManagerKpiPokazeteljiPage';
  tab2Root = 'ManagerKpiGrafikoniPage';
  

  constructor() {

  }
}
