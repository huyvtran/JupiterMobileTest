import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, Content } from 'ionic-angular';
import { InventuraProvider } from '../../../../../providers/modules/inventura-provider'
import { BasePage } from '../../../../../providers/base/base-page';
import { InventuraStavka } from '../../../../../interfaces/modules/IInvetura';
import * as IInvetura from '../../../../../interfaces/modules/IInvetura';

@IonicPage()
@Component({
    selector: 'page-utility-inventura-imovinaSva-modal',
    templateUrl: 'imovinaSva-modal.html',
})
export class UtilityInventuraImovinaSvaModalPage extends BasePage {
    @ViewChild('scrollToTop') scrollToTop: Content;

    private infiniteAllImovinaList: Array<InventuraStavka> = [];
    private tempImovinaAllList: Array<InventuraStavka> = [];
    term: string = '';

    constructor(private view: ViewController, private invProvider: InventuraProvider) {
        super();

        this.getData();
    }

    getData() {
        this.infiniteAllImovinaList = [];
        this.variable.loaderActive = true;
        this.invProvider.getInvStavkeBoth(this.invProvider.osinventuraglaid)
            .then((res) => {
                if (res) {
                    this.invProvider.setAllImovinaPronadjeno().then((res) => {
                        if (res) {
                            this.invProvider.getAllImovina()
                                .then((res) => { this.variable.loaderActive = false; })
                                .then(() => {this.updateInfiniteScrollVIew(this.infiniteAllImovinaList, this.invProvider.listImovinaA);})
                                .catch((err) => {
                                    console.log(err)
                                    this.variable.loaderActive = false;
                                })
                        }
                    })
                        .catch((err) => {
                            console.log(err)
                            this.variable.loaderActive = false;
                        });
                }
            })
    }

    updateInfiniteScrollVIew(infiniteAllImovinaList:any, originalImovinaListO:any) {
        for (let i = 0; i < 20; i++) {
        
            if (infiniteAllImovinaList.length == originalImovinaListO.length)
              break;
              
              infiniteAllImovinaList.push(originalImovinaListO[infiniteAllImovinaList.length]);
        }
    }

    getDynamicLoadingText() {
        let originalList = this.tempImovinaAllList.length > 0 ? this.tempImovinaAllList : this.invProvider.listImovinaA

          var trenutniBroj = this.infiniteAllImovinaList.length + 20 > originalList.length ? originalList.length : this.infiniteAllImovinaList.length + 20
          return "Učitavam još rezultata... <br>" + trenutniBroj + "/" + originalList.length
    }

    doInfinite(infiniteScroll) {
        try {
            if ((this.tempImovinaAllList.length > 0 && (this.infiniteAllImovinaList.length >= this.tempImovinaAllList.length))
                || (this.tempImovinaAllList.length == 0 && (this.infiniteAllImovinaList.length >= this.invProvider.listImovinaA.length)))
            {
                infiniteScroll.complete(); 
                return;
            }
            
            setTimeout(() => {
                if (this.tempImovinaAllList.length == 0)
                    this.updateInfiniteScrollVIew(this.infiniteAllImovinaList, this.invProvider.listImovinaA)
                else
                    this.updateInfiniteScrollVIew(this.infiniteAllImovinaList, this.tempImovinaAllList)

                infiniteScroll.complete();
            }, 200);
        }
        catch (err) {
            console.log(err)
        }
    }

    stopInfiniteScrollLoadIfAllLoaded(infiniteScroll) {
        if (this.infiniteAllImovinaList.length >= this.invProvider.listImovinaA.length)
          infiniteScroll.complete(); 
    }

    searchFn(ev: any) {
        this.scrollToTop.scrollToTop()
        .then(()=> {
            this.infiniteAllImovinaList = [];
            this.tempImovinaAllList = [];
            this.term = ev.target.value;

            this.invProvider.listImovinaA.map((stavka) => {
                if (stavka.barcode.includes(this.term) || stavka.naziv.includes(this.term))
                    this.tempImovinaAllList.push(stavka);
            })

            if (this.tempImovinaAllList.length == 0 && this.term.length > 0) // ako traže nešto što ne postoji
                this.infiniteAllImovinaList = [];
            else if (this.tempImovinaAllList.length == 0)
                this.updateInfiniteScrollVIew(this.infiniteAllImovinaList, this.invProvider.listImovinaA)
            else
                this.updateInfiniteScrollVIew(this.infiniteAllImovinaList, this.tempImovinaAllList)
        })
    }

    doRefresh(refresher) {
        console.log('refresh')
        if (this.tempImovinaAllList.length == 0)
            this.getData()
        else
        {
            this.infiniteAllImovinaList = [];
            this.updateInfiniteScrollVIew(this.infiniteAllImovinaList, this.tempImovinaAllList)
        }
        console.log(this.tempImovinaAllList.length)
        refresher.complete();
    }

    dismiss() {
        this.view.dismiss();
    }

    
    doScan(item) {
        this.invProvider.listImovina.forEach((jedinka) => {
            if (jedinka.barcode == item.barcode) {
                let stavka = this.createStavka(item);
                if (item.evidentirano > 0) {
                    this.invProvider.updateStavka('scanOne', stavka)
                        .then((res) => {
                            if (res) {
                                this.getData();
                            }
                        });
                }
                else {
                    if (item.ocekivano == "NE") {
                        this.invProvider.updateStavka('newOne', null, null, stavka)
                            .then((res) => {
                                if (res) {
                                    this.getData();
                                }
                            });
                    }
                    else {
                        this.invProvider.updateStavka('scanOne', stavka)
                            .then((res) => {
                                if (res) {
                                    this.getData();
                                }
                            });
                    }
                }
            }
        });
    }

    createStavka(item): IInvetura.InventuraStavka {

        let novaStavka = new IInvetura.InventuraStavka;
        novaStavka.barcode = item.barcode; //
        novaStavka.datumpopisa = ""; //
        novaStavka.invbroj = item.invbroj; //
        novaStavka.naziv = item.naziv; //
        novaStavka.osimovinaid = item.osimovinaid; //
        novaStavka.osinventuraglaid = this.invProvider.osinventuraglaid; //
        novaStavka.osinventuradetid = item.osinventuradetid;
        novaStavka.popisanakolicina = 1; //
        novaStavka.smjestajnakolicina = 0; //
        novaStavka.memo = ""; //
        novaStavka.guid = ""; //

        return novaStavka;
    }
}
