import {Component} from '@angular/core';
import {
    IonicPage,
    NavController,
    ModalController,
    PopoverController,
} from 'ionic-angular';

import {HrmOdsustvaNajavaProvider} from '../../../../../providers/hrm-odsustva-najava-provider';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
import * as Moment from 'moment';

@IonicPage()
@Component({selector: 'page-hrm-odsustva-najava', templateUrl: 'najava.html'})
export class HrmOdsustvaNajavaPage extends BasePage {
    data : any;

    constructor(public navCtrl : NavController, private provider : HrmOdsustvaNajavaProvider, private popoverCtrl : PopoverController, private modalCtrl: ModalController) {
        super();

        this
            .getData()
            .then(x => {
                this.data = x;
                this.setData();
            })
            .catch(ex => this.global.logError(ex, true));
    }

    getData() {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobHrmOdsustvaNajavaQuery",
                    "params": {
                        "action": "init",
                        "operaterid": "@@operaterid"
                    },
                    "tablename": "init"
                }, {
                    "query": "spMobHrmOdsustvaNajavaQuery",
                    "params": {
                        "action": "getHrOdsustva"
                    },
                    "tablename": "hrodsustva"
                }, {
                    "query": "spMobHrmOdsustvaNajavaQuery",
                    "params": {
                        "action": "getPrijevoz"
                    },
                    "tablename": "prijevoz"
                }
            ]
        }
        return this
            .global
            .getData(dataDef, true);

    }

    setData() {
        console.log("setData");
        console.log(this.data);
        if (this.data != null && this.data.init != null && this.data.init[0].zamjenikid != null) {
            this.provider.parametri.zamjenikid = this.data.init[0].zamjenikid;
            this.provider.parametri.zamjenik = this.data.init[0].zamjenik;
        } else {
            this.provider.parametri.ukljucizamjenika = false;
        }
        this.provider.parametriEmpty.zamjenikid = this.provider.parametri.zamjenikid;
        this.provider.parametriEmpty.zamjenik = this.provider.parametri.zamjenik;
        this.provider.parametriEmpty.ukljucizamjenika = this.provider.parametri.ukljucizamjenika;
    }

    buttonState() {
        if (this.provider.parametri.hrodsustvaid == null) 
            return true;
        return false;
    }

    presentPopover(myEvent) {
        try {
            var exclude = ["group2", "group3", "group4", "-d"]
            var inputvrijeme = {
                "vrijemeod": this.provider.parametri.vrijemeod,
                "vrijemedo": this.provider.parametri.vrijemedo
            }
            console.log(inputvrijeme);
            let popover = this
                .popoverCtrl
                .create('SharedDateFilterPage', {
                    exclude: exclude,
                    inputvrijeme
                });
            popover.present({ev: myEvent});

            popover.onDidDismiss((data) => {
                if (data != null) {
                    this.provider.parametri.vrijemeod = data.start;
                    this.provider.parametri.vrijemedo = data.end;
                    if (data.type == "+d")
                        this.provider.periodHelper ="sutra";
                    else if (data.type == "d")
                        this.provider.periodHelper ="danas";
                }
            })
        } catch (ex) {
            this
                .global
                .logError(ex, true);
        }
    }

    azur() {
        let data : ICore.IData = {
            "queries": [
                {
                    "query": "spMobHrmOdsustvaNajavaAzur",
                    "params": {
                        "action": "insert",
                        "operaterid": "@@operaterid",
                        "DatumOd": this.provider.parametri.vrijemeod,
                        "DatumDo": this.provider.parametri.vrijemedo,
                        "Napomena": this.provider.parametri.napomena,
                        "ZamId": this.provider.parametri.zamjenikid,
                        "UnioId": "@@operaterid",
                        "HROdsustvaId": this.provider.parametri.hrodsustvaid,
                        "SPutMjesto": this.provider.parametri.sputmjesto,
                        "SPutZadatak": this.provider.parametri.sputzadatak,
                        "SPutAkontacija": this.provider.parametri.sputakontacija,
                        "SPutPrijevoz": this.provider.parametri.sputprijevoz,
                        "SPutFirma": this.provider.parametri.sputfirma,
                        "UkljuciSate": this.provider.parametri.ukljucisate,
                        "UkljuciZamjenika": this.provider.parametri.ukljucizamjenika
                    }
                }
            ]
        }
        this
            .global
            .getData(data, true)
            .then(() => this.provider.resetValues())
            .then(() => this.global.presentToast("Najava odsustva je kreirana i poslana na odobravanje."))
            .catch(ex => this.global.logError(ex, false));
    }

    clearValue(slide, value?, name?, nameVal?) {
        slide.close();
        if (value != null)
            this.provider.parametri[value] = null;
        if (name != null)
            this.provider.parametri[name] = nameVal;
    }

    validateVrijeme(tip, iskljuciTypeText?: boolean) {
        if (iskljuciTypeText != false) {
            this.provider.periodHelper = null;
        }
        if (this.provider.parametri.vrijemeod >= this.provider.parametri.vrijemedo) 
        {
            var satiAdd: number = 1;
            if (this.provider.parametri.ukljucisate == false)
            {
                satiAdd = 0;
            }

            if (tip == "od")
                this.provider.parametri.vrijemedo = (Moment(this.provider.parametri.vrijemeod).add(satiAdd, 'hour')).format();
            else if (tip == "do")
                this.provider.parametri.vrijemeod = (Moment(this.provider.parametri.vrijemedo).add((-1 * satiAdd), 'hour')).format();
        }
    }

    ukljuciSateChange() {
        if (this.provider.parametri.ukljucisate == true) {
            this.validateVrijeme("od", false);
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
                        if (action == "hrkadrovi") {
                            this.provider.parametri.zamjenikid = data.id;
                            this.provider.parametri.zamjenik = data.naziv;
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


}
