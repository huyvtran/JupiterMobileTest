import {Component} from '@angular/core';

import{IonicPage, NavController, LoadingController, ModalController} from 'ionic-angular';
import { BasePage } from '../../../../../../providers/base/base-page';
import { SkladisteInventuraStavkaProvider } from '../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-stavka-provider';
import { SkladisteInventuraProvider } from '../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-provider';
import { SkladisteStavkaUnosIzmjenaProvider } from '../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-stavka-unos-izmjena-provider';
import { SkladisteStavkaIzmjenaProvider } from '../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-stavka-izmjenaprovider';
import { StavkaUnosPage } from '../stavka-unos/stavka-unos';


@IonicPage()
@Component ({
    selector: 'page-stavka-izmjena',
    templateUrl: 'stavka-izmjena.html'
})
export class StavkaIzmjenaPage extends BasePage 
{
    stavkaQuery: any;
    kolicinaPaket: any;
    
    
    constructor(
        public stavkaIzmjenaProvider : SkladisteStavkaIzmjenaProvider,
        public inventuraStavkaProvider: SkladisteInventuraStavkaProvider,
        public inventuraProvider: SkladisteInventuraProvider,
        private modalCtrl: ModalController
        ){
        super();
    }
    
    ionViewWillEnter(){   
         this. dohvatQuery();
         console.log('id odabrane stavke je:', this.inventuraStavkaProvider.stavkaid);    
    }

    dohvatQuery(){
        return new Promise((resolve)=> {
            this.stavkaQuery = [];
            this.stavkaIzmjenaProvider.getDetQuery()
            .then((res) => { 
              this.stavkaQuery = res;
            
              console.log('query:', this.stavkaQuery);
            })
            resolve();
          }) 
    }

    otvoriKontingent()
    {
      this.global.modal = this.modalCtrl.create("StavkaKontingentPage", null);
      this.global.modal.present();
      this.global.modal.onDidDismiss(()=> {
        this.global.modal = null;
      })
    }
    
    izmijeniStavku(){
      this.stavkaIzmjenaProvider.izmijeniStavku();
  }
  

       
}

