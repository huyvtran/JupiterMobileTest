import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';
import {RobainfoProvider} from '../../../../../providers/robainfo-provider';
@IonicPage()
@Component({
  selector: 'page-roba-kom-stanje',
  templateUrl: 'kom-stanje.html',
  //providers: [PartnerinfoProvider]
})
export class RobaKomStanjePage {

  term : string = '';
  constructor(navParams: NavParams, public roba : RobainfoProvider) {
  }
}
