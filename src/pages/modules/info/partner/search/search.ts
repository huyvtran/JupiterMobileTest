import {Component} from '@angular/core';
import {NavController, IonicPage, Events} from 'ionic-angular';

import {PartnerinfoProvider} from '../../../../../providers/partnerinfo-provider';

import {BasePage} from '../../../../../providers/base/base-page';
//import * as ICore from '../../../interfaces/ICore';

@IonicPage()
@Component({selector: 'page-partner-search', templateUrl: 'search.html'})

export class PartnerSearchPage extends BasePage {
    //public isFavoriteExists: boolean = false;

    constructor(public navCtrl : NavController, public partner : PartnerinfoProvider, private events: Events) {
        super();
        partner.clearData();
        partner.getDataFromStorage();
            events.subscribe('partner:selected', (data) => {
                this.detailItem(data);
            });
    }




    ngOnDestroy() {
        this.events.unsubscribe('partner:selected');
    }


    partnerInfo() {
        try {
            this.navCtrl.push('PartnerSearchDetPage', {});     
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
            .partner
            .InitStorage(item.partneriid);
        this.global.pushPage('PartnerTabsPage');
    }


    // getThisPageName(): string {
    //     return this.navCtrl.getActive().name;
    // }


}
