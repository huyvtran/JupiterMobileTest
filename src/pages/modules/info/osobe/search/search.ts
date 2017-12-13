import {Component} from '@angular/core';
import {NavController, IonicPage, Events} from 'ionic-angular';
import {OsobainfoProvider} from '../../../../../providers/osobainfo-provider';

import {BasePage} from '../../../../../providers/base/base-page';
//import * as ICore from '../../../interfaces/ICore';

@IonicPage()
@Component({selector: 'page-osoba-search', templateUrl: 'search.html'})

export class OsobaSearchPage extends BasePage {
    //public isFavoriteExists: boolean = false;

    constructor(public navCtrl : NavController, public osoba : OsobainfoProvider, private events: Events) {
        super();
        osoba.clearData();
        osoba.getDataFromStorage();
        events.subscribe('osoba:selected', (data) => {
            this.detailItem(data);
        });
    }




    ngOnDestroy() {
        this.events.unsubscribe('osoba:selected');
    }


    osobaInfo() {
        try {
            this.navCtrl.push('OsobaSearchDetPage', {});     
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
            .osoba
            .InitStorage(item.osobeid);
        this.global.pushPage('OsobaTabsPage');
    }


    // getThisPageName(): string {
    //     return this.navCtrl.getActive().name;
    // }


}
