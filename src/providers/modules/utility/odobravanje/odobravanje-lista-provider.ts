import { ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {GlobalProvider} from '../../../core/global-provider';
import * as ICore from '../../../../interfaces/ICore';


//import * as Moment from 'moment';

@Injectable()
export class OdobravanjeListaProvider {

    sveVrsteDokumenata: string= "";
    vrstadokid: number;
  //  oznaceniDokumenti: Array<any>; 

    properties : ICore.IProperties = {
        errorMessageCloseButton: false
    }

  constructor(public http: Http, private global: GlobalProvider, private modalCtrl: ModalController) {
  }

  getVrstaDokumenta() {

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMob_Odobravanje_VrstaDokFilter"
        }
      ]
    };

  //  this.sveVrsteDokumenata = this.getVrstaDokumenta(this.vrstadokid);  // aj

    return this.global.getData(dataDef, this.properties);
    }

}