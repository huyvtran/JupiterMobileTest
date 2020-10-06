import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, IonicPage, ToastController } from 'ionic-angular';

import { TerkomSifarniciProvider } from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import { TerkomArtiklProvider } from '../../../../../providers/modules/terkom/terkom-artikl-provider';
import { TerkomNarudzbaProvider } from '../../../../../providers/modules/terkom/terkom-narudzba-provider';

import { BasePage } from '../../../../../providers/base/base-page';
import { StorageProvider } from '../../../../../providers/core/storage-provider';

/*
  Generated class for the ArtiklEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
    selector: 'page-artikl-edit',
    templateUrl: 'artikl-edit.html'
})
export class TerkomArtiklEditPage extends BasePage {

    @ViewChild('kolicinaSelector') kolicinaEl;
    @ViewChild('kolicinaSelector', { read: ElementRef }) inputKolicinaEl: ElementRef;

    @ViewChild('kolicinaPaketSelector') kolicinaPaketEl;
    @ViewChild('kolicinaPaketSelector', { read: ElementRef }) inputKolicinaPaketEl: ElementRef;

    private inputRefKol;
    private inputRefKolPak;

    opis: string = "";
    kreditniLimit: number = 0;

    razlogpovrata: any;


    //stanje skladista sa servera
    stanjeSkladista: number = 0;
    //kolicina sa servera
    ukupnaKolicina: number = 0;
    //kolicina artikla koji se updatea
    kolicinaUpdate: number = 0;
    //suma iznosa koji se updatea
    iznosUpdate: number = 0;
    //za maksimalni limit R1 narudzbi suma stavki trenutne narudzbe
    sumIznosNarudzbe: number = 0;

    kolicinaPaket: number = 0;
    spremiButtonClicked: boolean = false;

    naslov: string;

    zabranaLimit: boolean = false;
    upozorenjeLimit: boolean = true;

    zabranaStanje: boolean = false;
    upozorenjeStanje: boolean = false;

    //ako je true dismiss alert i spremi stavku
    submit: boolean = true;
    alertShown: boolean = false;

    //disable submit
    disabled: boolean = true;
    //ako je vrstadokOznaka = MP ne provjeravaj kreditni limit, bez obzira na pubvars
    vrstaDokOznaka: string;

    par = new Parametri();
    grazlogpovrataid: string[] = [];

    //multi razlog povrata
    multirazlogPovrata: boolean;

    razlogpovrataid : Array<string> = null;


    constructor(public alertCtrl: AlertController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public artiklService: TerkomArtiklProvider,
        public narudzbeService: TerkomNarudzbaProvider,
        public toastCtrl: ToastController,
        public sifarniciService: TerkomSifarniciProvider) {
        super();

        this.par.crazlogpovrataid = this.grazlogpovrataid;

        console.log();


        this.razlogpovrataid = narudzbeService.narudzba.razlogpovrataid;

        console.log("narudzba multi razlog povrata je:", this.sifarniciService.multiRazlogPovrata);
    }



    onFocus() {
        //alert("focus kol")
        this.inputRefKol = this.inputKolicinaEl.nativeElement.querySelector("input[name='quantity']");

        this.inputRefKol.select();

    }

    onFocusPaket() {
        //alert("focus pak")
        this.inputRefKolPak = this.inputKolicinaPaketEl.nativeElement.querySelector("input[name='quantityPaket']");

        this.inputRefKolPak.select();

    }

	onCancel(){

		this.par.crazlogpovrataid = this.grazlogpovrataid;

	}

    ionViewWillEnter() {


		this.sifarniciService.loadRazlogPovrata()
		.then((res) => {
			this.razlogpovrata = res;
		})

        // console.log(this.artiklService.stavka);

        // if (this.artiklService.stavka.razlogpovratadetid === null)
        // {
        //     if (this.artiklService.stavka.razlogpovratadetid.length <= 0)
        //     {
        //         if (this.narudzbeService.narudzba.razlogpovrataid != null)
        //         {
        //             if (this.narudzbeService.narudzba.razlogpovrataid.length > 0)
        //             {
        //                 this.artiklService.stavka.razlogpovratadetid = this.narudzbeService.narudzba.razlogpovrataid;
        //             }
        //         }
        //     }

        // }



        //kreiraj novu stavku ili edit postojece
        if (this.artiklService.newArtikl == true) {
            //ako je insert dohvati robu
            //console.log("dodajem novi")
            this.naslov = "Unos";
            this.artiklService.opis = null;
            this.artiklService.getNewStavka(this.artiklService.robaId)
                .then((res) => {
                    this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor)
                    this.getUvjetiPartnera();
                    // console.log("asuso");
                    // console.log(this.artiklService.stavka);

                    if (this.sifarniciService.prikazirazlogpovratadetalj===1)
                    {

                        if (this.artiklService.stavka.razlogpovratadetid != null)
                        {
                            if (this.artiklService.stavka.razlogpovratadetid.length > 0)
                            {
                                this.par.crazlogpovrataid=this.artiklService.stavka.razlogpovratadetid;
                            }
                        }
                        else
                        {
                            if (this.narudzbeService.narudzba.razlogpovrataid != null)
                            {
                                if (this.narudzbeService.narudzba.razlogpovrataid.length > 0)
                                {
                                    this.par.crazlogpovrataid=this.narudzbeService.narudzba.razlogpovrataid;
                                }
                            }
                        }
                    }

                    // if(this.sifarniciService.multiRazlogPovrata == 0)
                    // {
                    //   this.multirazlogPovrata = false;

                    // }
                    // else if (this.sifarniciService.multiRazlogPovrata == 1 )
                    // {
                    //   this.multirazlogPovrata = true;

                    // }

                })
                .catch(err => {
                    this.disabled = true;
                    this.global.logError(err, false)
                })

        }
        else {
            this.naslov = "Izmijena";

            //ako je update dohvati stavku
            this.artiklService.getStavka(this.narudzbeService.NarudzbaID, this.artiklService.stavkaID).then((res) => {

                this.kolicinaUpdate = this.artiklService.stavka.kolicina;
                this.artiklService.rabatPosto = this.artiklService.stavka.rabatPosto ? this.artiklService.stavka.rabatPosto : 0;
                this.artiklService.cijena = this.artiklService.stavka.cijena ? this.artiklService.stavka.cijena : 0;
                this.artiklService.opis = this.artiklService.stavka.opis;
                //prepracunaj paketKolicinu

                this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor);

                //this.iznosUpdate = (this.artiklService.stavka.cijena * this.artiklService.kolicina) + ((this.artiklService.stavka.cijena * this.artiklService.stavka.porezposto / 100) * this.artiklService.kolicina);
                this.iznosUpdate = (this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100) + (((this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100)) * this.artiklService.stavka.porezposto / 100);

                if (this.sifarniciService.prikazirazlogpovratadetalj===1)
                {
                    if (this.artiklService.stavka.razlogpovratadetid != null)
                    {
                        if (this.artiklService.stavka.razlogpovratadetid.length > 0)
                        {
                            this.par.crazlogpovrataid=this.artiklService.stavka.razlogpovratadetid;
                        }
                    }
                    else
                    {
                        if (this.narudzbeService.narudzba.razlogpovrataid != null)
                        {
                            if (this.narudzbeService.narudzba.razlogpovrataid.length > 0)
                            {
                                this.par.crazlogpovrataid=this.narudzbeService.narudzba.razlogpovrataid;
                            }
                        }
                    }
                }

                //console.log("iznos Update " + this.iznosUpdate)
            })
                .then((res) => {
                    this.getUvjetiPartnera();
                    // console.log("asuso1");
                    // console.log(this.artiklService.stavka);

                    // if(this.sifarniciService.multiRazlogPovrata == 0)
                    // {
                    //   this.multirazlogPovrata = false;

                    // }
                    // else if (this.sifarniciService.multiRazlogPovrata == 1 )
                    // {
                    //   this.multirazlogPovrata = true;

                    // }

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
            //provjeriti terkom var dohvatuvjeta
            if (this.sifarniciService.dohvatUvjeta === 0) {
                this.artiklService.cijena = 0;
                this.artiklService.rabatPosto = 0;
                this.disabled = false;
            }
            else if (this.sifarniciService.dohvatUvjeta === 1) {
                this.artiklService.rabatPosto = 0;
                this.disabled = false;
            }
            else {
              if(this.narudzbeService.narudzba.oznaka == "VP")
              {
                this.artiklService.getUvjetiPartnera(this.narudzbeService.narudzba.datumdok, this.narudzbeService.narudzba.parstruid, this.narudzbeService.narudzba.partneriid, this.artiklService.stavka.robaid, this.narudzbeService.narudzba.nacinplacanjaid, this.narudzbeService.narudzba.nacinisporukeid)

                .subscribe((data: any) => {
                    //console.log(data);
                    this.disabled = false;
                    if (data != null && data.cijena != null) {
                        this.artiklService.cijena = this.precisionRound(data.cijena, 2);
                        //this.artiklService.cijena = this.precisionRound(0, 2);
                    }
                    if (data != null && data.rabat != null) {
                        this.artiklService.rabatPosto = this.precisionRound(data.rabat, 2);
                        this.artiklService.stavka.rabatPosto = this.precisionRound(data.rabat, 2);
                    }

                },
                    (err) => {
                        this.disabled = true;
                        this.global.logError(err, false)
                    });
              }
              else if (this.narudzbeService.narudzba.oznaka == "MP")
              {
                this.artiklService.getUvjetiPartneraMP(this.narudzbeService.narudzba.datumdok,this.narudzbeService.narudzba.vrstadokid,this.narudzbeService.narudzba.skladisteid,this.narudzbeService.narudzba.parstruid, this.narudzbeService.narudzba.partneriid, this.artiklService.stavka.robaid, this.narudzbeService.narudzba.nacinplacanjaid, this.narudzbeService.narudzba.nacinisporukeid)

                .subscribe((data: any) => {
                    //console.log(data);
                    this.disabled = false;
                    if (data != null && data.cijena != null) {
                        this.artiklService.cijena = this.precisionRound(data.cijena, 2);
                        //this.artiklService.cijena = this.precisionRound(0, 2);
                    }
                    if (data != null && data.rabat != null) {
                        this.artiklService.rabatPosto = this.precisionRound(data.rabat, 2);
                        this.artiklService.stavka.rabatPosto = this.precisionRound(data.rabat, 2);
                    }

                },
                    (err) => {
                        this.disabled = true;
                        this.global.logError(err, false)
                    });
              }

            }

        }
        else
            this.disabled = false;
    }

    precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }


    ionViewDidEnter() {
        this.vrstaDokOznaka = this.narudzbeService.narudzba.oznaka;
        console.log(this.vrstaDokOznaka)
        setTimeout(() => {
            if (this.kolicinaPaketEl)
                this.kolicinaPaketEl.setFocus();
            else
                this.kolicinaEl.setFocus();
        }, 150);
    }



    spremiStavku() {
        //alert(this.sifarniciService.cijenaNulaZabrana)
        //console.log(this.constants.MaxLimit)
        this.spremiButtonClicked = true;
        //provjeri stanje robe na skladistu
        //provjeri kreditni limit ako je veći od 0 izračunaj izns s PDVom svih stavki lokacije

        if (this.artiklService.kolicina > 0) {
            //ako je max iznos veci od 0 provjeri ukupni iznos narudzbe
            if (this.narudzbeService.MaxLimit > 0) {

                this.narudzbeService.getMaxIznosNarudzbe(this.narudzbeService.NarudzbaID).then((res) => {
                    //ukuzpniiznosnarudzbe
                    this.sumIznosNarudzbe = Number(res);
                    //console.log(this.sumIznosNarudzbe)

                })
                    .then(() => {
                        //trenutna stavka
                        //let sumaStavke = (this.artiklService.stavka.cijena *  this.artiklService.kolicina) + (( this.artiklService.stavka.cijena *  this.artiklService.stavka.porezposto / 100) * this.artiklService.kolicina);
                        let sumaStavke = (this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100) + (((this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100)) * this.artiklService.stavka.porezposto / 100);
                        if (this.narudzbeService.MaxLimit - this.sumIznosNarudzbe + this.iznosUpdate - sumaStavke < 0) {
                            this.spremiButtonClicked = false;
                            //this.zabrana = true;
                            //this.upozorenje = true;
                            this.submit = false;
                            this.presentAlert("Ukupni iznos narudžbe veći od odobrenog.", "Maksimalni dozvoljeni ukupni iznos je " + this.narudzbeService.MaxLimit, true, true);
                        }
                        else {
                            //this.zabrana = false;
                            // this.upozorenje = false;
                            this.submit = true;
                            this.checkCijena(this.artiklService.cijena).then((res) => {
                                this.doChecks();
                            })
                        }
                    })

            }
            else {
                //console.log("nema limita")
                this.submit = true;
                this.checkCijena(this.artiklService.cijena).then((res) => {
                    this.doChecks();
                })

            }

        }
        else {
            this.spremiButtonClicked = false;
            //this.zabrana = true;
            //this.upozorenje = true;
            this.submit = false;
            this.presentAlert("Količina mora biti veća od 0.", "", true, true);
        }



    }


    dismiss() {
        //console.log("dismiss");
        this.viewCtrl.dismiss(null);
    }

    kolicinaAdd() {
        //console.log(typeof this.artiklService.kolicina)
        //console.log(typeof this.faktor)
        this.artiklService.kolicina = Number(this.artiklService.kolicina) + 1;
        this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor);
    }

    kolicinaAddFaktor() {

        //console.log(typeof this.artiklService.kolicina)
        //console.log(typeof this.faktor)
        this.kolicinaPaket = Number(this.kolicinaPaket) + 1
        this.artiklService.kolicina = Number(this.kolicinaPaket) * this.artiklService.stavka.faktor;
    }

    kolicinaRemoveFaktor() {
        if (this.kolicinaPaket - 1 > 0) {
            this.kolicinaPaket = Number(this.kolicinaPaket) - 1;
            this.artiklService.kolicina = Number(this.kolicinaPaket) * this.artiklService.stavka.faktor;
        }

    }

    kolicinaRemove() {
        if (this.artiklService.kolicina - 1 > 0) {
            this.artiklService.kolicina = this.artiklService.kolicina - 1;
            this.kolicinaPaket = Math.round(Number(this.artiklService.kolicina) / this.artiklService.stavka.faktor);
        }

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
                        {
                            this.par.ckolicina = Number(this.artiklService.kolicina);
                            this.viewCtrl.dismiss(this.par);
                        }
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

        if (this.variable.hasInternet) {
            this.checkKreditniLimit()
                .then((res) => {
                    return this.checkStanjeArtikla()
                })
                .then((res) => {
                    if (!this.alertShown && this.submit) {
                        this.par.ckolicina = Number(this.artiklService.kolicina)
                        this.viewCtrl.dismiss(this.par);
                    }

                })

        }
        else {
            this.par.ckolicina = Number(this.artiklService.kolicina)
            this.viewCtrl.dismiss(this.par);
        }
    }

    checkCijena(cijena: number){
        console.log(cijena)
        console.log(this.sifarniciService.cijenaNulaZabrana)
        if((Number.isNaN(this.sifarniciService.cijenaNulaZabrana)) || this.sifarniciService.cijenaNulaZabrana === 0){
            console.log(1)
            return new Promise((resolve) => { resolve() });

        }
        else{
            console.log(2)
            return this.artiklService.checkCijenaVecaOdNula(cijena)
            .then((res) => {
                console.log(res)
                if (res) {
                    this.submit = true;
                }
                else {
                    this.submit = false;
                    this.spremiButtonClicked = false;
                    return this.presentAlert("Cijena artikla je nula", "Spremanje stavke s cijenom nula nije dozvoljeno!", this.sifarniciService.cijenaNulaZabrana, false);
                }
            })
            .catch((err) => this.global.logError(err, true));
        }
    }

    checkKreditniLimit() {
        //console.log("kreditni limit check")
        if (this.sifarniciService.kreditniLimitZabrana === 1)
            this.zabranaLimit = true;
        else
            this.zabranaLimit = false

        if (this.sifarniciService.kreditniLimitUpozorenje === 1)
            this.upozorenjeLimit = true;
        else
            this.upozorenjeLimit = false;

        //console.log("zabrana limit: " + this.zabranaLimit)

        if ((!this.zabranaLimit && !this.upozorenjeLimit) || this.vrstaDokOznaka === "MP")
            return new Promise((resolve) => { resolve() });

        return this.artiklService.getKreditniLimitPartnera(this.narudzbeService.parstruid)
            .then((val) => {

                if (val && val.limit) {

                    this.kreditniLimit = val ? val.limit : 0;
                    //trenutni iskoristen limit na uređaju

                    //console.log(this.pregledService.parstruid)
                    return this.narudzbeService.getKreditniLimitSuma(this.narudzbeService.parstruid).then((res) => {
                        //trenutna stavka
                        //let sumaStavke = (this.artiklService.stavka.cijena *  this.artiklService.kolicina) + (( this.artiklService.stavka.cijena *  this.artiklService.stavka.porezposto / 100) * this.artiklService.kolicina);
                        let sumaStavke = (this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100) + (((this.artiklService.cijena * this.artiklService.kolicina) * (1 - this.artiklService.rabatPosto / 100)) * this.artiklService.stavka.porezposto / 100)

                        //console.log("suma unesenae stavke " + sumaStavke);

                        //console.log("kreditni limit " + this.kreditniLimit)
                        //console.log("ukupno " + (this.kreditniLimit - Number(res) + this.iznosUpdate - sumaStavke))
                        if (this.kreditniLimit - Number(res) + this.iznosUpdate - sumaStavke < 0) {
                            if (this.zabranaLimit)
                                this.submit = false;
                            this.spremiButtonClicked = false;
                            return this.presentAlert("Kreditni limit", "Prešli ste kreditni limit.!", this.zabranaLimit, this.upozorenjeLimit);
                        }
                        else {
                            this.submit = true;
                        }
                    }).catch(err => this.global.logError(err, false));
                }
                else {
                    this.spremiButtonClicked = false;
                    if (this.zabranaStanje)
                        this.submit = false;
                    return this.presentAlert("Kreditni limit nedovoljan", "Prešli ste kreditni limit.", this.zabranaLimit, this.upozorenjeLimit);
                }

            })
            .catch((err) => {
                this.spremiButtonClicked = false;
                this.global.presentToast("Problem sa konekcijom. Pristup internetu ograničen.");
                this.global.logError(err, false)
            })

    }


    checkStanjeArtikla() {
        //console.log("stanje artikla check")
        if (this.sifarniciService.stanjeSkladistaZabrana === 1)
            this.zabranaStanje = true;
        else
            this.zabranaStanje = false

        if (this.sifarniciService.stanjeSkladistaupozorenje === 1)
            this.upozorenjeStanje = true;
        else
            this.upozorenjeStanje = false;

        //console.log("zabrana stanje " + this.zabranaStanje)

        if (!this.zabranaStanje && !this.upozorenjeStanje)
            return new Promise((resolve) => { resolve(); });

        return this.artiklService.getStanjeArtiklaNaSkladistu(this.artiklService.stavka.robaid, this.narudzbeService.narudzba.skladisteid)
            .then((val) => {

                if (val && val.kolicina) {
                    this.ukupnaKolicina = val ? val.kolicina : 0;
                    //stanje skladista upozorenje true / false
                    return this.narudzbeService.getStanjeArtikla(this.artiklService.stavka.robaid).then((res) => {
                        //trenutna kolicina stavke
                        let unesenaKolicina = this.artiklService.kolicina;
                        //ima robe na stanju
                        //console.log(this.ukupnaKolicina - Number(res) + this.kolicinaUpdate - unesenaKolicina)
                        if (this.ukupnaKolicina - Number(res) + this.kolicinaUpdate - unesenaKolicina < 0) {
                            //ako je postavljen pubvar za zabranu ako je stanje nedovoljno a nema dovoljno na stanju postavi submit na false
                            if (this.zabranaStanje)
                                this.submit = false;
                            this.spremiButtonClicked = false;
                            return this.presentAlert("Stanje artikla", "Količina na stanju nije dovoljna.", this.zabranaStanje, this.upozorenjeStanje);
                        }
                        else {
                            //ako je dovoljno na stanju dozvoli submit artikla ako submit vec nije false, tj kreditni limit nije prošao provjeru
                            if (this.submit)
                                this.submit = true;
                        }

                    }).catch(err => this.global.logError(err, false));

                    //stanje skladista zabrana true / false
                }
                else {
                    this.spremiButtonClicked = false;
                    if (this.zabranaStanje)
                        this.submit = false;
                    return this.presentAlert("Stanje artikla", "Količina na stanju je 0.", this.zabranaStanje, this.upozorenjeStanje);
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
        this.navCtrl.popTo("NarudzbaDetailPage");
    }

    razlogpovrataizbor() {

        this.sifarniciService.loadRazlogPovrata()
		.then((res) => {
            this.razlogpovrata = res;
            const alert = this.alertCtrl.create();
            alert.setTitle("Razlog povrata");
            this.razlogpovrata.forEach(razlog => {
                if (this.artiklService.stavka.razlogpovratadetid != null)
                {
                    if (this.artiklService.stavka.razlogpovratadetid.length > 0)
                    {
                        if (this.artiklService.stavka.razlogpovratadetid.indexOf(String(razlog.mobterkom_razlogpovrataid)) > -1)
                        {
                            alert.addInput({
                                name: 'checkbox' + String(razlog.mobterkom_razlogpovrataid),
                                type: 'checkbox',
                                label: razlog.opis,
                                value: String(razlog.mobterkom_razlogpovrataid),
                                checked: true
                            });
                        }
                        else
                        {
                            alert.addInput({
                                name: 'checkbox' + String(razlog.mobterkom_razlogpovrataid),
                                type: 'checkbox',
                                label: razlog.opis,
                                value: String(razlog.mobterkom_razlogpovrataid),
                                checked: false
                            });
                        }
                    }
                    else
                    {
                        if (this.narudzbeService.narudzba.razlogpovrataid != null)
                        {
                            if (this.narudzbeService.narudzba.razlogpovrataid.indexOf(String(razlog.mobterkom_razlogpovrataid)) > -1)
                            {
                                alert.addInput({
                                    name: 'checkbox' + String(razlog.mobterkom_razlogpovrataid),
                                    type: 'checkbox',
                                    label: razlog.opis,
                                    value: String(razlog.mobterkom_razlogpovrataid),
                                    checked: true
                                });
                            }
                            else
                            {
                                alert.addInput({
                                    name: 'checkbox' + String(razlog.mobterkom_razlogpovrataid),
                                    type: 'checkbox',
                                    label: razlog.opis,
                                    value: String(razlog.mobterkom_razlogpovrataid),
                                    checked: false
                                });
                            }
                        }
                    }
                }
                else
                {
                    if (this.narudzbeService.narudzba.razlogpovrataid != null)
                    {
                        if (this.narudzbeService.narudzba.razlogpovrataid.indexOf(String(razlog.mobterkom_razlogpovrataid)) > -1)
                        {
                            alert.addInput({
                                name: 'checkbox' + String(razlog.mobterkom_razlogpovrataid),
                                type: 'checkbox',
                                label: razlog.opis,
                                value: String(razlog.mobterkom_razlogpovrataid),
                                checked: true
                            });
                        }
                        else
                        {
                            alert.addInput({
                                name: 'checkbox' + String(razlog.mobterkom_razlogpovrataid),
                                type: 'checkbox',
                                label: razlog.opis,
                                value: String(razlog.mobterkom_razlogpovrataid),
                                checked: false
                            });
                        }
                    }
                    else
                    {
                        alert.addInput({
                            name: 'checkbox' + String(razlog.mobterkom_razlogpovrataid),
                            type: 'checkbox',
                            label: razlog.opis,
                            value: String(razlog.mobterkom_razlogpovrataid),
                            checked: false
                        });
                    }


                }


            });
            alert.addButton(
                {
                    text: 'Odustani',
                    role: 'cancel',
                    handler: () => {
                        this.par.crazlogpovrataid = [];
                    }
                }
            );
            alert.addButton(
                {
                    text: 'Potvrdi',
                    handler: data => {
                        this.grazlogpovrataid = data;
                        console.log(this.grazlogpovrataid);
                        //this.par.crazlogpovrataid=this.grazlogpovrataid

                    }
                }
            );

            alert.present();
		})
    }
}

class Parametri{
    ckolicina?: number;
    crazlogpovrataid?: Array<string>
}
