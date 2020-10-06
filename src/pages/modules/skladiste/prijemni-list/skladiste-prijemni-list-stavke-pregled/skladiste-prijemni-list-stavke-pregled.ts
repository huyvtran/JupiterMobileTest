import { Component, ChangeDetectorRef,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController} from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { SkladistePrijemniListProvider } from '../../../../../providers/modules/skladiste/skladiste-prijemni-list-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-skladiste-prijemni-list-stavke-pregled',
  templateUrl: 'skladiste-prijemni-list-stavke-pregled.html',
})
export class SkladistePrijemniListStavkePregledPage extends BasePage {

  subKeypress: Subscription;

  @ViewChild(Content) content: Content;

  originalStavkeList:any = [];
  stavkeList:any = [];
  primkaGlava:any = {};
  showNapomenaMemoInd:boolean = false;
  inifiniteScrollPomak:number = 10;
  listScrolledDown:boolean = false;
  scrollPosition:number = 0;
  infSc:any;
  showFooter:boolean = true;
  initNapomena:string = '';

  documentLocked:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: SkladistePrijemniListProvider,
    private cdr : ChangeDetectorRef, private alertCtrl: AlertController, private helpers:HelpersProvider) {
    super();
    
  }

  ngAfterViewInit() {
    
    // this.content.ionScrollStart.subscribe((ev)=>{
    //   if (ev.scrollTop == 0)
    //     this.listScrolledDown = false;
    //   else 
    //     this.listScrolledDown = true;
    // });
  }

  onScrollStart(ev) {
    try
    {
      if (ev != null && ev.scrollTop == 0)
        this.listScrolledDown = false;
      else 
        this.listScrolledDown = true;

      this.cdr.detectChanges();
      // if (this.listScrolledDown)
      //   this.scrollPosition = 
    }
    catch(ex) { }
  }

  // ngOnInit() {
  // }


  ionViewWillEnter() {
    this.provider.barcodeSearchString = '';

    this.subKeypress = Observable.fromEvent(document, 'keypress').subscribe(e => {
      
      console.log('subscribeam se na keypress Event')

      this.initBarcodeScanListener(e);
      
    })


    this.provider.getDokOperaterLock(this.provider.nabprigla.nabpriglaid)
    .then((res)=> {
      console.log(res[0].operaterlock)
      if (res[0].operaterlock == 0)
        this.documentLocked = false
      else
      {
        this.documentLocked = true;
        this.helpers.presentToast('Dokument je zaključan od strane drugog operatera.');
      }
      console.log('documentLocked = ' + this.documentLocked)
    })
    .then(()=> {
      this.provider.lockUnlockDocument(this.provider.nabprigla.nabpriglaid,'lock')
    })
    
    // maknuo if uvjet da gleda indikator refresh ind iz providera, sada uvijek refresha;
      console.log('refresham view')
      setTimeout(() => {
        this.updateStavkeView()
        .then(()=> {this.provider.refreshViewInd = false;})
      }, 150);
    
  }

  // ionViewDidEnter() {
  //   this.provider.getStavkePrimke(this.provider.nabprigla.nabpriglaid)
  //   .then((res) => {console.log(res) })
  // }
 
  ionViewWillLeave() {
    this.provider.lockUnlockDocument(this.provider.nabprigla.nabpriglaid,'unlock')

    console.log('un-subscribeam se sa keypress Eventa')
    this.subKeypress.unsubscribe();
  }

  doRefresh(refresher) {
    this.updateStavkeView();
    
    refresher.complete();
  }

  changeContent(contentType:string) {
    if (contentType=='stavke')
      this.showNapomenaMemoInd = false;
    else
    this.showNapomenaMemoInd = true;
  }

  presentStavkaUnosIzmjenaPage(nabpridetid:number, barcodeScan:boolean = false) {
    if (this.primkaGlava.statusid!=0 || this.documentLocked)
      return;

    this.provider.nabpridet.nabpridetid = nabpridetid == undefined ? null : nabpridetid;
    var dokumentZakljucen = false

    if (nabpridetid != undefined && (this.primkaGlava.statusid == 1 || this.primkaGlava.statusid == 2))
      dokumentZakljucen = true

    this.navCtrl.push("SkladistePrijemniListStavkaUnosIzmjenaPage", [dokumentZakljucen, barcodeScan]);
  }

  presentPrimkaEditPage() {
    this.navCtrl.push('SkladisteIzmjenaDokumentaPage', ['prijemniList']);
  }

  presentStavkaDonosPage() {
    this.navCtrl.push('SkladistePrijemniListStavkaDonosPage');
  }

  prijemniListStavkaDelete(nabpridetid:number) {
    let alert = this.alertCtrl.create({
      title: 'Brisanje stavke',
      message: 'Potvrdite brisanje stavke',
      buttons: [
        {
          text: 'Odustani',
          handler: () => {}
        },
        {
          text: 'Obriši',
          handler: () => {
            this.provider.prijemniListStavkaDelete(nabpridetid)
            .then(() => {
              this.provider.getStavkePrimke(this.primkaGlava.nabpriglaid)
                .then((res) => { this.updateStavkeView() })
            })
            this.helpers.presentToast('Stavka uspješno obrisana', null, 2000)
          }
        }
      ]
    });
    alert.present();
    
    
  }

  saveNapomena() {
    this.provider.saveNapomena(this.primkaGlava.nabpriglaid, this.primkaGlava.napomena)
    .then(()=> { 
      this.showNapomenaMemoInd = false;
      this.helpers.presentToast('Napomena uspješno spremljena', null, 1000) 
    })
    .then(()=> { this.cdr.detectChanges(); })
  }

  getDynamicLoadingText() {
    var trenutniBroj = this.stavkeList.length + this.inifiniteScrollPomak > this.originalStavkeList.length ? this.originalStavkeList.length : this.stavkeList.length + this.inifiniteScrollPomak
    return "Učitavam još rezultata... <br>" + trenutniBroj + "/" + this.originalStavkeList.length
    
  }

  doInfinite(infiniteScroll) {
    this.infSc = infiniteScroll;
    // console.log(this.stavkeList.length)
    // console.log(this.originalStavkeList.length)
    if (this.stavkeList.length >= this.originalStavkeList.length)
    {
      infiniteScroll.enable(false);
      return;
    }
    setTimeout(() => {
      this.updateInfiniteScrollVIew(this.stavkeList, this.originalStavkeList)
      .then(()=> { infiniteScroll.complete() })
    }, 200);
  }

  forceDoInfinite() {
    // console.log(this.stavkeList.length >= this.originalStavkeList.length)
    if (this.stavkeList.length >= this.originalStavkeList.length)
      return;

      setTimeout(() => {
      this.updateInfiniteScrollVIew(this.stavkeList, this.originalStavkeList)
      .then(()=> {this.cdr.detectChanges()})
    }, 200);
    
  }

  updateInfiniteScrollVIew(stavkeList:any, originalStavkeList:any) {
    return new Promise((resolve)=> {
      // console.log(this.stavkeList.length)
      // console.log(this.originalStavkeList.length)
      for (let i = 0; i < this.inifiniteScrollPomak; i++) {
          
      if (stavkeList.length == originalStavkeList.length)
        break;
        
        stavkeList.push(originalStavkeList[stavkeList.length]);
      }
       console.log(this.stavkeList)
      resolve();
    })
  }

  updateStavkeView() {
    return new Promise((resolve)=> {
      this.stavkeList = [];

      this.provider.getPrimka(this.provider.nabprigla.nabpriglaid)
      .then((res)=> { this.primkaGlava = res[0];})

      this.provider.getStavkePrimke(this.provider.nabprigla.nabpriglaid)
      .then((res) => { this.originalStavkeList = res; console.log(res) })
      .then(() => {this.updateInfiniteScrollVIew(this.stavkeList, this.originalStavkeList);})

      resolve();
    })
  }

  scrollToTopOfList(duration:number) {
    this.content.scrollToTop(duration)
    if (this.infSc != undefined)
      this.infSc.enable(false);
  }

  presentZakljuciAlert() {
    let alert = this.alertCtrl.create({
      title: 'Zaključak dokumenta',
      message: 'Potvrdite zaključak dokumenta',
      buttons: [
          {
            text: 'Odustani',
            handler: () => {}
          },
          {
            text: 'Zaključi',
            handler: () => {
              this.provider.prijemniListZakljuci(this.provider.nabprigla.nabpriglaid)
              .then(()=> { 
                this.helpers.presentToast('Dokument zaključen', '', 1500)
                this.navCtrl.pop()
              })
            }
        }
      ]
    });
    alert.present();
  }

  hideFooter() {
    if (this.infSc != undefined)
      this.infSc.enable(false);
    
    this.initNapomena = this.primkaGlava.napomena;
    this.showFooter = false;
    this.cdr.detectChanges();
  }

  showFooterOnLeave() {
    console.log(this.initNapomena)
    console.log(this.primkaGlava.napomena)
    if (this.initNapomena != this.primkaGlava.napomena)
      this.saveNapomena()
    
    this.showFooter = true;
    this.cdr.detectChanges();
  }

  unlockDoc(){
    this.provider.lockUnlockDocument(this.primkaGlava.nabpriglaid, 'unlock')
  }

  initBarcodeScanListener(e) {

    this.wasEnterPressed(e).then( res => {

          if (!res.wasEnterPressed)
          {
            console.log('wasEnterPressed: false');
            this.provider.barcodeSearchString = this.provider.barcodeSearchString + e.key;
            console.log(this.provider.barcodeSearchString);
          }
          else
          {
            console.log('wasEnterPressed: true');

            this.wasRobaFound(this.originalStavkeList, this.provider.barcodeSearchString).then(res => {

              console.log(res)

              if (res.found) {

                console.log('našao robu u listi dokumenata. nabpridetid: ' + res.nabpridetid + ', nazivrobe: ' + res.nazivrobe)
                this.presentStavkaUnosIzmjenaPage(res.nabpridetid);
                this.helpers.presentToast('Stavka je već pridružena dokumentu. Izmjena: ' + res.nazivrobe, null, 1500)
                this.provider.barcodeSearchString = '';
              }
              else {
                  this.provider.getScanRoba(this.provider.barcodeSearchString).then((res)=> {
                    
                    if (res.length > 0)
                    {
                      console.log('nisam našao robu u listi dokumenata ali postoji u bazi, otvaram insert page za robu:')
                      this.provider.scanRoba = res[0];
                      this.presentStavkaUnosIzmjenaPage(null, true);
                      this.provider.barcodeSearchString = '';
                    }
                    else 
                      {
                        this.helpers.presentToast('Očitani barkod nije pronađen.', null, 1000)
                        this.provider.barcodeSearchString = '';
                      }
                  })
              }
            })
          }
        }).catch((error)=>{ console.log(error)});
  }

  wasRobaFound(list:any[], searchString: string): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {

      let found:boolean = false;
      let nabpridetid: number = null;
      let nazivrobe: string = null;

      let matchingStavke = list.find(x => x.barcode == searchString);

      console.log(matchingStavke)

      if (matchingStavke != undefined){
        found = true;
        nabpridetid = matchingStavke.nabpridetid;
        nazivrobe = matchingStavke.nazivrobe;
      }
      
      if (!found)
        resolve({ found: false });
      else
        resolve({ found: true, nabpridetid: nabpridetid, nazivrobe: nazivrobe });

    })
  }

  wasEnterPressed(e:any): Promise<any>
  {
    return new Promise((resolve, reject) => {

      if (e.keyCode != 13 && e.keyCode != 9)
        resolve({wasEnterPressed: false});
      else
        resolve({wasEnterPressed: true});
    });
  
  }

  // scrollTo(element:string) {
  //   let yOffset = document.getElementById(element).offsetTop;
  //   this.content.scrollTo(0, yOffset, 4000)
  // }
}

