import {BasePage} from '../../../../../providers/base/base-page';
import {Component, Renderer2} from '@angular/core';

import{IonicPage, NavController} from 'ionic-angular';
import { SkladisteInventuraProvider } from '../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-provider';
import { SkladisteInventuraStavkaProvider } from '../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-inventura-stavka-provider';
import { SkladisteStavkaUnosIzmjenaProvider } from '../../../../../providers/modules/skladiste/skladiste-inventura/skladiste-stavka-unos-izmjena-provider';

@IonicPage()
@Component ({
    selector: 'page-skladiste-inventura-stavka',
    templateUrl: 'skladiste-inventura-stavka.html'
})
export class SkladisteInventuraStavkaPage extends BasePage 
{
    stavkeInventure: any = [];
    title: string;
    
    private initKeyboardListener:boolean = true;
    

    //public disableKeyboardListener:boolean = false;

    constructor(
        public inventuraStavkaProvider : SkladisteInventuraStavkaProvider,
         private navCtrl: NavController,
         private inventuraProvider: SkladisteInventuraProvider,
         public stavkaUnosIzmjenaProvider: SkladisteStavkaUnosIzmjenaProvider,
         private renderer: Renderer2) {
        super();

        if (this.initKeyboardListener)
            this.initializeKeyboardListener();
    }

    initializeKeyboardListener() {
      if (typeof this.inventuraProvider.pageListenFunc === 'undefined')
      {
          this.inventuraProvider.pageListenFunc = this.renderer.listen('document', 'keypress', e => {
              // ako listener nije disablean, a disablean je kada nisam na ovom pageu. SearchModal detektiram preko this.global.modal varijable - kada ga otvara
              // ne odrađuje leave event jer ovaj page ostaje aktivan
              // console.log("uso2");
              // console.log(this.inventuraProvider.disableKeyboardListener);
              // console.log(e.keyCode);
              // if (this.inventuraProvider.disableKeyboardListener || this.modalActive)
              //     return;
              if ( e.view.location.hash != "#/stavka-unos" || e.view.location.hash != "#/stavka-spremanje")
              {
                  // if (e.keyCode == 13 || e.keyCode == 9)
                  // {
                  //   console.log("uso1");
                  //   this.pretraziBarCode();
                  // }
                  // else
                  // {
                      if (e.target.localName == "body")
                      {
                        this.buildBarcodeString(e);
                      }
                      
                      if (e.keyCode == 13 || e.keyCode == 9)
                      {
                          this.pretraziBarCode();
                      }
                  // }
              }

          });
          

      }
  }

  buildBarcodeString(e) {
    return new Promise((resolve, reject) => {
        try
        {
            if (e.key != null)
            {
              this.inventuraStavkaProvider.SearchString += e.key;
              resolve();
            }
        }
        catch(err) { reject(console.log(err)) } 
    });
}

    ionViewWillEnter(){ 

       this.inventuraStavkaProvider.SearchString = "";
        this.title = this.inventuraProvider.naslov;
        console.log('id: ',this.inventuraProvider.inventuraid);
        this.NapuniStavkeInventure();
        this.inventuraProvider.getInventure();
        
        
        
    }

    pretraziBarCode() {

      this.stavkaUnosIzmjenaProvider.naslov = "Unos";
      this.stavkaUnosIzmjenaProvider.indikator = 0;
      this.inventuraStavkaProvider.odabraniBarkod = [];
      this.inventuraStavkaProvider.pretraziBarkod()
      .then((res) => {

        this.inventuraStavkaProvider.odabraniBarkod = res;
        
        //console.log('odabrani barkod: ',res)
        if(this.inventuraStavkaProvider.odabraniBarkod.length > 0)
        {
          this.inventuraStavkaProvider.kkvalglaid = this.inventuraStavkaProvider.odabraniBarkod[0].kkvalglaid;
          this.inventuraStavkaProvider.robaid = this.inventuraStavkaProvider.odabraniBarkod[0].robaid;
          this.navCtrl.push("StavkaUnosPage", null)
        }        
        else
        {
          this.inventuraProvider.localToast("Nije pronađena niti jedna roba prema zadanim uvjetima pretrage.");
        }
      })


    }

    NapuniStavkeInventure() {
        return new Promise((resolve)=> {
            this.stavkeInventure = [];
            this.inventuraStavkaProvider.getStavkaInventure()
            .then((res) => { 
              this.stavkeInventure = res;

              console.log('stavke inventure: ',res);

            
              });

            resolve();
          }) 
    }

    dohvatiBarkodStavku(stavka){

      this.stavkaUnosIzmjenaProvider.naslov = "Unos";
                    this.stavkaUnosIzmjenaProvider.indikator = 0;
        return new Promise((resolve)=> {
            this.inventuraStavkaProvider.odabraniBarkod = [];
            
                this.inventuraStavkaProvider.pretraziBarkod()
            .then((res) => { 
              this.inventuraStavkaProvider.odabraniBarkod = res;
              //console.log('odabrani barkod: ',res)
              if(this.inventuraStavkaProvider.odabraniBarkod.length > 0)
              {
                this.inventuraStavkaProvider.odabraniBarkod = stavka;
                this.inventuraStavkaProvider.kkvalglaid = stavka[0].kkvalglaid;
                this.inventuraStavkaProvider.robaid = stavka[0].robaid;
                this.navCtrl.push("StavkaUnosPage", null);
              }        
              else
              {
                this.inventuraProvider.localToast("Nije pronađena niti jedna roba prema zadanim uvjetima pretrage.");
              }
            })
      
            resolve();
        
          })
    }

    searchFn(ev: any) {

        if (ev.target.value === null || ev.target.value === '' || typeof ev.target.value  === "undefined")
            return;

            return new Promise((resolve)=> {
                this.inventuraStavkaProvider.odabraniBarkod = [];
                this.inventuraStavkaProvider.pretraziBarkod()
                .then((res) => { 
                  this.inventuraStavkaProvider.odabraniBarkod = res;
                  
                  if(this.inventuraStavkaProvider.odabraniBarkod.length > 0)
                  {
                    this.inventuraStavkaProvider.kkvalglaid = this.inventuraStavkaProvider.odabraniBarkod[0].kkvalglaid;
                    this.inventuraStavkaProvider.robaid = this.inventuraStavkaProvider.odabraniBarkod[0].robaid;
 
                    this.stavkaUnosIzmjenaProvider.naslov = "Unos"
                    this.stavkaUnosIzmjenaProvider.indikator = 0;

                    this.navCtrl.push("StavkaUnosPage", null);

                  }
                  else
                  {
                    this.inventuraProvider.localToast("Nije pronađena niti jedna roba prema zadanim uvjetima pretrage.");
                  }
                  })
                resolve();
            })
    }

    doRefresh(refresher) {
        this.NapuniStavkeInventure();
        refresher.complete();
    }

    disablekeyboardListener(disableEnable) {
        console.log('keyboard listener active = ' + !disableEnable)
        this.inventuraProvider.disableKeyboardListener = disableEnable;
    }

    otvoriIzmjenu(stavka){
 
        console.log('stavka je:',stavka);
        console.log('id stavke je:',this.stavkeInventure[0].sktinventuradetid);
        this.inventuraStavkaProvider.stavkaid = stavka.sktinventuradetid;
        this.inventuraStavkaProvider.robaid = stavka.robaid;
        this.inventuraStavkaProvider.kolicina = stavka.kolicina;
        this.stavkaUnosIzmjenaProvider.naslov = "Izmjena";
                 this.stavkaUnosIzmjenaProvider.indikator = 1;
        return new Promise((resolve)=> {
            this.inventuraStavkaProvider.odabraniBarkod = [];   
                this.stavkaUnosIzmjenaProvider.getDetQuery()
                .then((res) => { 
                console.log('res je:',res)

                this.inventuraStavkaProvider.odabraniBarkod = res;
                

                
                // this.inventuraStavkaProvider.kkvalglaid = this.inventuraStavkaProvider.odabraniBarkod[0].kkvalglaid;
                // this.inventuraStavkaProvider.robaid = this.inventuraStavkaProvider.odabraniBarkod[0].robaid;
                
                
                this.navCtrl.push("StavkaUnosPage", null);
                
                  console.log('query:', res);
                })

                resolve();     
            
          })

    }


    
} 

