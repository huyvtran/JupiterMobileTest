import {Component} from '@angular/core';

import{IonicPage, ViewController} from 'ionic-angular';
import { BasePage } from '../../../../../../../providers/base/base-page';
import { SkladisteInventuraProvider } from '../../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-provider';
import { SkladisteInventuraStavkaProvider } from '../../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-stavka-provider';
import { SkladisteStavkaUnosIzmjenaProvider } from '../../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-stavka-unos-izmjena-provider';

@IonicPage()
@Component ({
    selector: 'page-stavka-spremanje',
    templateUrl: 'stavka-spremanje.html'
})
export class StavkaSpremiPage extends BasePage 
{
    detProvjera: any;
    

    constructor(
        public inventuraStavkaProvider: SkladisteInventuraStavkaProvider,
        public inventuraStavkaUnosProvider: SkladisteStavkaUnosIzmjenaProvider,
        private viewCtrl: ViewController
        ){
        super();
    }

    ionViewWillEnter(){
        this.dohvatiProvjere()

    }
    pribrojiKolicinu(){
        this.viewCtrl.dismiss(null);
        this.inventuraStavkaUnosProvider.indZamijeniPribroji = 2;
        console.log('indzip:', this.inventuraStavkaUnosProvider.indZamijeniPribroji);
        // this.inventuraStavkaUnosProvider.inventuraDetUnos();
        
    }

    zamijeniKolicinu(){   
        this.viewCtrl.dismiss(null);
        this.inventuraStavkaUnosProvider.indZamijeniPribroji = 1;
        console.log('indzip:', this.inventuraStavkaUnosProvider.indZamijeniPribroji);
        // this.inventuraStavkaUnosProvider.inventuraDetUnos();
        
    }

    dohvatiProvjere(){
        return new Promise((resolve)=> {
            this.detProvjera = [];
            this.inventuraStavkaUnosProvider.getDetProvjera()
            .then((res) => { 
              this.detProvjera = res;
            
              console.log('provjere su:', this.detProvjera);
            })
            resolve();
          }) 
    }
    
    dismiss()
    {
        this.viewCtrl.dismiss();
    }
}

