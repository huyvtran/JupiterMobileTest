import { Component, } from '@angular/core';
import { IonicPage, PopoverController, ViewController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import { UtilityDMSService } from '../../../../../providers/modules/utility/utility-dms-provider';

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})
export class UtilityDMSV2FilterListPage  extends BasePage {
  constructor(private dms : UtilityDMSService, public viewCtrl: ViewController,   private popoverCtrl: PopoverController) {
    super();

  }

  ionViewWillEnter() {
    //console.log(this.dms.parametri)
    //this.getData();
  }



  presentPopover(myEvent) {
    let popover = this
      .popoverCtrl
      .create('SharedDateFilterPage');
    popover.present({ ev: myEvent });

    popover.onDidDismiss((data) => {
      //console.log(data)
      if (data != null) {
        this.dms.parametri.datumdodanood = data.start;
        this.dms.parametri.datumdodanodo = data.end;
      }
    })
  }


  pretrazi() {
    //console.log(this.dms.parametri)
      this.viewCtrl.dismiss(true);
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }


  clearValue(slide, value, name) {
    slide.close();
    this.dms.parametri[name] = null;
    this.dms.parametri[value] = null;
  }




}

