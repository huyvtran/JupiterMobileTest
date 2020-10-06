import { Component, Renderer2, ChangeDetectorRef } from '@angular/core';
import { NavController, IonicPage, ModalController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import { UtilityMobEvProvider } from '../../../../../providers/modules/utility/mobilne-evidencije/utility-mobilne-evidencije-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';
import { StorageProvider } from '../../../../../providers/core/storage-provider';

@IonicPage({priority: 'high'})
@Component({
  selector: 'page-utility-mobilne-evidencije-radni-nalozi',
  templateUrl: 'radni-nalozi.html'
})
export class UtilityMobEvRadniNaloziPage extends BasePage {
  pageListenFunc: Function;
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event);
  }
  
  nalozi:any[] = []; 
  kkvalparametriidArray:any[] = [];
  skladistaArray:any[] = [];
  kkvalparametriid:number;
  skladisteid:number;
  filterKontrola:any[] = [];
  npairedDevices: any;
  pairedDevices: any;
  gettingDevices: Boolean;
  kontrolaNapomeneArrayInit: string[] = []
  disabledNapomenaButtonsArray: number[] = []
  disableKeyboardListener:boolean;
  // mičem keyboard listener init jer Ireks ne želi više unositi nove uzorke čitačem-to se odrađuje kroz
  // desktop software sada
  initKeyboardListener:boolean = false;


  constructor(public navCtrl: NavController, private utilityMobEvProvider: UtilityMobEvProvider, private modalCtrl:ModalController,
    public storage: StorageProvider, private renderer: Renderer2, private cdref: ChangeDetectorRef, private helpersProvider: HelpersProvider) 
    {
    super();

    if (this.initKeyboardListener)
      this.initializeKeyboardListener();
    

    this.storage.getFromStorage('KontrolaKvaliteteSkladisteId', null, true)
      .then((res)=> {
        if (res != null)
          this.skladisteid = res
      }) 
      .then(()=> {
        this.utilityMobEvProvider.getHomePageData(this.skladisteid)
        .then((res)=> {
          this.skladistaArray = res.skladista;
          this.nalozi = res.nalozi;
          this.kkvalparametriidArray = res.kontrole;
        }) 
      }) 
      .then(()=> {
        this.storage.getFromStorage('KontrolaKvalitetePregledId', null, true)
        .then((res)=> {
          if (res != null)
            this.kkvalparametriid = res
        })
        .then(()=> {
          this.filterChanged(this.kkvalparametriid)
        })
      }) 
  }

  ionViewWillEnter() {
    this.disableKeyboardListener = false;

    this.utilityMobEvProvider.SearchString = "";
    if (this.utilityMobEvProvider.naloziIzmijenjeni == true)
    {
      console.log('nalozi su izmijenjeni - loadam novi dataset')
      this.nalozi = []
      this.utilityMobEvProvider.getRadniNalozi(this.skladisteid).then(res=>{
      this.nalozi = res.nalozi
      })
      this.filterChanged(this.kkvalparametriid);
    }
    this.utilityMobEvProvider.naloziIzmijenjeni = false;
  }

  addFiltersToStorage(kkvalparametriid:number, skladisteid:number) {
    this.storage.addToStorage('KontrolaKvaliteteSkladisteId', null, skladisteid, true)
    .then(()=> {
      this.storage.addToStorage('KontrolaKvalitetePregledId', null, kkvalparametriid, true)
    })
  }

  getFromStorage(storageKey:string) : number {
    let value;
    if (storageKey == 'KontrolaKvaliteteSkladisteId')
    {
      this.storage.getFromStorage('KontrolaKvaliteteSkladisteId', null, true)
      .then((res)=> {
        console.log('GetFromStorage KontrolaKvaliteteSkladisteId: ' + res)
        value = res
      })
    }
    else
    {
      this.storage.getFromStorage('KontrolaKvalitetePregledId', null, true)
      .then((res)=> {
        console.log('GetFromStorage KontrolaKvalitetePregledId: ' + res)
        value = res
      })
    }
    return value
  }

  doRefresh(refresher) {
    // this.utilityMobEvProvider.SearchString = '';
    if (this.kkvalparametriid == 0)
    {
      this.utilityMobEvProvider.getRadniNalozi(this.skladisteid)
      .then(res=>{
        this.nalozi = res.nalozi
      })
      .then(()=> {
        this.cdref.detectChanges(); 
      })
    }
    else
    {
      this.getFiltriraneKontroleAndSetNapomeneArrayInit(this.kkvalparametriid)
      .then(()=> {
        this.cdref.detectChanges(); 
      })
    }
    refresher.complete();
  }

  ionViewWillLeave() {
    // disable keyboard listenera na drugim pagevima, enable ponovo kad ulazim na ovaj
    this.disableKeyboardListener = true;
  }

  searchFn(ev : any) {
    if (ev.target.value === null || ev.target.value === '' || typeof ev.target.value  === "undefined")
      return;

    if (ev.target.value.length > 3)
      this.utilityMobEvProvider.SearchString = ev.target.value;
      
      
    if (ev.target.value.length > 8)
    {  
      this.utilityMobEvProvider.SearchString = ev.target.value;
      Object.keys(this.nalozi).forEach(nalog => {
        if (this.nalozi[nalog].barcode === this.utilityMobEvProvider.SearchString) {
          this.utilityMobEvProvider.kkvalglaid = this.nalozi[nalog].kkvalglaid;
          this.utilityMobEvProvider.ScanInd = true;
          console.log('dodajem')
          let data = {
            kkvalglaid: this.nalozi[nalog].kkvalglaid,
            index : this.nalozi[nalog].index,
            robaid : this.nalozi[nalog].robaid,
            roba: this.nalozi[nalog].roba
          }
          this.utilityMobEvProvider.dodajKontrolniUzorak(this.utilityMobEvProvider.kkvalglaid)
            .then(res => {
              console.log('dodao')
              this.navCtrl.push('UtilityMobEvRadniNaloziDetPage', data)
          })
        }
      });
    }
  }

  scanFn(scannedBarcode) {
    Object.keys(this.nalozi).forEach(nalog => {
      if (this.nalozi[nalog].barcode == scannedBarcode) {
        this.utilityMobEvProvider.kkvalglaid = this.nalozi[nalog].kkvalglaid;
        this.utilityMobEvProvider.ScanInd = true;
        // console.log('dodajem')
        this.utilityMobEvProvider.dodajKontrolniUzorak(this.utilityMobEvProvider.kkvalglaid).then(res => {
          // console.log('dodao')
          this.navCtrl.push('UtilityMobEvRadniNaloziDetPage', this.utilityMobEvProvider.kkvalglaid)
        })
        
      }
    });
  }


  getPromptInputType(kontrola:any) {
    return new Promise<string>((resolve, reject)=> {
      if (kontrola.tipnaziv == "Tekstualni")
        resolve("text")
      else if (kontrola.tipnaziv == "Brojčani")
        resolve("number")
      else if (kontrola.tipnaziv == "Da/Ne")
        resolve("boolean") 
      
      reject(new Error("error: Something awful happened"));
    })
  }

  checkIfValidINT(data) {
    var t = data.kontrolaValue;
    console.log(t)
    var INTpart = (t.indexOf(".") >= 0) ? parseInt(t.substr(0, t.indexOf("."))) : parseInt(t);

    // workaround... pošto ne mogu ograničiti unos na alert inputu, niti javascript number.IsInteger funkcija zna provjeriti
    // da li je broj unutar INT granica + stora prima max 6-znamenkasti broj iz ne znam kojeg razloga - moram ovako
    console.log(INTpart >=  -999999 && INTpart <=  999999)
    return (INTpart >=  -999999 && INTpart <=  999999)
    // 999999.1234
  }

  checkMax4DecimalPlaces(data) {
    var t = data.kontrolaValue;
    var decimalPlacesCount = (t.indexOf(".") >= 0) ? t.substr(t.indexOf(".")+1).length : 4
    console.log(t.substr(t.indexOf(".")))
    console.log(t.substr(t.indexOf(".").length))
    console.log(t)
    console.log(decimalPlacesCount)
    console.log(decimalPlacesCount < 5)
    return decimalPlacesCount < 5
  }


  // presentUnosRezultataKontrolePrompt(kontrola:any) {
    presentBrziUnosPage(kontrola:any) {
    this.disableKeyboardListener = true;
    // var kontrolaValueChanged = false;

    this.global.modal = this.modalCtrl.create('UtilityMobEvRadniNaloziBrziUnosPage', kontrola);
    this.global.modal.present();
    this.global.modal.onWillDismiss((kontrolaChanged)=> {
      if (kontrolaChanged)
      {
        this.disableKeyboardListener = false;
        this.getFiltriraneKontroleAndSetNapomeneArrayInit(this.kkvalparametriid)
        .then(()=> {
          this.cdref.detectChanges();
          this.helpersProvider.presentToast('Kontrola uspješno spremljena.','', 2000)
        })
      }
    })
  }

  getSpremniZaZakljuciti(nalog:any){
    if (nalog.nepopunjenekontrolecount == 0 && nalog.kontrolecount > 0)
        return true;
    else 
      return false;
  }

  getOpis(index:number){
    if (this.nalozi[index].opis == '' || this.nalozi[index].opis == null)
      return 'nedefinirano'
    else
      return this.nalozi[index].opis

  }


  otvoriDetalje(kkvalglaid:any, robaid:number,roba:string, index?:number, otvoriUzorak:boolean = false){
    let data = {
      kkvalglaid: kkvalglaid,
      index : index,
      robaid : robaid,
      roba: roba,
      otvoriUzorak: otvoriUzorak
    }
    // console.log(data)
    this.utilityMobEvProvider.kkvalglaid = kkvalglaid;
    this.navCtrl.push('UtilityMobEvRadniNaloziDetPage', data);
  }


  filterChanged(kkvalparametriid:number) {
    this.addFiltersToStorage(kkvalparametriid, this.skladisteid)
    this.kkvalparametriid = kkvalparametriid;

    if (kkvalparametriid==0) //svi otvoreni nalozi
    {
      console.log(this.skladisteid)
      this.utilityMobEvProvider.getRadniNalozi(this.skladisteid)
      .then(res=>{
        this.nalozi = res.nalozi
      })
      .then(()=> {
        this.cdref.detectChanges(); 
      })
    }
    else // distinct kontrole u otvorenim nalozima
    {
      this.getFiltriraneKontroleAndSetNapomeneArrayInit(kkvalparametriid)
      .then(()=> {
        this.cdref.detectChanges(); 
      })
    }
  }

  getFilterKontrolaValue(kontrola:any) {
    if (kontrola.decval != null)
      return Number.parseFloat(kontrola.value).toFixed(4);
    else if (kontrola.boolval != null)
    {
      if (kontrola.boolval == 0)
        return 'Ne'
      else
        return 'Da'
    }
    else
      return kontrola.value;
  }

  initializeKeyboardListener() {
    this.pageListenFunc = this.renderer.listen('document', 'keypress', e => {
      // console.log(e.key)
      if (this.disableKeyboardListener == false)
      {
        if (e.keyCode != 13 && e.keyCode != 9)
        {
          console.log(this.utilityMobEvProvider.SearchString)
          // utilityMobEvProvider.SearchString = utilityMobEvProvider.SearchString + e.key;
        }
        else
        {
          console.log(e.key);
          Object.keys(this.nalozi).forEach(nalog => {
            if (this.nalozi[nalog].barcode === this.utilityMobEvProvider.SearchString) {
              this.utilityMobEvProvider.kkvalglaid = this.nalozi[nalog].kkvalglaid;
              this.utilityMobEvProvider.ScanInd = true;
              console.log('dodajem')
              let data = {
                kkvalglaid: this.nalozi[nalog].kkvalglaid,
                index : this.nalozi[nalog].index,
                robaid : this.nalozi[nalog].robaid,
                roba: this.nalozi[nalog].roba
              }
              this.utilityMobEvProvider.dodajKontrolniUzorak(this.utilityMobEvProvider.kkvalglaid)
                .then(res => {
                  console.log('dodao')
                  this.navCtrl.push('UtilityMobEvRadniNaloziDetPage', data)
              })
            }
          });
        }
      }
    });
  }

  getSpremiNapomenuButtonDisabled(opis:string, index:number) {
    return opis == this.kontrolaNapomeneArrayInit[index]
  }

  SpremiNapomenu(kkvaldetid:number, opis:any, index:number){
      this.utilityMobEvProvider.spremiNapomenu(kkvaldetid, opis)
      .then(() => {
        this.kontrolaNapomeneArrayInit[index]=opis
        this.helpersProvider.presentToast('Napomena uspješno spremljena', null, 1500)
      })
  }

  getFiltriraneKontroleAndSetNapomeneArrayInit(kkvalparametriid:number) {
    return new Promise((resolve)=> {
      this.utilityMobEvProvider.getFiltriraneKontrole(kkvalparametriid, this.skladisteid)
      .then(res=>{
        this.filterKontrola = res;
        console.log(res)
        res.forEach(kontrola => {
          this.kontrolaNapomeneArrayInit.push(kontrola.opis)
        });
      })
      resolve();
    })
  }
}


