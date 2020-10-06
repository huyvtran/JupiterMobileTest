import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {BasePage} from '../../../../../providers/base/base-page';
import { UtilityMobEvProvider } from '../../../../../providers/modules/utility/mobilne-evidencije/utility-mobilne-evidencije-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';
/**
 * Generated class for the RadniNaloziDodajKontroluPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-radni-nalozi-dodaj-kontrolu',
  templateUrl: 'radni-nalozi-dodaj-kontrolu.html',
})
export class RadniNaloziDodajKontroluPage extends BasePage {


  kontroleList:any[] = []
  uzorci:number[] = []
  kkvallnparametarrobaid: number;
  odabraniUzorak:number;
  kkvalglaid:number;
  get selectedOptions() {
    return this.kontroleList
      .filter(opt => opt.checked)
      .map(opt => opt)
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: UtilityMobEvProvider
    , private viewCtrl:ViewController, private helpersProvider: HelpersProvider ) {
    super();
  }

  ionViewDidLoad() {
    console.log('roba: ' + this.navParams.data.robaid);
    this.kkvalglaid = this.navParams.data.kkvalglaid;

    this.provider.getKontrolePoRobi(this.navParams.data.robaid)
    .then(res=>{
      this.kontroleList = res.kontrole
      console.log(this.kontroleList)
    })

    for(var i = 0;i<this.navParams.data.uzorci.length;i++) { 
      this.uzorci[i] = this.navParams.data.uzorci[i];
    }
    this.odabraniUzorak = this.uzorci[0];
  }

  checkAll() {
    var checkedAllState = this.selectedOptions.length == this.kontroleList.length ? true : false;

    this.kontroleList.forEach(stavka => {
      stavka.checked = !checkedAllState;
    });
  }

  kreirajNoveKontroleUzorka() {
    return new Promise<any>((resolve,reject)=> {
      this.selectedOptions.forEach(selectedKontrola => {

        let novaKontrola = {
          kkvalglaid: this.kkvalglaid,
          kkvallnparametarrobaid: selectedKontrola.kkvallnparametarrobaid,
          stringval:'',
          boolval:null,
          decval:null,
          opis:'',
          orgshemaid:null,
          osobeid:null,
          uzorak:this.odabraniUzorak
        }
        this.provider.insertKontrola(novaKontrola)
        .catch(err => {
          reject(err)
        })
      });
      resolve();
    })
  }

  dodajNovuKontroluUzorka() {
    this.kreirajNoveKontroleUzorka()
    .then( res => { this.viewCtrl.dismiss(this.odabraniUzorak); this.helpersProvider.presentToast('Kontrole uspješno dodane',null, 2000) },
           rej => { this.helpersProvider.presentToast(rej, null, 3000) })
  }

  buttonState() {
    if (this.odabraniUzorak == null || this.selectedOptions.length == 0)
      return true;

    return false;
  }

}
