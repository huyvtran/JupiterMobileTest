import { Component } from '@angular/core';
import { NavParams, IonicPage, ModalController } from 'ionic-angular';
import { BiAnalizaTijekaNovcaProvider } from '../../../../../providers/bi-analiza-tijeka-novca-provider';
import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { NumberFormatPipe } from '../../../../../pipes/number-format.pipe';

import * as Moment from 'moment';

@IonicPage()
@Component({providers:[NumberFormatPipe],  selector: 'page-bi-analiza-tijeka-novca-usporedba', templateUrl: 'usporedba.html' })
export class BiAnalizaTijekaNovcaUsporedba extends BasePage {
    loading: boolean = true;
    data: any = [];
    dataDef:any = {};
    ponudeExists:boolean = false;
    ponudeExistsIzv:boolean = false;
    ponudeExistsRef:boolean = false;

    accordionColor: string = "#edefef";
    //accordionColor: string = "#e6e6e6"

    constructor(public navParams: NavParams, public modalCtrl: ModalController, private provider: BiAnalizaTijekaNovcaProvider,
        private pipe: NumberFormatPipe) {
        super();
        //console.log("uso1");
        this.getData();
        //console.log("uso");
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
            queryRef = {"query": "spMobManTijekNovca",
            "params": {
                "dat1": this.provider.parametriRef.datumod,
                "dat2": this.provider.parametriRef.datumdo,
                "org": this.provider.parametriRef.orgshemaid,
                "klm": this.provider.parametriRef.klmasterrobaid,
                "odgoso": this.provider.parametriRef.odgovornaosobaid,
            },
            "tablename":"ref"}
        }
        
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query":  "spMobManTijekNovca",
                    "params": {
                        "dat1": Moment(this.provider.parametriIzv.datumod).local().format("YYYYMMDD"),
                        "dat2": this.provider.parametriIzv.datumdo,
                        "org": this.provider.parametriIzv.orgshemaid,
                        "klm": this.provider.parametriIzv.klmasterrobaid,
                        "odgoso": this.provider.parametriIzv.odgovornaosobaid,
                    },
                    "tablename":"izv"
                }
            ]
        }
        console.log("setDataDef");
        console.log(Moment(this.provider.parametriIzv.datumod).local());

        if (queryRef != null) 
        {
            dataDef.queries.push(queryRef);
        }

        return this
            .global
            .getData(dataDef, false);

    }

    setDataValues() {
        try
        {
        this.dataDef = {data: {}, dataRef: {}};
            if (this.data.izv.length > 0)
                this.setValues(this.dataDef.data, this.data.izv[0]);
            if (this.data.ref != null && this.data.ref.length > 0 && this.provider.parametriRef.include == true)
                this.setValues(this.dataDef.dataRef, this.data.ref[0]);
        } catch (ex) {
            this.global.logError(ex, true);
        }

        try
        {
            this.setIndexes();
        } catch (ex) {
            this.global.logError(ex, true);
        }
    }

    setValues(arr: any, data: any) {
        try
        {
            arr.komercijalnipriliviznos = this.numberFormat(data.komercijalnipriliviznos, 2);
            arr.komercijalniprilivruc = this.numberFormat(data.komercijalniprilivruc, 2);
            arr.ostalipriliv = this.numberFormat(data.ostalipriliv, 2);
            arr.ukupanpriliv = this.numberFormat(data.ukupanpriliv, 2);
            arr.ukupanodliv = this.numberFormat(data.ukupanodliv, 2);
            arr.rezultat = this.numberFormat(data.rezultat, 2);

            arr.komercijalnipriliviznosdnevniprosjek = this.numberFormat(data.komercijalnipriliviznosdnevniprosijek, 2);
            arr.komercijalniprilivrucdnevniprosjek = this.numberFormat(data.komercijalniprilivrucdnevniprosijek, 2);
            arr.ostaliprilivdnevniprosjek = this.numberFormat(data.ostaliprilivdnevniprosijek, 2);
            arr.ukupanprilivdnevniprosjek = this.numberFormat(data.ukupanprilivdnevniprosijek, 2);
            arr.ukupanodlivdnevniprosjek = this.numberFormat(data.ukupanodlivdnevniprosijek, 2);
            arr.rezultatdnevniprosjek = this.numberFormat(data.rezultatdnevniprosijek, 2);

            arr.komercijalnipriliviznosdnevniprosjekindex = 0;
            arr.komercijalniprilivrucdnevniprosjekindex = 0;
            arr.ostaliprilivdnevniprosjekindex = 0;
            arr.ukupanprilivdnevniprosjekindex = 0;
            arr.ukupanodlivdnevniprosjekindex = 0;
            arr.rezultatdnevniprosjekindex = 0; 

            arr.brojdana = data.brojdana;
        } catch (ex) {
            this.global.logError(ex, true); 
        }
       
    }

    setIndexes() {
        try
        {
            if (this.dataDef.dataRef.komercijalnipriliviznos != null)
            {
                this.setIndexesMath(this.dataDef.data, this.dataDef.dataRef, this.data.izv[0], this.data.ref[0]);
            }   
        } catch (ex) {
            this.global.logError(ex, true);  
        }
    }

    setIndexesMath(izv: any, ref: any, dataIzv: any, dataRef: any) {
        if (dataRef.komercijalnipriliviznosdnevniprosijek > 0)
            izv.komercijalnipriliviznosdnevniprosjekindex = this.numberFormat(dataIzv.komercijalnipriliviznosdnevniprosijek * 100 / dataRef.komercijalnipriliviznosdnevniprosijek, 0);
        if (dataRef.komercijalniprilivrucdnevniprosijek > 0)
            izv.komercijalniprilivrucdnevniprosjekindex =  this.numberFormat(dataIzv.komercijalniprilivrucdnevniprosijek * 100 / dataRef.komercijalniprilivrucdnevniprosijek, 0);
        if (dataRef.ostaliprilivdnevniprosijek > 0)
            izv.ostaliprilivdnevniprosjekindex =  this.numberFormat(dataIzv.ostaliprilivdnevniprosijek * 100 / dataRef.ostaliprilivdnevniprosijek, 0);
        if (dataRef.ukupanprilivdnevniprosijek > 0)
            izv.ukupanprilivdnevniprosjekindex =  this.numberFormat(dataIzv.ukupanprilivdnevniprosijek * 100 / dataRef.ukupanprilivdnevniprosijek, 0);
        if (dataRef.ukupanodlivdnevniprosijek > 0)
            izv.ukupanodlivdnevniprosjekindex =  this.numberFormat(dataIzv.ukupanodlivdnevniprosijek * 100 / dataRef.ukupanodlivdnevniprosijek, 0);
        if (dataRef.rezultatdnevniprosijek > 0)
            izv.rezultatdnevniprosjekindex =  this.numberFormat(dataIzv.rezultatdnevniprosijek * 100 / dataRef.rezultatdnevniprosijek, 0);

        if (dataIzv.komercijalnipriliviznosdnevniprosijek > 0)
            ref.komercijalnipriliviznosdnevniprosjekindex = this.numberFormat(dataRef.komercijalnipriliviznosdnevniprosijek * 100 / dataIzv.komercijalnipriliviznosdnevniprosijek, 0);
        if (dataIzv.komercijalniprilivrucdnevniprosijek > 0)
            ref.komercijalniprilivrucdnevniprosjekindex =  this.numberFormat(dataRef.komercijalniprilivrucdnevniprosijek * 100 / dataIzv.komercijalniprilivrucdnevniprosijek, 0);
        if (dataIzv.ostaliprilivdnevniprosijek > 0)
            ref.ostaliprilivdnevniprosjekindex =  this.numberFormat(dataRef.ostaliprilivdnevniprosijek * 100 / dataIzv.ostaliprilivdnevniprosijek, 0);
        if (dataIzv.ukupanprilivdnevniprosijek > 0)
            ref.ukupanprilivdnevniprosjekindex =  this.numberFormat(dataRef.ukupanprilivdnevniprosijek * 100 / dataIzv.ukupanprilivdnevniprosijek, 0);
        if (dataIzv.ukupanodlivdnevniprosijek > 0)
            ref.ukupanodlivdnevniprosjekindex =  this.numberFormat(dataRef.ukupanodlivdnevniprosijek * 100 / dataIzv.ukupanodlivdnevniprosijek, 0);
        if (dataIzv.rezultatdnevniprosijek > 0)
            ref.rezultatdnevniprosjekindex =  this.numberFormat(dataRef.rezultatdnevniprosijek * 100 / dataIzv.rezultatdnevniprosijek, 0);
    }

    numberFormat(value, decimals): string {
        return this.pipe.transform(value, decimals)
    }

    

}