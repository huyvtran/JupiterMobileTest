import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { StorageProvider } from '../../../../../providers/core/storage-provider';
import * as IInvetura from '../../../../../interfaces/modules/IInvetura';
import { InventuraProvider } from '../../../../../providers/modules/inventura-provider'

@IonicPage()
@Component({
    selector: 'page-utility-inventura-sinkronizacija',
    templateUrl: 'sinkronizacija.html'
})
export class UtilityInventuraSinkronizacijaPage extends BasePage {

    i: number = 0;
    invCount: string = '0/0';
    imoCount: string = '0';
    syncDateVar: Date;
    keySyncDate: string = 'syncDate';

    public syncData: IInvetura.SyncData;

    public inventura: Array<any>;
    public allImovina: Array<any>;
    public inventuraList: Array<IInvetura.Inventura> = [];

    constructor(private storage: StorageProvider, private modalCtrl: ModalController, private invProvider: InventuraProvider) {
        super();

        this.checkSync();
        this.getData();
    }

    ionViewWillEnter() {
        this.getData();
    }

    getData() {
        this.invProvider.getInventure()
            .then(() => {
                this.inventuraList = this.invProvider.inventuraList;
                console.log(this.invProvider.inventuraList)
            })
            .catch((err) => console.log())
    }

    glavaItemClick(item) {
        this.global.pushPage('UtilityInventuraTabsDetPage',
            { id: item.osinventuraglaid, naziv: item.naziv, osbarcodepubvar: item.osbarcodepubvar });
    }

    checkSync() {
        this.getDateFromStorage().then(() => {
            if (this.syncDateVar != null) {
                this.invProvider.setInvCountFromStorage().then((res) => {
                    this.invCount = res;
                });
                this.invProvider.setImoCountFromStorage().then((res) => {
                    this.imoCount = res;
                });
            }
        });
    }

    getDateFromStorage() {
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keySyncDate, null, true)
                .then((val) => {
                    if (val != null) {
                        this.syncDateVar = val;
                    }
                    else {
                        this.syncDateVar = null;
                    }
                    resolve();
                }, (error) => {
                    reject(error);
                });
        });
    }

    openModal() {

        if (this.variable.hasInternet == 0) {
            this.invProvider.localToast('Za sinkronizaciju je potreban pristup internetu')
        }
        else {

            this.global.modal = this.modalCtrl.create("UtilityInventuraSinkronizacijaModalPage");
            this.global.modal.onWillDismiss((data) => {
                let doDismiss = data;
                if (doDismiss == 'false') {
                    this.setDateKey().then((res) => {
                        this.checkSync();
                        this.getData();
                    });
                }
                this.global.modal = null;
            });

            this.global.modal.present()
        }
    }

    setDateKey(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.syncDateVar = new Date();
            resolve(this.storage.addToStorage(this.keySyncDate, null, this.syncDateVar, true));
        });
    }

}
