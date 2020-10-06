import { Injectable } from '@angular/core';
import { ToastController, Platform, AlertController, ToastOptions } from 'ionic-angular';
import {ConstProvider} from './const-provider';
import { VariableProvider } from './variable-provider';

@Injectable()
export class HelpersProvider {
    constructor(private toastCtrl: ToastController
        , private variableProvider: VariableProvider
        , private alertCtrl: AlertController
        , private platform: Platform, private constants: ConstProvider) { }

        

    errorShown: boolean = false;

    presentToast(message: string, cssClass?: string, duration?: number, showCloseButton: boolean = false) {
        if (duration == null || duration == 0)
            duration = 5000;

        if (this.errorShown == true)
            return;
        this.errorShown = true;

        let toastOptions: ToastOptions = {};

        toastOptions.message = message;
        toastOptions.duration = showCloseButton? null: duration;
        toastOptions.position = 'bottom';
        toastOptions.cssClass = cssClass;
        toastOptions.showCloseButton = showCloseButton;
        toastOptions.closeButtonText = "Ok";
        
        let toast = this
            .toastCtrl
            .create(toastOptions);


        toast.onDidDismiss(() => {
            this.errorShown = false;
        });

        toast.present();
    }



    presentAlert(message: string, cssClass?: string, duration?: number) {
        if (duration == null || duration == 0)
            duration = 5000;

        if (this.errorShown == true)
            return;

        this.errorShown = true;

        let alert = this.alertCtrl.create({
            title: "Dogodila se greška",
            subTitle: message,

            cssClass: cssClass,
            buttons: [{
                text: 'Ok',
                handler: () => {

                    
                }
            }]
        });

        alert.present();

        alert.onDidDismiss(() => {
            this.errorShown = false;
        });

    }



    isDevMode(): boolean {
        return !this.platform.is("cordova") && (this.constants.isDevMode == true && (this.platform.is("mobileweb") || this.platform.is("core")));
    }
}