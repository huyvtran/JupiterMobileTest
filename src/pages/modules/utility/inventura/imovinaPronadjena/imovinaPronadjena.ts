import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { InventuraProvider } from '../../../../../providers/modules/inventura-provider';

@IonicPage()
@Component({ selector: 'page-utility-inventura-imovinaPronadjena', templateUrl: 'imovinaPronadjena.html' })
export class UtilityInventuraImovinaPronadjenaPage extends BasePage {

    osInventuraGlaId: number;
    inventuraNaziv: string = '';
    term: string = '';

    constructor(private modalCtrl: ModalController, public invProvider: InventuraProvider) {
        super();

        this.osInventuraGlaId = this.invProvider.osinventuraglaid;
        this.inventuraNaziv = this.invProvider.osinventuranaziv;

        this.getData();
    }

    ionViewWillEnter() {
        // this.invProvider.selectedTabIndex = 1;
        this.getData();
    }
    ionViewWillLeave() {
        // this.invProvider.selectedTabIndex = 0;
        this.invProvider.SearchString = '';
    }
    getData() {
        console.log('refresh pronađene imovine')
        this.invProvider.getInvStavkeBoth(this.osInventuraGlaId)
    }

    searchFn(ev: any) {
        this.term = ev.target.value;
    }

    sideBarButtonClick(kolicinaHlp: string, item, popisanaKolicina?: number) {

        if (kolicinaHlp != 'scanEnterNumber') {
            if (kolicinaHlp == 'removeOne' && item.osinventuradetid == null && item.popisanakolicina == 1)
                kolicinaHlp = 'removeAll';

            this.invProvider.updateStavka(kolicinaHlp, item)
                .then((res) => {
                    this.getData();
                });
        }
        else {
            this.invProvider.updateStavka(kolicinaHlp, item, popisanaKolicina)
                .then((res) => {
                    this.getData();
                });
        }
    }
    openModal(item) {
        console.log(item)
        this.invProvider.disableKeyboardListener = true;
        console.log('keyboard listener active = false');
        this.global.modal = this.modalCtrl.create('KolicinaModalPage', { data: item });
        this.global.modal.onDidDismiss(() => {
            this.invProvider.disableKeyboardListener = false;
            console.log('keyboard listener active = true');
            this.getData();
            this.global.modal = null;
        });

        this.global.modal.present();
    }

    getPopisanaColor(item) {
        if (item.smjestajnakolicina < item.popisanakolicina)
            return "green";
        else if (item.smjestajnakolicina > item.popisanakolicina)
            return "red";

    }
    resetInventura() {
        if (this.invProvider.listImovinaP.length > 0) {
            this.global.modal = this.modalCtrl.create('UtilityInventuraDialogModalPage', {
                title: 'POTVRDA',
                msg: 'Vrati svu pronađenu imovinu?',
                confirmCaption: 'DA',
                dismissCaption: 'NE'
            });
            this.global.modal.onDidDismiss(data => {
                if (data == true) {
                    this.invProvider.resetInventura(this.osInventuraGlaId).then((res) => {
                        this.getData();
                    });
                }
                this.global.modal = null;
            });

            this.global.modal.present();
        }

    }
    sendToDb() {
        if (this.variable.hasInternet == 0) {
            this.invProvider.localToast('Inventura se ne može zaključiti bez pristupa internetu')
        }
        else {
            this.global.modal = this.modalCtrl.create('UtilityInventuraDialogModalPage', {
                title: 'POTVRDA',
                msg: 'Želite li sigurno zaključiti inventuru?',
                confirmCaption: 'DA',
                dismissCaption: 'NE'
            });
            this.global.modal.onDidDismiss(data => {
                if (data == true) {
                    this.invProvider.sendInvToDb(this.osInventuraGlaId).then((res) => {
                        if (res == "success") {
                            // this.invProvider.selectedTabIndex = 0;
                            this.getData();
                            this.invProvider.localToast('Inventura uspješno zaključena!');
                            this.global.pullPage('UtilityInventuraTabsDetPage');
                        }
                    });
                }
                this.global.modal = null;
                //this.global.pullPage('UtilityInventuraTabsDetPage');
            });

            this.global.modal.present();
        }
    }

}