import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { UtilityIzvidnikProvider } from '../../../../../providers/modules/utility/izvidnik/utility-izvidnik-provider';

/**
 * Generated class for the IzvidnikPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */

@IonicPage()
@Component({
  selector: 'page-izvidnik',
  templateUrl: 'izvidnik.html'
})
export class IzvidnikPage extends BasePage {

  mojiDogadjajiRoot = 'DanasPage'
  danasRoot = 'DanasPage'
  zadnjih7DanaRoot = 'DanasPage'


  constructor(public navCtrl: NavController, private izvidnikProvider: UtilityIzvidnikProvider) {
    super();
  }

  ionViewWillLoad() 
  {
    this.izvidnikProvider.getMenuPermissions();
  }

}
