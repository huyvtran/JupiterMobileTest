import {Component, ViewChild} from '@angular/core';

import{IonicPage, NavController, LoadingController, ModalController, ViewController} from 'ionic-angular';
import { BasePage } from '../../../../../../providers/base/base-page';
import { SkladisteInventuraStavkaProvider } from '../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-stavka-provider';
import { SkladisteInventuraProvider } from '../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-provider';
import { SkladisteStavkaUnosIzmjenaProvider } from '../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-stavka-unos-izmjena-provider';


@IonicPage()
@Component ({
    selector: 'page-stavka-unos',
    templateUrl: 'stavka-unos.html'
})
export class StavkaUnosPage extends BasePage 
{
    
    @ViewChild('kolicinaInput') kolicinaEl;
    @ViewChild('kolicinaPakInput') kolicinaPakEl;
    kolicinaText: string;
    kolicinaPakText: string;
    brojDecimala: number = 0;

    odabranaRoba: any;
    kolicinaPaket: number = 0;
    // inventureDefaults : any = [];
    polica : boolean;
    detProvjera: any;
    //naslov: string;
    
    // indikator 0 = unos, indikator 1 = izmjena
    //indikator: number;

    constructor(
        public inventuraStavkaProvider: SkladisteInventuraStavkaProvider,
        public inventuraProvider : SkladisteInventuraProvider,
        public inventuraStavkaUnosIzmjenaProvider: SkladisteStavkaUnosIzmjenaProvider,
        private modalCtrl: ModalController,
        private viewCtrl: ViewController
        ){
        super();
    }

    
    ionViewWillEnter(){   
        
        if(this.inventuraStavkaProvider.odabraniBarkod == null)
        {
            this.viewCtrl.dismiss(null);
        }
        console.log('odabrana roba: ',this.inventuraStavkaProvider.odabraniBarkod);
        this.odabranaRoba = this.inventuraStavkaProvider.odabraniBarkod;
        console.log('odabrana roba: ',this.odabranaRoba);
        console.log('odabrana roba naziv: ',this.odabranaRoba[0].robanaziv);
        this.inventuraStavkaProvider.faktor = this.odabranaRoba[0].faktor;

        this.brojDecimala = this.odabranaRoba[0].jm_br_dec;
        this.kolicinaPakText = Number(this.odabranaRoba[0].kolicinapak).toFixed(this.brojDecimala);
        this.kolicinaText = Number(this.odabranaRoba[0].kolicina).toFixed(this.brojDecimala);
        if(this.odabranaRoba[0].faktorfix == 1){
            this.kolicinaPakText = (Math.round(Number(this.kolicinaText) / this.inventuraStavkaProvider.faktor)).toFixed(this.brojDecimala);
        }

         this.inventuraStavkaProvider.kontingent = this.odabranaRoba[0].kontingent ;

        console.log('faktor je: ',this.inventuraStavkaProvider.faktor)
        console.log('ind polica je:', this.inventuraProvider.indpolica);
        this.inventuraStavkaProvider.kkvalglaid = this.odabranaRoba[0].kkvalglaid;
        console.log('odabrani kontingent je: ', this.odabranaRoba[0].kontingent);
    }

    kolicinaRemove() {
        if (Number(this.kolicinaEl.value) - 1 >= 0) {
            this.kolicinaText =  (Number(this.kolicinaText) - 1).toFixed(this.brojDecimala);
            this.inventuraStavkaProvider.kolicina = Number(this.kolicinaText);
            if(this.odabranaRoba[0].faktorfix == 1)
            {
                this.kolicinaPakText = (Math.round(Number(this.kolicinaText) / this.inventuraStavkaProvider.faktor)).toFixed(this.brojDecimala);
                this.inventuraStavkaProvider.kolicinaPaket = this.kolicinaPakEl.value;    
            }    
        }

    }

    kolicinaAdd() {

        this.kolicinaText = (Number(this.kolicinaEl.value) + 1).toFixed(this.brojDecimala);
        this.inventuraStavkaProvider.kolicina = Number(this.kolicinaText);
        if(this.odabranaRoba[0].faktorfix == 1){
            this.kolicinaPakText = Math.round(Number(this.kolicinaText) / this.inventuraStavkaProvider.faktor).toFixed(this.brojDecimala);
            this.inventuraStavkaProvider.kolicinaPaket = this.kolicinaPakEl.value;
        }
    }

    kolicinaRemoveFaktor() {
        if (Number(this.kolicinaPakText) - 1 >= 0) {
            this.kolicinaPakText = (Number(this.kolicinaPakText) - 1).toFixed(this.brojDecimala);
            this.kolicinaText = (Number(this.kolicinaPakText) * this.inventuraStavkaProvider.faktor).toFixed(this.brojDecimala);
            this.inventuraStavkaProvider.kolicina = Number(this.kolicinaText);
        }
    }



    kolicinaAddFaktor() {
        this.kolicinaPakText = (Number(this.kolicinaPakText) + 1).toFixed(this.brojDecimala)
        this.kolicinaText = (Number(this.kolicinaPakText) * this.inventuraStavkaProvider.faktor).toFixed(this.brojDecimala); 
        this.inventuraStavkaProvider.kolicina = Number(this.kolicinaText);
    }

    formatBrojaPak(e: any, separador: string = '.') {
        // console.log(e.value);
        //this.kolicinaText = (Math.round(Number(e.value) * this.inventuraStavkaProvider.faktor)).toFixed(this.brojDecimala);
        if (this.brojDecimala == 0)
        {
            return;
        }

        let a =  e.value.split("");
        let ns:string = '';
        a.forEach((c:any) => { if (!isNaN(c)) ns = ns + c; });
        ns = parseInt(ns).toString();
        if (ns.length < (this.brojDecimala+1)) { ns = ('0'.repeat(this.brojDecimala+1) + ns); ns = ns.slice((this.brojDecimala+1)*-1); }
        let ans = ns.split('');
        let r = '';
        for (let i=0; i < ans.length; i++) if (i == ans.length - this.brojDecimala) r = r + separador + ans[i]; else r = r + ans[i];
        e.value = r;
      }

    formataNumero(e: any, separador: string = '.') {

        
        if(this.odabranaRoba[0].faktorfix == 1){
            this.kolicinaPakText = (Math.round(Number(e.value) / this.inventuraStavkaProvider.faktor)).toFixed(this.brojDecimala);
        }
        if (this.brojDecimala == 0)
        {
            return;
        }

        let a =  e.value.split("");
        let ns:string = '';
        a.forEach((c:any) => { if (!isNaN(c)) ns = ns + c; });
        ns = parseInt(ns).toString();
        if (ns.length < (this.brojDecimala+1)) { ns = ('0'.repeat(this.brojDecimala+1) + ns); ns = ns.slice((this.brojDecimala+1)*-1); }
        let ans = ns.split('');
        let r = '';
        for (let i=0; i < ans.length; i++) if (i == ans.length - this.brojDecimala) r = r + separador + ans[i]; else r = r + ans[i];
        e.value = r;
      }

    dohvatiProvjere(){
        return new Promise((resolve)=> {
            this.detProvjera = [];
            this.inventuraStavkaUnosIzmjenaProvider.getDetProvjera()
            .then((res) => { 
              this.detProvjera = res;
            
              console.log('provjere su:', this.detProvjera);
            })
            resolve();
          }) 
    }

    // dohvatQuery(){
    //     return new Promise((resolve)=> {
    //         this.inventuraStavkaProvider.odabraniBarkod = [];
    //         this.inventuraStavkaUnosIzmjenaProvider.getDetQuery()
    //         .then((res) => { 
    //             this.inventuraStavkaProvider.odabraniBarkod = res;
            
    //           console.log('query:', res);
    //         })
    //         resolve();
    //       }) 
    // }

    spremiStavku(){


        if(this.inventuraStavkaUnosIzmjenaProvider.indikator == 0)
        {

          return new Promise((resolve)=> {
            this.detProvjera = [];
            this.inventuraStavkaUnosIzmjenaProvider.getDetProvjera()
            .then((res) => {
              this.detProvjera = res;

              console.log('testne provjere su :', res);

              if( this.detProvjera[0].indpostoji==1){
 
                this.global.modal = this.modalCtrl.create('StavkaSpremiPage',null);
                this.global.modal.present();
                this.global.modal.onDidDismiss(()=> {
                    if(this.odabranaRoba[0].kkvalobavezan == 1 && (this.odabranaRoba[0].kontingent == null || this.odabranaRoba[0].kontingent == ""))
                    {
                        this.inventuraProvider.localToast('Potrebno je odabrati kontingent za odabranu robu');
                        this.global.modal = null;
                    }
                    else{
                        this.inventuraStavkaUnosIzmjenaProvider.inventuraDetUnos(Number(this.kolicinaText),Number(this.kolicinaPakText));
                        this.inventuraStavkaProvider.odabraniBarkod = null;
                        this.inventuraStavkaProvider.pretraziBarkod();
                        this.global.modal = null;
                        this.viewCtrl.dismiss(null);
                    }


                })
            }
            else{
                console.log("uso152");
                if(this.odabranaRoba[0].kkvalobavezan == 1 && (this.odabranaRoba[0].kontingent == null || this.odabranaRoba[0].kontingent == ""))
                    {
                        this.inventuraProvider.localToast('Potrebno je odabrati kontingent za odabranu robu');
                    }
                    else {
                        this.inventuraStavkaUnosIzmjenaProvider.indZamijeniPribroji = null;
                        this.inventuraStavkaUnosIzmjenaProvider.inventuraDetUnos(Number(this.kolicinaText),Number(this.kolicinaPakText));
                        this.inventuraStavkaProvider.odabraniBarkod = null;
                        this.inventuraStavkaProvider.pretraziBarkod();
                        // this.inventuraStavkaProvider.odabraniBarkod = null;
                        // this.inventuraStavkaProvider.pretraziBarkod();
                        this.viewCtrl.dismiss(null);
                    }

            }
              console.log('provjere su:', this.detProvjera);
            })
            resolve();
          })



        }
         if(this.inventuraStavkaUnosIzmjenaProvider.indikator == 1)
         {
             this.inventuraStavkaUnosIzmjenaProvider.inventuraDetIzmjena(Number(this.kolicinaText),Number(this.kolicinaPakText));
             this.inventuraStavkaProvider.odabraniBarkod = null;
             this.inventuraStavkaProvider.pretraziBarkod();
             this.viewCtrl.dismiss(null);
         }

    }

    otvoriKontingent()
    {
        this.global.modal = this.modalCtrl.create("StavkaKontingentPage", null); 
        this.global.modal.present();
        this.global.modal.onDidDismiss(() => {
         console.log('dismisani kkvalglaid je:', this.inventuraStavkaProvider.kkvalglaid )
         this.odabranaRoba[0].kkvalglaid = this.inventuraStavkaProvider.kkvalglaid;
         console.log('dismisani kontingent je:', this.inventuraStavkaProvider.kontingent )
         this.odabranaRoba[0].kontingent = this.inventuraStavkaProvider.kontingent;
         this.global.modal = null;    
        })
    }

    doRefresh(refresher) {
        this.dohvatiProvjere();
        this.odabranaRoba;
        refresher.complete();
    }


}

