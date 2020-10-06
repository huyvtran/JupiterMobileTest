import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { SkladistePrijemniListProvider } from '../../../../../providers/modules/skladiste/skladiste-prijemni-list-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';


@IonicPage()
@Component({
  selector: 'page-skladiste-prijemni-list-pregled-filter',
  templateUrl: 'skladiste-prijemni-list-pregled-filter.html',
})
export class SkladistePrijemniListPregledFilterPage extends BasePage {

  skladista:any = [];
  initSkladisteId:number = null;
  initDatumOd:string = '';
  initDatumDo:string = '';
  odabranoSkladisteNaziv:string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: SkladistePrijemniListProvider
    ,private viewCtrl: ViewController, private popoverCtrl: PopoverController, private helpers:HelpersProvider) {
    super();

    this.provider.getSkladistaPrava('%')
    .then((res)=> { this.skladista = res; })
    .then ((res)=>{console.log(res)})
    .then ((res)=>{console.log(this.skladista)})

    this.initSkladisteId = provider.primkeFilterSkladisteId;
  }


  applyFilter() {
    // console.log(this.provider.primkeFilterSkladiste)
    if (this.provider.primkeFilterSkladisteId != null)
      {
        var getNewResultSet1 = this.initSkladisteId == this.provider.primkeFilterSkladisteId ? false : true;
        var getNewResultSet2 = this.initDatumOd == this.provider.primkeFilterDatumOd ? false : true;
        var getNewResultSet3 = this.initDatumDo == this.provider.primkeFilterDatumDo ? false : true;
        this.viewCtrl.dismiss(getNewResultSet1 || getNewResultSet2 || getNewResultSet3);
        this.provider.primkeFilterSkladisteNaziv = (this.skladista.find(skladiste => skladiste.id == this.provider.primkeFilterSkladisteId).skladiste)
        // console.log(this.provider.primkeFilterSkladisteNaziv)
      }
    else
      this.helpers.presentToast('Niste odabrali skladište', null, 1000);
  }

  presentPopover(myEvent) {
    let popover = this
        .popoverCtrl
        .create('SharedDateFilterPage');
    popover.present({ ev: myEvent });

    popover.onDidDismiss((data) => {
        if (data != null) 
        {
            this.provider.primkeFilterDatumOd = data.start;
            this.provider.primkeFilterDatumDo = data.end;
        }
    })
}

}
