import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { InventuraProvider } from '../../../../../providers/modules/inventura-provider'
import * as IInvetura from '../../../../../interfaces/modules/IInvetura';

@IonicPage()
@Component({
  selector: 'page-memo-modal',
  templateUrl: 'memo-modal.html',
})
export class MemoModalPage {

  varNaziv: string = "";
  varOpis: string = "";
  varKolicina?: number = null;
  osInventuraGlaId: number;

  constructor(private view: ViewController, private invProvider: InventuraProvider) {

    this.osInventuraGlaId = this.invProvider.osinventuraglaid;
  }

  confirm() {
    if (this.varNaziv == "" || this.varOpis == "") {
      this.invProvider.localToast('Sva polja moraju biti popunjena!');
      return;
    }
    else {
      var memoStavka = this.createMemoStavka();

      this.invProvider.updateStavka('newOne', null, null, memoStavka)
        .then((res) => {
          this.closeModal();
        });
    }
  }
  closeModal() {
    this.view.dismiss();
  }

  createMemoStavka(): IInvetura.InventuraStavka {
    let novaStavka = new IInvetura.InventuraStavka;
    novaStavka.barcode = "";
    novaStavka.datumpopisa = "";
    novaStavka.invbroj = "";
    novaStavka.naziv = this.varNaziv;
    novaStavka.osimovinaid = null;
    novaStavka.osinventuraglaid = this.osInventuraGlaId;
    novaStavka.osinventuradetid = null;
    novaStavka.popisanakolicina = (this.varKolicina != null && this.varKolicina > 0) ? +this.varKolicina : 1;
    novaStavka.smjestajnakolicina = 0;
    //novaStavka.vrijemepromjene = dateNow.toString();
    novaStavka.memo = this.varOpis;
    novaStavka.guid = this.invProvider.generateUUID();

    return novaStavka;
  }
}
