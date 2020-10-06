import { Component} from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { DecimalPipe } from '@angular/common';

import {BasePage} from '../../../../../providers/base/base-page';
import { UtilityMobEvProvider } from '../../../../../providers/modules/utility/mobilne-evidencije/utility-mobilne-evidencije-provider';

@IonicPage()
@Component({
  selector: 'page-brzi-unos',
  templateUrl: 'brzi-unos.html'
})
export class UtilityMobEvRadniNaloziBrziUnosPage extends BasePage {

  kontrola:any;
  kontrolaInitDec:number;
  kontrolaInitString:string;
  kontrolaInitBool:number;
  kontrolaInitNapomena:string;
  
  constructor(public navCtrl: NavController, private navParams: NavParams, private decimalPipe: DecimalPipe, private utilityMobEvProvider: UtilityMobEvProvider) {
    super();

    console.log(navParams.data);
    this.kontrola = this.navParams.data;
    this.kontrolaInitDec = this.navParams.data.decval;
    this.kontrolaInitString = this.navParams.data.stringval;
    this.kontrolaInitBool = this.navParams.data.boolval;
    this.kontrolaInitNapomena = this.navParams.data.opis;
  }

  getFilterKontrolaValue() {
    if (this.kontrola.tipnaziv == 'Brojčani')
      return Number.parseFloat(this.kontrolaInitDec.toString()).toFixed(4);

    else if (this.kontrola.tipnaziv == 'Da/Ne')
    {
      if (this.kontrolaInitBool == 0)
        return 'Ne'
      else
        return 'Da'
    }
    
    else if (this.kontrola.tipnaziv == 'Tekstualni')
      return this.kontrolaInitString;
  }

  getFormatOcekivano() {
    return parseFloat(this.kontrola.decmin).toFixed(4) + ' - ' + parseFloat(this.kontrola.decmax).toFixed(4)
  }

  dec4(kontrola:any) {
    try
    {
      kontrola.decimalvalue = this.decimalPipe.transform(kontrola.decimalvalue, '1.2-4');
    }
    catch(err){}
  }

  spremiKontrolu() {
    this.utilityMobEvProvider.spremiNapomenu(this.kontrola.kkvaldetid, this.kontrola.opis)
      .then(() => {
        if (this.kontrola.tipnaziv == "Brojčani")
        {
          var brojcanaVrijednost = isNaN(parseFloat((parseFloat(this.kontrola.decval)).toFixed(4))) ? '' : parseFloat(this.kontrola.decval).toFixed(4)
          this.utilityMobEvProvider.spremiKontroluUzorka(this.kontrola.kkvaldetid, brojcanaVrijednost, "", null)
        }
        else if (this.kontrola.tipnaziv == "Tekstualni")
          this.utilityMobEvProvider.spremiKontroluUzorka(this.kontrola.kkvaldetid, null,this.kontrola.stringval, null)
        else if (this.kontrola.tipnaziv == "Da/Ne")
          this.utilityMobEvProvider.spremiKontroluUzorka(this.kontrola.kkvaldetid, null, "", this.kontrola.boolval)
      })
      .then(()=> { this.global.modal.dismiss(true) })
  }

  getDisabledState() {
    return this.kontrola.decval == this.kontrolaInitDec && this.kontrola.stringval == this.kontrolaInitString 
      && this.kontrola.boolval == this.kontrolaInitBool && this.kontrola.opis == this.kontrolaInitNapomena 
  }

  // text: 'Spremi',
  //         handler: data => {
  //           console.log(data)
  //           kontrolaValueChanged = true;
            
  //           var brojcanaVrijednost = isNaN(parseFloat((parseFloat(data.kontrolaValue)).toFixed(4))) ? '' : parseFloat(data.kontrolaValue).toFixed(4)

  //           if (kontrola.tipnaziv == "Brojčani")
  //             this.utilityMobEvProvider.spremiKontroluUzorka(kontrola.kkvaldetid, brojcanaVrijednost, "", null)
  //           else if (kontrola.tipnaziv == "Tekstualni")
  //             this.utilityMobEvProvider.spremiKontroluUzorka(kontrola.kkvaldetid, null, data.kontrolaValue, null)
  //           else if (kontrola.tipnaziv == "Da/Ne")
  //             this.utilityMobEvProvider.spremiKontroluUzorka(kontrola.kkvaldetid, null, "", data)
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();

  //   alert.onWillDismiss((data)=> {
  //     if (kontrolaValueChanged == true)
  //     {
  //       this.disableKeyboardListener = false;
  //       this.getFiltriraneKontroleAndSetNapomeneArrayInit(this.kkvalparametriid)
  //       .then(()=> {
  //         this.cdref.detectChanges();
  //         this.helpersProvider.presentToast('Kontrola uspješno spremljena.','', 2000)
  //       })
}

  