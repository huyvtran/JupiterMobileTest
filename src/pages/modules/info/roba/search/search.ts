import {Component} from '@angular/core';
import {NavController, IonicPage, Events} from 'ionic-angular';

import {RobainfoProvider} from '../../../../../providers/robainfo-provider';

import {BasePage} from '../../../../../providers/base/base-page';
//import * as ICore from '../../../interfaces/ICore';

@IonicPage()
@Component({selector: 'page-roba-search', templateUrl: 'search.html'})

export class RobaSearchPage extends BasePage {
    //public isFavoriteExists: boolean = false;

    constructor(public navCtrl : NavController, public roba : RobainfoProvider, private events: Events) {
        super();
        roba.clearData();
        roba.getDataFromStorage();
        events.subscribe('roba:selected', (data) => {
            this.detailItem(data);
        });
    }




    ngOnDestroy() {
        this.events.unsubscribe('roba:selected');
    }


    robaInfo() {
        try {
            this.navCtrl.push('RobaSearchDetPage', {});     
        } catch (ex) {}
        
        // let modal = this
        //     .modalCtrl
        //     .create('PartnerSearchDetPage');
        // modal.present();

        // modal.onDidDismiss(data => { //This is a listener which wil get the data passed from modal when the modal's view controller is dismissed
        //     if (data != null) {
        //         //this.partner.InitStorage(data.partneriId);
        //         this.detailItem(data);
        //     }
        // })
    }


    detailItem(item) {
        this
            .roba
            .InitStorage(item.robaid);
        this.global.pushPage('RobaTabsPage');
    }


    // getThisPageName(): string {
    //     return this.navCtrl.getActive().name;
    // }


}
