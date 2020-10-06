import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';


import { BasePage } from '../../../../../providers/base/base-page';
import { TerkomObavijestiProvider } from '../../../../../providers/modules/terkom/terkom-obavijesti-provider';



/*
  Generated class for the Pregled page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-obavijest-detail',
  templateUrl: 'obavijest-detail.html'
})
export class TerkomObavijestDetailPage extends BasePage {

  obavijest: any = [];
  test: string = "asdasdasd<br/>asdasdasdsasd"
  constructor(
    public navParams: NavParams,
    private obavijestiService: TerkomObavijestiProvider
  ) {
    super();
  }


  ionViewDidLoad() {
    this.obavijest = this.navParams.get('obavijest');

    //azuriraj da je vijest procitana
    this.obavijestProcitana();
    this.obavijestiService.updateStorageObavijest(this.obavijest.mobterkom_obavijestioperateriid)
    .catch((err) => console.log(err))
  }

  obavijestProcitana() {
    if (this.variable.hasInternet) {
      this.obavijestiService.azurirajObavijest(this.obavijest.mobterkom_obavijestioperateriid)

        .subscribe((data: any) => {
          console.log(data);
        },
          (err) => {
            this.global.logError(err, true)
          });
    }

  }



}
