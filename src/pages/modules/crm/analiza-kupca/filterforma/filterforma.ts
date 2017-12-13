import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, AlertController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { BasePage } from '../../../../../providers/base/base-page';
//import * as ICore from '../../../../interfaces/iCore';


import { ItemSliding } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-crm-analizakupca-filterforma',
  templateUrl: 'filterforma.html'
})
export class CRMAnalizaKupcaFilerFormaPage extends BasePage {

  parametriupita: any = {
    action: 0,
    objektanalize: 'Ponude',
    partnerinaziv: '',
    partneriid: null,
    lokacijanaziv: '',
    lokacijaid: 0,
    klasasortkey: '%',
    klmasterrobanaziv: '',
    klmasterrobaid: null,
    orgsortkey: '%',
    orgshemanaziv: '',
    orgshemaid: null,
    datumod: '',
    datumdo: '',
    datumod2: '',
    datumdo2: ''


  };

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage, public popoverCtrl: PopoverController) {
    super();
    this.storage.get('jm_crm_analizakupcafilterforma_parametriupita').then(data => {
      if (data) {
        this.parametriupita = data;
        console.log('parametri upita koji se vuku iz storagea: ', this.parametriupita);
      }
    });
  }


  izracunaj() {
    if (this.parametriupita.objektanalize == '' || this.parametriupita.partneriid == null || this.parametriupita.datumod == '' || this.parametriupita.datumdo == '') {
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo izaberite objekt analize, razdoblje i kupca!',
        buttons: ['OK']
      });
      alert.present();

    }
    else {
      console.log("Klik izracunaj 11", this.parametriupita.datumod);

      this.spremiParametreUpita();
      this.parametriupita.datumod2 = this.parametriupita.datumod.replace(/-/g, "");
      console.log('datumod nakon replacea:', this.parametriupita.datumod);
      this.parametriupita.datumdo2 = this.parametriupita.datumdo.replace(/-/g, "");
      this.navCtrl.push('CRMAnalizaKupcaListaPage', this.parametriupita);
      // let modal = this.modalCtrl.create('CRMAnalizaKupcaListaPage', this.parametriupita);
      // modal.present();
    }
  }

  izaberi(action) {
    this.parametriupita.action = action;
    if (action == 10 && this.parametriupita.partneriid == null) {
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo izaberite partnera!',
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      let modal = this.modalCtrl.create('CRMKonsolidacijaTrazilicaPage',
        {
          'action': action, 'klmasterrobaid': this.parametriupita.klmasterrobaid
          , 'partneriid': this.parametriupita.partneriid, 'lokacijaid': this.parametriupita.lokacijaid, 'orgshema': this.parametriupita.orgshemaid
          , 'datumod': this.parametriupita.datumod, 'datumdo': this.parametriupita.datumdo
        }
        //this.parametriupita
      );
      modal.present();

      modal.onDidDismiss(data => {
        
        if(data==null){
          console.log('data je null');
          data={action:0};
          console.log('data: ', data);
        }
        if (typeof data != 'undefined') {
          if (data.action == 7) {
            if(this.parametriupita.partneriid!=data.id){
              this.parametriupita.lokacijaid=0;
              this.parametriupita.lokacijanaziv='';
              this.parametriupita.partneriid = data.id;
              this.parametriupita.partnerinaziv = data.naziv;
            }
            console.log('Kupac je ostao isti!');

          }
          if (data.action == 10) {
            this.parametriupita.lokacijaid = data.id;
            this.parametriupita.lokacijanaziv = data.naziv;
          }
          if (data.action == 11) {
            this.parametriupita.klasasortkey = data.sortkey + '%';
            this.parametriupita.klmasterrobaid = data.id;
            this.parametriupita.klmasterrobanaziv = data.naziv;
          }
          if (data.action == 4) {
            this.parametriupita.orgsortkey = data.sortkey + '%';
            this.parametriupita.orgshemaid = data.id;
            this.parametriupita.orgshemanaziv = data.naziv;
          }


        }
        

      });
    }
  }

  spremiParametreUpita() {
    this.storage.set('jm_crm_analizakupcafilterforma_parametriupita', this.parametriupita);
  }

  brisiKupca(slidingItem: ItemSliding) {
    this.parametriupita.partneriid = null;
    this.parametriupita.partnerinaziv = '';

    try {
      slidingItem.close();
    } catch (error) {
      //
    }
  }
  brisiLokaciju(slidingItem: ItemSliding) {
    this.parametriupita.lokacijaid = 0;
    this.parametriupita.lokacijanaziv = '';
    try {
      slidingItem.close();
    } catch (error) {
      //
    }
  }
  brisiKlasurobe(slidingItem: ItemSliding) {
    this.parametriupita.klmasterrobaid = null;
    this.parametriupita.klmasterrobanaziv = '';
    this.parametriupita.klasasortkey = '%';
    try {
      slidingItem.close();
    } catch (error) {
      //
    }
  }
  brisiOrganizacijskujedinicu(slidingItem: ItemSliding) {
    this.parametriupita.orgshemaid = null;
    this.parametriupita.orgshemanaziv = '';
    this.parametriupita.orgsortkey = '%';
    try {
      slidingItem.close();
    } catch (error) {
      //
    }
  }
  popoverRazdoblje(myEvent) {
    let popover = this
    .popoverCtrl
    .create('SharedDateFilterPage');
popover.present({ ev: myEvent });

popover.onDidDismiss((data) => {
    if (data != null) 
    {
      let datumod=data.start.split('T');
      let datumdo=data.end.split('T');
        this.parametriupita.datumod = datumod[0];
        this.parametriupita.datumod2 = datumod[0];
        console.log('datumod: ',this.parametriupita.datumod);
        console.log('data.start', data.start);
        this.parametriupita.datumdo = datumdo[0];
        this.parametriupita.datumdo2 =datumdo[0];
    }
})
  }
  ocistiSve() {
    this.brisiKupca(undefined);
    this.brisiLokaciju(undefined);
    this.brisiKlasurobe(undefined);
    this.brisiOrganizacijskujedinicu(undefined);
    this.parametriupita.objektanalize = 'Ponude'; 
  }
}
