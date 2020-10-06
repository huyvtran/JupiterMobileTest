import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController,  LoadingController, NavParams, Navbar } from 'ionic-angular';


import { BasePage } from '../../../../../providers/base/base-page';
import { TerkomObavijestiProvider } from '../../../../../providers/modules/terkom/terkom-obavijesti-provider';



/*
  Generated class for the Pregled page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-obavijesti',
  templateUrl: 'obavijesti.html'
})
export class TerkomObavijestiPage extends BasePage {

  parstruid : number = null;
  partneriid : number = null;
  constructor(public navParams : NavParams ,
    public navCtrl: NavController,
    public loading: LoadingController,
    private obavijestiService : TerkomObavijestiProvider
  ) {
    super();
      this.parstruid = this.navParams.get('parstruid');
      this.partneriid = this.navParams.get('partneriid');
      console.log(this.parstruid)
      console.log(this.partneriid)
  }

  ionViewDidEnter() {
    this.obavijestiService.getObavijesti(this.parstruid,this.partneriid)
  }

  ionViewDidLoad() {
    //console.log("pregled");
  }


  prikaziDetalje(item){
      let loading = this.loading.create({
          content: 'Loading...'
      });

      loading.present().then(() => {
        this.navCtrl.push("TerkomObavijestDetailPage", {obavijest : item});
        setTimeout(() => {
          loading.dismiss();
        }, 500);
      });
  }





}
