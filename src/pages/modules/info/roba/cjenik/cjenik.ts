import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';

//import {PartnerLocationDetPage} from '../location-det/location-det';
import {RobainfoProvider} from '../../../../../providers/robainfo-provider';

@IonicPage()
@Component({selector: 'page-roba-cjenik', templateUrl: 'cjenik.html'})
export class RobaCjenikPage {
  modifiedData : any;
  term : string = '';

  constructor(public roba : RobainfoProvider) {
   
  }
}
