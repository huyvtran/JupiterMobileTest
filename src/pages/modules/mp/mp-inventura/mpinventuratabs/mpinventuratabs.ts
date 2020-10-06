import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Inventura_ListatrgovinaPage } from '../../../../../pages/modules/mp/mp-inventura/inventura_listatrgovina/inventura_listatrgovina';
import { InventuraOffListatrgovinaPage } from '../../../../../pages/modules/mp/mp-inventura/inventura_off_listatrgovina/inventura_off_listatrgovina';
//import { InventuraTrazilicarobePage } from '../../pages/inventura-trazilicarobe/inventura-trazilicarobe';

@IonicPage()
@Component({
  templateUrl: 'mpinventuratabs.html'
})
export class MPInventuraTabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = Inventura_ListatrgovinaPage;
  tab2Root: any = InventuraOffListatrgovinaPage;
   

  constructor() {

  }
}
