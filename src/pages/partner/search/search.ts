import {Component} from '@angular/core';
import {NavController, ModalController, IonicPage, App, ToastController, Events} from 'ionic-angular';

// import { PartnerTabsPage } from '../tabs/tabs'; import { PartnerSearchDetPage
// } from '../search-det/search-det';

import {GlobalProvider} from '../../../providers/core/global-provider';
import {PartnerinfoProvider} from '../../../providers/partnerinfo-provider';
import {FavoritesProvider} from '../../../providers/core/favorites-provider';

@IonicPage()
@Component({selector: 'page-partner-search', templateUrl: 'search.html'})

export class PartnerSearchPage {
    //public isFavoriteExists: boolean = false;

    constructor(public navCtrl : NavController, private modalCtrl : ModalController, private app : App, private partner : PartnerinfoProvider, private favoritesProvider: FavoritesProvider, private globalProvider: GlobalProvider, private toastCtrl: ToastController, private events: Events) {
        this.init();
        partner.clearData();
        partner.getDataFromStorage();
            events.subscribe('partner:selected', (data) => {
                this.detailItem(data);
            });
    }

    private init() {
        Promise
        .resolve()
        .then(() => {
            return this.favoritesProvider.init("PartnerSearchPage", "Patner info", "Info točka");
        });
    }

    ngOnDestroy() {
        this.events.unsubscribe('partner:selected');
    }


    partnerInfo() {
        this.navCtrl.push('PartnerSearchDetPage', {});        
        // let modal = this
        //     .modalCtrl
        //     .create('PartnerSearchDetPage');
        // modal.present();

        // modal.onDidDismiss(data => { //This is a listener which wil get the data passed from modal when the modal's view controller is dismissed
        //     console.log("Data =>", data);
        //     if (data != null) {
        //         //this.partner.InitStorage(data.partneriId);
        //         this.detailItem(data);
        //     }
        // })
    }


    detailItem(item) {
        this
            .partner
            .InitStorage(item.partneriId);
        GlobalProvider.pushPage('PartnerTabsPage');
    }


    // getThisPageName(): string {
    //     return this.navCtrl.getActive().name;
    // }


}
