import { Component } from '@angular/core';
import { IonicPage , NavController} from 'ionic-angular';

import {TerkomSifarniciProvider} from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import {BasePage} from '../../../../../providers/base/base-page';

@IonicPage()
@Component({
  selector: 'page-terkom-dashboard-homepage',
  templateUrl: 'home.html'
})
export class TerkomDashboardHomePage  extends BasePage {



  	constructor(private navCtrl: NavController, private sifarniciService: TerkomSifarniciProvider) {
        super()
        //init sifarnika
        this.sifarniciService.initSifarnika();
    }


    startModule(module){
        console.log("startam " + module)
        this.navCtrl.push(module);
    }


}
