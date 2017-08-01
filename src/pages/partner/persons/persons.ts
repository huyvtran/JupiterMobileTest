import {Component} from '@angular/core';
import {NavController, IonicPage } from 'ionic-angular';

import {GlobalProvider} from '../../../providers/global-provider';
import {PartnerinfoProvider} from '../../../providers/partnerinfo-provider';
//import 'rxjs/add/operator/map';

//import { PartnerPersonsDetPage } from '../persons-det/persons-det';

@IonicPage()
@Component({
  selector: 'page-partner-persons', templateUrl: 'persons.html',
  //providers: [PartnerinfoProvider]
})
export class PartnerPersonsPage {
  modifiedData: any;
  term: string = '';
  constructor(private navCtrl: NavController, private partner : PartnerinfoProvider, private globalProvider: GlobalProvider) {
    // this
    //   .partner
    //   .InitStorage(118);
  }

  Provjeri() {
    console.log(this.partner.items);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  detailItem(item: any) {
    this.navCtrl.push('PartnerPersonsDetPage', {
      item
    });
  }

  searchFn(ev: any) {
    this.term = ev.target.value;
  }

}
