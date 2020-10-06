import { Injectable } from '@angular/core';

import * as ICore from '../../../../interfaces/iCore'
import { GlobalProvider } from '../../../core/global-provider';
import { providerDef } from '@angular/core/src/view';
import { SkladisteInventuraProvider } from './skladiste-inventura-provider';

@Injectable()
export class SkladisteInventuraStavkaProvider{

    properties : ICore.IProperties = {
        errorMessageCloseButton: false
    }
    public SearchString: string = '';
    public odabraniBarkod: any = [];
    public kolicina: number = 0;
    public kolicinaPaket: number = 0;
    public faktor: number;
    public robaid: number;
    public kkvalglaid : number;
    public stavkaid: number;
    public kontingent: string;

    constructor (private global: GlobalProvider, private inventuraProvider: SkladisteInventuraProvider){

    }

    //dohvacanje stavke inventure
    getStavkaInventure() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_InventuraDet_Grid",
                "params": {
                    "operateriid": '@@operateriid',
                    "@sktinventuraglaid": this.inventuraProvider.inventuraid
                },
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }

    pretraziBarkod() {
  
        this.SearchString = this.SearchString.replace("Enter", "");
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_Trazi_Barkod",
                "params": {
                    "operateriid": '@@operateriid',
                    "@sktinventuraglaid": this.inventuraProvider.inventuraid,
                    "@uvjet": this.SearchString
                },
                }
            ]
            };

            return this.global.getData(dataDef, this.properties);
    }

}