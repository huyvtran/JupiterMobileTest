import { Component,ViewChild, ElementRef, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Keyboard } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { SkladistePrijemniListProvider } from '../../../../../providers/modules/skladiste/skladiste-prijemni-list-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';
import { NumberFormatPipe } from '../../../../../pipes/number-format.pipe';


@IonicPage()
@Component({
  selector: 'page-skladiste-prijemni-list-stavka-unos-izmjena',
  templateUrl: 'skladiste-prijemni-list-stavka-unos-izmjena.html',
  providers: [NumberFormatPipe] 
})

export class SkladistePrijemniListStavkaUnosIzmjenaPage extends BasePage {

  @ViewChild('kolicinaSelector') kolicinaEl;
  @ViewChild('kolicinaSelector', { read: ElementRef }) inputKolicinaEl: ElementRef;

  @ViewChild('JMRkolicinaSelector') JMRkolicinaEl;
  @ViewChild('JMRkolicinaSelector', { read: ElementRef }) inputJMRkolicinaEl: ElementRef;

  private inputRefKol;
  private inputRefKolPak;

  naslov:string = '';
  naslovVar:string = '';

  Roba:any = { "id":null, "naziv":null }; 
  kolicinaBrojDecimala:number;
  kolicinaJMRobaBrojDecimala:number;
  SifraRobe:string='';
  Kolicina : number = null;
  KolicinaJMRoba:number = null;
  Cijena : number;
  Napomena : string = '';
  JM:string = '';
  JMRoba:string = '';
  JMRobaFaktorMnozenja:number = 1;
  dokumentZakljucen:boolean = false;
  barcodeScanNovaStavka:boolean = false;
  napomenaFocused:boolean=false;

  showJMRobaInd:boolean;
  cijenaVidljivaInd:boolean = false;
  canLeave:boolean = false;
  initValues:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone, private provider: SkladistePrijemniListProvider, private keyboard: Keyboard,
    private modalCtrl: ModalController, private helpers:HelpersProvider, private alertCtrl: AlertController, private numberFormatPipe: NumberFormatPipe) {
      super();

      this.dokumentZakljucen = this.navParams.data[0]
      this.barcodeScanNovaStavka = this.navParams.data[1]
      
      if (this.dokumentZakljucen)
        this.naslov = "Pregled stavke"
      else
        this.naslov = this.provider.nabpridet.nabpridetid == undefined ? "Unos stavke" : "Izmjena stavke";

      if (this.barcodeScanNovaStavka)
      {
        this.setControlValues(this.provider.scanRoba)
        .then(()=> {
          this.helpers.presentToast('Unos robe: ' + this.Roba.naziv, null, 1500)
        })
      }
      else
      {
        if (this.naslov == "Izmjena stavke" || this.naslov == "Pregled stavke")
          {
            this.provider.getStavkaPrimke(this.provider.nabpridet.nabpridetid)
            .then ((res)=> {
              console.log(res)
              this.Roba = { "id":res[0].robaid, "naziv":res[0].robanaziv }; 
              this.SifraRobe = res[0].sifrarobe;
              
              this.Cijena = res[0].cijena;
              this.Napomena = res[0].napomena;

              this.provider.getSifraRobeiJM(this.Roba.id)
              .then((resSifraRobeiJM)=> {
                this.JM = '(' + resSifraRobeiJM[0].jm.toLowerCase() + ')'; 
                this.kolicinaBrojDecimala = resSifraRobeiJM[0].kolicinadecimals
                // console.log('kolicina decimale: ' + this.kolicinaBrojDecimala)
                this.Kolicina = parseFloat(res[0].kolicina.toFixed(this.kolicinaBrojDecimala))
              })
              this.showHideJMRoba(this.Roba.id)
              .then(()=> {
                setTimeout(() => {
                  if (this.showJMRobaInd) { 
                    this.KolicinaJMRoba = this.racunajJMRKolicinu(null, this.Kolicina.toFixed(this.kolicinaBrojDecimala))
                    // this.KolicinaJMRoba = parseFloat(res[0].kolicinajmroba.toFixed(this.kolicinaJMRobaBrojDecimala)) 
                  }
                }, 100);
              })
            })
          }
        else
          this.showJMRobaInd = false;
      }

      this.provider.getCijenaVidljivaInd()
      .then((res)=> { this.cijenaVidljivaInd = res[0].vidljivacijena; /*console.log(res[0].vidljivacijena)*/ })
  }

  ionViewDidEnter() {
    this.initValues = {
      "roba": {"id":this.Roba.id, "naziv": this.Roba.naziv },
      "kolicina" : this.Kolicina,
      "kolicinajmroba": this.KolicinaJMRoba,
      "napomena" : this.Napomena
    }

    setTimeout(() => {
      if (this.JMRkolicinaEl)
        this.JMRkolicinaEl.setFocus();
      else
        this.kolicinaEl.setFocus();
      }, 150);
  }

  userChangedValues() {
    if (this.Roba.id ==  this.initValues.roba.id && this.Kolicina == this.initValues.kolicina
      && this.KolicinaJMRoba == this.initValues.kolicinajmroba && this.Napomena == this.initValues.napomena)
      return false;
    else
      return true;
  }

  ionViewCanLeave() {
    return new Promise((resolve)=> {

      if (this.dokumentZakljucen || this.canLeave || !this.userChangedValues())
        {
          this.provider.refreshViewInd = this.userChangedValues() || this.barcodeScanNovaStavka;
          resolve(true);
          return;
        }
     
        let alert = this.alertCtrl.create({
            title: 'Upozorenje',
            message: 'Napuštate formu bez spremljenih izmjena.',
            buttons: [
                {
                    text: 'Spremi i napusti',
                    handler: () => {
                      this.InsertEditStavka()
                      .then((res)=> {
                        this.provider.refreshViewInd = true;
                        resolve(res)
                      })
                    }
                },
                {
                  text: 'Napusti bez spremanja',
                  handler: () => {
                    this.provider.refreshViewInd = false;
                    resolve(true)
                  }
              }
            ]
        });
        alert.present();
      })
  }

  presentSearchModal(searchType : string, trazilicaBrojZnakova:number, cijelaSearchListaOnInit:boolean, timeoutUntilSearch:number) {
    this.global.modal = this
    .modalCtrl
    .create("SkladisteSearchModalPage", [searchType, trazilicaBrojZnakova, cijelaSearchListaOnInit, timeoutUntilSearch] ,{enableBackdropDismiss: false});

    this.global.modal.present();


    this.global.modal.onDidDismiss((searchResult) => {
      if (searchResult == null || searchResult == undefined)
        return; 

      if (searchType=='roba')
        this.setControlValues(searchResult)

      this.global.modal = null;
    });
  }

  onFocusInput(inputName:string, e:Event) {
    if (inputName == 'kolicina')
    {
      this.inputRefKol = this.inputKolicinaEl.nativeElement.querySelector("input[name='inputKolicina']");
      this.inputRefKol.select();
    }
    else
    {
      this.inputRefKolPak = this.inputJMRkolicinaEl.nativeElement.querySelector("input[name='inputJMRkolicina']");
      this.inputRefKolPak.select();
    }
  }

  showHideJMRoba(robaid) {
    return new Promise((resolve)=> {
      this.provider.getJMRoba(robaid)
      .then((res)=> {
        if (res[0] != undefined && res[0].defaultind == 1)
          {
            this.JMRoba = (res[0].jmroba).toLowerCase();
            this.JMRobaFaktorMnozenja = res[0].faktor;
            this.kolicinaJMRobaBrojDecimala = res[0].kolicinajmrobadecimals
            // console.log('kolicina JMR decimale: ' + this.kolicinaJMRobaBrojDecimala)
            this.showJMRobaInd = true;
          }
          else
            this.showJMRobaInd = false;
      })
      resolve()
    })
  }

  getCijena() {
    this.provider.getCijena(this.Roba.id, this.provider.nabprigla.skladisteid)
    .then((res)=> { this.Cijena = res[0].cijena })
  }
  
  racunajKolicinu(e) {
    // console.log('racunam kolicinu')
    this.regexajValue(e.srcElement.value, this.kolicinaJMRobaBrojDecimala)// ograničavam input broj decimala (jer ionicov input to ne zna)
    .then((res)=> {e.srcElement.value = res})
    if (isNaN(this.Kolicina))
    {
      this.Kolicina=0
      return;
    }

    this.zone.run(() => {
      this.Kolicina =  parseFloat((e.srcElement.value * this.JMRobaFaktorMnozenja).toFixed(this.kolicinaBrojDecimala))
    });
  }

  racunajJMRKolicinu(e, jmValue = null) {
    if (e != null)  // null je samo kada pozivam ovo na initu izmjene stavke, kasnije e uvijek dolazi sa input eventa
    {
      this.regexajValue(e.srcElement.value, this.kolicinaBrojDecimala)  // ograničavam input broj decimala (jer ionicov input to ne zna)
      .then((res)=> {e.srcElement.value = res})
    }

    if (this.showJMRobaInd || jmValue != null) //ako postoji dodatna jedinica mjere, preračunaj
      {
        if (isNaN(this.KolicinaJMRoba))
        {
          this.KolicinaJMRoba=0
          return;
        }
        if (e != null)
          this.zone.run(() => {
            this.KolicinaJMRoba =  parseFloat((e.srcElement.value / this.JMRobaFaktorMnozenja).toFixed(this.kolicinaJMRobaBrojDecimala))
          });
        else
          this.zone.run(() => {
            this.KolicinaJMRoba =  parseFloat((jmValue / this.JMRobaFaktorMnozenja).toFixed(this.kolicinaJMRobaBrojDecimala))
          });
          
        return this.KolicinaJMRoba
      }
  }

  onLeaveDecimalCountFix(kontrola:string) {

    if (kontrola=='kolicina')
      {
        if (Number(this.Kolicina) == 0)
        {
          this.Kolicina=0
          return;
        }
        this.regexajValue(this.Kolicina, this.kolicinaBrojDecimala)
        .then((res)=> {this.Kolicina = parseFloat(res.toString()); /*console.log('kolicina: ' + this.Kolicina)*/})
      }
    else if(kontrola=='kolicinaJMRoba' && this.showJMRobaInd)
    {
      if (Number(this.KolicinaJMRoba) == 0)
      {
        this.KolicinaJMRoba=0
        return;
      }
      this.regexajValue(this.KolicinaJMRoba, this.kolicinaJMRobaBrojDecimala)
      .then((res)=> {this.KolicinaJMRoba = parseFloat(res.toString()); /*console.log('kolicinaJMR: ' + this.KolicinaJMRoba)*/})
    }

  }

  regexajValue(value, brojDecimala) {
    return new Promise((resolve)=> {
      var regexString = '/^[-?]*[0-9]*(?:\\.[0-9]{0,4})?$/'; 
      regexString = regexString.replace('{0,4}', '{0,' + brojDecimala + '}')
      regexString = regexString.substring(1, regexString.length-1)
      var regex = new RegExp(regexString)
      var t = value.toString().substring(0, value.length - 1);

      if (!regex.test(value)) 
        value = t;
      
      resolve(value);
    })
  }

  // regexajValue(value, brojDecimala) {
  //   return new Promise((resolve)=> {
  //     var elementValue = value;
  //     if(elementValue){
  //       var regexString = '/^[-?]*[0-9]*(?:\\.[0-9]{0,4})?$/'; 
  //       regexString = regexString.replace('{0,4}', '{0,' + brojDecimala + '}')
  //       regexString = regexString.substring(1, regexString.length-1)
  //       var regex = new RegExp(regexString)
  //       var t = elementValue.substring(0, elementValue.length - 1);
  //       if (!regex.test(elementValue)) {
  //         value = t;
  //       }
  //     }
  //     resolve(value);
  //   })
  // }

  InsertEditStavka (popPage:boolean = false) : Promise<boolean> {
    return new Promise((resolve)=> {
      if (this.Roba.id == null)
      {
        this.helpers.presentToast('Nije odabrana roba', null, 1000)
        resolve(false)
        return;
      }

      if (this.naslov == "Unos stavke")
      {
        if (this.barcodeScanNovaStavka) 
          this.provider.refreshViewInd = true
        
        this.provider.prijemniListStavkaInsert(
          // selectedStavka.nabnarglaid,
           this.provider.nabprigla.nabpriglaid, this.Roba.id, this.Kolicina = isNaN(this.Kolicina) ? 0 : this.Kolicina, 
           this.Napomena, this.KolicinaJMRoba = isNaN(this.KolicinaJMRoba) ? 0 : this.KolicinaJMRoba, null, false
          // this.provider.nabprigla.nabpriglaid, this.Roba.id, this.Kolicina, this.Napomena, this.KolicinaJMRoba
          )
        .then(()=> {
          this.canLeave = true
          this.ionViewCanLeave()
          .then((canLeave)=> { 
            if (canLeave)
              {
                this.helpers.presentToast('Uspješan unos stavke', null, 1500)
                if (popPage == true)
                  this.navCtrl.pop()
              }
          })
        })
      }
      else
        this.provider.prijemniListStavkaUpdate(this.provider.nabpridet.nabpridetid, this.Roba.id, this.Kolicina, this.Napomena, this.KolicinaJMRoba)
        .then(()=> {
          this.canLeave = true
          this.ionViewCanLeave()
          .then((canLeave)=> { 
            if (canLeave)
            {
              this.helpers.presentToast('Uspješna izmjena stavke', null, 1500)
              if (popPage == true)
                  this.navCtrl.pop()
            }
          })
        })
        resolve(true);
    })
  }

  clearValue(searchType, slide) {
    // console.log('clear value: ' + searchType)
    if (searchType=='roba')
      {
        this.Roba = {}
        this.SifraRobe = null;
        this.Kolicina = null;
        this.KolicinaJMRoba = null;
        this.Cijena = null;
        this.Napomena = '';
      }

    slide.close();
  }

  setControlValues(robaObj) {
    // this.Roba = searchResult;
    return new Promise((resolve)=> {
      // console.log(robaObj)
      // this.provider.getDecimalsCount(robaObj.id)
      // .then((res) => { this.Decimals = res[0].decimals; console.log(res[0].decimals) })

      this.Roba = robaObj
      this.Napomena = '';

      this.provider.getCijena(robaObj.id, this.provider.nabprigla.skladisteid)
      .then((res) => { this.Cijena = res[0].cijena })

      this.provider.getSifraRobeiJM(robaObj.id)
      .then((res)=> {
        this.JM = '(' + res[0].jm.toLowerCase() + ')'; 
        this.SifraRobe = res[0].sifrarobe
        this.kolicinaBrojDecimala = res[0].kolicinadecimals
        this.Kolicina = parseFloat(this.numberFormatPipe.transform(0, this.kolicinaBrojDecimala));
        // console.log('kolicina decimale: ' + this.kolicinaBrojDecimala)
      })

      this.showHideJMRoba(robaObj.id)
      .then(()=> {
        this.KolicinaJMRoba = parseFloat(this.numberFormatPipe.transform(0, this.kolicinaJMRobaBrojDecimala));
      })
      resolve()
    })
  }

  // decimalCheck (e) {
  //    var elementValue = e.srcElement.value;
  //     if(elementValue){
  //       var regex = /^[-+]?[0-9]*\.?[0-9]{0,4}$/;
  //        var tempValue = elementValue.substring(0, elementValue.length - 1);
  //        if (!regex.test(elementValue)) {
  //          e.srcElement.value = tempValue;
  //        }
  //     }
  //     // var regex = /^[0-9]*(?:\.[0-9]{0,4})?$/;  
  //     // return regex.exec(e.srcElement.value);

     
  //   }

}
