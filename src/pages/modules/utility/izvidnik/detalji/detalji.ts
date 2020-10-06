import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { UtilityIzvidnikProvider } from '../../../../../providers/modules/utility/izvidnik/utility-izvidnik-provider';

/**
 * Generated class for the DetaljiPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalji',
  templateUrl: 'detalji.html',
})
export class DetaljiPage extends BasePage {

  detaljiObject:any
  currentId:number
  img:any
  allimages:any = [];
  dogadjaj: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private izvidnikProvider:UtilityIzvidnikProvider, private alertCtrl : AlertController) {
    super()
    console.log("data");
    console.log(this.navParams.get('data'));
    this.dogadjaj = this.navParams.get('data')
    console.log(this.dogadjaj.arkod);

    // this.currentId = this.navParams.get('data')[0].ratizvidid
    // this.allimages = this.detaljiObject[0].slike

    this.izvidnikProvider.getSlikeById("slikebyId", this.dogadjaj.ratizvidid).then(res => {

        // res.detalji
        console.log("dohvacam slike alternativno");
        console.log(res);
        this.allimages.push(res.detalji)
        console.log(this.allimages)
      })
    
  }

  Obrisi(id:number){

    this.izvidnikProvider.dismissType = 'delete'
    this.izvidnikProvider.obrisiDogadjaj(id)
    this.navCtrl.pop()
  
  }

  dismissModal(){
    this.izvidnikProvider.dismissType = 'dismiss'
    this.navCtrl.pop()
  }

  deleteDogadjajConfirm(id:number) {
    let alert = this
        .alertCtrl
        .create({
            message: 'Potvrdite brisanje događaja...',
            buttons: [
                {
                    text: 'Odustani',
                    role: 'cancel',
                    handler: () => {
                    }
                }, {
                    text: 'Potvrdi',
                    handler: () => {
                        this.Obrisi(id)
                           
                    }
                }
            ]
        });
    alert.present();
    }


  uvecajSliku(){
  }


}
