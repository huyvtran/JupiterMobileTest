import {Component} from '@angular/core';

import{IonicPage, NavController, LoadingController, ModalController, ViewController} from 'ionic-angular';
import { BasePage } from '../../../../../../../providers/base/base-page';
import { SkladisteStavkaUnosIzmjenaProvider } from '../../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-stavka-unos-izmjena-provider';
import { SkladisteInventuraStavkaProvider } from '../../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-stavka-provider';
import { SkladisteInventuraProvider } from '../../../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-provider';




@IonicPage()
@Component ({
    selector: 'page-stavka-kontingent',
    templateUrl: 'stavka-kontingent.html'
})
export class StavkaKontingentPage extends BasePage 
{
    
    kontingenti: any = [];

    constructor(
        public stavkaUnosProvider : SkladisteStavkaUnosIzmjenaProvider,
        public inventuraProvider: SkladisteInventuraProvider,
        private navCtrl: NavController,
        private viewCtrl : ViewController,
        private inventuraStavkaProvider: SkladisteInventuraStavkaProvider
        ){
        super();
    }

    ionViewWillEnter(){
     this.napuniKontingent();
    }

    napuniKontingent()
    {
        return new Promise((resolve)=> {
            this.kontingenti = [];
            this.stavkaUnosProvider.getKontingent()
            .then((res) => { 
              this.kontingenti = res;
              
              console.log('kontigneti su:', this.kontingenti);
              
            
            })
            resolve();
          }) 
    }


    odaberiKontingent(item){
        console.log('kontingent je:', item);
        console.log('kontingent iz kontingent pagea je:', item.kkvalglaid);
        if(item.kkvalglaid == null)
        {
            this.inventuraStavkaProvider.kkvalglaid = null;
        }   
        console.log('item kkvalglaid je:', item.kkvalglaid);
        this.inventuraStavkaProvider.kkvalglaid = item.kkvalglaid;
        console.log('item kontingent je je:', item.kontingent);
        this.inventuraStavkaProvider.kontingent = item.kontingent;
        this.viewCtrl.dismiss(null); 
        
            
    }

    
    doRefresh(refresher) {
        this.napuniKontingent();
        refresher.complete();
    }

    dismiss()
    {
        this.viewCtrl.dismiss(null);
    }



}

