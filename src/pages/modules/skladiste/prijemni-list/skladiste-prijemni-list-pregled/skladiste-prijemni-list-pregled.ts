import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { SkladistePrijemniListProvider } from '../../../../../providers/modules/skladiste/skladiste-prijemni-list-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';

@IonicPage()
@Component({
  selector: 'page-skladiste-prijemni-list-pregled',
  templateUrl: 'skladiste-prijemni-list-pregled.html',
})
export class SkladistePrijemniListPregledPage extends BasePage {

  originalMojiDokumentiList:any = [];
  mojiDokumentiList:any = [];
  originalFiltriraniDokumentiList:any = [];
  filtriraniDokumentiList:any = [];
  dokumentiSegment:string = "0";
  inifiniteScrollPomak:number = 10;

  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: SkladistePrijemniListProvider,
    private modalCtrl: ModalController, private alertCtrl: AlertController, private helpers:HelpersProvider) {
    super();

    this.provider.documentType = 'prijemniList';
  }

  ionViewWillEnter() {
    if (this.provider.kreiraniDok != undefined && this.provider.kreiraniDok != null)  // ako je napravljena nova primka
    {
      this.updateMojiDokumentiView()
      .then(()=>{ this.provider.nabprigla.nabpriglaid =  this.provider.kreiraniDok })
      .then(()=> { this.presentPrimkaDetaljPage(this.provider.kreiraniDok.nabpriglaid,
         this.provider.kreiraniDok.skladisteid, this.provider.kreiraniDok.partneriid )})
      .then(()=> { this.provider.kreiraniDok = null }) 
    }
    else
      this.updateMojiDokumentiView()

    if (this.dokumentiSegment=="1") // kada se vraćam s stavkeList pagea, želim refresh forsirati u slučaju izmjenjenog dokumenta
      this.updateFiltriraniDokumentiView();
  }

  doRefresh(refresher) {
    if (this.dokumentiSegment == "1")
      this.updateFiltriraniDokumentiView();
    else
      this.updateMojiDokumentiView();
    
    refresher.complete();
  }

  presentPrimkaUnosPage() {
    this.navCtrl.push('SkladisteUnosDokumentaPage', ['prijemniList']);
  }

  segmentChanged(ev:Event){
    if (ev.type != 'click' && this.dokumentiSegment == '1') // spriječavam okidanje 2 puta jer se poziva i za click i za segment changed
      return;

    if (this.dokumentiSegment == "0")
      this.updateMojiDokumentiView();
  }

  presentPrimkaDetaljPage(nabpriglaid:number, skladisteid:number, partneriid:number){
    this.provider.nabprigla.nabpriglaid = nabpriglaid;
    this.provider.nabprigla.skladisteid = skladisteid;
    this.provider.nabprigla.partneriid = partneriid;
    this.provider.refreshViewInd = true;
    this.navCtrl.push('SkladistePrijemniListStavkePregledPage');
  }

  primkaDelete(nabpriglaid:number) {
    let alert = this.alertCtrl.create({
      title: 'Upozorenje',
      message: 'Potvrdite brisanje dokumenta',
      buttons: [
          {
              text: 'Odustani',
              handler: () => {}
          },
          {
            text: 'Obriši',
            handler: () => {
              this.provider.prijemniListDelete(nabpriglaid)
              .then(()=> { this.helpers.presentToast('Dokument uspješno obrisan', null, 2000)})
              .then(()=> { this.updateFiltriraniDokumentiView()})
            }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss(()=> {
      this.updateMojiDokumentiView();
    })
  }

  primkaPonistiZakljucak(nabpriglaid:number) {
    let alert = this.alertCtrl.create({
      title: 'Upozorenje',
      message: 'Potvrdite poništavanje zaključka dokumenta',
      buttons: [
          {
              text: 'Odustani',
              handler: () => {}
          },
          {
            text: 'Poništi zaključak',
            handler: () => {
              this.provider.prijemniListPonistiZakljucak(nabpriglaid)
              .then(()=> { this.helpers.presentToast('Uspješno poništavanje zaključka dokumenta', null, 2000)})
              .then(()=> { this.updateFiltriraniDokumentiView()})
            }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss(()=> {
      this.updateMojiDokumentiView();
    })
  }

  presentFilterModal(){
    this.global.modal = this
            .modalCtrl
            .create("SkladistePrijemniListPregledFilterPage", {},{enableBackdropDismiss: false});

    this.global.modal.onDidDismiss((getNewResultSet) => {
      if (getNewResultSet)
      {
        this.updateFiltriraniDokumentiView();
        this.global.modal = null;
      }
    });
    this.global.modal.present();
  }

  doInfinite(infiniteScroll) {
    this.stopInfiniteScrollLoadIfAllLoaded(infiniteScroll);
    
    setTimeout(() => {
      if (this.dokumentiSegment == "0")
        this.updateInfiniteScrollVIew(this.mojiDokumentiList, this.originalMojiDokumentiList);
      else
        this.updateInfiniteScrollVIew(this.filtriraniDokumentiList, this.originalFiltriraniDokumentiList);
      
      infiniteScroll.complete();
    }, 200);
  }

  stopInfiniteScrollLoadIfAllLoaded(infiniteScroll) {
    if (this.dokumentiSegment == "0" && (this.mojiDokumentiList.length >= this.originalMojiDokumentiList.length))
      infiniteScroll.complete(); 
    else if (this.dokumentiSegment == "1" && (this.filtriraniDokumentiList.length >= this.originalFiltriraniDokumentiList.length))
      infiniteScroll.complete(); 
  }

  updateInfiniteScrollVIew(dokumentList:any, originalDokumentList:any) {
    for (let i = 0; i < this.inifiniteScrollPomak; i++) {
        
    if (dokumentList.length == originalDokumentList.length)
      break;
      
      dokumentList.push(originalDokumentList[dokumentList.length]);
    }
  }

  updateMojiDokumentiView() {
    return new Promise((resolve)=> {
      this.mojiDokumentiList = [];
      this.provider.getMojiDokumenti()
      .then((res) => { this.originalMojiDokumentiList = res; console.log(res)})
      .then(() => {this.updateInfiniteScrollVIew(this.mojiDokumentiList, this.originalMojiDokumentiList);})

      resolve();
    })
  }

  updateFiltriraniDokumentiView() {
    return new Promise((resolve)=> {
      this.filtriraniDokumentiList = [];
      this.provider.getFiltriraniDokumenti()
      .then((res) => {this.originalFiltriraniDokumentiList = res; /*console.log(res)*/})
      .then(() => {this.updateInfiniteScrollVIew(this.filtriraniDokumentiList, this.originalFiltriraniDokumentiList);})
      resolve();
    })
  }

  getDynamicLoadingText() {
    if (this.dokumentiSegment == "0")
    {
      var trenutniBroj = this.mojiDokumentiList.length + this.inifiniteScrollPomak > this.originalMojiDokumentiList.length ? this.originalMojiDokumentiList.length : this.mojiDokumentiList.length + this.inifiniteScrollPomak
      return "Učitavam još rezultata... <br>" + trenutniBroj + "/" + this.originalMojiDokumentiList.length
    }
    else
    {
      trenutniBroj = this.filtriraniDokumentiList.length + this.inifiniteScrollPomak > this.originalFiltriraniDokumentiList.length ? this.originalFiltriraniDokumentiList.length : this.filtriraniDokumentiList.length + this.inifiniteScrollPomak
      return "Učitavam još rezultata... <br>" + trenutniBroj + "/" + this.originalFiltriraniDokumentiList.length
    }
  }
  
}
