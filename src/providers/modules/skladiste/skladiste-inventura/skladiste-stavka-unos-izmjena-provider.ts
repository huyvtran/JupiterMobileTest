import { Injectable } from '@angular/core';

import * as ICore from '../../../../interfaces/iCore'
import { GlobalProvider } from '../../../core/global-provider';
import { providerDef } from '@angular/core/src/view';
import { SkladisteInventuraProvider } from './skladiste-inventura-provider';
import { SkladisteInventuraStavkaProvider } from './skladiste-inventura-stavka-provider';

@Injectable()
export class SkladisteStavkaUnosIzmjenaProvider{
    

    public indikator: number;
    public naslov: string;
    public indZamijeniPribroji: number;
    public kontingent: any;

    properties : ICore.IProperties = {
        errorMessageCloseButton: false
    }

    constructor (
        private global: GlobalProvider,
         private inventuraProvider: SkladisteInventuraProvider,
         private inventuraStavkaProvider: SkladisteInventuraStavkaProvider){

    }

    
    getDetProvjera() {
        console.log('kkvagla id iz providera je:', this.inventuraStavkaProvider.kkvalglaid);
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_InventuraDet_Provjera",
                "params": {
                    "operateriid": '@@operateriid',
                    "@sktinventuraglaid": this.inventuraProvider.inventuraid,
                    "@kkvalglaid": this.inventuraStavkaProvider.kkvalglaid,
                    "@robaid": this.inventuraStavkaProvider.robaid
                },
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }
        
    inventuraDetUnos(kolicina: number, kolicinapak: number) {
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_InventuraDet_Unos",
                "params": {
                    "operateriid": '@@operateriid',
                    "@sktinventuraglaid": this.inventuraProvider.inventuraid,
                    "@kkvalglaid": this.inventuraStavkaProvider.kkvalglaid,
                    "@robaid": this.inventuraStavkaProvider.robaid,
                    "@kolicina": kolicina,
                    "@kolicinapak": kolicinapak,
                    "@polica": this.inventuraProvider.indpolica,
                    "@indzamjenipribroji": this.indZamijeniPribroji
                },
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }

    getKontingent() {
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_Trazi_KKvalGla",
                "params": {
                    "operateriid": '@@operateriid',
                    "@sktinventuraglaid": this.inventuraProvider.inventuraid,
                    "@robaid": this.inventuraStavkaProvider.robaid,
                    "@skladisteid": this.inventuraProvider.skladisteid,
                    "@uvjet": this.inventuraStavkaProvider.SearchString,
                    
                },
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }

    getDetQuery() {
        console.log('usao u detquery');
        console.log('stavka id je:', this.inventuraStavkaProvider.stavkaid);
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

    inventuraDetIzmjena(kolicina: number, kolicinaPaket: number) {
        let dataDef: ICore.IData = {
            "queries": [
                {
                "query": "spMob_Sklad_InventuraDet_Izmjena",
                "params": {
                    "operateriid": '@@operateriid',
                    "@sktinventuraglaid": this.inventuraProvider.inventuraid,
                    "@sktinventuradetid": this.inventuraStavkaProvider.stavkaid,
                    "@kkvalglaid": this.inventuraStavkaProvider.kkvalglaid,
                    "@robaid": this.inventuraStavkaProvider.robaid,
                    "@kolicina": kolicina,
                    "@kolicinapak": kolicinaPaket,
                    "@polica": this.inventuraProvider.indpolica,

                },
                }
            ]
            };
            return this.global.getData(dataDef, this.properties);
    }


}