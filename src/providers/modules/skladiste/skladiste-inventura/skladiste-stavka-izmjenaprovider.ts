import { Injectable } from '@angular/core';

import * as ICore from '../../../../interfaces/iCore'
import { GlobalProvider } from '../../../core/global-provider';
import { providerDef } from '@angular/core/src/view';
import { SkladisteInventuraProvider } from './skladiste-inventura-provider';
import { SkladisteInventuraStavkaProvider } from './skladiste-inventura-stavka-provider';

@Injectable()
export class SkladisteStavkaIzmjenaProvider { 
    


    public novaKolicina: number;
    public novaKolicinapak: number;
    public noviKkvaglaid: number;
    public novaPolica: any;
    properties : ICore.IProperties = {
        errorMessageCloseButton: false
    }

    constructor (
        private global: GlobalProvider,
         private inventuraProvider: SkladisteInventuraProvider,
         private inventuraStavkaProvider: SkladisteInventuraStavkaProvider){

    }

    
    getDetQuery() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_InventuraDet_Query",
                "params": {
                    "operateriid": '@@operateriid',
                    "@sktinventuradetid": this.inventuraStavkaProvider.stavkaid,
                    
                },
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }

    izmijeniStavku() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_InventuraDet_Query",
                "params": {
                    "operateriid": '@@operateriid',
                    "@sktinventuraglaid": this.inventuraProvider.inventuraid,
                    "@sktinventuradetid": this.inventuraStavkaProvider.stavkaid,
                    "@kkvalglaid": this.noviKkvaglaid,
                    "@robaid": this.inventuraStavkaProvider.robaid,
                    "@kolicina": this.novaKolicina,
                    "@kolicinapak": this.novaKolicinapak,
                    "@polica": this.novaPolica,
                    
                    
                    
                },
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }
        
   

   


}