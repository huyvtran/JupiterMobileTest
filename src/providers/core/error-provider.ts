import { Injectable } from '@angular/core';

import { HelpersProvider } from './helpers-provider';
import { VariableProvider } from './variable-provider';
import { variable } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class ErrorProvider {
    constructor(private helpers: HelpersProvider, private variable: VariableProvider) { }

    logError(err: any, show?: boolean, type?: string, showCloseButton?: boolean) {
        console.log(err);
        if (show == null)
            show = this.variable.defShowError;

        if (show == true && type === "alert") {
            let cssClass: string = "alert-error";
            let message: string = this.getErrorMessage(err);
            this.helpers.presentAlert(message, cssClass);
        }
        else if(show == true){
            let cssClass: string = "toast-error";
            let message: string = this.getErrorMessage(err);
            this.helpers.presentToast(message, cssClass, null, showCloseButton);
        }
    }

    getErrorMessage(err: any): string {
        let message: string;
        if (typeof err === "string")
            message = err;
        else if (err.message != null)
            message = err.message;
        else if (err._body != null && typeof err._body === "string")
            message = err._body;
        else if (!this.variable.hasInternet)
            message = "Nemate internet konekciju.";
        else
            message = "Nepoznata greška.";

        return message;
    }
}