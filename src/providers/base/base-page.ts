import {Injectable} from '@angular/core';

import {AppInjector} from "../../app/app.module";
import {GlobalProvider} from '../core/global-provider';
import {VariableProvider} from '../core/variable-provider';

@Injectable()
export class BasePage {
    global: GlobalProvider;
    variable: VariableProvider;
    //private viewCtrl: ViewController
    constructor() {
        this.global = AppInjector.get(GlobalProvider);
        this.variable = AppInjector.get(VariableProvider);
        //this.viewCtrl = AppInjector.get(ViewController);
        
    }
    ionViewWillLeave() {
        this.variable.loaderActive=false;
    }
}