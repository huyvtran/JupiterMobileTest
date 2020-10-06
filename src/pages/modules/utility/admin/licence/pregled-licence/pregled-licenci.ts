import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ToastController, ModalController, Modal, AlertController, ItemSliding, LoadingController, Toast } from 'ionic-angular';

import { BasePage } from '../../../../../../providers/base/base-page';
import * as ICore from '../../../../../../interfaces/iCore';

@IonicPage()
@Component({ selector: 'page-admin-pregled-licenci', templateUrl: 'pregled-licenci.html' })
export class AdminPregledLicenciPage extends BasePage {
    tvrtka: any = {};
    licence: Array<any> = [];
    term: string = '';
    selected: boolean = true;
    toast: Toast = null;
    constructor(private toastCtrl: ToastController, private navCtrl: NavController, private navParams: NavParams, private loading: LoadingController, private alertController: AlertController, private modal: ModalController) {
        super();

        this.tvrtka = this.navParams.get('tvrtka');

        this.getData()
        this.setToastInfo();
    }

    filter(ev: any) {

        if (ev.value)
            this.licence = this.tvrtka.licence.filter(opt => opt.deviceuuid)
        else
            this.licence = this.tvrtka.licence.filter(opt => opt.deviceuuid === null);
    }

    getData() {
        if (this.tvrtka)
            this.licence = this.tvrtka.licence.filter(opt => opt.deviceuuid);
    }

    searchFn(ev: any) {
        this.term = ev.target.value;
    }

    updateLicence(licenceId: number) {
        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobAdminAzur",
                    "params": {
                        "action": "resetLicence",
                        "id": licenceId
                    }
                }
            ]
        }
        return this
            .global
            .getData(dataDef);

    }

    ionViewWillLeave() {
        console.log("leave")
        this.toast.dismiss();
    }

    async presentAlertPrompt(slidingItem: ItemSliding, licenca) {
        const alert = await this.alertController.create({
            title: 'Želite resetirati licencu <i><small>' + licenca.login + '</small></i> ?',
            //subTitle: '<b>Želite resetirati licencu</b> <i><small>' + licenca.login + '</small></i><b> ?</b>',
            buttons: [
                {
                    text: 'Odustani',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        slidingItem.close();
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Resetiraj',
                    handler: (data) => {

                        let content = 'Resetiranje...';
                        let loading = this.loading.create({
                            content: content,

                        });

                        loading.present().then(() => {
                            setTimeout(() => {
                                //update na serveru
                                this.updateLicence(licenca.pincoreid)
                                    .then((res) => {

                                        loading.setContent("Uspješno resetirana licenca.");
                                        setTimeout(() => {
                                            //update lokalno
                                            this.updateLicecesArray(licenca.pincoreid)
                                            slidingItem.close();
                                            loading.dismiss()
                                            this.getData();
                                        }, 500);
                                    })
                                    .catch((err) => {
                                        slidingItem.close();
                                        loading.dismiss();
                                        this.global.logError(err, false);
                                    })
                            }, 500)
                        })
                    }
                }
            ]
        });

        await alert.present();
    }

    buttonState(item) {
        if (!item.active)
            return true;
        return false;
    }

    updateLicecesArray(pincoreid) {

        let index = this.licence.findIndex(x => x.pincoreid = pincoreid)

        if (!(index < 0)) {
            this.licence[index].deviceuuid = null;
            this.licence[index].active = 0;
        }

    }

    resetLicenca(licenca, slidingItem) {
        return this.updateLicence(licenca.pincoreid)
    }


    pressed(slidingItem: ItemSliding, licenca) {
        this.presentAlertPrompt(slidingItem, licenca)
    }

    setToastInfo() {

        this.toast = this
            .toastCtrl
            .create({ message: "Za resetiranje licence duže držite za odabir ili swipe udesno.", position: 'bottom', showCloseButton: true, closeButtonText: 'Ok' });
        this.toast.present();
    }

    searchOptions() {

        this.global.modal = this
            .modal
            .create('AdminFindLicencePage', { tvrtka: this.tvrtka.serverid });
        this.global.modal.onDidDismiss(data => {
            this.variable.loaderActive = false;
            if (data != null) {
                this.tvrtka.licence = data;
                this.filter(this.selected);
            }
            this.global.modal = null;
        });
        this.toast.dismiss();
        this.global.modal.present();

    }
}
