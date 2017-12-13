import {Component} from '@angular/core';
import {NavParams, NavController, IonicPage, ModalController, PopoverController} from 'ionic-angular';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import {BiAnalizaNabaveProvider} from '../../../../../providers/bi-analiza-nabave-provider';
import {BasePage} from '../../../../../providers/base/base-page';
//import * as iCore from '../../../../../interfaces/iCore';

@IonicPage()
@Component({selector: 'page-bi-analiza-prodaja-filter', templateUrl: 'filter.html'})
export class BiAnalizaNabaveFilter extends BasePage {

    filterType: string;
    subTitle: string;
    checked: boolean = true;

    parametri: any;

    constructor(private navCtrl : NavController, navParams : NavParams, private modalCtrl : ModalController, private popoverCtrl : PopoverController, private provider : BiAnalizaNabaveProvider,
        private nativePageTransitions: NativePageTransitions) {
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
                        } else if (action == "operater") {
                            this.parametri.odgovornaosobaid = data.id;
                            this.parametri.odgovornaosobanaziv = data.naziv;
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

    trazilicaAuto(action) {
        this.global.modal = this
            .modalCtrl
            .create('SharedTrazilicaAutocompletePage', {action: action});
        this.global.modal.onDidDismiss(data => {
            if (data != null) {
                if (action == "partner") {
                    this.parametri.partnerid = data.id;
                    this.parametri.partnernaziv = data.naziv;
                }
            }
            this.global.modal = null;
        });
        this.global.modal.present();
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
        this.setSP();
        this.navCtrl.push('BiAnalizaNabaveUsporedba');
        // if (this.filterType=="b") {
        //     this.navCtrl.push('BiAnalizaNabaveUsporedba');
        // } else {
        //     this.navCtrl.parent.select(1); 
        // }
    }

    copyValues() {
        this.parametri = Object.assign({},this.provider.parametriIzv);
        this.provider.parametriRef = this.parametri;
    }


    private setSP() {
        let stora: string;
        let objekttekst: string;
        switch(this.parametri.objekt) { 
            case "p": { 
               stora = "spMobManAnaProPon1";
               objekttekst = "ponude";
               break; 
            } 
            case "o": { 
                stora = "spMobManAnaProNOT"
                objekttekst = "otpremnice";
                break; 
            } 
            case "f": { 
                stora = "spMobManAnaProFak"
                objekttekst = "fakture";
                break; 
            } 
            case "m": { 
                stora = "spMobManAnaProMP"
                objekttekst = "Maloprodaja";
               break; 
            } 
            case "v": { 
                stora = "spMobManAnaProMPVP"
                objekttekst = "MP + VP";
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
            this.provider.showTransition=true;
            this.navCtrl.parent.select(0); 
        }
    }

    ionViewWillLeave() {
        try
        {
            if (this.provider.showTransition==true)
            {
                let options: NativeTransitionOptions = {
                    direction: 'up',
                    duration: 500,
                    slowdownfactor: 3,
                    slidePixels: 20,
                    iosdelay: 100,
                    androiddelay: 150,
                    fixedPixelsTop: 0,
                    fixedPixelsBottom: 60
                };
                
                this.nativePageTransitions.slide(options);
            }
        } finally {
            this.provider.showTransition=false;
        }        
    }
}