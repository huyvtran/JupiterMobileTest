import {Component} from '@angular/core';
import {NavController, ModalController, IonicPage, App, ToastController} from 'ionic-angular';

// import { PartnerTabsPage } from '../tabs/tabs'; import { PartnerSearchDetPage
// } from '../search-det/search-det';

import {GlobalProvider} from '../../../providers/global-provider';
import {PartnerinfoProvider} from '../../../providers/partnerinfo-provider';
import {FavoritesProvider} from '../../../providers/favorites-provider';

@IonicPage()
@Component({selector: 'page-partner-search', templateUrl: 'search.html'})

export class PartnerSearchPage {
    //public isFavoriteExists: boolean = false;

    constructor(public navCtrl : NavController, private modalCtrl : ModalController, private app : App, private partner : PartnerinfoProvider, private favoritesProvider: FavoritesProvider, private globalProvider: GlobalProvider, private toastCtrl: ToastController) {
        this.init();
        partner.clearData();
        partner.getDataFromStorage();
    }

    private init() {
        Promise
        .resolve()
        .then(() => {
            return this.favoritesProvider.init("PartnerSearchPage", "Patner info", "Info točka");
        });
    }

    partnerInfo() {
        let modal = this
            .modalCtrl
            .create('PartnerSearchDetPage');
        modal.present();

        modal.onDidDismiss(data => { //This is a listener which wil get the data passed from modal when the modal's view controller is dismissed
            console.log("Data =>", data);
            if (data != null) {
                //this.partner.InitStorage(data.partneriId);
                this.detailItem(data);
            }
        })
    }


    // partnerInfo() {   this.navCtrl.push(PartnerTabsPage); }

    detailItem(item) {
        this
            .partner
            .InitStorage(item.partneriId);
        this
            .navCtrl
            .push('PartnerTabsPage');
    }

    goBack() {
        this.globalProvider.pullPage();
        // this
        //     .app
        //     .getRootNav()
        //     .setRoot('CoreCcTabsPage', {}, {
        //         animate: true,
        //         direction: 'backward'
        //     });
    }


    // getThisPageName(): string {
    //     return this.navCtrl.getActive().name;
    // }


}
