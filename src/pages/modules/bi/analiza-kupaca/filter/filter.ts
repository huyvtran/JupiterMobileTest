import {Component} from '@angular/core';
import {NavParams, NavController, IonicPage, ModalController, PopoverController, AlertController } from 'ionic-angular';
import {BiAnalizaKupacaProvider } from '../../../../../providers/bi-analiza-kupaca-provider';
import {BasePage} from '../../../../../providers/base/base-page';
//import * as iCore from '../../../../../interfaces/iCore';

@IonicPage()
@Component({selector: 'page-bi-analiza-kupaca-filter', templateUrl: 'filter.html'})
export class BiAnalizaKupacaFilter extends BasePage {

    filterType: string;
    subTitle: string;
    checked: boolean = true;

    parametri: any;

    constructor(private navCtrl : NavController, navParams : NavParams, private modalCtrl : ModalController, private popoverCtrl : PopoverController, private provider : BiAnalizaKupacaProvider, public alertCtrl: AlertController) {
        super();

        this.filterType=navParams.data;
        if (this.filterType=="a") {
            this.subTitle = "Izvještajno razdoblje";
            this.parametri = provider.parametriIzv;
        }   
        else {
            this.subTitle = "Referentno razdoblje";
            provider.parametriRef.include = true;
            this.parametri = provider.parametriRef;
        }
    }

    trazilicaAuto(action) {
        if (action == "PartnerLokacija" && this.parametri.partneriid == null) {
            // let alert = this.alertCtrl.create({
            //   title: 'Upozorenje',
            //   subTitle: 'Molimo izaberite partnera!',
            //   buttons: ['OK']
            // });
            // alert.present();
            this.global.uIzradi();
            return;
          }

          

        this.global.modal = this
        .modalCtrl
        .create('SharedTrazilicaAutocompletePage', {action: action, partneriid: this.parametri.partneriid});
        this.global.modal.onDidDismiss(data => {
        if (data != null) {
            if (action == "partner") {
                this.parametri.partneriid = data.id;
                this.parametri.partnerinaziv = data.naziv;
            }
            if (action == "PartnerLokacija") {
                this.parametri.parstruid = data.id;
                this.parametri.parstrunaziv = data.naziv;
            }
        }
        this.global.modal = null;
    });
    this.global.modal.present();

    }

    trazilica(action) {
        try
        {
            this.global.modal = this
            .modalCtrl
            .create('ModalNavPage', {page: 'SharedTrazilicaTreePage', action: action});
            this.global.modal.present();
            this.global.modal.onDidDismiss(data => {
                if (data!= null) {
                    try
                    {
                        if (action == "klmasterroba") {
                            this.parametri.klmasterrobaid = data.id;
                            this.parametri.klmasterrobanaziv = data.naziv;
                        } else if (action == "orgshema") {
                            this.parametri.orgshemaid = data.id;
                            this.parametri.orgshemanaziv = data.naziv;
                        } 
                    } catch(e) {
                        this.global.logError(e, true);
                    }
                }
                this.global.modal = null;
            })
        } catch(e) {
            this.global.logError(e, true);
        }
       
        



    }

    presentPopover(myEvent) {
        var exclude =  ["group1", "group4"]
        let popover = this
            .popoverCtrl
            .create('SharedDateFilterPage', {exclude: exclude});
        popover.present({ev: myEvent});

        popover.onDidDismiss((data) => {
            if (data != null) {
                this.parametri.datumod = data.start;
                this.parametri.datumdo = data.end;
            }
        })

    }

    ok() {
        if (this.parametri.partneriid == null) {
            this.global.presentToast("Obavazen odabir kupca");
            return;
        }
        this.setSP();
        this.navCtrl.push('BiAnalizaKupacaUsporedba');
        // if (this.filterType=="b") {
        //     this.navCtrl.push('BiAnalizaProdajeUsporedba');
        // } else {
        //     this.navCtrl.parent.select(1); 
        // }
    }

    copyValues() {
        //this.parametri = Object.create(this.provider.parametriIzv);
        this.parametri = Object.assign({},this.provider.parametriIzv);
        this.provider.parametriRef = this.parametri;
        //this.parametri.objekt = this.provider.parametriIzv.objekt;
        //this.parametri.datumod = this.provider.parametriIzv.datumod;
        //this.parametri.datumdo = this.provider.parametriIzv.datumdo;
    }


    private setSP() {
        let stora: string;
        let objekttekst: string;
        switch(this.parametri.objekt) { 
            case "p": { 
               stora = "spMobManAnaKupPon1";
               objekttekst = "ponude";
               break; 
            } 
            case "o": { 
                stora = "spMobManAnaKupNOT"
                objekttekst = "otpremnice";
                break; 
            } 
            case "f": { 
                stora = "spMobManAnaKupFak"
                objekttekst = "fakture";
                break; 
            } 
            case "m": { 
                stora = "spMobManAnaKupMP"
                objekttekst = "Maloprodaja";
               break; 
            } 
        } 
        
        this.parametri.stora = stora;
        this.parametri.objekttekst = objekttekst;
    }

    clearValue(slide, value, name) {
        slide.close();
        this.parametri[name] = null;
        this.parametri[value] = null;
    }

    includeRef() {
        if (this.parametri.include == false) {
            this.navCtrl.parent.select(0); 
        }
    }

    onSelectChange() {
        this.setSP();
    }
}