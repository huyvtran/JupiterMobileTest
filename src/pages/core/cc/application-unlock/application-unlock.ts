import {Component} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {AppUnlockProvider} from '../../../../providers/core/app-unlock-provider';

import {GlobalProvider} from '../../../../providers/core/global-provider';

@IonicPage()
@Component({selector: 'page-core-cc-application-unlock', templateUrl: 'application-unlock.html'})
export class CoreCcApplicationUnlockPage {
    private groupSifra : FormGroup;
    private item: any;
    private pin: string = ""
    constructor(private navParams : NavParams, private formBuilder : FormBuilder, 
        private global: GlobalProvider, private appUnlockProvider: AppUnlockProvider, private viewCtrl: ViewController) {
        this.item = this
            .navParams
            .get('item');
        this.groupSifra = this
            .formBuilder
            .group({
                sifra: ['', Validators.required]
            });
    }

    formSubmit() {
        this.appUnlockProvider.unlockApp(this.pin, this.item.code)
            .then(() => {
                this.viewCtrl.dismiss({valid: true});
        }).catch(ex => {
            this.global.presentToastError(ex)}
        );
    }

}
