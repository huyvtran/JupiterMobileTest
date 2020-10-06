import { Injectable } from '@angular/core';
import { AlertController, DateTime } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import * as IPrint from '../../../interfaces/terpro/IPrint';
import * as INarudzba from '../../../interfaces/terpro/INarudzba';
import { TerproNarudzbaProvider } from '../../../providers/modules/terpro/terpro-narudzba-provider';
import * as Moment from 'moment';

@Injectable()
export class NativePrintProvider {

  printTypes = { Otpremnica: 0, RacunOtpremnica: 1, MP_Racun: 2, MP_Kupac: 3, Statistika: 4 }
  selectedPrinter: any;
  isConnected: boolean = false;


  ones = ['', 'jedan', 'dvije', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet'];
  tens = ['', '', 'dvadeset', 'trideset', 'četrdeset', 'pedeset', 'šezdeset', 'sedamdeset', 'osamdeset', 'devedeset'];
  teens = ['deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest'];
  stotice = ['', 'sto', 'dvjesto', 'tristo', 'četristo', 'petsto', 'šesto', 'sedamsto', 'osamsto', 'devetsto']


  paperWidth: number = 69
  headerDef = [

    { nazivKolone: "Naziv", leftpadding: 0, red: 1 },
    { nazivKolone: "Kolicina", leftpadding: 20, red: 1 },
    { nazivKolone: "JM", leftpadding: 8, red: 1 },
    { nazivKolone: "PDV", leftpadding: 10, red: 1 },
    { nazivKolone: "Cijena", leftpadding: 7, red: 1 },
    { nazivKolone: "Sifra", leftpadding: 0, red: 2 },
    { nazivKolone: "Popust", leftpadding: 45, red: 2 },
    { nazivKolone: "Ukupno", leftpadding: 7, red: 2 },
  ]




  listaStavki: any

  constructor(private btSerial: BluetoothSerial,
    private alertCtrl: AlertController,
    private narudzbaService: TerproNarudzbaProvider) {

  }

  searchBt() {
    return this.btSerial.list();
  }

  connectBT(address) {
    return this.btSerial.connect(address);

  }

  disconnectBT() {
    return this.btSerial.disconnect();
  }

  discoveBTUnpaired() {
    return this.btSerial.discoverUnpaired();
  }

  cleartBTDataBuffer() {
    return this.btSerial.clear();
  }

  showBTSettings() {
    return this.btSerial.showBluetoothSettings();
  }

  testPrint(address) {

    let xyz = this.connectBT(address).subscribe(data => {

      this.btSerial.write(this.clearBuffer())
      this.btSerial.write(this.setCodePage()) // postavi kodnu stranicu na 1250
      this.btSerial.write(this.centerText('tedt' + '\n'))

      this.btSerial.write(this.centerText('šššššššššššŠŠŠŠŠŠŠŠŠ' + '\n'))
      this.btSerial.write(this.centerText('đđđđđđđđđĐĐĐĐĐĐĐĐĐĐĐ' + '\n'))
      this.btSerial.write(this.centerText('žžžžžžžžžžŽŽŽŽŽŽŽŽŽŽ' + '\n'))
      this.btSerial.write(this.centerText(' @ ! ` [ { | ] } ^  ~ '))

      this.btSerial.write(this.centerText('šššššššššššŠŠŠŠŠŠŠŠŠ' + '\n'))
      this.btSerial.write(this.centerText('đđđđđđđđđĐĐĐĐĐĐĐĐĐĐĐ' + '\n'))
      this.btSerial.write(this.centerText('žžžžžžžžžžŽŽŽŽŽŽŽŽŽŽ' + '\n'))
      this.btSerial.write(this.centerText(' @ ! ` [ { | ] } ^  ~ '))
      this.btSerial.write(this.centerText('tedt' + '\n'))




    }, err => {
      console.log("CONNECTION ERROR", err);
      let mno = this.alertCtrl.create({
        title: "ERROR " + err,
        buttons: ['Dismiss']
      });
      mno.present();
    });

  }


  Print(address, report: string, pronarudzbeglaid) {
    console.log(address)
    // let xyz = this.connectBT(address).subscribe(data => {
    //this.isConnected = true;
    this.btSerial.write(this.clearBuffer())
    this.btSerial.write(this.setCodePage()) // postavi kodnu stranicu na 1250
    this.btSerial.write(report).then((res) => {
      //update broj ispisa 
      console.log("ispis")
      if (pronarudzbeglaid)
        return this.narudzbaService.updateNarudzbaBrojIspisa(pronarudzbeglaid)
      else
        return true

    })
      .then((res) => {
        this.narudzbaService.getNarudzba(this.narudzbaService.pronarudzbeglaid)
      })

    // }, err => {
    //   this.isConnected = false;
    //   console.log("CONNECTION ERROR", err);
    //   let mno = this.alertCtrl.create({
    //     title: "ERROR " + err,
    //     buttons: ['Dismiss']
    //   });
    //   mno.present();
    // });

  }


  clearBuffer() {
    var arr = []

    arr.push('0x01B', '0x40')
    var buffer = new Uint8Array(arr).buffer
    return buffer
  }

  centerText(message: string) {

    var str = '';
    var cnt = (69 - message.length) / 2;

    if (message.length <= 69) {

      var leftPadding = '';

      for (var i = 0; i < cnt; i++) {
        leftPadding += ' ';
      }
      str = leftPadding.concat(message);

    } else {

      str = message.substr(0, 69)

    }

    //console.log(str);
    return str
  }

  rightAlign(message: string) {

    var str: string = ''

    return ' '.repeat((this.paperWidth - message.length)) + str
  }

  bold(activated: string) {

    var arr = []

    if (activated == 'true') {

      arr.push('0x1B', '0x45', '0x01') //bold uključen

    } else {

      arr.push('0x1B', '0x45', '0x00') //bold isključen

    }

    var buffer = new Uint8Array(arr).buffer

    return buffer
  }

  setCodePage() {

    var arr = []

    arr.push('0x1B', '0x74', '18') // Latin 2
    var buffer = new Uint8Array(arr).buffer
    return buffer

  }

  createHeader(headerDef: any) {

    let row1: string = '-'.repeat(this.paperWidth) + '\n'
    let row2: string = '\n'

    this.headerDef.forEach(element => {

      if (element.red == 1) {
        row1 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)
      } else {
        row2 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)

      }

    });

    return row1 + row2 + '\n' + '-'.repeat(this.paperWidth) + '\n'

  }


  createBody(headerDef: any, listaStavki: Array<IPrint.NarudzbaStavka>) {

    let str: string = ''

    listaStavki.forEach(stavka => {

      str += this.replaceSPecialChars(stavka.naziv)
      str += this.padLeft(this.roundNumber3DecimalPlaces(stavka.kolicina), ' ', headerDef[1].leftpadding - (stavka.naziv.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      str += this.padLeft(stavka.jm, ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.stopa), ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.cijena), ' ', headerDef[4].leftpadding + headerDef[4].nazivKolone.length)
      str += '\n'
      str += stavka.sifra
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.rabat), ' ', headerDef[6].leftpadding - (stavka.sifra.length - headerDef[5].nazivKolone.length) + headerDef[6].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos_neto), ' ', headerDef[7].leftpadding + headerDef[7].nazivKolone.length)
      str += '\n'

    });

    str += '-'.repeat(this.paperWidth)

    return str
  }

  roundNumber2DecimalPlaces(number: number): string {
    return number.toFixed(2);
  }

  roundNumber3DecimalPlaces(number: number): string {
    //console.log(number.toFixed(2))
    return number.toFixed(3);
  }


  replaceSPecialChars(naziv: string): string {
    var s = new RegExp("š", "g");
    var S = new RegExp("Š", "g");
    var z = new RegExp("ž", "g");
    var Z = new RegExp("Ž", "g");
    var c = new RegExp("č", "g");
    var C = new RegExp("Č", "g");
    var cc = new RegExp("ć", "g");
    var CC = new RegExp("Ć", "g");
    var dz = new RegExp("DŽ", "g");
    var DZ = new RegExp("dž", "g");
    var d = new RegExp("đ", "g");
    var D = new RegExp("Đ", "g");

    if (naziv)
      naziv = naziv.replace(S, 'S').replace(s, 's').replace(Z, 'Z').replace(z, 'z').replace(C, 'C').replace(c, 'c').replace(CC, 'C').replace(cc, 'c').replace(DZ, 'Dz').replace(dz, 'dz').replace(D, 'D').replace(d, 'd')
    //console.log(naziv)
    return naziv;
  }

  padLeft(text: string, padChar: string, size: number): string {

    if (size > 0) {

      return (String(padChar).repeat(size) + text).substr((size * -1), size);
    }
    else {

      return text
    }
  }


  setFontSizeDouble() {
    var arr = []

    arr.push('0x1d', '0x21', '0x30')
    var buffer = new Uint8Array(arr).buffer
    return buffer
  }

  LF() {
    var arr = []

    arr.push('0x0a')
    var buffer = new Uint8Array(arr).buffer
    return buffer

  }

  isConnectedBT(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.btSerial.isConnected()
        .then((val) => {
          //console.log("connected")
          //console.log(val)
          this.isConnected = true;
          resolve(val);
        }, (error) => {
          //console.log(error)
          this.isConnected = false;
          resolve(false)
        });
    });
  }

  isEnabledBT(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.btSerial.isEnabled()
        .then((val) => {
          console.log("enabled")
          console.log(val)
          resolve(val);
        }, (error) => {
          console.log(error)
          return this.btSerial.enable();
        });
    });
    //return this.btSerial.isEnabled();
  }


  /****** print type statistika begin ******/


  //header statistike reporta
  createHeaderStatistika(userData: any) {

    let datum = Moment(new Date()).format("DD.MM.YYYY HH:mm");

    let str: string = ''

    str += this.replaceSPecialChars('{right}' + userData.vozac) + '\n'
    str += this.replaceSPecialChars(userData.terminal) + '\n'
    str += this.replaceSPecialChars(datum) + '\n'
    str += '-'.repeat(this.paperWidth) + '\n'
    str += '\n'

    return str;
  }

  //header prve tablice stanja
  createHeaderStatistikaTableStanja(headerDef: any) {

    let row1: string = "{left}"
    let row2: string = '\n'

    headerDef.forEach(element => {

      if (element.red == 1) {
        row1 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)
      } else {
        row2 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)

      }

    });

    return row1 + row2 + '\n' + '-'.repeat(this.paperWidth) + '\n'

  }

  //body prve tablice stanja
  createBodyStatistikaTableStanja(headerDef: any, listaStavki: Array<IPrint.StatistikaStanje>) {
    //console.log(listaStavki)
    let str: string = ''

    listaStavki.forEach(stavka => {

      str += this.replaceSPecialChars(stavka.naziv)
      str += this.padLeft(stavka.ulaz.toString(), ' ', headerDef[1].leftpadding - (stavka.naziv.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      str += this.padLeft(stavka.svi.toString(), ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += this.padLeft(stavka.zakljuceni.toString(), ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += this.padLeft(stavka.raspolozivo.toString(), ' ', headerDef[4].leftpadding + headerDef[4].nazivKolone.length)
      str += '\n'
      str += stavka.sifra
      str += '\n'
    })

    str += '-'.repeat(this.paperWidth)

    return str
  }


  //header statistike

  //header prve tablice stanja
  createHeaderStatistikaTable(headerDef: any) {

    let row1: string = ""
    let row2: string = '\n'

    headerDef.forEach(element => {

      if (element.red == 1) {
        row1 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)
      } else {
        row2 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)

      }

    });

    return row1 + row2 + '\n' + '-'.repeat(this.paperWidth) + '\n'

  }


  createBodyStatistikaTable(headerDef: any, listaStavki: Array<INarudzba.Narudzba>, vrstadok) {
    console.log(listaStavki)
    let str: string = ''
    let ukupno: number = 0;

    listaStavki.forEach(stavka => {
      ukupno += stavka.iznos_ukupno;
      str += this.replaceSPecialChars(stavka.partner)
      str += this.padLeft(stavka.lokacija, ' ', headerDef[1].leftpadding - (stavka.partner.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos_ukupno), ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += '\n'
      str += this.padLeft(stavka.vrstadokoznaka, ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += this.padLeft(this.replaceSPecialChars(stavka.vrstadokumenta), ' ', headerDef[4].leftpadding + headerDef[4].nazivKolone.length)
      str += this.padLeft(stavka.broj, ' ', headerDef[5].leftpadding + headerDef[5].nazivKolone.length)
      str += '\n'
    })

    str += '-'.repeat(this.paperWidth)
    str += '\n'

    if (vrstadok != "VP") {
      str += '{b}' + this.padLeft('UKUPNO:', ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length + headerDef[4].leftpadding + headerDef[4].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(ukupno), ' ', headerDef[5].leftpadding + headerDef[5].nazivKolone.length) + '{/b}'
      str += '\n'
    }

    return str
  }

  /****** print type statistika end ******/



  /* MP račun  start*/
  createHeaderMPRacun(racun: IPrint.Narudzba, printType: number) {
    //console.log(printType)

    let datum = Moment(racun.datumdok).format("DD.MM.YYYY");
    let datumzaprimanja = Moment(racun.datum_zaprimanja).format("DD.MM.YYYY HH:mm:ss");

    let str: string = ''

    str += 'Datum dok: ' + datum + '\n'
    str += 'Adresa: ' + 'Djelatnost trgovine putem pokretne prodaje' + '\n'
    str += 'Datum isporuke: ' + datum + '\n'
    str += 'Datum izdavanja racuna: ' + datumzaprimanja + '\n'
    str += '-'.repeat(this.paperWidth) + '\n'


    if (printType == this.printTypes.MP_Kupac) {
      str += '{b}KUPAC:{/b} ' + '\n'
      str += this.replaceSPecialChars(racun.partner) + '\n'
      str += this.replaceSPecialChars(racun.partner_adresa) + '\n'
      str += this.replaceSPecialChars(racun.partner_mjesto) + '\n'
      str += 'OIB kupca: ' + racun.oib + '\n'
      str += 'Dostavno mjesto: ' + this.replaceSPecialChars(racun.lokacija) + ' ' + this.replaceSPecialChars(racun.adresa) + ' ' + this.replaceSPecialChars(racun.mjesto) + '\n'
    }

    str += '\n'
    str += '{b}' + this.replaceSPecialChars(racun.vrstadok) + ': ' + racun.fiskalnibroj + (printType === this.printTypes.MP_Kupac ? ' R-1' : '') + '{/b}' + '\n'
    str += '\n'


    return str;
  }


  createHeaderTable(headerDef: any) {

    let row1: string = ""
    let row2: string = '\n'

    headerDef.forEach(element => {

      if (element.red == 1) {
        row1 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)
      } else {
        row2 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)

      }

    });

    return row1 + row2 + '\n' + '-'.repeat(this.paperWidth) + '\n'

  }


  createBodyMPRacunTable(headerDef: any, listaStavki: Array<IPrint.NarudzbaStavka>) {
    //console.log(listaStavki)
    let str: string = ''

    listaStavki.forEach(stavka => {

      str += this.replaceSPecialChars(stavka.naziv)
      str += this.padLeft(this.roundNumber3DecimalPlaces(stavka.kolicina), ' ', headerDef[1].leftpadding - (stavka.naziv.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      str += this.padLeft(stavka.jm, ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.stopa), ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.cijena), ' ', headerDef[4].leftpadding + headerDef[4].nazivKolone.length)
      str += '\n'
      str += stavka.sifra
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.rabat), ' ', headerDef[6].leftpadding - (stavka.sifra.length - headerDef[5].nazivKolone.length) + headerDef[6].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos_osnovica), ' ', headerDef[7].leftpadding + headerDef[7].nazivKolone.length)
      str += '\n'

    });

    str += '-'.repeat(this.paperWidth)

    return str
  }


  createBodyMPRacunAmbalazaTable(headerDef: any, listaStavki: Array<any>) {

    //console.log(listaStavki)
    let str: string = ''

    listaStavki.forEach(stavka => {
      console.log(stavka)
      str += this.replaceSPecialChars(stavka.sifra)
      str += this.padLeft(this.replaceSPecialChars(stavka.naziv), ' ', headerDef[1].leftpadding - (stavka.sifra.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.mpc), ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos), ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += '\n'
      str += this.padLeft(stavka.vraceno, ' ', headerDef[4].leftpadding + headerDef[4].nazivKolone.length)
      str += this.padLeft(stavka.izdano, ' ', headerDef[5].leftpadding + headerDef[5].nazivKolone.length)
      str += this.padLeft(stavka.razlika, ' ', headerDef[6].leftpadding + headerDef[6].nazivKolone.length)
      str += '\n'

    });

    str += '-'.repeat(this.paperWidth)

    return str
  }

  createBodyVPRacunAmbalazaTable(headerDef: any, listaStavki: Array<any>) {

    //console.log(listaStavki)
    let str: string = ''

    listaStavki.forEach(stavka => {
      console.log(stavka)
      str += this.replaceSPecialChars(stavka.sifra)
      str += this.padLeft(this.replaceSPecialChars(stavka.naziv), ' ', headerDef[1].leftpadding - (stavka.sifra.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      // str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.mpc), ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      // str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos), ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += '\n'
      str += this.padLeft(stavka.vraceno, ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += this.padLeft(stavka.izdano, ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += this.padLeft(stavka.razlika, ' ', headerDef[4].leftpadding + headerDef[4].nazivKolone.length)
      str += '\n'

    });

    str += '-'.repeat(this.paperWidth)

    return str
  }




  createHeaderRekapitulacijaMPRacunTable(headerDef: any) {

    let row1: string = ''
    let row2: string = ''

    headerDef.forEach(element => {

      if (element.red == 1) {
        row1 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)
      } else {
        row2 += this.padLeft(element.nazivKolone, ' ', element.leftpadding + element.nazivKolone.length)

      }

    });

    return row1 + row2 + '\n' + this.padLeft('-'.repeat(55), ' ', this.paperWidth) + '\n'


  }




  createBodyRekapitulacijaMPRacunPorezTable(headerDef: any, listaStavki: any) {

    //console.log(listaStavki)
    let str: string = ''

    listaStavki.forEach(stavka => {
      str += this.padLeft(stavka.stopa_naziv, ' ', headerDef[0].leftpadding + headerDef[0].nazivKolone.length - 2)
      str += this.padLeft(stavka.stopa, ' ', headerDef[1].leftpadding - (stavka.stopa_naziv.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.osnovica_porez), ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos_porez), ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += '\n'
    });
    str += this.padLeft('-'.repeat(55), ' ', this.paperWidth) + '\n'
    str += '{b}' + this.padLeft('UKUPNO: ' + this.roundNumber2DecimalPlaces(listaStavki.ukupno), ' ', this.paperWidth - 6) + '{/b}' + '\n'
    str += this.padLeft('-'.repeat(55), ' ', this.paperWidth)

    str += '\n'.repeat(3)
    str += 'Placeno novcanicama.' + '\n'
    str += 'Slovima: ' + this.replaceSPecialChars(this.convertNumberToWords(Number(listaStavki.ukupno.toFixed(2))))

    return str
  }


  createBodyRekapitulacijaVPRacunOtpremnicaPorezTable(headerDef: any, listaStavki: any) {

 
    let str: string = ''

    listaStavki.forEach(stavka => {
      str += this.padLeft(stavka.stopa_naziv, ' ', headerDef[0].leftpadding + headerDef[0].nazivKolone.length)
      str += this.padLeft(stavka.stopa, ' ', headerDef[1].leftpadding + headerDef[1].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos_osnovica), ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos_porez), ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += '\n'
    });
    str += this.padLeft('-'.repeat(55), ' ', this.paperWidth) + '\n'
    str += '{b}' + this.padLeft('UKUPNO: ' + this.roundNumber2DecimalPlaces(listaStavki.ukupno), ' ', this.paperWidth - 6) + '{/b}' + '\n'
    str += this.padLeft('-'.repeat(55), ' ', this.paperWidth)

    str += '\n'.repeat(3)

    str += 'Slovima: ' + this.replaceSPecialChars(this.convertNumberToWords(Number(listaStavki.ukupno.toFixed(2))))

    return str
  }


  createZKIandJIR(racun: IPrint.Narudzba) {

    //console.log(listaStavki)
    let str: string = '\n'

    str += 'ZKI: ' + racun.kod + '\n'
    str += 'JIR: ' + racun.jir + '\n'
    return str
  }
  /* MP račun end  */


  /* VP otpremnica  start*/
  createHeaderVPOtpremnica(racun: IPrint.Narudzba, printType: number) {
    //console.log(printType)

    let datum = Moment(racun.datumdok).local().format("DD.MM.YYYY");
    let datumzaprimanja = Moment(racun.datum_zaprimanja).format("DD.MM.YYYY HH:mm:ss");
    let datumvalute = Moment(racun.datumdok).add(racun.odgoda, 'days').format("DD.MM.YYYY");

    let str: string = ''

    str += 'Mjesto i datum dok: ' + 'OSIJEK, ' + datum + '\n'
    str += 'Model placanja: ' + '00 ' + racun.fiskalnibroj + '\n'
    str += 'Datum isporuke: ' + datum + '\n'
    str += 'Datum izdavanja racuna: ' + datumzaprimanja + '\n'
    str += 'Datum valute: ' + datumvalute + '\n'

    str += '-'.repeat(this.paperWidth) + '\n'

    str += '{b}KUPAC:{/b}' + '\n'
    str += this.replaceSPecialChars(racun.partner) + '\n'
    str += this.replaceSPecialChars(racun.partner_adresa) + '\n'
    str += this.replaceSPecialChars(racun.partner_mjesto) + '\n'
    str += 'OIB kupca: ' + racun.oib + '\n'
    str += 'Dostavno mjesto: ' + this.replaceSPecialChars(racun.lokacija) + ' ' + this.replaceSPecialChars(racun.adresa) + ' ' + this.replaceSPecialChars(racun.mjesto) + '\n'
    str += '-'.repeat(this.paperWidth) + '\n'
    str += '\n'

    if (printType == this.printTypes.RacunOtpremnica) {
      str += '{b}' + "Racun: " + racun.fiskalnibroj + ' R-1' + '{/b}' + '\n'
    }
    str += '{b}' + this.replaceSPecialChars(racun.vrstadok) + ': ' + racun.broj + '{/b}' + '\n'
    str += '\n'


    return str;
  }



  createBodyVPOtpremnicaTable(headerDef: any, listaStavki: Array<IPrint.NarudzbaStavka>) {
    //console.log(listaStavki)
    let str: string = ''

    listaStavki.forEach(stavka => {

      str += stavka.sifra
      str += this.padLeft(this.replaceSPecialChars(stavka.naziv), ' ', headerDef[1].leftpadding - (stavka.sifra.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.kolicina), ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += this.padLeft(stavka.jm, ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += '\n'

    });

    str += '-'.repeat(this.paperWidth)

    return str
  }


  createBodyVPRacunOtpremnicaTable(headerDef: any, listaStavki: Array<IPrint.NarudzbaStavka>) {
    //console.log(listaStavki)
    let str: string = ''

    listaStavki.forEach(stavka => {

      str += ' ' + stavka.sifra
      str += this.padLeft(this.replaceSPecialChars(stavka.naziv), ' ', headerDef[1].leftpadding - (stavka.sifra.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.kolicina), ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += this.padLeft(stavka.jm, ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += '\n'
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.cijena), ' ', headerDef[4].leftpadding + headerDef[4].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.nak_trosarina), ' ', headerDef[5].leftpadding + headerDef[5].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.nak_zbrinjavanje), ' ', headerDef[6].leftpadding + headerDef[6].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.rabat), ' ', headerDef[7].leftpadding + headerDef[7].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos_osnovica), ' ', headerDef[8].leftpadding + headerDef[8].nazivKolone.length)
      str += '\n'

    });

    str += '-'.repeat(this.paperWidth)

    return str
  }

  createBodyVPOtpremnicaPovratnaTable(headerDef: any, listaStavki: Array<IPrint.NarudzbaStavka>) {
    //console.log(listaStavki)
    let str: string = ''

    listaStavki.forEach(stavka => {

      str += this.replaceSPecialChars(stavka.sifra)
      str += this.padLeft(this.replaceSPecialChars(stavka.naziv), ' ', headerDef[1].leftpadding - (stavka.sifra.length - headerDef[0].nazivKolone.length) + headerDef[1].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.cijena), ' ', headerDef[2].leftpadding + headerDef[2].nazivKolone.length)
      str += '\n'
      str += this.padLeft(stavka.jm, ' ', headerDef[3].leftpadding + headerDef[3].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.kolicina), ' ', headerDef[4].leftpadding + headerDef[4].nazivKolone.length)
      str += this.padLeft(this.roundNumber2DecimalPlaces(stavka.iznos_osnovica), ' ', headerDef[5].leftpadding + headerDef[5].nazivKolone.length)
      str += '\n'

    });

    str += '-'.repeat(this.paperWidth)

    return str
  }

  /* VP otpremnica  start*/

  getLipe(iznos: number) {

    let functionReturnValue = null;
    let kun: string = ' kuna ';
    let lip: string = ' lipa';
    let tisa: string = 'tisuća';
    let tise: string = 'tisuće';
    let mila: string = 'milijuna';
    let miln: string = 'milijun';

    // lipe

    let jedinice = ['', 'jedna', 'dvije', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet', 'deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest']
    let desetice = ['', 'deset', 'dvadeset', 'trideset', 'četrdeset', 'pedeset', 'šezdeset', 'sedamdeset', 'osamdeset', 'devedeset', 'deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest']
    let stotice = ['', 'sto', 'dvjesto', 'tristo', 'četristo', 'petsto', 'šesto', 'sedamsto', 'osamsto', 'devetsto']

    if (iznos < 0) {
      return 'minus ' + this.getLipe(Math.abs(iznos));
    }

    if (iznos == 0) {

      functionReturnValue = 'nula' + lip
      return functionReturnValue
    }
    if (iznos > 0) {

      let wholeNumber = Math.trunc(iznos); // npr. 25.46 -> 25
      let ostatakStr = String(iznos).replace(String(wholeNumber) + '.', "")
      // LIPE

      let lipe = 0
      let lipeStr = ''

      if (Number(ostatakStr) > 0) {

        var lipeOstatak = iznos.toString().split(".")       // 25.54
        lipe = Number(lipeOstatak[1])   // 54

        if (lipe < 10) {
          lipeStr = jedinice[Number(lipe)]
        }
        if (lipe > 10 && lipe < 20) {
          var lipeDesetice = lipe.toString().substr(0, 1)
          var lipeJedinice = lipe.toString().substr(1, 2)

          lipeStr = jedinice[lipe]
        } else {
          var lipeDesetice = lipe.toString().substr(0, 1)
          var lipeJedinice = lipe.toString().substr(1, 2)
          lipeStr = desetice[Number(lipeDesetice)] + jedinice[Number(lipeJedinice)]

        }

      } else {

        lipeStr = 'nula'

      }

      var lipeJediniceInt = Number(lipeJedinice)

      if (lipeJediniceInt == 2 || lipeJediniceInt == 3 || lipeJediniceInt == 4) {

        lip = ' lipe'

      }

      functionReturnValue = lipeStr + lip

      return functionReturnValue
    }

  }

  convert_millions(num) {
    if (num >= 1000000) {
      return this.convert_millions(Math.floor(num / 1000000)) + " milijuna " + this.convert_thousands(num % 1000000);
    }
    else {
      return this.convert_thousands(num);
    }
  }

  convert_thousands(num) {
    if (num >= 1000) {
      let numStr = String(Math.trunc(num / 1000))
      if (num / 1000 >= 100)
        return this.convert_hundreds(this.stotice[num / 100000]) + ' tisuća'
      if (numStr == '2' || numStr == '3' || numStr == '4') {
        return this.convert_hundreds(Math.floor(num / 1000)) + " tisuće " + this.convert_hundreds(num % 1000)
      }
      else return this.convert_hundreds(Math.floor(num / 1000)) + " tisuća " + this.convert_hundreds(num % 1000);
    }
    else {
      return this.convert_hundreds(num);
    }
  }

  convert_hundreds(num) {
    if (num > 99) {
      let numStr = String(Math.trunc(num / 100))
      if (numStr == '2' || numStr == '3' || numStr == '4')
        return this.ones[Math.floor(num / 100)] + " stotine " + this.convert_tens(num % 100);
      else
        if (numStr == '1')
          return "jedna stotina i " + this.convert_tens(num % 100);
        else
          return this.ones[Math.floor(num / 100)] + " stotina " + this.convert_tens(num % 100);
    }
    else {
      return this.convert_tens(num);
    }
  }

  convert_tens(num) {
    if (num - (Math.floor(num / 10) * 10) == 1) {
      return 'jedna'
    }
    if (num - (Math.floor(num / 10) * 10) == 2) {
      return this.tens[Math.floor(num / 10)] + 'dvije'
    }
    if (num > 1 && num < 10)
      return this.ones[num];
    if (num >= 10 && num < 20)
      return this.teens[num - 10];
    if (num % 10 == 0)
      return this.tens[Math.floor(num / 10)]
    else {
      return this.tens[Math.floor(num / 10)] + " i " + this.ones[num % 10];
    }
  }

  convert(num) {
    let numStr = String(num).substr(String(num).length - 1, String(num).length)
    if (num == 0)
      return "nula kuna";
    if (numStr == '2' || numStr == '3' || numStr == '4')
      return this.convert_millions(num) + ' kune';
    else
      return this.convert_millions(num) + ' kuna';

  }

  convertNumberToWords2(iznos) {
    let finalStr = ''
    let iznosStr = iznos.toString()
    let ostatak = iznosStr.split(".")

    if (iznosStr.includes(".")) {
      if (ostatak[1] > 10) {
        finalStr = this.convert(Number(iznosStr.substr(0, Number(iznosStr.length) - 3))) + ' i ' + this.getLipe(iznos)
        //console.log(finalStr)
      }
      if (ostatak[1] < 10) {
        finalStr = this.convert(Number(iznosStr.substr(0, Number(iznosStr.length) - 2))) + ' i ' + this.getLipe(iznos)
        //console.log(finalStr)
      }
      return finalStr
    }

    else {
      //console.log(this.convert(iznos) + ' i ' + this.getLipe(0))
      return this.convert(iznos) + ' i ' + this.getLipe(0)
    }

  }


  isEmpty(value): string{
    if (value == undefined || value == null) 
        return ""
    else
        return value;
  }

  convertNumberToWords(Iznos: number): string {
    let Kun = " kn ";
    let Lip = " lp";
    let Tisa = "tisuca";
    let Tise = "tisuce";
    let Mila = "milijuna";
    let Miln = "milijun";

    let Jedinice: string[] = ["","jedna", "dvije", "tri", "cetiri", "pet", "sest", "sedam", "osam", "devet", "deset", "jedanaest", "dvanaest", "trinaest", "cetrnaest", "petnaest", "sesnaest", "sedamnaest", "osamnaest", "devetnaest" ]
    let MJedinice: string[] = ["", "jedan", "dva", "tri", "cetiri", "pet", "sest", "sedam", "osam", "devet", "deset", "jedanaest", "dvanaest", "trinaest", "cetrnaest", "petnaest", "sesnaest", "sedamnaest", "osamnaest", "devetnaest" ]
    let Desetice: string[] = ["", "deset", "dvadeset", "trideset", "cetrdeset", "pedeset", "sezdeset", "sedamdeset", "osamdeset", "devedeset" ];
    let Stotice: string[] = ["", "sto", "dvijesto", "tristo", "cetiristo", "petsto", "sesto", "sedamsto", "osamsto", "devetstvo" ];
    let Rezultat: string = "";
    let Tis: string;
    let Mil: string;
    let sPom: string;
    let spom1: string;
    let ipom1: number;
    let ipom2: number;
    let ipom3: number;
    let ipom4: number;
    let prefix: string = "";

    if (Iznos < 0)
        prefix = "minus ";

    Iznos = Math.abs(Iznos);

    if (Iznos < 0)
        return "";
    if (Iznos == 0)
    {
        Rezultat = "ništa" + Kun;
        return Rezultat;
    }

    sPom = Iznos.toFixed(2);
    spom1 = (sPom + "").split(".")[1];
    ipom1 = Math.trunc(Number(spom1));

    if (ipom1 > 0)
    {
        if (ipom1 < 20)
            Rezultat = Jedinice[ipom1] + Lip;
        else {
            Rezultat = this.isEmpty(Desetice[Math.trunc(ipom1 / 10)]) + this.isEmpty(Jedinice[Math.trunc(ipom1 % 10)]) + Lip;
        }
            
    }

    ipom1 = Math.trunc(Number(sPom));


    if (ipom1 > 0)
    {
        Rezultat = Kun + Rezultat;
        ipom2 = Math.trunc(ipom1 % 1000);
        if ((Math.trunc(ipom2 % 100)) < 20)
            Rezultat = Stotice[Math.trunc(ipom2 / 100)] + Jedinice[Math.trunc(ipom2 % 100)] + Rezultat;
        else
            Rezultat = Stotice[Math.trunc(ipom2 / 100)] + Desetice[Math.trunc(Math.trunc(ipom2 % 100) / 10)] + Jedinice[Math.trunc(Math.trunc(ipom2 % 100) % 10)] + Rezultat;
        ipom2 = Math.trunc(ipom1 / 1000);
        ipom3 = Math.trunc(ipom2 % 1000);
        if (ipom3 > 0)
        {
            if (((Math.trunc(ipom3 % 10) == 2) || (Math.trunc(ipom3 % 10) == 3) || (Math.trunc(ipom3 % 10) == 4)) && ((Math.trunc(ipom3) < 10) || (ipom3 > 20)))
                Tis = Tise;
            else
                Tis = Tisa;
            if ((ipom3 % 100) < 20)
                Rezultat = Stotice[Math.trunc(ipom3 / 100)] + Jedinice[Math.trunc(ipom3 % 100)] + Tis + Rezultat;
            else
                Rezultat = Stotice[Math.trunc(ipom3 / 100)] + Desetice[Math.trunc(Math.trunc(ipom3 % 100) / 10)] + Jedinice[Math.trunc(Math.trunc(ipom3 % 100) % 10)] + Tis + Rezultat;
        }
        ipom3 = Math.trunc(ipom2 / 1000);
        ipom4 = Math.trunc(ipom3 % 1000);
        if (ipom4 > 0)
        {
            if ((Math.trunc(ipom4 % 10)) == 1)
                Mil = Miln;
            else
                Mil = Mila;
            if ((Math.trunc(ipom4 % 100)) < 20)
                Rezultat = Stotice[Math.trunc(ipom4 / 100)] + MJedinice[Math.trunc(ipom4 % 100)] + Mil + Rezultat;
            else
                Rezultat = Stotice[Math.trunc(ipom4 / 100)] + Desetice[Math.trunc(Math.trunc(ipom4 % 100) / 10)] + MJedinice[Math.trunc(Math.trunc(ipom4 % 100) % 10)] + Mil + Rezultat;
        }
    }

    return prefix + Rezultat;
}





}
