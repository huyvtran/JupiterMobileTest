import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HrmResursiZauzecaProvider } from '../../../../../../providers/hrm-resursi-zauzeca';
// import { HrmResursiZauzecaMainPage } from '../main/main';

import { BasePage } from '../../../../../../providers/base/base-page';

import * as ICore from '../../../../../../interfaces/iCore';
import * as Moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-hrm-resursi-zauzeca-pregled-det',
  templateUrl: 'pregled-det.html',
  providers: [HrmResursiZauzecaProvider]
})
export class HrmResursiZauzecaPregledDetPage extends BasePage {

  params: any;
  zauzeca: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: HrmResursiZauzecaProvider,
    private alertCtrl: AlertController,
    //  private mainPage: HrmResursiZauzecaMainPage
  ) {
    super();
    this.params = this.navParams.get('params');
    console.log(this.params)

    this.getZauzeca30dana(this.params.hrresursiid).then(data => {
      this.zauzeca = data;
    });


  }


  getZauzeca30dana(hrresursiid) {
    let data: ICore.IData = {
      "queries": [
        {
          "query": "spMobHRMResursiZauzeca",
          "params": {
            "action": "zauzeceZa30dana",
            "Danas": this.provider.danasDatum,
            "HrResursiId": hrresursiid,
            "operaterid": "@@operaterid"
          }
        }
      ]
    }
    return this
      .global
      .getData(data, true);
  }

  datumFormat(datum) {
    return Moment(datum).format("DD.MM.YYYY");
  }

  checkHrKadroviId(zauzece) {
    console.log(zauzece)
    if (zauzece.hrkadroviid == zauzece.hrkadroviidmoj)
      return true;

    else
      return false;
  }

  deleteZauzece(zauzece) {
    this.presentConfirm(zauzece);

    // var p = new Promise(this.presentConfirm(zauzece))
  }

  presentConfirm(zauzece) {
    let alert = this.alertCtrl.create({
      title: 'Potvrdite brisanje',
      message:
      '<strong>Resurs:</strong><br>' + zauzece.naziv + '<br><br>'
      + '<strong>Period: </strong><br>'
      + 'Od: ' + this.datumFormat(zauzece.datumod) + '<br>'
      + 'Do: ' + this.datumFormat(zauzece.datumdo) + '<br><br>',

      buttons: [
        {
          text: 'Odustani',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Obriši',
          handler: () => {
            this.cancelZauzece(zauzece.hrresursizauzeceid)
              .then(() => {
                this.getZauzeca30dana(this.params.hrresursiid)
                  .then(data => {
                    this.zauzeca = data
                  })
              })
              .catch((err) => console.log(err.message));
          }
        }
      ]
    });
    alert.present();
  }

  cancelZauzece(hrresursizauzeceid) {
    let data: ICore.IData = {
      "queries": [
        {
          "query": "spMobHRMResursiZauzeca",
          "params": {
            "action": "cancelZauzece",
            "HrResursiZauzeceId": hrresursizauzeceid
          },
        }
      ]
    }
    return this
      .global
      .getData(data, true);
  }
}
