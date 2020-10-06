import {ModalNavPage} from './modal-nav/modal-nav';
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import {BasePage} from '../../../providers/base/base-page';
import * as ICore from '../../../interfaces/iCore';
import {VariableProvider} from '../../../providers/core/variable-provider';

@IonicPage()
@Component({selector: 'page-shared-trazilica-tree', templateUrl: 'trazilica-tree.html'})
export class SharedTrazilicaTreePage extends BasePage {
    data : any;
    item : any = [];


    breadcrumb: string = "./";

    constructor(private navCtrl : NavController, private modalNavPage : ModalNavPage, private navParams : NavParams, private toastCtrl: ToastController, variableProvider: VariableProvider) {
        super();
        this.initData();
        this.setToastInfo();
    }

    initData() {
        this.item = this
            .navParams
            .get('item') || {
            id: null
        };
        
        if (this.item.id != null)
            this.breadcrumb = this.item.naziv;

        this
            .getData()
            .then((res) => {
                this.data = res;
            }
        );
    }

    getData() {
        console.log("getData");
        console.log("1");
        let data : ICore.IData 
        if (this.modalNavPage.query != null) {
            data = this.modalNavPage.query;
        } else {
            data = {
                "queries": [
                    {
                        "query": "spMobTrazilica",
                        "params": {
                            "action": this.modalNavPage.action,
                            "id": this.item.id
                        }
                    }
                ]
            }
        }
        console.log("2");
        console.log(data);
        console.log("3");
        return this
            .global
            .getData(data);
    }

    next(item) {
        if (item.cnt == null || item.cnt == 0) {
            this.setItem(item);
        } else {
            this
                .navCtrl
                .push('SharedTrazilicaTreePage', {item});
        }
    }

    setItem(item) {
        this
            .modalNavPage
            .dismissModal(item);
    }

    setToastInfo() {
        if (this.modalNavPage.toast == null && this.variable.trazilicaToastShow == true) {
            this.modalNavPage.toast = this
                .toastCtrl
                .create({message: "Ako stavka sadrži podstavke, duže držite za odabir", position: 'bottom', showCloseButton: true, closeButtonText:'Ok', cssClass: 'toast-info', });
            this.modalNavPage.toast.present();
            this.modalNavPage.toast.onDidDismiss((data, role) => {
                if (role == "close") {
                  this.variable.trazilicaToastShow = false;
                }
            });
        }
    }


}
