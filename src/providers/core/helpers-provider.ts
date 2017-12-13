import {Injectable} from '@angular/core';
import {ToastController, Platform} from 'ionic-angular';
import {ConstProvider} from './const-provider';

@Injectable()
export class HelpersProvider {
    constructor(private toastCtrl : ToastController, private platform: Platform, private constants: ConstProvider) {
    }

    presentToast(message: string, cssClass?: string, duration?: number) {
        if (duration == null || duration == 0)
            duration = 5000;

        let toast = this
            .toastCtrl
            .create({message: message, duration: duration, position: 'bottom', cssClass: cssClass});

        toast.present();
    }

    isDevMode(): boolean {
        return !this.platform.is("cordova") && (this.constants.isDevMode == true && (this.platform.is("mobileweb") || this.platform.is("core")));
    }
}