import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import { GenericFormProvider } from '../../../../../providers/modules/utility/generic/generic_form_provider';


@IonicPage()
@Component({
  selector: 'page-generic-info',
  templateUrl: 'info.html'
})
export class GenericInfoPage extends BasePage {

  data: any
  detail: any
  constructor(private navParams: NavParams, private genericProvider: GenericFormProvider) {
    super();

    //detalji dokumenta
    this.detail = this.navParams.get('data')

    //lista propertiesa
    this.data = Object.keys(this.detail);
    //iz liste ukloni properies koji su potrebni za repx
    this.data = this.data.filter((item) => {
      return (!item.toLowerCase().includes('tablename') && !item.toLowerCase().includes('repx') && !item.toLowerCase().includes('brojdokumenata') && !item.toLowerCase().includes('brojstavaka'));
    })

    this.genericProvider.refreshData = false;

  }


  containsId(key: string) {
    return key.toLocaleLowerCase().includes('id');
  }


}
