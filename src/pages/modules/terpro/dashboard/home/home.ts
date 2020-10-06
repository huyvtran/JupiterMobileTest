import { Component, ViewChild } from '@angular/core';
import { IonicPage , NavController} from 'ionic-angular';

import {TerproSifarniciProvider} from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';
import {BasePage} from '../../../../../providers/base/base-page';

@IonicPage()
@Component({
  selector: 'page-terpro-dashboard-homepage',
  templateUrl: 'home.html'
})
export class TerproDashboardHomePage  extends BasePage {

      @ViewChild('component') component;

  	constructor(private navCtrl: NavController, private sifarniciService: TerproSifarniciProvider) {
        super()
        //init sifarnika
        this.sifarniciService.initSifarnika();
    }

    ionViewDidEnter(){
        this.component.init();
    }


    startModule(module){
        console.log("startam " + module)
        this.navCtrl.push(module)
        .catch((err) => {
            this.global.presentToast("U izradi!")
            console.log(err)
        })
    }


}
