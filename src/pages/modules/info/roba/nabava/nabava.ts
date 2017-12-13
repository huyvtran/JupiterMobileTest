import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';
import {RobainfoProvider} from '../../../../../providers/robainfo-provider';
@IonicPage()
@Component({
  selector: 'page-roba-nabava',
  templateUrl: 'nabava.html',
  //providers: [PartnerinfoProvider]
})
export class RobaNabavaPage {

  term : string = '';
  constructor(navParams: NavParams, public roba : RobainfoProvider) {

  }
}
