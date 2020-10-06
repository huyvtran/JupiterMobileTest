import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { SkladistePrijemniListProvider } from '../../../../../providers/modules/skladiste/skladiste-prijemni-list-provider';
import { GlobalProvider } from '../../../../../providers/core/global-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';

import * as Moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-skladiste-izmjena-dokumenta',
  templateUrl: 'skladiste-izmjena-dokumenta.html',
})
export class SkladisteIzmjenaDokumentaPage extends BasePage {

  nabpriglaid:number = null;
  Datum : string = new Date().toISOString();
  Opis:string = '';
  Otpremnica:string = '';
  Partner:any = {};
  OdgOsoba:any = {};
  OrgShema:any = {};
  Vrstadok:any = {};
  SkladistePrava:any = {};
  PartnerPromjenaInd:boolean=true;

  primkaDokEdit:any;

  OtpremnicaIliBrNarudzbe:string = '';
  skladistaCombo:any = [];
  vrstaDokCombo:any = [];

  
  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: SkladistePrijemniListProvider,
    private modalCtrl: ModalController, public global: GlobalProvider, private viewCtrl: ViewController, private helpers:HelpersProvider) {
    super();
    
    this.provider.documentType = this.navParams.data[0];
    this.provider.refreshViewInd = false;

    if (this.provider.documentType == 'prijemniList')
      this.OtpremnicaIliBrNarudzbe = 'Otpremnica';
    else
      this.OtpremnicaIliBrNarudzbe = 'Broj narudžbe';
    
    this.provider.getPrimka(this.provider.nabprigla.nabpriglaid)
    .then((res)=> { this.primkaDokEdit = res[0]; /*console.log(res[0])*/ })
    .then(() => { this.setInitValues() })

    this.getControlsDataSets();
    this.provider.getPartnerDobavljacPromjenaInd(this.provider.nabprigla.nabpriglaid)
    .then((res)=> {this.PartnerPromjenaInd = res[0].dobavljacpromjenaind, console.log(res[0].dobavljacpromjenaind);
      //  console.log(this.PartnerPromjenaInd)
      })
  }

  getControlsDataSets() {
    // this.provider.getSkladistaPrava()
    // .then((res)=> {this.skladistaCombo = res; /*console.log(res)*/})

    this.provider.getVrstaDok()
    .then((res)=> {this.vrstaDokCombo = res; /*console.log(res)*/})

    this.provider.getSkladisteMinDate()
    .then((res)=> {this.provider.PrijemniListUnosIzmjenaSkladisteMinDatum = res[0].varset; /*console.log(res[0].varset)*/})

    this.provider.getSkladisteMaxDate()
    .then((res)=> {this.provider.PrijemniListUnosIzmjenaSkladisteMaxDatum = res[0].varset; /*console.log(res[0].varset)*/})
  }

  setInitValues() {
    this.provider.nabprigla.nabpriglaid = this.primkaDokEdit.nabpriglaid;
    this.provider.nabprigla.skladisteid = this.primkaDokEdit.skladisteid;
    this.Datum = this.primkaDokEdit.datumdok;
    this.Opis = this.primkaDokEdit.opis;
    this.Otpremnica = this.primkaDokEdit.otpremnica;
    this.Partner = { "id":this.primkaDokEdit.partneriid, "naziv": this.primkaDokEdit.partner };
    this.OdgOsoba = { "id":this.primkaDokEdit.osobeid, "naziv": this.primkaDokEdit.osoba };
    this.OrgShema = { "id":this.primkaDokEdit.orgshemaid, "naziv": this.primkaDokEdit.orgshema };
    this.Vrstadok = { "id":this.primkaDokEdit.vrstadokid, "naziv": this.primkaDokEdit.vrstadok };
    this.SkladistePrava = { "id":this.primkaDokEdit.skladisteid, "naziv": this.primkaDokEdit.skladiste };
  }

  presentSearchModal(searchType : string, trazilicaBrojZnakova:number, cijelaSearchListaOnInit:boolean) {
    
    if (searchType=='partneri' && this.PartnerPromjenaInd == false)
    {
      this.helpers.presentToast('Nije moguće promijeniti partnera jer su donešene stavke', null, 1500)
      return;
    }

    this.global.modal = this
    .modalCtrl
    .create("SkladisteSearchModalPage", [searchType, trazilicaBrojZnakova, cijelaSearchListaOnInit] ,{enableBackdropDismiss: false});

    this.global.modal.onDidDismiss((searchResult) => {
      if (searchResult == null || searchResult == undefined)
        return; 

      if (searchType=='partneri')
        this.Partner = searchResult;
      else if (searchType=='orgshema')
        this.OrgShema = searchResult;
      else if (searchType=='odgosoba')
        this.OdgOsoba = searchResult;
      else if (searchType=='skladiste')
        this.SkladistePrava = searchResult;
    });

  this.global.modal.present();
  }

  clearValue(searchType, slide) {
    console.log('clear value: ' + searchType)
    if (searchType=='partneri')
      this.Partner = {}
    else if (searchType=='orgshema')
      this.OrgShema = {}
    else if (searchType=='odgosoba')
      this.OdgOsoba = {}
    else if (searchType=='skladiste')
      this.SkladistePrava = {}

    slide.close();
  }

  // trazilicaAuto() {

  // this.global.modal = this
  //       .modalCtrl
  //       .create('SharedTrazilicaAutocompletePage', {action: action, partneriid: this.parametri.partneriid});
  //       this.global.modal.onDidDismiss(data => {
  //       if (data != null) {
  //           // if (action == "partner") {
  //           //     this.parametri.partneriid = data.id;
  //           //     this.parametri.partnerinaziv = data.naziv;
  //           // }
  //           // if (action == "PartnerLokacija") {
  //           //     this.parametri.parstruid = data.id;
  //           //     this.parametri.parstrunaziv = data.naziv;
  //           // }
  //       }
  //       this.global.modal = null;
  //   });
  //   this.global.modal.present();
  // }


  EditDokument() {
    if (this.provider.documentType == 'prijemniList' && this.validate())
    {
      this.provider.prijemniListEdit(this.provider.nabprigla.nabpriglaid, this.Datum, this.OrgShema.id,
        this.Partner.id, this.OdgOsoba.id, this.Vrstadok.id,
        this.Opis, this.SkladistePrava.id, this.Otpremnica)
        .then(()=> {

          this.provider.nabprigla.skladisteid = this.SkladistePrava.id;
          this.provider.nabprigla.partneriid = this.Partner.id;


          this.helpers.presentToast('Uspješno izmijenjen prijemni list',null, 3000)
          this.provider.refreshViewInd = true;
          this.navCtrl.pop();
        })
    }
  }

  validate() {
    var datum = Date.parse(Moment(this.Datum).format("YYYY-MM-DD"));
    var datMin = Date.parse(Moment(this.provider.PrijemniListUnosIzmjenaSkladisteMinDatum).format("YYYY-MM-DD"));
    var datMax = Date.parse(Moment(this.provider.PrijemniListUnosIzmjenaSkladisteMaxDatum).format("YYYY-MM-DD"));

    if ((datum < datMin) || (datum > datMax))
        { this.helpers.presentToast('Neodgovarajući datum',null, 1500); return false; }

    if (this.SkladistePrava.id == undefined || this.SkladistePrava.id == null)
      { this.helpers.presentToast('Niste odabrali skladište',null, 1500); return false; }
      else if (this.Partner.id ==  undefined || this.Partner.id == null)
      { this.helpers.presentToast('Niste odabrali partnera',null, 1500); return false; }
      else if (this.Vrstadok.id == undefined || this.Vrstadok.id == null)
      { this.helpers.presentToast('Niste odabrali vrstu dokumenta',null, 1500); return false; }
      else if (this.OrgShema.id == undefined || this.OrgShema.id == null)
      { this.helpers.presentToast('Niste odabrali organizacijsku jedinicu',null, 1500); return false; }
      else if (this.OdgOsoba.id == undefined || this.OdgOsoba.id == null)
      { this.helpers.presentToast('Niste odabrali odgovornu osobu',null, 1500); return false; }
      else 
        return true;
  }

}
