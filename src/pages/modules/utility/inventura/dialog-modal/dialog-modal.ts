import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';

@IonicPage()
@Component({
    selector: 'page-utility-inventura-dialog-modal',
    templateUrl: 'dialog-modal.html',
})
export class UtilityInventuraDialogModalPage extends BasePage {

    title: string = "POTVRDA"; // ovdje može ići defaultni naslov
    msg: string = "";
    confirmCaption: string = "DA";
    dismissCaption: string = "NE";

    constructor(private view: ViewController, private navParams: NavParams) {
        super();

        this.title = this.navParams.get('title');
        this.msg = this.navParams.get('msg');
        this.confirmCaption = this.navParams.get('confirmCaption');
        this.dismissCaption = this.navParams.get('dismissCaption');

    }
    confirm() {
        this.view.dismiss(true);
    }

    dismiss() {
        this.view.dismiss(false);
    }

}
