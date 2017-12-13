import { Component } from '@angular/core';
import { NavParams, IonicPage, ModalController } from 'ionic-angular';
import { BiAnalizaNabaveProvider } from '../../../../../providers/bi-analiza-nabave-provider';
import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { NumberFormatPipe } from '../../../../../pipes/number-format.pipe';

@IonicPage()
@Component({providers:[NumberFormatPipe],  selector: 'page-bi-analiza-nabave-usporedba', templateUrl: 'usporedba.html' })
export class BiAnalizaNabaveUsporedba extends BasePage {
    loading: boolean = true;
    data: any = [];
    dataDef:any = {};
    ponudeExists:boolean = false;
    ponudeExistsIzv:boolean = false;
    ponudeExistsRef:boolean = false;

    accordionColor: string = "#e6e6e6";

    constructor(public navParams: NavParams, public modalCtrl: ModalController, private provider: BiAnalizaNabaveProvider,
        private pipe: NumberFormatPipe) {
        super();
        this.getData();

        
        this.ponudeExists = true;
        this.ponudeExistsIzv = true;
        


    }

    getData() {
        this.loading = true;
        this
            .setDataDef()
            .then(x => {
                this.data = x;
                this.setDataValues();
                this.loading = false;
            });

    }

    setDataDef() {
        let dataDef : ICore.IData = {
        
            "queries": [
                {
                    "query":  "spMobManAnalizaNabave",
                    "params": {
                        "dat1": this.provider.parametriIzv.datumod,
                        "dat2": this.provider.parametriIzv.datumdo,
                        "org": this.provider.parametriIzv.orgshemaid,
                        "klm": this.provider.parametriIzv.klmasterrobaid,
                        "osobeid": this.provider.parametriIzv.odgovornaosobaid,
                        "parid": this.provider.parametriIzv.partnerid
                    },
                    "tablename":"izv"
                },
                {
                    "query": "spMobManAnalizaNabave",
                    "params": {
                        "dat1": this.provider.parametriRef.datumod,
                        "dat2": this.provider.parametriRef.datumdo,
                        "org": this.provider.parametriRef.orgshemaid,
                        "klm": this.provider.parametriRef.klmasterrobaid,
                        "osobeid": this.provider.parametriRef.odgovornaosobaid,
                        "parid": this.provider.parametriIzv.partnerid
                    },
                    "tablename":"ref"
                }
            ]
        }
        return this
            .global
            .getData(dataDef, false);

    }

    setDataValues() {
        
        this.dataDef = {dataZah: {}, dataZahRef: {}, 
            dataNar: {}, dataNarRef: {},
            dataPri: {}, dataPriRef: {},
            dataPro: {}, dataProRef: {},
        };

        if (this.data.izv.length > 0)
            this.setValues(this.dataDef.dataZah, this.data.izv[0]);
        if (this.data.ref != null && this.data.ref.length > 0 && this.provider.parametriRef.include == true)
            this.setValues(this.dataDef.dataZahRef, this.data.ref[0]);
        if (this.data.izv.length > 1)
            this.setValues(this.dataDef.dataNar, this.data.izv[1]);
        if (this.data.ref != null && this.data.ref.length > 1 && this.provider.parametriRef.include == true)
             this.setValues(this.dataDef.dataNarRef, this.data.ref[1]);
        if (this.data.izv.length > 2)
            this.setValues(this.dataDef.dataPri, this.data.izv[2]);
        if (this.data.ref != null && this.data.ref.length > 2 && this.provider.parametriRef.include == true)
            this.setValues(this.dataDef.dataPriRef, this.data.ref[2]);
        if (this.data.izv.length > 3)
            this.setValues(this.dataDef.dataPro, this.data.izv[3]);
        if (this.data.ref != null && this.data.ref.length > 3 && this.provider.parametriRef.include == true)
            this.setValues(this.dataDef.dataProRef, this.data.ref[3]);

        this.setIndexes();
    }

    setValues(arr: any, data: any) {
        arr.kolicina = data.kolicina;
        arr.vrijednost = this.numberFormat(data.vrijednost, 2);
        arr.dnevniprosjekkolicina = this.numberFormat(data.dnevniprosijekkolicina, 2);
        arr.dnevniprosjekvrijednost = this.numberFormat(data.dnevniprosijekvrijednost, 2);
        arr.dnevniprosjekkolicinaindex = 0;
        arr.dnevniprosjekvrijednostindex = 0;
        arr.brojdana = data.brojdana;
    }

    setIndexes() {
        try
        {
            this.setIndexesMath(this.dataDef.dataZah, this.dataDef.dataZahRef, this.data.izv[0], this.data.ref[0]);
            this.setIndexesMath(this.dataDef.dataNar, this.dataDef.dataNarRef, this.data.izv[1], this.data.ref[1]);
            this.setIndexesMath(this.dataDef.dataPri, this.dataDef.dataPriRef, this.data.izv[2], this.data.ref[2]);
            this.setIndexesMath(this.dataDef.dataPro, this.dataDef.dataProRef, this.data.izv[3], this.data.ref[3]);
        } catch (ex) {
            console.log(ex);   
        }
       
        
    }

    setIndexesMath(izv: any, ref: any, dataIzv: any, dataRef: any) {
        if (dataRef.dnevniprosijekkolicina > 0) 
            izv.dnevniprosjekkolicinaindex = this.numberFormat(dataIzv.dnevniprosijekkolicina * 100 / dataRef.dnevniprosijekkolicina, 0);
        if (dataRef.dnevniprosijekvrijednost > 0)
            izv.dnevniprosjekvrijednostindex =  this.numberFormat(dataIzv.dnevniprosijekvrijednost * 100 / dataRef.dnevniprosijekvrijednost, 0);

        if (dataIzv.dnevniprosijekkolicina > 0 && this.provider.parametriRef.include == true)
            ref.dnevniprosjekkolicinaindex = this.numberFormat(dataRef.dnevniprosijekkolicina * 100 / dataIzv.dnevniprosijekkolicina, 0);
        if (dataIzv.dnevniprosijekvrijednost > 0 && this.provider.parametriRef.include == true)
            ref.dnevniprosjekvrijednostindex =  this.numberFormat(dataRef.dnevniprosijekvrijednost * 100 / dataIzv.dnevniprosijekvrijednost, 0);        
    }

    numberFormat(value, decimals): string {
        return this.pipe.transform(value, decimals)
    }


}