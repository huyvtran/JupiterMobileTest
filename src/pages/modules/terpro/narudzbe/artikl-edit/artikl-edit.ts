import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, IonicPage, ToastController } from 'ionic-angular';

import { TerproSifarniciProvider } from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';
import { TerproArtiklProvider } from '../../../../../providers/modules/terpro/terpro-artikl-provider';
import { TerproNarudzbaProvider } from '../../../../../providers/modules/terpro/terpro-narudzba-provider';
import { TerproStanjeSkladistaProvider } from '../../../../../providers/modules/terpro/terpro-stanjeskladista-provider';

import { BasePage } from '../../../../../providers/base/base-page';

/*
  Generated class for the ArtiklEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
    selector: 'page-terpro-artikl-edit',
    templateUrl: 'artikl-edit.html'
})
export class TerproArtiklEditPage extends BasePage {

    stavka: any
    @ViewChild('kolicinaSelector') kolicinaEl;
    @ViewChild('kolicinaSelector', { read: ElementRef }) inputKolicinaEl: ElementRef;

    @ViewChild('kolicinaPaketSelector') kolicinaPaketEl;
    @ViewChild('kolicinaPaketSelector', { read: ElementRef }) inputKolicinaPaketEl: ElementRef;

    private inputRefKol;
    private inputRefKolPak;


    //stanje skladista sa servera
    stanjeSkladista: number = 0;
    //kolicina sa servera
    ukupnaKolicina: number = 0;
    //kolicina artikla koji se updatea
    kolicinaUpdate: number = 0;

    kolicinaPaket: number = 0;
    spremiButtonClicked: boolean = false;

    naslov: string;

    //ako je true dismiss alert i spremi stavku
    submit: boolean = true;
    alertShown: boolean = false;

    //disable submit 
    disabled: boolean = true;
    //ako je vrstadokOznaka = MP ne provjeravaj kreditni limit, bez obzira na pubvars
    vrstaDokOznaka: string;

    constructor(public alertCtrl: AlertController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public artiklService: TerproArtiklProvider,
        public narudzbeService: TerproNarudzbaProvider,
        public toastCtrl: ToastController,
        private sifarniciService: TerproSifarniciProvider,
        private stanjeSkladistaProvider: TerproStanjeSkladistaProvider) {
        super();
        this.stavka = this.navParams.get("stavka");
    }


    onFocus() {
        this.inputRefKol = this.inputKolicinaEl.nativeElement.querySelector("input[name='quantity']");

        this.inputRefKol.select();

    }

    onFocusPaket() {
        this.inputRefKolPak = this.inputKolicinaPaketEl.nativeElement.querySelector("input[name='quantityPaket']");

        this.inputRefKolPak.select();

    }

    ionViewWillEnter() {


        //kreiraj novu stavku ili edit postojece
        if (this.artiklService.newArtikl == true) {
            //ako je insert dohvati robu
            //console.log("dodajem novi")
            this.naslov = "Unos";
            this.artiklService.getNewStavka(this.artiklService.robaId)
                .then((res) => {
                    this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor)
                    this.getUvjetiPartnera();
                })
                .catch(err => {
                    this.disabled = true;
                    this.global.logError(err, true)
                })

        }
        else {
            this.naslov = "Izmijena";

            //ako je update dohvati stavku
            this.artiklService.getStavka(this.narudzbeService.pronarudzbeglaid, this.artiklService.stavkaID).then((res) => {

                this.kolicinaUpdate = this.artiklService.stavka.kolicina;
                this.artiklService.rabatPosto = this.artiklService.stavka.rabat ? this.artiklService.stavka.rabat : 0;
                this.artiklService.cijena = this.artiklService.stavka.cijena ? this.artiklService.stavka.cijena : 0;
                //prepracunaj paketKolicinu

                this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor);

                //this.iznosUpdate = (this.artiklService.stavka.cijena * this.artiklService.kolicina) + ((this.artiklService.stavka.cijena * this.artiklService.stavka.porezposto / 100) * this.artiklService.kolicina);
                //this.iznosUpdate = (this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100) + (((this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100)) * this.artiklService.stavka.porezposto / 100);

                //console.log("iznos Update " + this.iznosUpdate)
            })
                .then((res) => {
                    this.getUvjetiPartnera();
                })
                .catch(err => {
                    this.disabled = true;
                    this.global.logError(err, false)
                })
        }

    }

    getUvjetiPartnera() {
        //console.log(this.narudzbeService.narudzba)
        //console.log(this.artiklService.stavka)
        //dohvati uvjete partnera Observable
        if (this.variable.hasInternet) {
            this.disabled = false;
            //provjeriti terkom var dohvatuvjeta
            //   if(this.sifarniciService.dohvatUvjeta === 0){
            //       this.artiklService.cijena = 0;
            //       this.artiklService.rabatPosto = 0;
            //       this.disabled = false;
            //   }
            //   else if(this.sifarniciService.dohvatUvjeta === 1){
            //       this.artiklService.rabatPosto = 0;
            //       this.disabled = false;
            //   }
            //   else{
            //         this.artiklService.getUvjetiPartnera(this.narudzbeService.narudzba.datumdok,this.narudzbeService.narudzba.parstruid,this.narudzbeService.narudzba.,this.artiklService.stavka.robaid,this.narudzbeService.narudzba.nacinplacanjaid,this.narudzbeService.narudzba.nacinisporukeid)

            //         .subscribe((data : any) => {
            //             //console.log(data);
            //             this.disabled = false;
            //             if (data != null && data.cijena !=null) {
            //                 this.artiklService.cijena = this.precisionRound(data.cijena, 2);
            //             }
            //             if (data != null && data.rabat !=null) {
            //                 this.artiklService.rabatPosto = this.precisionRound(data.rabat, 2);
            //                 this.artiklService.stavka.rabatPosto = this.precisionRound(data.rabat, 2);
            //             }

            //         },
            //         (err) => {
            //             this.disabled = true;
            //             this.global.logError(err,false)
            //         });  
            //   }

        }
        else
            this.disabled = false;
    }

    precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }


    ionViewDidEnter() {

        setTimeout(() => {
            if (this.kolicinaPaketEl)
                this.kolicinaPaketEl.setFocus();
            else
                this.kolicinaEl.setFocus();
        }, 150);
    }



    spremiStavku() {

        //console.log(this.constants.MaxLimit)
        this.spremiButtonClicked = true;


        if (Number(this.artiklService.kolicina) > 0 || Number(this.artiklService.kolicina) < 0) {
            this.submit = true;
            this.doChecks();
        }
        else if (Number(this.artiklService.kolicina) === 0){
            this.submit = false;
            this.spremiButtonClicked = false;
            this.presentAlert("Količina ne smije biti 0.", "", true, true);
        }
        else {
            this.submit = false;
            this.spremiButtonClicked = false;
            this.presentAlert("Količina mora biti broj.", "", true, true);
        }

        // if ((this.stavka && this.stavka.pov_nak_ind === 0 && this.stavka.pov_nak_sysind === 1) || this.narudzbeService.narudzba.vrstadokid == 306) {

        //     this.submit = true;
        //     this.doChecks();
            // if (this.artiklService.kolicina < 0) {
            //     this.submit = true;
            //     this.doChecks();
            // }
            // else {
            //     this.submit = false;
            //     this.spremiButtonClicked = false;
            //     this.presentAlert("Količina mora biti manja od 0.", "", true, true);
            // }

        // }
        // else {
        //     this.submit = true;
        //     this.doChecks();
            // if (this.artiklService.kolicina > 0) {
            //     this.submit = true;
            //     this.doChecks();
            // }
            // else {
            //     this.spremiButtonClicked = false;
            //     //this.zabrana = true;
            //     //this.upozorenje = true;
            //     this.submit = false;
            //     this.presentAlert("Količina mora biti veća od 0.", "", true, true);

            // }
        //}

        //provjeri stanje robe na skladistu      
        //provjeri kreditni limit ako je veći od 0 izračunaj izns s PDVom svih stavki lokacije

        // if(this.artiklService.kolicina > 0)
        // {

        //     this.doChecks();
        //    //ako je max iznos veci od 0 provjeri ukupni iznos narudzbe
        //     // if(this.narudzbeService.MaxLimit > 0)
        //     // {

        //         // this.narudzbeService.getMaxIznosNarudzbe(this.narudzbeService.pronarudzbeglaid).then((res) => {
        //         //     //ukuzpniiznosnarudzbe
        //         //     this.sumIznosNarudzbe = Number(res);
        //         //     //console.log(this.sumIznosNarudzbe)

        //         // })
        //         // .then(() => {
        //         //     //trenutna stavka
        //         //     //let sumaStavke = (this.artiklService.stavka.cijena *  this.artiklService.kolicina) + (( this.artiklService.stavka.cijena *  this.artiklService.stavka.porezposto / 100) * this.artiklService.kolicina);
        //         //     let sumaStavke = (this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100) + (((this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100)) * this.artiklService.stavka.porezposto / 100);
        //         //     if(this.narudzbeService.MaxLimit - this.sumIznosNarudzbe + this.iznosUpdate - sumaStavke < 0)
        //         //     {
        //         //         this.spremiButtonClicked = false;
        //         //         //this.zabrana = true;
        //         //         //this.upozorenje = true;
        //         //         this.submit = false;
        //         //         this.presentAlert("Ukupni iznos narudžbe veći od odobrenog.","Maksimalni dozvoljeni ukupni iznos je " + this.narudzbeService.MaxLimit,true, true);
        //         //     }
        //         //     else{
        //         //         //this.zabrana = false;
        //         //         // this.upozorenje = false;
        //         //         this.submit = true;
        //         //         this.doChecks();
        //         //     }
        //         // })

        //     // }
        //     // else
        //     // {
        //     //     //console.log("nema limita")
        //     //     this.doChecks();
        //     // }

        // }
        // else
        // {
        //     this.spremiButtonClicked = false;
        //     //this.zabrana = true;
        //     //this.upozorenje = true;
        //     this.submit = false;
        //     this.presentAlert("Količina mora biti veća od 0.","", true, true);
        // }



    }


    dismiss() {
        //console.log("dismiss");
        this.viewCtrl.dismiss(null);
    }

    kolicinaAdd() {

        if (this.stavka && this.stavka.pov_nak_ind === 0 && this.stavka.pov_nak_sysind === 1) {
            // dozvoli samo kolicinu u minus
            //if (this.artiklService.kolicina + 1 < 0) {
                this.artiklService.kolicina = Number(this.artiklService.kolicina) + 1;
                this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor);
            //}

        }
        else {
            //console.log(typeof this.artiklService.kolicina)
            //console.log(typeof this.faktor)
            this.artiklService.kolicina = Number(this.artiklService.kolicina) + 1;
            this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor);
        }

    }

    kolicinaAddFaktor() {

        //console.log(typeof this.artiklService.kolicina)
        //console.log(typeof this.faktor)
        this.kolicinaPaket = Number(this.kolicinaPaket) + 1
        this.artiklService.kolicina = Number(this.kolicinaPaket) * this.artiklService.stavka.faktor;
    }

    kolicinaRemoveFaktor() {
        //if (this.kolicinaPaket - 1 > 0) {
            this.kolicinaPaket = Number(this.kolicinaPaket) - 1;
            this.artiklService.kolicina = Number(this.kolicinaPaket) * this.artiklService.stavka.faktor;
        //}

    }

    kolicinaRemove() {
        if (this.stavka && this.stavka.pov_nak_ind === 0 && this.stavka.pov_nak_sysind === 1) {
            // dozvoli samo kolicinu u minus

            this.artiklService.kolicina = Number(this.artiklService.kolicina) - 1;
            this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor);


        }
        else {

            //if (this.artiklService.kolicina - 1 > 0) {
                this.artiklService.kolicina = this.artiklService.kolicina - 1;
                this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor);
            //}

        }
        // if(this.artiklService.kolicina - 1  > 0)
        // {

        // }

    }



    kolicinaChange() {
        //preracunaj kolicinaPaket
        //console.log(this.artiklService.kolicina)
        this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor);
        //console.log(this.kolicina)
    }

    kolicinaPaketChange() {
        //preracunaj kolicinaPaket
        this.artiklService.kolicina = Number(this.kolicinaPaket) * this.artiklService.stavka.faktor;
        //console.log(this.kolicina)
    }

    presentAlert(naslov, text, zabrana, upozorenje) {

        let alert = this.alertCtrl.create({
            title: naslov,
            subTitle: text,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.alertShown = false;
                    if (this.submit)
                        this.viewCtrl.dismiss(Number(this.artiklService.kolicina));
                }
            }]
        });
        //ako je upozorenje ili da je zabrana i upozorenje onda prikazi alert
        if (upozorenje || (zabrana && !upozorenje)) {
            this.alertShown = true;
            return alert.present();
        }


    }


    doChecks() {

        if (this.narudzbeService.narudzba.donos === 1 || (this.narudzbeService.narudzba.vrstadokid != 1 && this.narudzbeService.narudzba.vrstadokid != 2 && this.narudzbeService.narudzba.vrstadokid != 3 && this.narudzbeService.narudzba.vrstadokid != 306))
            this.checkStanjeArtikla()
                .then((res) => {
                    if (!this.alertShown && this.submit) {
                        this.viewCtrl.dismiss(Number(this.artiklService.kolicina));
                    }
                })
        //ako je dokument naknadno dodan ne provjeravaj stanje skladista jer se radi za neki drugi dan
        else
            this.viewCtrl.dismiss(Number(this.artiklService.kolicina));

    }


    checkStanjeArtikla() {

        return this.stanjeSkladistaProvider.getUkupnoStanjeArtiklaNaSkladistu(this.artiklService.stavka.robaid)
            .then((val) => {
                //console.log("ukupna kolicina na skladistu " + val)
                if (val) {
                    this.ukupnaKolicina = val ? val : 0;
                    //stanje skladista upozorenje true / false
                    return this.narudzbeService.getStanjeArtikla(this.artiklService.stavka.robaid).then((res) => {
                        //trenutna kolicina stavke
                        //console.log("stanje artikla " + res)
                        let unesenaKolicina = this.artiklService.kolicina;
                        //ima robe na stanju
                        //console.log(this.ukupnaKolicina - Number(res) + this.kolicinaUpdate - unesenaKolicina)
                        if (this.ukupnaKolicina - Number(res) + this.kolicinaUpdate - unesenaKolicina < 0) {
                            //ako je postavljen pubvar za zabranu ako je stanje nedovoljno a nema dovoljno na stanju postavi submit na false
                            // if(this.zabranaStanje)
                            this.submit = false;
                            this.spremiButtonClicked = false;
                            return this.presentAlert("Stanje artikla", "Količina na stanju nije dovoljna.", true, true);
                        }
                        else {
                            this.submit = true;
                        }

                    }).catch(err => this.global.logError(err, false));

                    //stanje skladista zabrana true / false
                }
                else {
                    this.spremiButtonClicked = false;
                    // if(this.zabranaStanje)
                    this.submit = false;
                    return this.presentAlert("Stanje artikla", "Količina na stanju je 0.", true, true);
                }

            })
            .catch((err) => {
                this.spremiButtonClicked = false;
                this.global.presentToast("Problem sa konekcijom. Pristup internetu ograničen.");
                this.global.logError(err, false)
            })

    }

    showNarudzba() {
        //ovdje poslatiparametar da zna sakriti i dalje tabs na pregledu narudzbe
        this.navCtrl.popTo("TerproNarudzbaDetailPage");
    }

}
