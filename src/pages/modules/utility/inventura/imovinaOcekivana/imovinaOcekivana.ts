import { Component, Renderer2, ChangeDetectorRef } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { StorageProvider } from '../../../../../providers/core/storage-provider';
import { InventuraProvider } from '../../../../../providers/modules/inventura-provider'
import { InventuraStavka } from '../../../../../interfaces/modules/IInvetura';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import * as IInvetura from '../../../../../interfaces/modules/IInvetura';

@IonicPage()
@Component({ selector: 'page-utility-inventura-imovinaOcekivana', templateUrl: 'imovinaOcekivana.html' })
export class UtilityInventuraImovinaOcekivanaPage extends BasePage {

    handleKeyboardEvent(event: KeyboardEvent) {
        console.log(event);
    }
    // public barcodes = new Array<{name: string, barcode: string, format: string }>();
    private initKeyboardListener:boolean = true;
    private modalActive:boolean = false;

    private imovinaList: Array<InventuraStavka> = [];
    private infiniteListImovinaO: Array<InventuraStavka> = [];

    osInventuraGlaId: number;
    inventuraNaziv: string = '';
    term: string = '';
    

    bcdFormOpenCntDef: number = 2; // defaultna količina preko koje ćemo po skeniranju paliti formu
    bcdFormOpenCnt: number = 0; // defaultna količina preko koje ćemo po skeniranju paliti formu
    useOneClickScan: boolean = true;
    useScanWithMobile: boolean = true;
    keyScanSettings: string = 'scanSettings';

    constructor(private storage: StorageProvider, private invProvider: InventuraProvider,
        private modalCtrl: ModalController, private barcodeScanner: BarcodeScanner, private renderer: Renderer2, private cdr: ChangeDetectorRef) {
        super();

        if (this.initKeyboardListener)
            this.initializeKeyboardListener();


        this.osInventuraGlaId = this.invProvider.osinventuraglaid;
        this.inventuraNaziv = this.invProvider.osinventuranaziv;

        this.getData()
        .then(()=> {
            this.setSettingsKey();
        })
    }

    doBarcodeSearch() {
        console.log('gotov string: ' + this.invProvider.SearchString)

        this.searchBarcodeInOcekivana(this.invProvider.SearchString)
        .then((res)=>{
            if (res == true)
            {
                this.clearTempStr();
                this.refreshPronadenaImovinaStavke();
            }
            else
            {
                this.searchBarcodeInAll(this.invProvider.SearchString)
                .then((res) => {
                    if (res == true)
                        this.clearTempStr();
                    else
                    {
                        this.invProvider.localToast("Barcode '" + this.invProvider.SearchString + "' nije pronađen!")
                        this.clearTempStr();
                    }
                })
            }
        })
    }

    initializeKeyboardListener() {
        if (typeof this.invProvider.pageListenFunc === 'undefined')
        {
            this.invProvider.pageListenFunc = this.renderer.listen('document', 'keypress', e => {
                // ako listener nije disablean, a disablean je kada nisam na ovom pageu. SearchModal detektiram preko this.global.modal varijable - kada ga otvara
                // ne odrađuje leave event jer ovaj page ostaje aktivan
                if (this.invProvider.disableKeyboardListener || this.modalActive)
                    return;

                // ako je stisnut enter ili tab (ili poslan carriage return sa skenera)
                if (e.keyCode == 13 || e.keyCode == 9)
                    this.doBarcodeSearch();
                // ako se barkod utipkava jos uvijek
                else
                {
                    this.buildBarcodeString(e)

                    if (this.invProvider.osbarcodepubvar != undefined && this.invProvider.SearchString.length == this.invProvider.osbarcodepubvar)
                        this.doBarcodeSearch();
                }
            });
        }
    }

    buildBarcodeString(e) {
        return new Promise((resolve, reject) => {
            try
            {
                this.invProvider.SearchString += e.key;
                resolve();
            }
            catch(err) { reject(console.log(err)) } 
        });
    }

    clearTempStr() {
        return new Promise((resolve, reject) => {
            this.invProvider.SearchString = "";
            resolve();
        });
    }
    
    refreshPronadenaImovinaStavke() {
        this.invProvider.getInvStavkeBoth(this.osInventuraGlaId)
        .then(()=> {this.cdr.detectChanges()})
        .catch((err) => console.log(err))
    }

    ionViewWillEnter() {
        console.log(this.invProvider.pageListenFunc)
        // this.invProvider.selectedTabIndex = 0;
        this.disablekeyboardListener(false);
        this.clearTempStr()
            .then(() => {
                this.getData();
            });
    }

    disablekeyboardListener(disableEnable) {
        console.log('keyboard listener active = ' + !disableEnable)
        this.invProvider.disableKeyboardListener = disableEnable;
    }

    ionViewWillLeave() {
        this.clearTempStr();
    }

    setSettingsKey() {
        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(this.keyScanSettings, null, true)
                .then((val) => {
                    if (val != null) { // ako postoji KEY - setam iz keya
                        this.bcdFormOpenCnt = val.count;
                        this.useScanWithMobile = val.usescanwithmobile;
                        this.useOneClickScan = val.useoneclickscan;
                    }
                    else { // ako ne postoji KEY - setam defaultne vrijednosti i spremam key u bazu
                        let key = new IInvetura.ScanSettings;
                        key.count = this.bcdFormOpenCnt = this.bcdFormOpenCntDef;
                        key.usescanwithmobile = this.useScanWithMobile = false;
                        key.useoneclickscan = this.useOneClickScan = false;

                        resolve(this.storage.addToStorage(this.keyScanSettings, null, key, true));
                    }
                    resolve();
                }, (error) => {
                    reject(error);
                });
        });
    }

    getData() {
        return new Promise((resolve)=> {
            this.infiniteListImovinaO = new Array<{}>();
            this.invProvider.getInvStavkeBoth(this.osInventuraGlaId)
            .then(()=> {
                this.invProvider.getInvStavke(this.osInventuraGlaId)
                .then(() => {
                    this.imovinaList = this.invProvider.listImovina;
                })
            })
            .then(() => {this.updateInfiniteScrollVIew(this.infiniteListImovinaO, this.invProvider.listImovinaO);})
            .then(()=>  {
                this.cdr.detectChanges();
                resolve(); 
            })
            .catch((err) => console.log(err))
        })

    }

    updateInfiniteScrollVIew(infiniteListImovinaO:any, originalImovinaListO:any) {
        for (let i = 0; i < 20; i++) {
        
            if (infiniteListImovinaO.length == originalImovinaListO.length)
              break;
              
              infiniteListImovinaO.push(originalImovinaListO[infiniteListImovinaO.length]);
        }
    }

    getDynamicLoadingText() {
          var trenutniBroj = this.infiniteListImovinaO.length + 20 > this.invProvider.listImovinaO.length ? this.invProvider.listImovinaO.length : this.infiniteListImovinaO.length + 20
          return "Učitavam još rezultata... <br>" + trenutniBroj + "/" + this.invProvider.listImovinaO.length
    }

    doInfinite(infiniteScroll) {
        this.stopInfiniteScrollLoadIfAllLoaded(infiniteScroll);
        
        setTimeout(() => {
            this.updateInfiniteScrollVIew(this.infiniteListImovinaO, this.invProvider.listImovinaO);
            infiniteScroll.complete();
        }, 200);
    }

    stopInfiniteScrollLoadIfAllLoaded(infiniteScroll) {
        if (this.infiniteListImovinaO.length >= this.invProvider.listImovinaO.length)
          infiniteScroll.complete(); 
    }

    doRefresh(refresher) {
        this.getData();

        refresher.complete();
    }

    scanBarcode() {
        this.disablekeyboardListener(true);
        try {
            this.barcodeScanner.scan().then((barcodeData) => {
                if (barcodeData.cancelled) {
                    return false;
                }
                // this.barcodes.push({ name: 'nedefinirano', barcode: barcodeData.text, format: barcodeData.format });

                this.invProvider.SearchString = barcodeData.text;
                this.searchBarcodeInOcekivana(this.invProvider.SearchString)
                .then((res)=>{
                    if (res != true)
                    {
                        this.searchBarcodeInAll(this.invProvider.SearchString)
                        .then((res) => {
                            if (res != true)
                                this.invProvider.localToast("Pronađeni barcode '" + this.term + "' ne postoji u sustavu!");
                        })
                    }
                })
            });
        }
        catch(err) {
            console.log(err)
        }
        finally {
            this.clearTempStr();
            this.disablekeyboardListener(false);
        }
    }
    
    searchFn(ev: any) {
        console.log(ev.target.value)
        if (ev.target.value === null || ev.target.value === '' || typeof ev.target.value  === "undefined" || ev.target.value.length < this.invProvider.osbarcodepubvar)
            return;

        this.term = ev.target.value;
        this.searchBarcodeInOcekivana(this.invProvider.SearchString)
        .then((res)=>{
            if (res != true)
            {
                this.searchBarcodeInAll(this.invProvider.SearchString)
                .then((res) => {
                    if (res != true)
                        this.invProvider.localToast("Pronađeni barcode '" + this.term + "' ne postoji u sustavu!");
                })
            }
        })
        this.clearTempStr()
    }

    searchBarcodeInOcekivana(bcdText: string) {
        return new Promise((resolve) => {
            for (let item of this.imovinaList) {
                if (item.barcode == bcdText) {
                    let preostalaKolicina: number = item.smjestajnakolicina - item.popisanakolicina;
    
                    if ((this.bcdFormOpenCnt > 0) && (preostalaKolicina > this.bcdFormOpenCnt))
                        this.openModal(item, true);
                    else 
                        this.doScan(item, 'scanOne');
                    
                    resolve(true)
                }
            }
            resolve(false);
        })
    }

    searchBarcodeInAll(bcdText: string) {
        return new Promise((resolve) => {
            for (let item of this.invProvider.listImovinaO) {
                if (item.barcode == bcdText) {
                    let novaStavka = this.createStavkaFromAllImovina(item);
    
                    this.invProvider.updateStavka('newOne', null, null, novaStavka)
                        .then((res) => {
                            this.getData();
                        });
                    resolve(true);
                }
            }
            resolve(false);
        })
    }

    createStavkaFromAllImovina(item): IInvetura.InventuraStavka {
        let novaStavka = new IInvetura.InventuraStavka;
        novaStavka.barcode = item.barcode;
        novaStavka.datumpopisa = "";
        novaStavka.invbroj = item.invbroj;
        novaStavka.naziv = item.naziv;
        novaStavka.osimovinaid = item.osimovinaid;
        novaStavka.osinventuraglaid = this.osInventuraGlaId;
        novaStavka.osinventuradetid = null;
        novaStavka.popisanakolicina = 1;
        novaStavka.smjestajnakolicina = 0;
        //novaStavka.vrijemepromjene = dateNow.toString();
        novaStavka.memo = "";
        novaStavka.guid = "";

        return novaStavka;
    }


    openModal(item, isFound: boolean) {
        this.disablekeyboardListener(true);
        this.global.modal = this.modalCtrl.create('KolicinaModalPage', {
            data: item,
            IsFound: isFound
            // ,
            // osInventuraGlaId: this.osInventuraGlaId
        });
        this.global.modal.onDidDismiss(() => {
            this.disablekeyboardListener(false);
            this.getData();
            this.global.modal = null;
        });

        this.global.modal.present();
    }

    openMemoModal() {
        this.disablekeyboardListener(true);
        this.modalActive = true;
        this.global.modal = this.modalCtrl.create('MemoModalPage', {
            // osInventuraGlaId: this.osInventuraGlaId
        });
        this.global.modal.onDidDismiss(() => {
            this.disablekeyboardListener(false);
            this.getData();
            this.global.modal = null;
            this.modalActive = false;
        });

        this.global.modal.present();
    }

    openSearchModal() {
        this.disablekeyboardListener(true);
        this.invProvider.setAllImovinaOcekivano().then((res) => {
            if (res) {
                this.modalActive = true;
                this.global.modal = this.modalCtrl.create('UtilityInventuraImovinaSvaModalPage', {
                    // osInventuraGlaId: this.osInventuraGlaId
                });
                this.global.modal.onDidDismiss(() => {
                    this.disablekeyboardListener(false);
                    this.getData();
                    this.global.modal = null;
                    this.modalActive = false;
                });

                this.global.modal.present();
            }
        });
    }

    tryScanItem(item) {
        if (this.useOneClickScan == true)
            this.doScan(item, 'scanOne');
    }

    doScan(item, hlpStr: string) {
        this.invProvider.updateStavka(hlpStr, item)
            .then((res) => {
                this.getData();
            });
    }

    openSettingsModal() {
        this.disablekeyboardListener(true);
        this.global.modal = this.modalCtrl.create('UtilityInventuraImovinaPostavkeModalPage');
        this.global.modal.onDidDismiss(() => {
            this.disablekeyboardListener(false);
            this.setSettingsKey();
            this.global.modal = null;
        });

        this.global.modal.present();
    }

    // warningInfo() {
    //     this.invProvider.localToast('OPREZ: Nalazite se u modu prijenosa jednim klikom!');
    // }
}