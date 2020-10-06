import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { SkladistePrijemniListProvider } from '../../../../../providers/modules/skladiste/skladiste-prijemni-list-provider';

/**
 * Generated class for the SkladistePrijemniListSearchModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-skladiste-search-modal',
  templateUrl: 'skladiste-search-modal.html',
})
export class SkladisteSearchModalPage extends BasePage {

  @ViewChild('searchInput') searchBar;

  searchData:string = '';
  searchDataDataSet:any = [];
  selectedId:number = null;
  SearchString:string = '';
  trazilicaBrojZnakova:number = 2;
  allowShowingAllResults:boolean=false;
  timeoutUntilSearch:number=100;
  title:string;

  timeoutOn:boolean;

 
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: SkladistePrijemniListProvider,
    private viewCtrl : ViewController)
  {
    super();

    console.log('params = ')
    console.log(this.navParams.data)
    this.searchData = this.navParams.data[0];
    this.trazilicaBrojZnakova = this.navParams.data[1];
    this.allowShowingAllResults = this.navParams.data[2];
    this.timeoutUntilSearch = this.navParams.data[3];

    switch(this.searchData) { 
      case "partneri": { 
        this.title = 'Tražilica partnera';
        break; 
      } 
      case "orgshema": { 
        this.title = 'Tražilica org. sheme';
        break; 
      } 
      case "odgosoba": { 
        this.title = 'Tražilica osoba';
        break; 
      } 
      case "roba": { 
        this.title = 'Tražilica robe';
        break; 
      }
      case "skladiste": { 
        this.title = 'Tražilica skladišta';
        break; 
      }
      default:this.title = 'Tražilica';
      break;
    }

    console.log(this.title)
    this.showAllResults()
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if(this.searchBar)
        this.searchBar.setFocus();
    }, 150);
  }

  getPlaceholder() {
    return 'Traži...' + ' (min. ' + this.trazilicaBrojZnakova + ' ' + this.getPadez() + ')'
  }

  searchFn(event) {
    // timeoutOn - parametar proslijeđen u tražilicu, želim odgoditi pretragu kada ima puno rezultata, a traži se mali minimalni broj znakova
    // uključim ga na početku, i isključim kada je gotova pretraga, s time blokira neke međusearchove dok se ne utipka željeni search string
    if (!this.timeoutOn)  
    {
      this.timeoutOn = true;
      setTimeout(() => {
        console.log(event)
        if (event.target.value != null && event.target.value.length >= this.trazilicaBrojZnakova)
        {
          this.SearchString = event.target.value;
          this.doSearch(this.SearchString)
        }
        // else if (event.target.value.length < this.trazilicaBrojZnakova && this.allowShowingAllResults)
        // {
        //   this.searchDataDataSet = null;
        // }
    
        this.timeoutOn  = false;
      }, this.timeoutUntilSearch);
    }
  }

  doSearch(keyword:string) {
    if (this.searchData == 'partneri')
    {
      this.provider.getPartneri(keyword)
      .then((res) => {this.searchDataDataSet = res; /*console.log(res)*/})
    }
    else if (this.searchData == 'orgshema')
    {
      this.provider.getOrgShema(keyword)
      .then((res) => {this.searchDataDataSet = res; /*console.log(res)*/})
    }
    else if (this.searchData == 'odgosoba')
    {
      this.provider.getOdgOsobe(keyword)
      .then((res) => {this.searchDataDataSet = res; /*console.log(res)*/})
    }
    else if (this.searchData == 'roba')
    {
      this.provider.getRoba(keyword)
      .then((res) => {this.searchDataDataSet = res; /*console.log(res)*/})
    }
    else if (this.searchData == 'skladiste')
    {
      this.provider.getSkladistaPrava(keyword)
      .then((res) => {this.searchDataDataSet = res; /*console.log(res)*/})
    }
  }

  setResult(searchResult : any) {
    console.log(searchResult)
    this.viewCtrl.dismiss(searchResult);
  }


  showAllResults() {
    if (this.allowShowingAllResults)
    {
      if (this.searchData == 'partneri')
      {
        this.provider.getPartneri('%')
        .then((res) => {this.searchDataDataSet = res; console.log(res)})
      }
      else if (this.searchData == 'orgshema')
      {
        this.provider.getOrgShema('%')
        .then((res) => {this.searchDataDataSet = res; console.log(res)})
      }
      else if (this.searchData == 'odgosoba')
      {
        this.provider.getOdgOsobe('%')
        .then((res) => {this.searchDataDataSet = res; console.log(res)})
      }
      else if (this.searchData == 'roba')
      {
        this.provider.getRoba('%')
        .then((res) => {this.searchDataDataSet = res; console.log(res)})
      }
      else if (this.searchData == 'skladiste')
      {
        this.provider.getSkladistaPrava('%')
        .then((res) => {this.searchDataDataSet = res; console.log(res)})
      }
    }
  }

  getPadez() {
    var brojZnakovaString = this.trazilicaBrojZnakova.toString();
    if (parseInt(brojZnakovaString.slice(-1))==1)
      return 'znak'
    else if (parseInt(brojZnakovaString.slice(-1))>0 && parseInt(brojZnakovaString.slice(-1))<5)
      return 'znaka'
    else
      return 'znakova'
  }

  getIsSearchStringValidBorder(){
    if(this.SearchString.length < this.trazilicaBrojZnakova)
      return 'rgba(150,0,0, 0.3)'
    else
      return 'rgba(0,150,0, 0.3)'
  }

}
