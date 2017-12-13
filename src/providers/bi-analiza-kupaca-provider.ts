import {Injectable} from '@angular/core';
import {GlobalProvider} from './core/global-provider';

@Injectable()
export class BiAnalizaKupacaProvider {

    parametriIzv : IParametri = {
        include: true,
        stora: 'spMobManAnaKupPon1',
        objekt: 'p',
        objekttekst: 'ponude',
        datumod: null,
        datumdo: null,
        klmasterrobaid: null,
        klmasterrobanaziv: '',
        orgshemaid: null,
        orgshemanaziv: '',
        partneriid: null,
        partnerinaziv: '',
        parstruid: null,
        parstrunaziv: '',
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
    stora: string,
    objekt: string,
    objekttekst: string,
    datumod: string,
    datumdo: string,
    klmasterrobaid?: number,
    klmasterrobanaziv: string,
    orgshemaid?: number,
    orgshemanaziv: string,
    partneriid?: number,
    partnerinaziv: string,
    parstruid?: number,
    parstrunaziv: string,
    brojdana?: number
}