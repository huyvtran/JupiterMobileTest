import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import * as IInvetura from '../../../../../interfaces/modules/IInvetura';
import { StorageProvider } from '../../../../../providers/core/storage-provider';

@IonicPage()
@Component({
    selector: 'page-utility-inventura-imovinapostavke-modal',
    templateUrl: 'imovinaPostavke-modal.html',
})
export class UtilityInventuraImovinaPostavkeModalPage extends BasePage {

    useOneClickScan: boolean = true;
    useScanWithMobile: boolean = false;
    useOpenForm: boolean = true;
    bcdFormOpenCnt: number = 0;
    keyScanSettings: string = 'scanSettings';

    constructor(private view: ViewController, private storage: StorageProvider) {
        super();

        this.setValuesFromStorage();
    }

    checkUseOneClickScan() {
        this.useOneClickScan = !this.useOneClickScan;
    }
    checkUseScanWithMobile() {
        this.useScanWithMobile = !this.useScanWithMobile;
    }
    checkUseOpenForm() {
        this.useOpenForm = !this.useOpenForm;
    }
    confirm() {
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyScanSettings, null, true)
                .then((val) => {
                    if (val) {
                        let key = new IInvetura.ScanSettings;
                        key.useoneclickscan = this.useOneClickScan;
                        key.usescanwithmobile = this.useScanWithMobile;
                        if (this.useOpenForm)
                            key.count = +this.bcdFormOpenCnt;
                        else
                            key.count = 0;
                            
                        resolve(this.storage.addToStorage(this.keyScanSettings, null, key, true));
                    }
                    resolve();
                }, (error) => {
                    reject(error);
                });
        }).then(() => {
            this.view.dismiss();
        });
    }
    dismiss() {
        this.view.dismiss();
    }
    setValuesFromStorage() {
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyScanSettings, null, true)
                .then((val) => {
                    if (val) {
                        this.useOneClickScan = val.useoneclickscan;
                        this.useScanWithMobile = val.usescanwithmobile;
                        this.bcdFormOpenCnt = val.count;
                        this.useOpenForm = +this.bcdFormOpenCnt > 0 ? true : false;
                    }
                    else
                        resolve();
                }, (error) => {
                    reject(error);
                });
        });
    }

}
