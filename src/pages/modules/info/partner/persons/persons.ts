import {Component} from '@angular/core';
import {NavController, IonicPage } from 'ionic-angular';
import {PartnerinfoProvider} from '../../../../../providers/partnerinfo-provider';
//import 'rxjs/add/operator/map';

//import { PartnerPersonsDetPage } from '../persons-det/persons-det';

declare var window;

@IonicPage()
@Component({
  selector: 'page-partner-persons', templateUrl: 'persons.html',
  //providers: [PartnerinfoProvider]
})
export class PartnerPersonsPage {
  modifiedData: any;
  term: string = '';
  constructor(private navCtrl: NavController, public partner: PartnerinfoProvider) {
    // this
    //   .partner
    //   .InitStorage(118);
  }


  doRefresh(refresher) {
    setTimeout(() => {
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

  call(item) {
    window.location = "tel:" + item;
  }

  mailto(item) {
    if (item==null)
        return;
    window.location = "mailto:" + item;
 }

}
