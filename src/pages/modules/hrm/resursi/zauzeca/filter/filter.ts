import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {HrmResursiZauzecaProvider} from '../../../../../../providers/hrm-resursi-zauzeca';

import {BasePage} from '../../../../../../providers/base/base-page';

import * as Moment from 'moment';

@IonicPage()
@Component({selector: 'page-hrm-resursi-zauzeca-filter', templateUrl: 'filter.html'})
export class HrmResursiZauzecaFilterPage extends BasePage {

  minDate = Moment(new Date())
    .format('YYYY-MM-DD')
    .toString();

  constructor(public navCtrl : NavController, public provider : HrmResursiZauzecaProvider) {
    super();
  }

  presentMainPage() {
    let params = {
      "VrijemeOd": this.provider.vriOd,
      "VrijemeDo": this.provider.vriDo
    }

    this
      .navCtrl
      .push('HrmResursiZauzecaPregledPage', params);
  }

  validateVriOd() {
    if (this.provider.vriOd >= this.provider.vriDo) 
      this.provider.vriDo = (Moment(this.provider.vriOd).add(1, 'hour')).format();
    }
  
  validateVriDo() {
    if (this.provider.vriOd >= this.provider.vriDo) 
      this.provider.vriOd = (Moment(this.provider.vriDo).add(-1, 'hour')).format();
    }
  }
