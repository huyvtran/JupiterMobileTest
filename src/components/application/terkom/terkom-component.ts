
import { Component, Input } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/core/global-provider';
import { FavoritesProvider } from '../../../providers/core/favorites-provider';

import { TerkomSifarniciProvider } from '../../../providers/modules/terkom/terkom-sifarnici-provider';
import { ConstProvider } from '../../../providers/core/const-provider';
import { TerkomUserProvider } from '../../../providers/modules/terkom/terkom-user-provider';
import { TerkomNarudzbaProvider } from '../../../providers/modules/terkom/terkom-narudzba-provider';
import { TerkomObavijestiProvider } from '../../../providers/modules/terkom/terkom-obavijesti-provider';

@Component({
    selector: 'terkom-component',
    templateUrl: 'terkom-component.html'
})
export class TerkomComponent {

    sinkroniziran: number = 0;
    danas = new Date();
    syncDate: Date;
    neposlaneNarudzbeCnt: number = 0;
    ukupnoNarudzbiCnt: number = 0;
    ukupnaVrijednostNarudzbi: number = 0;
    vrijednostNespolanihNarudzbi: number = 0;
    constructor(private sifarniciServis: TerkomSifarniciProvider, private globalProvider: GlobalProvider, private favoritesProvider: FavoritesProvider,
        private config: ConstProvider, private user: TerkomUserProvider,
        private narudzbeService: TerkomNarudzbaProvider,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private obavijestiService : TerkomObavijestiProvider
    ) {

        sifarniciServis.initSifarnika()
            .then(() => this.init())

            .then((res) => this.checkDates())
            .then((res) => this.obavijestiService.getObavijesti())

    }

    init() {

        return this.user.getUserInfo()
            .then((res) => {

                return this.syncDate = res ? res.syncDate : null;


            })
            .then(() => { return this.narudzbeService.getKomunikacijaNeposlaneNarudzbe() })
            .then((res) => {
                let data: any = res;

                if (data) {
                    //prikazi podataka o neposlanim narudžbama
                    //console.log(data.length)
                    this.neposlaneNarudzbeCnt = data;
                }
                else
                    this.neposlaneNarudzbeCnt = 0;
            })
            .then(() => {
                return this.narudzbeService.getNarudzbeCount().then((res) => {
                    let data: any = res;

                    if (data && data.length > 0) {

                        this.ukupnoNarudzbiCnt = data.length;
                    }
                    else
                        this.ukupnoNarudzbiCnt = 0;
                })
            })
            .then(() => {
                this.narudzbeService.getVrijednostNarudzbe()
                    .then((res) => {
                        let data: any = res;
                        // console.log(data)
                        if (data) {
                            this.vrijednostNespolanihNarudzbi = data ? data.vrijednostNeposlanih : 0;
                            this.ukupnaVrijednostNarudzbi = data ? data.ukupnaVrijednost : 0;
                        }

                    })
            })
            .catch(Error => console.log(Error.message))

    }


    checkDates() {
        //  console.log("did load");

        //  console.log(this.syncDate)
        if (this.syncDate != null) {
            //console.log(this.dateDiffInDays(this.danas, new Date(this.syncDate)))
            if (this.dateDiffInDays(this.danas, new Date(this.syncDate)) < 0) {
                this.sinkroniziran = 0;
                this.presentConfirm();
            }
            else {
                this.sinkroniziran = 1;
            }
        }
        else {
            this.sinkroniziran = 0;
            this.presentConfirm();
        }

    }


    dateDiffInDays(a, b) {
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        // Discard the time and time-zone information.
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }


    presentConfirm() {
        let alert = this.alertCtrl.create({
            title: 'Niste sinkronizirali podatke',
            message: 'Želite li ih sinkronizirati sada?',
            buttons: [
                {
                    text: 'Odustani',
                    role: 'cancel',
                    handler: () => {

                    }
                },
                {
                    text: 'U redu',
                    handler: () => {
                        this.globalProvider.pushPage("TerkomKomunikacijaPage");
                    }
                }
            ]
        });
        alert.present();
    }

}
