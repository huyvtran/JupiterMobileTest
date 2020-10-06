import { GlobalProvider } from './../../../../providers/core/global-provider';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'page-core-cc-profil',
    templateUrl: 'profil.html'
})
export class CoreCcProfilPage {
    private user: any;

    constructor(private global: GlobalProvider) {
        try {
            this.user = GlobalProvider.getJupiterSystemData.user;
        } catch (ex) {
            global.logError(ex, false);
        }

    }

    getBackgroundImage(): string {
        try {

            if (this.user != null && this.user.imagebyte != null)
                return "url('data:image/png;base64," + this.user.imagebyte;
            else
                return " url('data:image/png;base64,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')";
        } catch (ex) {
            this.global.logError(ex, false);
        }

        //return "url('../assets/images/user-unknown.png')";
    }

    // getUserName(): string {
    //     return GlobalProvider.jupiterSystemData.user.name;
    // }

    // getLevel(): string {
    //     return GlobalProvider.jupiterSystemData.user.name;
    // }

}
