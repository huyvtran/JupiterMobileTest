
import {Component, Input} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

@Component({ selector: 'js-header-modal', templateUrl: 'js-header-modal.html' })
export class JsHeaderModalComponent {

  @Input()title : string = "...";
  @Input()type : string;
  @Input()showClose : boolean = true;
  
  canGoBack: boolean = false;

  constructor(navCtrl: NavController, private viewCtrl: ViewController) {
     this.canGoBack = navCtrl.canGoBack();

  }
  dismiss() {
    this
      .viewCtrl
      .dismiss();
  }

}
