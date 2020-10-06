import { Component, ViewChild, ElementRef} from '@angular/core';
import { IonicPage , LoadingController} from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
import {ConstProvider} from '../../../../../providers/core/const-provider';
import * as Moment from 'moment';

import {TerproPocetakRadaProvider} from '../../../../../providers/modules/terpro/terpro-pocetakrada-provider';

@IonicPage()
@Component({
  selector: 'page-terpro-pocetakrada',
  templateUrl: 'pocetak.html'
})
export class TerproPocetakRadaPage  extends BasePage {

    @ViewChild('pocetnikmSelector') pocetniEL;
    @ViewChild('pocetnikmSelector', { read: ElementRef }) inputPocetniEl:ElementRef;

    @ViewChild('zavrsnikmSelector') zavrsniEl;
    @ViewChild('zavrsnikmSelector', { read: ElementRef }) inputZavrsniEl:ElementRef;

    private inputRefPocetni;
    private inputRefZavrsni;

  	constructor( private constantService : ConstProvider, private pocetakradaServis : TerproPocetakRadaProvider, private loading : LoadingController) {
        super()
    }

    ionViewDidEnter(){
        this.inputRefPocetni = this.inputPocetniEl.nativeElement.querySelector("input[name='pocetnikm']");
        this.inputRefZavrsni = this.inputZavrsniEl.nativeElement.querySelector("input[name='zavrsnikm']");
    }

    onFocus(){

        this.inputRefPocetni.select();
        
    }

    onFocusZavrsni(){

        this.inputRefZavrsni.select();
        
    }

    posalji(){

        let loading = this.loading.create({
            content: 'Loading...'
        });
        //console.log(typeof this.pocetakradaServis.pocetniKm)
        if(Number(this.pocetakradaServis.pocetniKm) === 0)
            this.global.presentToast("Stanje kilometraže ne smije biti 0!")
        else if(this.validateDatume() === false)
            this.global.presentToast("Datumi početka i završetka moraju biti isti!")
        else if(this.validateVrijeme() === false)
            this.global.presentToast("Vrijeme početka mora biti prije vremena završetka!")
        else if(this.validateKilometre() === false)
            this.global.presentToast("Početni kilometri moraju biti manji od završnih!")
        else{
            loading.present().then(() => {

                this.pocetakradaServis.sendRadnoVrijeme().then((val) => {    
                    setTimeout(() => {
                        loading.dismiss();
                        this.global.presentToast("Uspješno poslano radno vrijeme")
                    }, 500);  
                    
                })
                .catch((err) => {
                    setTimeout(() => {
                        loading.dismiss();
                    }, 500);
                    this.global.logError(err, false);
                })
               
            });
    
           
        }

      
    }
    // send(){

    //     let data : ICore.IData = {
    //         "queries": [
    //     {
    //         "query": "spmobTerkom_PrijenosSati",
    //         "params": {
    //             "terminalid": this.constantService.terminalId,
    //             "starttime" : this.pocetakradaServis.datumPocetka,
    //             "endtime" : this.pocetakradaServis.datumZavrsetka,
    //             "startkm" : this.pocetakradaServis.pocetniKm,
    //             "endkm" : this.pocetakradaServis.zavrsniKm,
    //             "napomena" : this.pocetakradaServis.napomena
    //         }
    //     }
    //   ]
    //     }
    //     return this
    //         .global
    //         .getData(data, true);
     
    

    // }

    validateVrijeme() {

        if (this.pocetakradaServis.datumPocetka >= this.pocetakradaServis.datumZavrsetka) 
        {
           return false
        }
        else
            return true
    }

     validateKilometre() {

        if (Number(this.pocetakradaServis.pocetniKm) >= Number(this.pocetakradaServis.zavrsniKm))
        {
           return false;
        }
        else
            return true;
    }

    validateDatume(){
        var datod = Moment(this.pocetakradaServis.datumPocetka, "YYYY-MM-DD")
        var datdo = Moment(this.pocetakradaServis.datumZavrsetka, "YYYY-MM-DD")

        if(Moment(datod).isSame(datdo))
            return true
        else
            return false;
    }


}
