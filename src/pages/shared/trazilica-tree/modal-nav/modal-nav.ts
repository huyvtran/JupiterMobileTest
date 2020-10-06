
import { Component } from '@angular/core';
import {IonicPage, NavParams, ViewController, Toast} from 'ionic-angular';
import * as ICore from '../../../../interfaces/iCore';

@IonicPage()
@Component({
  selector: 'page-modal-nav',
  templateUrl: 'modal-nav.html',
})
export class ModalNavPage {
  modalPage: any;
  action: string;
  query: ICore.IData;
  modalParams: any = { };
  toast: Toast = null;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    this.modalPage = this.navParams.get('page');
    this.action = this.navParams.get('action');
    this.query = this.navParams.get('query'); //custom query
    console.log("query");
    console.log(this.query);
  }

  ionViewDidLeave(){
    if (this.toast!=null)
      this.toast.dismiss();
  }

  dismissModal(data) {
    this.viewCtrl.dismiss(data);
  }
  
}
