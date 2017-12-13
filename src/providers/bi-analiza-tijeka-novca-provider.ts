import {Injectable} from '@angular/core';
import {GlobalProvider} from './core/global-provider';

@Injectable()
export class BiAnalizaTijekaNovcaProvider {
    showTransition: boolean = false;

    parametriIzv : IParametri = {
        include: true,
        datumod: null,
        datumdo: null,
        klmasterrobaid: null,
        klmasterrobanaziv: '',
        orgshemaid: null,
        orgshemanaziv: '',
        odgovornaosobaid: null,
        odgovornaosobanaziv: '',
        brojdana: null
    };

    parametriRef: IParametri;

    constructor(global: GlobalProvider) {
        var dat : Date = new Date();
        //this.parametriIzv.datumod = dat.toISOString();
        this.parametriIzv.datumod = global.getTime("m").start;
        this.parametriIzv.datumdo = dat.toISOString();
        this.parametriRef = Object.assign({},this.parametriIzv);

        var lastMonth = global.getTime("-m");

        this.parametriRef.include = false;
        this.parametriRef.datumod = lastMonth.start;
        this.parametriRef.datumdo = lastMonth.end;
    }

    

}


export interface IParametri {
    include: boolean,
    datumod: string,
    datumdo: string,
    klmasterrobaid?: number,
    klmasterrobanaziv: string,
    orgshemaid?: number,
    orgshemanaziv: string,
    odgovornaosobaid?: number,
    odgovornaosobanaziv: string,
    brojdana?: number
}