import { BasePage } from './base-page';
import {Injectable} from '@angular/core';

import {AppInjector} from "../../app/app.module";
import {GlobalProvider} from '../core/global-provider';
import {VariableProvider} from '../core/variable-provider';

import * as ICore from '../../interfaces/ICore';

@Injectable()
export class BaseSearchPage extends BasePage  {
    global: GlobalProvider;
    variable: VariableProvider;

    action: string;
    data : any;
    keyword : string;
    historyHidden : boolean = false;

    //private viewCtrl: ViewController
    constructor() {
        super();
        this.global = AppInjector.get(GlobalProvider);
        this.variable = AppInjector.get(VariableProvider);
        //this.viewCtrl = AppInjector.get(ViewController);
        
    }

    search(event) {
        this.keyword = event.target.value;

        if (event.target.value != null && event.target.value.length > 2) {
            this
            .setDataDef(this.keyword)
            .then(x => {         
                this.historyHidden = true;
                this.data = x;
            }).catch(ex=> this.global.logError(ex, false));
        } else {
            this.historyHidden = false;
            this.data = null;
        }
    }

    setDataDef(keyword: string) {
        // let dataDef : ICore.IData = {
        //     "queries": [
        //         {
        //             "query": "spMobInfoPartner",
        //             "params": {
        //                 "Action": "search",
        //                 "Keyword": keyword,
        //             }
        //         }
        //     ]
        // }

        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobTrazilica",
                    "params": {
                        "action": this.action,
                        "keyword": keyword
                    }
                }
            ]
        }
        
        return this
            .global
            .getData(dataDef, true)
            .catch(ex=> this.global.logError(ex, false));
    
    }
}