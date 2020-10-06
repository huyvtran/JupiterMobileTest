import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController} from 'ionic-angular';



import {BasePage} from '../../../../../../providers/base/base-page';

import {ConstProvider} from '../../../../../../providers/core/const-provider';
import { TerkomIzvjestajiProvider } from '../../../../../../providers/modules/terkom/terkom-izvjestaji-provider';
import { TerkomSifarniciProvider } from '../../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import { HelpersProvider } from '../../../../../../providers/core/helpers-provider';

/*
  Generated class for the Lokacija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-izvjestaji-stanjeskladista',
  templateUrl: 'stanjeskladista.html'
})
export class TerkomIzvjestajiPutnikaStanjeSkladistaPage extends BasePage{

  SkladisteId: any[];
  KlasaRobeId: any[];
  public stanjeSkladista = new Array<any>();
  constructor(public loading: LoadingController,
    private helpers:HelpersProvider, public navCtrl: NavController,public sifarniciService : TerkomSifarniciProvider,	private izvjestajiService : TerkomIzvjestajiProvider,) {
    super();


  }

  ionViewWillEnter(){
      //console.log("asd")
      console.log("skladista su", this.sifarniciService.skladista);
      console.log("klase su su", this.sifarniciService.klaserobe);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoadStanjeSkladistaPage');
  }

prikazi(){

  if(this.validate())
  {
    let params = { "SkladisteId" : this.SkladisteId,"KlasaRobeId" : this.KlasaRobeId};

    let loading = this.loading.create({
      content: 'Loading...'
    });

    loading.present().then(() => {
			this.izvjestajiService.getStanjeSkladista(params).then(data => {
				//console.log(data);
				this.stanjeSkladista = data;
			})
        .catch(err => this.global.logError(err, false))
	      setTimeout(() => {
	        loading.dismiss();
	      }, 1000);
	    });
  }

  }

  validate() {


      if (this.SkladisteId == undefined || this.SkladisteId == null)
      { this.helpers.presentToast('Niste odabrali skladište',null, 1500); return false; }
      if (this.KlasaRobeId ==  undefined || this.KlasaRobeId == null)
      { this.helpers.presentToast('Niste odabrali klasu robe',null, 1500); return false; }

      else
        return true;
  }
}
