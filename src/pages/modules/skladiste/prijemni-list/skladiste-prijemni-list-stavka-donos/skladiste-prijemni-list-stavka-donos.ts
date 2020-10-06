import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { SkladistePrijemniListProvider } from '../../../../../providers/modules/skladiste/skladiste-prijemni-list-provider';
import { createDirectiveInstance } from '@angular/core/src/view/provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';
import * as  _ from 'lodash';


@IonicPage()
@Component({
  selector: 'page-skladiste-prijemni-list-stavka-donos',
  templateUrl: 'skladiste-prijemni-list-stavka-donos.html',
})
export class SkladistePrijemniListStavkaDonosPage extends BasePage {

  @ViewChild(Content) content: Content;
  stavkeDonosList:any=[];
  // stavkeDonosListMockup:any=[];
  listaUcitanaInd:boolean;
  
  inifiniteScrollPomak:number=100;
  listScrolledDown:boolean = false;
  originalStavkeDonosList:any=[];
  infSc:any;

  selectedStavke:string='';

  selectedOptions:any = []

  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: SkladistePrijemniListProvider,
    private cdr: ChangeDetectorRef, private helpers:HelpersProvider) {
    super();

    this.provider.refreshViewInd = false;
    this.updateDonosStavkiView();

    // this.stavkeDonosListMockup = [
    //   {
    //     broj: "2018-000001",
    //     datumdok: "2018-03-15T00:00:00",
    //     jm: "kom",
    //     nabnardetid: 13800,
    //     nabnarglaid: 3643,
    //     narucenakolicina: 1,
    //     otvorenakolicina: 1,
    //     robaid: 6073,
    //     robanaziv: "SAMSUNG A300F BLACK MOBILNI TELEFON",
    //     sifra: "T0500735",
    //     skladiste: "OS Skladište osnovnih sredstava"
    //   },
      // {
      //   broj: "2018-000001",
      //   datumdok: "2018-03-15T00:00:00",
      //   jm: "kom",
      //   nabnardetid: 13801,
      //   nabnarglaid: 3643,
      //   narucenakolicina: 8,
      //   otvorenakolicina: 8,
      //   robaid: 4302,
      //   robanaziv: "Prepaid e-bon 50 kn",
      //   sifra: "W0700003",
      //   skladiste: null
      // }
    // ]
    
  }

  // ionViewWillLoad() {

    // for(var i = 0; i < 60; i++)
    // {this.originalStavkeDonosList.push(this.stavkeDonosListMockup[0])}

    // for(var i = 0; i < this.inifiniteScrollPomak; i++)
    // {this.stavkeDonosList.push(this.originalStavkeDonosList[0])}
    // console.log(this.stavkeDonosList)
  // }

  ionViewDidEnter() {
    this.listaUcitanaInd = true
  }

  checkAll() {
    var checkedAllState = this.selectedOptions.length == this.stavkeDonosList.length ? true : false;

    this.stavkeDonosList.forEach(stavka => {
      stavka.checked = !checkedAllState;
    });
  }

  donesiStavke() {

    console.log(this.selectedOptions)

    // pod kolicinaJMR šaljem isto otvorenu kolicinu ali ju u stori za insert/donos stavki preracunavam s faktorom
    // preracunavanja osnovne u dodatnu jedinicu mjere
    this.selectedOptions.forEach(selectedStavka => {
      this.provider.prijemniListStavkaInsert(
        // selectedStavka.nabnarglaid,
         this.provider.nabprigla.nabpriglaid, selectedStavka.robaid, 
        selectedStavka.otvorenakolicina, '', selectedStavka.otvorenakolicina, selectedStavka.nabnardetid, true)
    });
    this.helpers.presentToast('Stavke uspješno donesene', null, 1500);
    this.provider.refreshViewInd = true;
    this.navCtrl.pop();


  }


  onScrollStart(ev) {
    try
    {
      if (ev.scrollTop > 0)
        this.listScrolledDown = true;
      else 
        this.listScrolledDown = false;

        this.cdr.detectChanges();
    }
    catch(ex) { }
  }


  getDynamicLoadingText() {
    var trenutniBroj = this.stavkeDonosList.length + this.inifiniteScrollPomak > this.originalStavkeDonosList.length ? this.originalStavkeDonosList.length : this.stavkeDonosList.length + this.inifiniteScrollPomak
    return "Učitavam još rezultata... <br>" + trenutniBroj + "/" + this.originalStavkeDonosList.length
    
  }

  doInfinite(infiniteScroll) {
    this.infSc = infiniteScroll;
    // console.log(this.stavkeDonosList.length)
    // console.log(this.originalStavkeDonosList.length)
    if (this.stavkeDonosList.length >= this.originalStavkeDonosList.length)
    {
      infiniteScroll.enable(false);
      return;
    }
    setTimeout(() => {
      this.updateInfiniteScrollVIew(this.stavkeDonosList, this.originalStavkeDonosList)
      .then(()=> { infiniteScroll.complete() })
    }, 200);
  }

  forceDoInfinite() {
    if (this.stavkeDonosList.length >= this.originalStavkeDonosList.length)
      return;

      setTimeout(() => {
      this.updateInfiniteScrollVIew(this.stavkeDonosList, this.originalStavkeDonosList)
      .then(()=> {this.cdr.detectChanges()})
    }, 200);
  }

  updateInfiniteScrollVIew(stavkeDonosList:any, originalStavkeDonosList:any) {
    return new Promise((resolve)=> {
      // console.log(this.stavkeDonosList.length)
      // console.log(this.originalStavkeDonosList.length)
      for (let i = 0; i < this.inifiniteScrollPomak; i++) {
          
      if (stavkeDonosList.length == originalStavkeDonosList.length)
        break;
        
        stavkeDonosList.push(originalStavkeDonosList[stavkeDonosList.length]);
      }
      // console.log(this.stavkeDonosList)
      resolve();
    })
  }

  updateDonosStavkiView() {
    return new Promise((resolve)=> {
      this.stavkeDonosList = [];

      console.log('nabprigla')
      console.log(this.provider.nabprigla)
      this.provider.getPrimkaDonosStavke(this.provider.nabprigla.partneriid)
      .then((res) => { 
              
        this.groupStavke(res).then((res) =>{

          this.originalStavkeDonosList = res;
          console.log(this.originalStavkeDonosList)
        })
      })
      .then(() => {this.updateInfiniteScrollVIew(this.stavkeDonosList, this.originalStavkeDonosList);})

      resolve();
    })
  }

  groupStavke(stavke:any): Promise<any> {
    return new Promise<any>((resolve) =>{

      var result = _(stavke)
      .groupBy(x => x.broj)
      .map((value, key) => ({broj: key, stavke: value}))
      .value();

      result.forEach(group => {
        _.extend(group, {datumdok: group.stavke[0].datumdok})
      });

      resolve(result);
    });
  }

  checkGroup(index, grupa) {
    console.log(grupa)

    grupa.stavke.forEach(el => {

      el.checked = grupa.checked
      this.addItem(this.selectedOptions, el)
    });
  }

  toggleGroup(index, grupa) {

    grupa.open = !grupa.open;
    console.log(grupa)
  }


  checkItem(stavka, grupa, index) {

    this.addItem(this.selectedOptions, stavka)

    console.log(this.selectedOptions);
  }

  addItem(items, item) {

    let foundObject = _.find(items, function(e) {

      return e.nabnardetid === item.nabnardetid;
    });

    if(!foundObject) {
      items.push(item);
    }
    else
    {
      _.remove(items, x => x.nabnardetid === item.nabnardetid);
    }
  }


  scrollToTopOfList(duration:number) {
    this.content.scrollToTop(duration)
    .then(()=> {this.listScrolledDown = false;})
    .then(()=> {this.infSc.enable(false)})
  }

}
