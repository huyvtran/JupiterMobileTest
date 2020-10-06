import {BasePage} from '../../../../providers/base/base-page';
import {Component, Renderer2} from '@angular/core';

import{IonicPage, NavController, LoadingController} from 'ionic-angular';
import { SkladisteInventuraProvider } from '../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-provider';
import { SkladisteInventuraStavkaProvider } from '../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-stavka-provider';

@IonicPage()
@Component ({
    selector: 'page-skladiste-inventura',
    templateUrl: 'skladiste-inventura.html'
})
export class SkladisteInventuraPage extends BasePage 
{
    public loading: LoadingController;
    inventure: any = [];
    inventureDefaults: any = [];
    inventuraIzabrani = "";
    title: string;
    private modalActive:boolean = false;

    constructor(
        private inventuraProvider : SkladisteInventuraProvider, 
        private navCtrl: NavController,
        private inventuraStavkaProvider: SkladisteInventuraStavkaProvider,
        private renderer: Renderer2){
        super();
    }

    ionViewWillEnter(){ 
        this.inventuraProvider.disableKeyboardListener = false;
        this.NapuniInventuru();
        this.NapuniDefaultneVrijednosti();
    }

    ionViewDidLeave() {
        this.inventuraProvider.pageListenFunc = null;
        this.inventuraProvider.disableKeyboardListener = true;
      }

    NapuniInventuru() {
        return new Promise((resolve)=> {
            this.inventure = [];
            this.inventuraProvider.getInventure()
            .then((res) => { 
              this.inventure = res;
              if(this.inventuraIzabrani != "")
              {
              this.inventuraProvider.inventuraid = this.inventuraIzabrani;
              }
              else
              {
              this.inventuraProvider.inventuraid = this.inventure[0].inventuraid;
              this.inventuraProvider.skladisteid = this.inventure[0].skladisteid;
              }
    
              console.log('inventure',res)})

            resolve();
          })
    }

    NapuniDefaultneVrijednosti()
    {
        return new Promise((resolve)=> {
            this.inventureDefaults = [];
            this.inventuraProvider.getInventureDefaults()
            .then((res) => { 
              this.inventureDefaults = res;
              console.log('inventure defaults: ',res);

              
              this.inventuraProvider.indpolica = this.inventureDefaults[0].indpolica;
              this.inventuraProvider.indimei = this.inventureDefaults[0].indimei;
            
            })
            resolve();
          }) 
    }

    doRefresh(refresher) {
        this.NapuniInventuru();
        this.NapuniDefaultneVrijednosti()

        refresher.complete();
    }

    otvoriStavkuInventure(stavka) {
        this.inventuraProvider.inventuraid = stavka.sktinventuraglaid;
        this.inventuraProvider.naslov  = stavka.naslov;
        console.log('stavka:', stavka)
        console.log('naslov: ', stavka.naslov);
        //this.global.pushPage("SkladisteInventuraStavkaPage", null);
        this.navCtrl.push("SkladisteInventuraStavkaPage", null);             
        
    } 


}

