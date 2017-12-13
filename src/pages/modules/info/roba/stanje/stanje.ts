import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';
import {RobainfoProvider} from '../../../../../providers/robainfo-provider';
@IonicPage()
@Component({
  selector: 'page-roba-stanje',
  templateUrl: 'stanje.html',
  //providers: [PartnerinfoProvider]
})
export class RobaStanjePage {

  term : string = '';
  constructor(navParams: NavParams, public roba : RobainfoProvider) {

  }
}
