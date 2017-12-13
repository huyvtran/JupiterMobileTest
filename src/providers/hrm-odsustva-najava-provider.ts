import {Injectable} from '@angular/core';
import {GlobalProvider} from './core/global-provider';

import * as Moment from 'moment'

@Injectable()
export class HrmOdsustvaNajavaProvider {
    parametriEmpty : IParametri;
    periodHelper : string =  "sutra";
    parametri : IParametri = {
        hrodsustvaid: null,
        hrodsustvanaziv: null,
        vrijemeod: null,
        vrijemedo: null,
        ukljucisate: true,
        ukljucizamjenika: true,
        zamjenik: '(nedefinirano)',
        napomena: null,
        sputmjesto: null,
        sputakontacija: null,
        sputfirma: null,
        sputzadatak: null
    };

    constructor(global: GlobalProvider) {

        var vrijemeOd = Moment(global.getTime("+d").start).local().hour(8).minutes(0).seconds(0).milliseconds(0).format();
        var vrijemeDo = Moment(global.getTime("+d").start).local().hour(16).minutes(0).seconds(0).milliseconds(0).format();

        this.parametri.vrijemeod = vrijemeOd;
        this.parametri.vrijemedo = vrijemeDo;
        
        this.parametriEmpty = Object.assign({},this.parametri);
    }

    resetValues() {
        this.parametri = Object.assign({},this.parametriEmpty);
    }

    

}


export interface IParametri {
    hrodsustvaid?: number,
    hrodsustvanaziv: string,
    ukljucisate: boolean,
    vrijemeod: string,
    vrijemedo: string,
    ukljucizamjenika: boolean,
    zamjenikid?: number,
    zamjenik: string,
    napomena: string,
    sputmjesto: string,
    sputfirma: string,
    sputzadatak: string,
    sputakontacija?: number,
    sputprijevoz?: string
}