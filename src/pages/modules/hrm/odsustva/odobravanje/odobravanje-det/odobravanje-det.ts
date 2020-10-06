import {Component} from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams
} from 'ionic-angular';

import {BasePage} from '../../../../../../providers/base/base-page';
import * as ICore from '../../../../../../interfaces/iCore';
import * as Moment from 'moment';

@IonicPage()
@Component({selector: 'page-hrm-odsustva-odobravanje-det', templateUrl: 'odobravanje-det.html'})
export class HrmOdsustvaOdobravanjeDetPage extends BasePage {
    item : any;
   

    constructor(public navCtrl : NavController, private navParams: NavParams) {
        super();
        this.item = this.navParams.get('resurs');
        //console.log(this.item)
    }

 

}
