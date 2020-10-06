import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ItemSliding, AlertController } from 'ionic-angular';


import { BasePage } from '../../../../../providers/base/base-page';
import { TerproNarudzbaProvider } from '../../../../../providers/modules/terpro/terpro-narudzba-provider';
// import { ConstProvider } from '../../../../../providers/core/const-provider';
import { TerproSifarniciProvider } from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';
import { TerproArtiklProvider } from '../../../../../providers/modules/terpro/terpro-artikl-provider';

/*
  Generated class for the Pregled page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-terpro-narudzbe-pregled',
  templateUrl: 'pregled.html'
})
export class TerproNarudzbaPregledPage extends BasePage {


  selVrstaDokId: number = -1;
  razlogStorniranja: string = null;

  constructor(/*private config: ConstProvider,*/ private narudzbeService: TerproNarudzbaProvider, private loading: LoadingController, private navCtrl: NavController
    , private sifarniciService: TerproSifarniciProvider, private artiklService: TerproArtiklProvider, private alertCtrl: AlertController
  ) {
    super();
  }

  ionViewWillEnter() {
    this.sifarniciService.loadVrsteDok()
      .then((res) => {
        this.narudzbeService.getNarudzbe(this.selVrstaDokId)
      })
      .catch(Error => console.log(Error.message));


  }

  getDokumenti() {
    this.narudzbeService.getNarudzbe(this.selVrstaDokId).catch(Error => console.log(Error.message));
  }

  deleteDokument(slidingItem: ItemSliding, nar) {

    //console.log(nar)
    if (nar.pronarudzbeglaid == null) {
      slidingItem.close();
      return;
    }


    if (nar.vrstadokoznaka != "NAR" && nar.status != 1) {
      this.global.presentToast("Dokument se ne može brisati, možete ga stornirati");
      slidingItem.close();
      return;
    }

    let alert = this.alertCtrl.create({
      title: 'Želite obrisati dokument broj ' + nar.broj + ' ?',
      buttons: [
        {
          text: 'Odustani',
          handler: () => {
            slidingItem.close();
          }
        },
        {

          text: 'Obriši',
          handler: () => {
            //console.log(id)

            // if (nar.donos === 1)
            //   this.narudzbeService.resetirajDokument(nar.pronarudzbeglaid)
            //     .then((res) => {
            //       slidingItem.close();
            //       this.global.presentToast("Uspješno resetiran dokument " + nar.broj);
            //       //console.log("parstruid " + this.narudzbeService.parstruid );
            //       this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid);
            //       this.narudzbeService.getNarudzbe();
            //     }).catch((err) => {
            //       //console.log(err);
            //       this.global.logError(err, false);
            //       this.global.presentToast("Greška prilikom vraćanja  statusa dokumenta!");
            //     });
            // else
            this.narudzbeService.delete(nar.pronarudzbeglaid, nar.vrstadokid)
              .then((res) => {
                slidingItem.close();
                if(res){
                  this.global.presentToast("Uspješno obrisan dokument " + nar.broj);
                  //console.log("parstruid " + this.narudzbeService.parstruid );
                  this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid);
                  this.narudzbeService.getNarudzbe(this.selVrstaDokId);
                }

              }).catch((err) => {
                //console.log(err);
                this.global.logError(err, false);
                this.global.presentToast("Greška prilikom brisanja!");
              });
          }
        }]
    });
    // now present the alert on top of all other content
    alert.present();

  }

  stornirajDokument(pronarudzbeglaid, razlog: string) {
    //dodaj ambalazu ovisno o vrsti dokumenta

    let content = 'Storniranje dokumenta...';
    let loading = this.loading.create({
      content: content

    });


    loading.present().then(() => {
      setTimeout(() => {
        this.narudzbeService.getIdNovogDokumenta()
          //dohvati podatke novog dokumetna
          .then((res) => {
            return this.narudzbeService.stornirajDokument(pronarudzbeglaid, razlog)
          })
          .then((res) => {
            //spremi storno dokument
            return this.narudzbeService.save(res)
          })
          .then((res) => {
            return this.narudzbeService.updateStornoDokStatus(razlog, pronarudzbeglaid)
          })
          //ako je status = 1 znaci da je vrstadokid = 78 i treba na fiskalizaciju,
          //dohvati taj dokument
          .then((res) => {
            return this.narudzbeService.getNarudzba(this.narudzbeService.newPronarudzbeglaid)
          })
          //obracunaj zaglavlje
          .then((res) => {
            return this.narudzbeService.getFinData(this.narudzbeService.newPronarudzbeglaid)
          })
          //
          .then((finData) => {
            return this.narudzbeService.zakljuciDokument(this.narudzbeService.newPronarudzbeglaid, finData)
          })
          .then((res) => {
            if (this.narudzbeService.narudzba.vrstadokid === 78)
              return this.narudzbeService.fiskalizirajDokument(this.narudzbeService.newPronarudzbeglaid)
            else
              return true
          })

          //.then((res) => { return this.narudzbeService.updateStornoDokStatus(razlog, pronarudzbeglaid) })
          .then((res) => {
            this.narudzbeService.getNarudzbe();

            if (res) {
              loading.setContent("Uspješno storniran dokument.");
              setTimeout(() => {
                loading.dismiss()
              }, 500);
            }
            else {
              loading.dismiss()
              return false;
            }

          })
          .catch((err) => {
            //console.log(err)
            loading.setContent("Greška kod storniranja dokumenta.");
            setTimeout(() => {
              loading.dismiss()
            }, 1000);
          })


      }, 500);
    });


  }

  otkaziDok(slidingItem: ItemSliding, nar) {
    let alert = this.alertCtrl.create({
      title: 'Želite otkazati dokument broj ' + nar.broj + ' ?',
      buttons: [
        {
          text: 'Odustani',
          handler: () => {
            slidingItem.close();
          }
        },
        {

          text: 'Otkaži',
          handler: () => {
            this.narudzbeService.otkaziDokument(nar.pronarudzbeglaid, nar.vrstadokid)
              .then((res) => {
                slidingItem.close();
                if(res){
                  this.global.presentToast("Uspješno otkazan dokument " + nar.broj);
                  //console.log("parstruid " + this.narudzbeService.parstruid );
                  this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid);
                  this.narudzbeService.getNarudzbe(this.selVrstaDokId);
                }


              }).catch((err) => {
                console.log(err);
                this.global.logError(err, false);
                this.global.presentToast("Greška prilikom otkazivanja dokumenta!");
              });
          }
        }]
    });
    // now present the alert on top of all other content
    alert.present();

  }
  stornoDokument(slidingItem: ItemSliding, nar) {

    if (nar.status === 1) {
      this.global.presentToast("Dokument nije zaključen, ne može se stornirati!")
      slidingItem.close();
      return
    }

    if (nar.storno === 1) {
      this.global.presentToast("Dokument je već storniran!")
      slidingItem.close();
      return
    }


    this.presentStornoRazlogPrompt(slidingItem, nar.pronarudzbeglaid);

  }

  azurirajDokument(slidingItem: ItemSliding, nar) {

    nar.prijenosind = 1;
    slidingItem.close();
    this.narudzbeService.updatePrijenosind(nar, nar.pronarudzbeglaid);

  }

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    this.narudzbeService.getNarudzbe(this.selVrstaDokId);
    setTimeout(() => {
      //console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }


  pageDetail(nar) {

    let loading = this.loading.create({
      content: 'Loading...'
    });


    this.narudzbeService.pronarudzbeglaid = nar.pronarudzbeglaid;
    this.narudzbeService.parstruid = nar.parstruid;
    this.narudzbeService.vrstaDokId = nar.vrstadokid;

    loading.present().then(() => {
      this.narudzbeService.getNarudzba(this.narudzbeService.pronarudzbeglaid)
        .then((res) => {

          this.artiklService.getStavke(this.narudzbeService.pronarudzbeglaid)
        })
        .then((res) => {

          this.navCtrl.push("TerproNarudzbaDetailPage");
          setTimeout(() => {
            loading.dismiss();
          }, 500);
        }).catch((err) => {
          //console.log("greska pri otvaranju pregleda narudzbe")
          console.log(err)
        });
    });

  }



  presentStornoRazlogPrompt(slidingItem: ItemSliding, pronarudzbeglaid) {

    let alert = this.alertCtrl.create({
      title: 'Razlog storniranja',
      inputs: [
        {
          label: 'Odustali od narudžbe',
          value: 'Odustali od narudžbe',
          type: 'radio',
          checked: true
        },
        {
          label: 'Nitko nije prisutan',
          value: 'Nitko nije prisutan',
          type: 'radio'
        },
        {
          label: 'Kašnjenje kod isporuke',
          value: 'Kašnjenje kod isporuke',
          type: 'radio'
        },
        {
          label: 'Ostalo',
          value: 'Ostalo',
          type: 'radio'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            this.razlogStorniranja = null;
          }
        },
        {
          text: 'Odaberi',
          handler: data => {
            this.razlogStorniranja = data;
          }
        }
      ]
    });

    alert.onDidDismiss((razlog) => {
      slidingItem.close();

      if (this.razlogStorniranja)
        this.stornirajDokument(pronarudzbeglaid, this.razlogStorniranja)
    })

    alert.present();
  }


}
