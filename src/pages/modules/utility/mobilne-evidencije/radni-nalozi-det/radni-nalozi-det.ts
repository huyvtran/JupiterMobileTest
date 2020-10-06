import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DecimalPipe } from '@angular/common';

import {BasePage} from '../../../../../providers/base/base-page';
import { UtilityMobEvProvider } from '../../../../../providers/modules/utility/mobilne-evidencije/utility-mobilne-evidencije-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';

import * as Moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-radni-nalozi-det',
  templateUrl: 'radni-nalozi-det.html'
})
export class UtilityMobEvRadniNaloziDetPage extends BasePage {

  kkvalglaid:any
  kontrolniUzorciArray:any[] = []
  kontrolniUzorciArrayInit:any[]
  public detalji:KontrolaParametriInterface[] = []
  kkvaldetid:number;
  status:number;
  kkvalstatusid:number;
  showKontroleList:boolean = false;
  btnContinueDisabledInd:boolean;
  otvoriUzorakBr:number;
  robaid:number;
  roba:string;
  dataSaved:boolean;

  constructor(public navCtrl: NavController, private utilityMobEvProvider: UtilityMobEvProvider,
     public navParams:NavParams, private modalCtrl: ModalController, private cdref: ChangeDetectorRef,
     private alertCtrl: AlertController, private helpersProvider: HelpersProvider, private decimalPipe: DecimalPipe) {
    super();

    this.kkvalglaid = navParams.data.kkvalglaid;
    this.robaid = navParams.data.robaid;
    this.roba = navParams.data.roba;
    this.otvoriUzorakBr = this.navParams.data.otvoriUzorak==true ? this.navParams.data.index : null;
  }

  createViewDataAndSetInitArrayAndGetBtnZakljuciDisabled(){
    return new Promise((resolve)=> {
      this.createViewCompatibleArray()
      .then(()=> {
        this.setInitArray();
        this.cdref.detectChanges(); 
      })
      .then(()=> { 
        this.btnZakljuciDisabled();
      });
      resolve();
    });
  }


  ionViewDidLoad() {
    this.createViewDataAndSetInitArrayAndGetBtnZakljuciDisabled();
  }

  ionViewDidEnter() {
    this.setInitArray();
    this.utilityMobEvProvider.SearchString = '';
  }

  ionViewCanLeave() {
    return new Promise((resolve)=> {
      if (JSON.stringify(this.kontrolniUzorciArray) != JSON.stringify(this.kontrolniUzorciArrayInit))
      {
        let alert = this.validationAlert()
        alert.present();
        alert.onDidDismiss((res) => {
          if (res == true)
            this.dataSavedToast();
          
          resolve();
        })
      }
      else
        resolve();
    })
  }

  validationAlert() {
    let alertPopup = this.alertCtrl.create({
      title: 'Upozorenje',
      message: 'Niste spremili kontrole. Želite li ih spremiti prije napuštanja forme?',
      buttons: [
        {
          text: 'Napusti formu bez spremanja',
          handler: () => {}
        },
        {
          text: 'Spremi i napusti formu',
          handler: () => {
            this.checkAllAndSaveUnsavedData()
          }
        }]
    });
    return alertPopup;
  }     

  dataSavedToast() {
    this.helpersProvider.presentToast('Kontrole uspješno spremljene.','', 2000)
  }
  
 
  ionViewWillLeave() {
    this.utilityMobEvProvider.ScanInd = false;
    this.utilityMobEvProvider.clearZakljucakData()
  }

  checkAllAndSaveUnsavedData(showLoader:boolean = true) {
    return new Promise((resolve)=> {
      for(var i=0; i < this.kontrolniUzorciArray.length; i++)
        this.spremiKontrolu(i, showLoader)

      resolve();
    })
  }
  
  setInitArray() {
    return new Promise((resolve)=> {
      this.kontrolniUzorciArrayInit = (JSON.parse(JSON.stringify(this.kontrolniUzorciArray)));
    })
  }

  doRefresh(refresher) {
    this.createViewDataAndSetInitArrayAndGetBtnZakljuciDisabled()
      .then(()=> {
        refresher.complete();
      })
  }

  refreshDataSet() {
    return new Promise((resolve)=> {
     
      resolve();
    })
  }


  getEditiraniUzorci(): number[] {
    let editiraniUzorciArray:number[] = []

    this.kontrolniUzorciArray.forEach(uzorak => {
      if (JSON.stringify(uzorak) != JSON.stringify(this.kontrolniUzorciArrayInit[this.kontrolniUzorciArray.indexOf(uzorak)]))
        {
          editiraniUzorciArray.push(uzorak[0].uzorak - 1)
        }
    });
    return editiraniUzorciArray;
  }
  
  expandKontrolniUzorak(uzorak:any, index:number){
    console.log()
    if (this.otvoriUzorakBr != null && uzorak[index].uzorak == this.otvoriUzorakBr)
      return true;

    return false;
  }

  hideContinueButton() {
    if (this.utilityMobEvProvider.ScanInd == true || this.detalji.length == 0)
      return true;
    else
      return false
  }

  createViewCompatibleArray(){
    return new Promise((resolve)=> {
      this.utilityMobEvProvider.getDetalji(this.kkvalglaid)
      .then(res=>{
        this.detalji = res.detalji
        this.cdref.detectChanges(); 
        this.utilityMobEvProvider.kkvalglaid = this.kkvalglaid

        var groupedUzorciArray = []
        this.kontrolniUzorciArray = []

        var maxUzorakBr = Math.max.apply(Math, this.detalji.map(function(o) { return o.uzorak; }))

        for (var i=0; i<maxUzorakBr; i++)
        {
          groupedUzorciArray.push(
          this.detalji
          .filter(opt => opt.uzorak == i+1)
          .map(opt => opt))
        }
        this.kontrolniUzorciArray = groupedUzorciArray.filter(value => Object.keys(value).length !== 0);
        
        this.cdref.detectChanges(); 
        resolve();
      })
     
    })
  }

  getBrojUzorka(index:number) {
    var kontrolniUzorak = this.kontrolniUzorciArray[index];
    var accordionTitle = 'Uzorak br.' + kontrolniUzorak[0].uzorak;
    if (this.kontrolniUzorciArray[index][0].datumuzorka != null)
      accordionTitle = accordionTitle + ' - ' + Moment(this.kontrolniUzorciArray[index][0].datumuzorka).format("DD.MM.YYYY")

    return accordionTitle
  }

  getItemLabel(uzorak:number, kontrola:number){
    return this.kontrolniUzorciArray[uzorak][kontrola].parametarnaziv
  }

  getGraniceNorme(uzorak:number, kontrola:number){
    if (this.kontrolniUzorciArray[uzorak][kontrola].tipnaziv == "Brojčani" )
      return '(' + this.kontrolniUzorciArray[uzorak][kontrola].decmin + ' - ' + this.kontrolniUzorciArray[uzorak][kontrola].decmax + ')'
  }
  

  nijeUnutarGranica(uzorak:number, kontrola:number){
    if (this.nijePopunjenaKontrola(uzorak, kontrola) == true)
      return false;
    
      if (this.kontrolniUzorciArray[uzorak][kontrola].tipnaziv === "Brojčani") 
     {
       if (this.kontrolniUzorciArray[uzorak][kontrola].decimalvalue < this.kontrolniUzorciArray[uzorak][kontrola].decmin 
       || this.kontrolniUzorciArray[uzorak][kontrola].decimalvalue > this.kontrolniUzorciArray[uzorak][kontrola].decmax 
       || this.kontrolniUzorciArray[uzorak][kontrola].decimalvalue == null)
        return true;

        return false;
     }
    else
      return false;
  }

  nijePopunjenaKontrola(uzorak:number, kontrola:number){
    if (this.kontrolniUzorciArray[uzorak][kontrola].tipnaziv=='Tekstualni')
    {
      if (this.kontrolniUzorciArray[uzorak][kontrola].stringval === null || this.kontrolniUzorciArray[uzorak][kontrola].stringval === '' || typeof this.kontrolniUzorciArray[uzorak][kontrola].stringval === "undefined")
        return true;

        return false;
    }
    else if (this.kontrolniUzorciArray[uzorak][kontrola].tipnaziv=='Brojčani')
      {
        if (this.kontrolniUzorciArray[uzorak][kontrola].decimalvalue === null || this.kontrolniUzorciArray[uzorak][kontrola].decimalvalue === '' || typeof this.kontrolniUzorciArray[uzorak][kontrola].decimalvalue === "undefined")
        return true;

        return false;
      }
    else
      return false;
  }

  getOpis(index:number){

    if (this.detalji[index].opis == null || this.detalji[index].opis == '')
      return 'nedefinirano'
    else
      return this.detalji[index].opis

  }

    
  spremi(uzorak:number){
    this.spremiKontrolu(uzorak)
    .then(()=> { this.otvoriUzorakBr = null })
    .then(()=> { 
      setTimeout(() => {
        this.createViewDataAndSetInitArrayAndGetBtnZakljuciDisabled() 
      }, 150); 
    })
  }

  spremiKontrolu(index:number, showLoader:boolean = true) {
    return new Promise((resolve, reject) => {
      this.kontrolniUzorciArray[index].forEach(kontrola => {
        if (JSON.stringify(kontrola) != JSON.stringify(this.kontrolniUzorciArrayInit[index].find(kontrolaToFind => kontrolaToFind.kkvaldetid == kontrola.kkvaldetid)))
        {
          this.utilityMobEvProvider.spremiKontroluUzorka(kontrola.kkvaldetid, kontrola.decimalvalue, kontrola.stringval, kontrola.boolval, showLoader)
          .catch((err)=> { 
            reject(err); 
            console.log(err); 
            return;
          })
          this.SpremiNapomenu(kontrola.kkvaldetid, kontrola.opis)
          .catch((err)=> { 
            reject(err); 
            console.log(err); 
            return;
          })
          this.utilityMobEvProvider.naloziIzmijenjeni = true;
        }
      })
      this.dataSavedToast();
      resolve();
    })
  }

  SpremiNapomenu(kkvaldetid:number, opis:any){
    return new Promise((resolve)=> {
      this.utilityMobEvProvider.spremiNapomenu(kkvaldetid, opis)
      resolve()
    })
  }

  obrisiKontrolu(uzorak: number, kontrola: number){
    let alertPopup = this.alertCtrl.create({
    title: 'Upozorenje',
    message: 'Potvrdite brisanje kontrole.',
    buttons: [
      {
        text: 'Obriši',
        handler: () => {
          this.utilityMobEvProvider.deleteKontrola(this.kontrolniUzorciArray[uzorak][kontrola].kkvaldetid)
          .then(()=> {
            this.otvoriUzorakBr = uzorak+1;
            this.createViewDataAndSetInitArrayAndGetBtnZakljuciDisabled();
            this.utilityMobEvProvider.naloziIzmijenjeni = true;
            this.helpersProvider.presentToast('Kontrola obrisana.','', 2000)
          })
        }
      },
      {
        text: 'Odustani', 
        role: 'cancel'
      }]
    });
    alertPopup.present();
  }

  presentRezultatiKontrolePage(){
    let kontroleOrderedList :any[] = []; 

    let BrojcaneKontrole :any[] = []; 
    let TekstualneKontrole :any[] = []; 
    let LogickeKontrole :any[] = []; 

    this.detalji.forEach(kontrola => {
      if (kontrola.tipnaziv=='Brojčani')
        BrojcaneKontrole.push(kontrola);
      else if (kontrola.tipnaziv=='Tekstualni')
        TekstualneKontrole.push(kontrola);
      else if (kontrola.tipnaziv=='Da/Ne')
        LogickeKontrole.push(kontrola);
    });
    BrojcaneKontrole.sort(function(a:any,b:any) {
      var textA = a.parametarnaziv.toUpperCase();
      var textB = b.parametarnaziv.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    TekstualneKontrole.sort(function(a:any,b:any) {
      var textA = a.parametarnaziv.toUpperCase();
      var textB = b.parametarnaziv.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    LogickeKontrole.sort(function(a:any,b:any) {
      var textA = a.parametarnaziv.toUpperCase();
      var textB = b.parametarnaziv.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    kontroleOrderedList = kontroleOrderedList.concat(BrojcaneKontrole)
    kontroleOrderedList = kontroleOrderedList.concat(TekstualneKontrole);
    kontroleOrderedList = kontroleOrderedList.concat(LogickeKontrole);


    this.navCtrl.push("RezultatiKontrolePage", kontroleOrderedList);
  }

  getUnutarGranicaStatusColor(index:number){
    let returnValue = '';
    this.kontrolniUzorciArray[index].forEach(kontrola => {
      if (kontrola.tipnaziv=='Brojčani')
      {
        if (parseFloat(kontrola.decimalvalue) < kontrola.decmin || parseFloat(kontrola.decimalvalue) > kontrola.decmax)
          returnValue = 'yellow';
      }
    });
    return returnValue;
  }

  getPopunjenaKontrolaStatusColor(index:number){
    let returnValue = '';
    this.kontrolniUzorciArray[index].forEach(kontrola => {
        if (kontrola.tipnaziv=='Tekstualni')
          {
            if (kontrola.stringval === null || kontrola.stringval === '' || typeof kontrola.stringval === "undefined")
              returnValue = 'red'
          }
        else if (kontrola.tipnaziv=='Brojčani')
          {
            if (kontrola.decimalvalue === null || typeof kontrola.decimalvalue === "undefined")
              returnValue = 'red'
          }
      });
    return returnValue;
  }

  btnZakljuciDisabled(){
    this.btnContinueDisabledInd = false;
    
      if (this.kontrolniUzorciArray.length == 0)
        {
          this.btnContinueDisabledInd = true;
          return;
        }
      this.kontrolniUzorciArray.forEach(uzorak => {
        this.kontrolniUzorciArray[this.kontrolniUzorciArray.indexOf(uzorak)].forEach(kontrola => {
          if (kontrola.tipnaziv=='Brojčani')
          {
            if (kontrola.decimalvalue === null || typeof kontrola.decimalvalue === "undefined"
            || (typeof kontrola.decimalvalue != "undefined" && kontrola.decimalvalue.length == 0))
              this.btnContinueDisabledInd = true;
          }
          else if (kontrola.tipnaziv=='Da/Ne')
          {
            if (kontrola.boolval === null  || typeof kontrola.boolval === "undefined")
              this.btnContinueDisabledInd = true;
          }
        });
      });
  }

  dodajKontrolniUzorak(){
    this.utilityMobEvProvider.dodajKontrolniUzorak(this.kkvalglaid).then(res =>{
      this.createViewDataAndSetInitArrayAndGetBtnZakljuciDisabled()
      this.utilityMobEvProvider.naloziIzmijenjeni = true;
    })
  }

    dec4(kontrola:any) {
      try
      {
        kontrola.decimalvalue = this.decimalPipe.transform(kontrola.decimalvalue, '1.2-4');
      }
      catch(err){}
  }

    showHideKontrole(myEvent, a:number){
      this.showKontroleList = !this.showKontroleList
    }

    dodajNovuKontrolu() {
      this.ionViewCanLeave()
      .then(()=> {
        var uzorciBrojDinstinct = []
        this.kontrolniUzorciArray.forEach(uzorak => {
          uzorciBrojDinstinct.push(uzorak[0].uzorak)
        });
        let data = {
          robaid : this.robaid,
          uzorci : uzorciBrojDinstinct,
          kkvalglaid: this.kkvalglaid
        }
          this.global.modal = this
          .modalCtrl
          .create("RadniNaloziDodajKontroluPage",data ,{enableBackdropDismiss: false});
  
  
      this.global.modal.onDidDismiss((uzorak) => {
        this.otvoriUzorakBr = uzorak;
        this.createViewDataAndSetInitArrayAndGetBtnZakljuciDisabled();
        this.utilityMobEvProvider.naloziIzmijenjeni = true;
      })
      this.global.modal.present()
      })
    }

    presentIzmjenaNapomeneModal(kontrola) : Promise<any> {
      return new Promise((resolve)=> {
        this.ionViewCanLeave()
        .then(()=> {
          console.log(kontrola)

          this.global.modal = this.modalCtrl.create('UtilityMobEvRadniNaloziIzmjenaNapomeneModalPage', kontrola);
          this.global.modal.present()

          this.global.modal.onDidDismiss((data)=> {
            console.log(data)
            if (data != null && data[0])
              this.utilityMobEvProvider.spremiNapomenu(kontrola.kkvaldetid, data[1])
            
            resolve();
          })
        })
    });
    
    }

    izmijeniNapomenu(kontrola:any) {
      console.log(kontrola)
      this.presentIzmjenaNapomeneModal(kontrola)
      .then(()=> {
        this.otvoriUzorakBr = kontrola.uzorak;
        setTimeout(() => {
          this.createViewDataAndSetInitArrayAndGetBtnZakljuciDisabled() 
        }, 150); 
        this.utilityMobEvProvider.naloziIzmijenjeni = true;
      })
    }

    getNapomena(opis) {
      if (opis.length == 0)
        return 'napomena...'
      else
        return opis
    }

    getNapomenaColor(opis) {
      if (opis.length == 0)
        return 'rgba(125, 125, 125, 0.5)'
    }

    getDeleteButtonColor(uzorakIndex, kontrolaIndex) {
      var kontrola = this.kontrolniUzorciArray[uzorakIndex][kontrolaIndex]
      if ((kontrola.dodanakontrola!=true && kontrola.obavezan!=true) || kontrola.dodanakontrola==true)
        return 'red'
    }
}
  

  export interface KontrolaParametriInterface {
    boolval: number
    robaid: number
    decmax: number
    decmin: number
    decimalvalue: number
    jmnaziv: string
    kkvaldetid: number
    kkvalglaid: number
    kkvallnparametarrobaid: number
    obavezan: number
    opis: string
    orgshemaid: number
    osobeid: number
    parametarnaziv: string
    stringval: string
    tipnaziv: string
    uzorak: number
  }