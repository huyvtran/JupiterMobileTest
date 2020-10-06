import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { InventuraProvider } from '../../../../../providers/modules/inventura-provider'
import { BasePage } from '../../../../../providers/base/base-page';

@IonicPage()
@Component({
  selector: 'page-kolicina-modal',
  templateUrl: 'kolicina-modal.html',
})
export class KolicinaModalPage extends BasePage  {

  item: any = [];
  imovinaNaziv: string = "";
  imovinaInvBroj: string = "";
  imovinaBarcode: string = "";
  imovinaKolicina: number = 0;
  osinventuraglaid: number;

  constructor(private view: ViewController, public navParams: NavParams, private invProvider: InventuraProvider) {
      super();

    this.item = navParams.get('data');
    console.log(this.item);
    this.osinventuraglaid = this.invProvider.osinventuraglaid;

    this.imovinaNaziv = this.item.naziv;
    this.imovinaInvBroj = this.item.invbroj;
    this.imovinaBarcode = this.item.barcode;
    this.imovinaKolicina = this.item.popisanakolicina;

    console.log(this.item)
  }
  closeModal() {
    this.view.dismiss();
  }

  editKolicina(kolicina) {
    this.imovinaKolicina = Number(this.imovinaKolicina) + Number(kolicina);
  }
  setKolicina() {
    if (this.imovinaKolicina > 0) {
      this.invProvider.updateStavka('scanEnterNumber', this.item, this.imovinaKolicina)
        .then((res) => {
          this.closeModal();
        });
    }
    else {
      this.invProvider.localToast('Unešena količina mora biti pozitivna vrijednost');
    }
  }

}
