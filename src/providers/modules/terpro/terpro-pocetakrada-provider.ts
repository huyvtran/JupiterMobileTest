
import {Injectable} from '@angular/core';

import {GlobalProvider} from '../../core/global-provider';

import * as ICore from '../../../interfaces/ICore';
import * as Moment from 'moment';

import {ConstProvider} from '../../core/const-provider';

@Injectable()
export class TerproPocetakRadaProvider {
    //datum  = new Date().setHours(9,0,0,0);
    datumPocetka : string; //= new Date(this.datum).toISOString();
    datumZavrsetka: string; // = new Date(new Date().setHours(20,0,0,0)).toISOString();

   
    pocetniKm : number = 0;
    zavrsniKm : number = 0;
    napomena : string = "";
   
    constructor( private global: GlobalProvider, private constants : ConstProvider) {
        this.datumPocetka = Moment(global.getTime("d").start).local().hour(9).minutes(0).seconds(0).milliseconds(0).format();
        this.datumZavrsetka = Moment(global.getTime("d").start).local().hour(19).minutes(0).seconds(0).milliseconds(0).format();
    }


    sendRadnoVrijeme() {

        let data : ICore.IData = {
            "queries": [
        {
            "query": "spMobTerpro_PrijenosSati",
            "params": {
                "operaterid" : "@@operaterid",
                "starttime" : this.datumPocetka,
                "endtime" : this.datumZavrsetka,
                "startkm" : this.pocetniKm,
                "endkm" : this.zavrsniKm,
                "napomena" : this.napomena
            }
        }
      ]
        }
        return this
            .global
            .getData(data);
     
    }

}
