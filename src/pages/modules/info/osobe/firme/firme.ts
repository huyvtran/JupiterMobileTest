import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';

//import {PartnerLocationDetPage} from '../location-det/location-det';
import {OsobeinfoProvider} from '../../../../../providers/osobeinfo-provider';

@IonicPage()
@Component({selector: 'page-osoba-firma', templateUrl: 'firme.html'})
export class OsobaFirmaPage {
  modifiedData : any;
  term : string = '';

  constructor(public osoba : OsobeinfoProvider) {
    //this.partner.InitStorage(118);

  }

  // this is run whenever the (ionInput) event is fired
  searchFn(ev : any) {
    this.term = ev.target.value;
  }


  
}
