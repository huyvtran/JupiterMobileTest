import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { SkladistePrijemniListProvider } from '../../../../../providers/modules/skladiste/skladiste-prijemni-list-provider';
import { GlobalProvider } from '../../../../../providers/core/global-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';


import * as Moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-skladiste-unos-dokumenta',
  templateUrl: 'skladiste-unos-dokumenta.html',
})
export class SkladisteUnosDokumentaPage extends BasePage {

  Datum : string = new Date().toISOString();
  Opis:string = '';
  Otpremnica:string = '';
  

  OtpremnicaIliBrNarudzbe:string = '';
  skladistaCombo:any = [];
  vrstaDokCombo:any = [];

  
  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: SkladistePrijemniListProvider,
    public global: GlobalProvider, private helpers:HelpersProvider, private modalCtrl: ModalController) {
    super();
    
    this.provider.documentType = this.navParams.data[0];
    
    if (this.provider.documentType == 'prijemniList')
      this.OtpremnicaIliBrNarudzbe = 'Otpremnica';
    else
      this.OtpremnicaIliBrNarudzbe = 'Broj narudžbe';

    this.getControlsDataSets();
  }

  ionViewWillEnter() {
  this.provider.Partner = {};
  }

  getControlsDataSets() {
    // this.provider.getSkladistaPrava()
    // .then((res)=> {this.skladistaCombo = res; /*console.log(res)*/})

    this.provider.getVrstaDok()
    .then((res)=> {
      this.vrstaDokCombo = res; 
      console.log(res)
      this.provider.PrijemniListUnosZapamtiVrstadok.id = res[0].vrstadokid
    })

    this.provider.getSkladisteMinDate()
    .then((res)=> {this.provider.PrijemniListUnosIzmjenaSkladisteMinDatum = res[0].varset; /*console.log(res[0].varset)*/})

    this.provider.getSkladisteMaxDate()
    .then((res)=> {this.provider.PrijemniListUnosIzmjenaSkladisteMaxDatum = res[0].varset; /*console.log(res[0].varset)*/})
  }

  presentSearchPage(searchPage : string) {
    this.global.modal = this.modalCtrl.create(searchPage);
    this.global.modal.present();

    this.global.modal.onDidDismiss(data => {
      console.log(data);
      if (data != null) {
        switch(searchPage) { 
          case "SearchOsobeNasePage": { 
            this.provider.PrijemniListUnosZapamtiOdgOsoba = data;
            break; 
          } 
        }    
      }  
    this.global.modal = null;
    });
  }

  clearValue(searchType, slide) {
    console.log('clear value: ' + searchType)
    if (searchType=='partneri')
      this.provider.Partner = {}
    else if (searchType=='orgshema')
      this.provider.PrijemniListUnosZapamtiOrgShema = {}
    else if (searchType=='odgosoba')
      this.provider.PrijemniListUnosZapamtiOdgOsoba = {}
    else if (searchType=='skladiste')
      this.provider.PrijemniListUnosZapamtiSkladistePrava = {}

    slide.close();
  }

  KreirajDokument() {
    if (this.provider.documentType == 'prijemniList' && this.validate())
    {
      this.provider.prijemniListInsert(this.Datum, this.provider.PrijemniListUnosZapamtiOrgShema.id,
        this.provider.Partner.id, this.provider.PrijemniListUnosZapamtiOdgOsoba.id, this.provider.PrijemniListUnosZapamtiVrstadok.id,
        this.Opis, this.provider.PrijemniListUnosZapamtiSkladistePrava.id, this.Otpremnica)
      .then((res)=> {
        // res - scope identity / vraća ID novo unesene stavke
        if (res != null)
        // console.log('vraćeni scope identity')
        // console.log(res[0].id)
          this.provider.getPrimka(res[0].id)  // dohvati novo unesenu primku
          .then((primkaObj)=> {
            this.helpers.presentToast('Uspješno kreiran prijemni list',null, 2000)
            // console.log(primkaObj[0])
            this.provider.kreiraniDok = primkaObj[0];
            this.navCtrl.pop();
          })
        })
    }
  }

  validate() {
    console.log(this.provider.PrijemniListUnosZapamtiOrgShema)
    var datum = Date.parse(Moment(this.Datum).format("YYYY-MM-DD"));
    var datMin = Date.parse(Moment(this.provider.PrijemniListUnosIzmjenaSkladisteMinDatum).format("YYYY-MM-DD"));
    var datMax = Date.parse(Moment(this.provider.PrijemniListUnosIzmjenaSkladisteMaxDatum).format("YYYY-MM-DD"));

    if ((datum < datMin) || (datum > datMax))
        { this.helpers.presentToast('Neodgovarajući datum',null, 1000); return false; }

    if (this.provider.PrijemniListUnosZapamtiSkladistePrava.id == undefined || this.provider.PrijemniListUnosZapamtiSkladistePrava.id == null)
      { this.helpers.presentToast('Niste odabrali skladište',null, 1000); return false; }
      else if (this.provider.Partner.id ==  undefined || this.provider.Partner.id == null)
      { this.helpers.presentToast('Niste odabrali partnera',null, 1000); return false; }
      else if (this.provider.PrijemniListUnosZapamtiVrstadok.id == undefined || this.provider.PrijemniListUnosZapamtiVrstadok.id == null)
      { this.helpers.presentToast('Niste odabrali vrstu dokumenta',null, 1000); return false; }
      else if (this.provider.PrijemniListUnosZapamtiOrgShema.id == undefined || this.provider.PrijemniListUnosZapamtiOrgShema.id == null)
      { this.helpers.presentToast('Niste odabrali organizacijsku jedinicu',null, 1000); return false; }
      else if (this.provider.PrijemniListUnosZapamtiOdgOsoba.id == undefined || this.provider.PrijemniListUnosZapamtiOdgOsoba.id == null)
      { this.helpers.presentToast('Niste odabrali odgovornu osobu',null, 1000); return false; }
      else 
        return true;
  }

}
