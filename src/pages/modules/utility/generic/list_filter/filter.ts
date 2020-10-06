import { Component, } from '@angular/core';
import { IonicPage, ModalController, PopoverController, ViewController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';

import { GenericFormProvider } from '../../../../../providers/modules/utility/generic/generic_form_provider';

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})
export class GenericFilterListPage extends BasePage {

  granula: string = "Ponude"

  constructor(private provider: GenericFormProvider, private modalCtrl: ModalController, public viewCtrl: ViewController, private popoverCtrl: PopoverController) {
    super();

  }

  ionViewWillEnter() {
    console.log(this.provider.parametri)
    //this.getData();
  }



  presentPopover(myEvent) {
    let popover = this
      .popoverCtrl
      .create('SharedDateFilterPage');
    popover.present({ ev: myEvent });

    popover.onDidDismiss((data) => {
      console.log(data)
      if (data != null) {
        this.provider.parametri.datumod = data.start;
        this.provider.parametri.datumdo = data.end;
      }
    })
  }



  trazilicaAuto(action) {


    this.global.modal = this
      .modalCtrl
      .create('SharedTrazilicaAutocompletePage', { action: action, partneriid: this.provider.parametri.partneriid });
    this.global.modal.onDidDismiss(data => {
      if (data != null) {
        if (action == "partner") {
          this.provider.parametri.partneriid = data.id;
          this.provider.parametri.partnerinaziv = data.naziv;
        }
      }
      this.global.modal = null;
    });
    this.global.modal.present();

  }

  pretrazi() {
      this.viewCtrl.dismiss(true);
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }


  clearValue(slide, value, name) {
    slide.close();
    this.provider.parametri[name] = null;
    this.provider.parametri[value] = null;
  }




}

