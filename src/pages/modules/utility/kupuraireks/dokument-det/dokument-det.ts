import { Component } from '@angular/core';
import { ViewController, IonicPage, NavParams } from 'ionic-angular';


import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';


@IonicPage()
@Component({
  selector: 'page-utility-kupuraireks-dokument-det',
  templateUrl: 'dokument-det.html'
})
export class UtilityKupUraIreksDokumentDetPage extends BasePage {
  private item: any;
  private status: string;
  private statusText: string;

  private napomena: string;


  constructor(private viewCtrl: ViewController, private navParams : NavParams) {
    super();
    this.item = this.navParams.get("item");
    this.status = this.navParams.get("status");

    if (this.status == "odobri") {
      this.statusText = "odobri";
    } else {
      this.statusText = "odbaci";
    }
  }

  setStatus() {
    this.viewCtrl.dismiss({type:"ok", napomena:this.napomena});
  }

  odustani() {
    this.viewCtrl.dismiss({type:"cancel", napomena:this.napomena});
  }
}

