import { Component } from '@angular/core';
import { NavParams, IonicPage, ModalController } from 'ionic-angular';
import { BiAnalizaKupacaProvider } from '../../../../../providers/bi-analiza-kupaca-provider';
import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { NumberFormatPipe } from '../../../../../pipes/number-format.pipe';

@IonicPage()
@Component({providers:[NumberFormatPipe],  selector: 'page-bi-analiza-kupaca-usporedba', templateUrl: 'usporedba.html' })
export class BiAnalizaKupacaUsporedba extends BasePage {
    loading: boolean = true;
    data: any = [];
    dataDef:any = {};
    ponudeExists:boolean = false;
    ponudeExistsIzv:boolean = false;
    ponudeExistsRef:boolean = false;

    accordionColor: string = "#e6e6e6";

    constructor(public navParams: NavParams, public modalCtrl: ModalController, private provider: BiAnalizaKupacaProvider,
        private pipe: NumberFormatPipe) {
        super();
        console.log(provider);
        this.getData();
        
        if (this.provider.parametriIzv.objekt == "p")
        {
            this.ponudeExists = true;
            this.ponudeExistsIzv = true;
        }
        if (this.provider.parametriRef.objekt == "p" && this.provider.parametriRef.include == true) {
            this.ponudeExists = true;
            this.ponudeExistsRef = true;
        }


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
        let queryRef;
        if (this.provider.parametriRef.include == true)
        {
            queryRef = {"query": this.provider.parametriRef.stora,
            "params": {
                "dat1": this.provider.parametriRef.datumod,
                "dat2": this.provider.parametriRef.datumdo,
                "org": this.provider.parametriRef.orgshemaid,
                "klm": this.provider.parametriRef.klmasterrobaid,
                "parid": this.provider.parametriRef.partneriid,
                "parstruid": this.provider.parametriRef.parstruid,
            },
            "tablename":"ref"}
        }


        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query":  this.provider.parametriIzv.stora,
                    "params": {
                        "dat1": this.provider.parametriIzv.datumod,
                        "dat2": this.provider.parametriIzv.datumdo,
                        "org": this.provider.parametriIzv.orgshemaid,
                        "klm": this.provider.parametriIzv.klmasterrobaid,
                        "parid": this.provider.parametriIzv.partneriid,
                        "parstruid": this.provider.parametriIzv.parstruid,
                    },
                    "tablename":"izv"
                }
            ]
        }

        if (queryRef != null) 
        {
            dataDef.queries.push(queryRef);
        }

        return this
            .global
            .getData(dataDef, false);

    }

    setDataValues() {
        
        this.dataDef = {dataIzd: {}, dataIzdRef: {}, 
            dataRea: {}, dataReaRef: {},
            dataOtp: {}, dataOtpRef: {}};

        if (this.data.izv.length > 0)
            this.setValues(this.dataDef.dataIzd, this.data.izv[0]);
        if (this.data.ref != null && this.data.ref.length > 0 && this.provider.parametriRef.include == true)
            this.setValues(this.dataDef.dataIzdRef, this.data.ref[0]);
        if (this.data.izv.length > 1)
            this.setValues(this.dataDef.dataRea, this.data.izv[1]);
        if (this.data.ref != null && this.data.ref.length > 1 && this.provider.parametriRef.include == true)
             this.setValues(this.dataDef.dataReaRef, this.data.ref[1]);
        if (this.data.izv.length > 2)
            this.setValues(this.dataDef.dataOtp, this.data.izv[2]);
        if (this.data.ref != null && this.data.ref.length > 2 && this.provider.parametriRef.include == true)
            this.setValues(this.dataDef.dataOtpRef, this.data.ref[2]);
        
        this.setIndexes();
    }

    setValues(arr: any, data: any) {

            arr.kolicina = data.kolicina;
            arr.vrijednost = this.numberFormat(data.vrijednost, 2);
            arr.ruc = this.numberFormat(data.ruc, 2);
            arr.prosjek = this.numberFormat(data.prosijek, 2);
            arr.postoruc = this.numberFormat(data.postoruc, 2);
            arr.dnevniprosjekkolicina = this.numberFormat(data.dnevniprosijekkolicina, 2);
            arr.dnevniprosjekvrijednost = this.numberFormat(data.dnevniprosijekvrijednost, 2);
            arr.dnevniprosjekruc = this.numberFormat(data.dnevniprosijekruc, 2);
            arr.dnevniprosjekkolicinaindex = 0;
            arr.dnevniprosjekvrijednostindex = 0;
            arr.dnevniprosjekrucindex = 0;
            arr.brojdana = data.brojdana;
    }

    setIndexes() {
        try
        {
            if (this.dataDef.dataIzd.dnevniprosjekkolicina != null && this.dataDef.dataIzdRef.dnevniprosjekkolicina != null) 
            {
                this.setIndexesMath(this.dataDef.dataIzd, this.dataDef.dataIzdRef, this.data.izv[0], this.data.ref[0]);
            }
            if (this.dataDef.dataRea.dnevniprosjekvrijednost != null && this.dataDef.dataReaRef.dnevniprosjekvrijednost != null) {
                this.setIndexesMath(this.dataDef.dataRea, this.dataDef.dataReaRef, this.data.izv[1], this.data.ref[1]);
            }
            if (this.dataDef.dataOtp.dnevniprosjekruc != null && this.dataDef.dataOtpRef.dnevniprosjekruc != null) {
                this.setIndexesMath(this.dataDef.dataOtp, this.dataDef.dataOtpRef, this.data.izv[2], this.data.ref[2]);
            }
        } catch (ex) {
            console.log(ex);   
        }
       
        
    }

    setIndexesMath(izv: any, ref: any, dataIzv: any, dataRef: any) {
        if (dataRef.dnevniprosijekkolicina > 0)
            izv.dnevniprosjekkolicinaindex = this.numberFormat(dataIzv.dnevniprosijekkolicina * 100 / dataRef.dnevniprosijekkolicina, 0);
        if (dataRef.dnevniprosijekvrijednost > 0)
            izv.dnevniprosjekvrijednostindex =  this.numberFormat(dataIzv.dnevniprosijekvrijednost * 100 / dataRef.dnevniprosijekvrijednost, 0);
        if (dataRef.dnevniprosijekruc > 0)
            izv.dnevniprosjekrucindex =  this.numberFormat(dataIzv.dnevniprosijekruc * 100 / dataRef.dnevniprosijekruc, 0);

        if (dataIzv.dnevniprosijekkolicina > 0 && this.provider.parametriRef.include == true)
            ref.dnevniprosjekkolicinaindex = this.numberFormat(dataRef.dnevniprosijekkolicina * 100 / dataIzv.dnevniprosijekkolicina, 0);
        if (dataIzv.dnevniprosijekvrijednost > 0 && this.provider.parametriRef.include == true)
            ref.dnevniprosjekvrijednostindex =  this.numberFormat(dataRef.dnevniprosijekvrijednost * 100 / dataIzv.dnevniprosijekvrijednost, 0);
        if (dataIzv.dnevniprosijekruc > 0 && this.provider.parametriRef.include == true)
            ref.dnevniprosjekrucindex =  this.numberFormat(dataRef.dnevniprosijekruc * 100 / dataIzv.dnevniprosijekruc, 0);
    }

    numberFormat(value, decimals): string {
        return this.pipe.transform(value, decimals)
    }


}