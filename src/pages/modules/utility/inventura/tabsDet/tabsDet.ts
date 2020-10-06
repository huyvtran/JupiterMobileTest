import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { InventuraProvider } from '../../../../../providers/modules/inventura-provider';

@IonicPage()
@Component({
  templateUrl: 'tabsDet.html'
})
export class UtilityInventuraTabsDetPage {
    tab1Root = 'UtilityInventuraImovinaOcekivanaPage';
    tab2Root = 'UtilityInventuraImovinaPronadjenaPage';


  constructor(public navPar: NavParams, private invProvider: InventuraProvider) {
    
    console.log(navPar.get('id'))
    console.log(navPar.get('naziv'))
    console.log(navPar.get('osbarcodepubvar'))
    this.invProvider.osinventuraglaid = navPar.get('id');
    this.invProvider.osinventuranaziv = navPar.get('naziv');
    this.invProvider.osbarcodepubvar = navPar.get('osbarcodepubvar');
    
  }

  ionViewDidEnter() {
    console.log('enableam scan listener')
    this.invProvider.disableKeyboardListener = false;
  }

  ionViewDidLeave() {
    console.log('DISABLEAM scan listener')
    this.invProvider.pageListenFunc = null;
    this.invProvider.disableKeyboardListener = true;
  }
}
