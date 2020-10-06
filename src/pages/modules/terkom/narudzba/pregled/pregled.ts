import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Content, LoadingController, ActionSheetController, Platform, Events, ItemSliding, AlertController } from 'ionic-angular';


import { BasePage } from '../../../../../providers/base/base-page';
import { TerkomNarudzbaProvider } from '../../../../../providers/modules/terkom/terkom-narudzba-provider';
import { TerkomSifarniciProvider } from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import { TerkomArtiklProvider } from '../../../../../providers/modules/terkom/terkom-artikl-provider';
import { StorageProvider } from '../../../../../providers/core/storage-provider';
import * as INarudzba from '../../../../../interfaces/terkom/INarudzba';

/*
  Generated class for the Pregled page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-pregled',
  templateUrl: 'pregled.html'
})
export class TerkomNarudzbaPregledPage extends BasePage {

  @ViewChild(Content) content: Content;

  // datumOd: string = new Date().toISOString();
  // datumDo: string = new Date().toISOString();
  // segment: string = "narudzbe";
  // showSearchBar: boolean = true;
  // queryText = '';
  // public realizacija = new Array<any>();

  // public totalhL: number = 0;
  // public totaliznos: number = 0;

  zabrana: boolean = false;
  upozorenje: boolean = true;
  dozvolislanje: boolean = false;

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    private narudzbeService: TerkomNarudzbaProvider,
    public loading: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public events: Events,
    public sifarniciService: TerkomSifarniciProvider,
    private artiklService: TerkomArtiklProvider,
    private storage: StorageProvider

  ) {
    super();
  }

  ionViewWillEnter() {
    this.narudzbeService.getNarudzbe().catch(Error => console.log(Error.message));
    if (this.sifarniciService.ponovnoSlanjeZabrana === 1)
      this.zabrana = true;
    else
      this.zabrana = false

    if (this.sifarniciService.ponovnoSlanjeUpozorenje === 1)
      this.upozorenje = true;
    else
      this.upozorenje = false;
  }

  ionViewDidLoad() {
    //console.log("pregled");
  }


  goToDetails(slidingItem: ItemSliding, id, vrstaDok) {
    if (id == null)
      return;

    this.narudzbeService.NarudzbaID = id;
    //console.log(data);
    let loading = this.loading.create({
      content: 'Loading...'
    });

    loading.present().then(() => {
      slidingItem.close();
      this.navCtrl.push("TerkomNarudzbaDetailPage", { vrstaDok: vrstaDok });
      setTimeout(() => {
        loading.dismiss();
      }, 1000);
    });

  }


  addNarudzba() {
    //console.log("dodajem narudzbu!");
    //redirect na obilazak
    this.events.publish('tab:change');
  }

  searchNarudzbe() {
    // return this.narudzbe.filter((item) => {
    //     console.log(item);
    //     //return item.naziv.toLowerCase().indexOf(this.queryText.toLowerCase()) > -1;
    // });     
  }

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    this.narudzbeService.getNarudzbe();
    setTimeout(() => {
      //console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  presentActionSheet(id, parstruid, broj, maxIznos, prijenosInd, vrstaDok) {

    if (id == null)
      return;
    //setaj id narudzbe u provideru
    //console.log("prijenosind " + prijenosInd);
    this.narudzbeService.NarudzbaID = id;
    this.narudzbeService.parstruid = parstruid;
    //this.narudzbeService.parstruid = parstruid;
    this.narudzbeService.MaxLimit = maxIznos;
    let loading = this.loading.create({
      content: 'Loading...'
    });

    //ako je prijenosInd == 1 znaci da je narudzba poslana i ako je zabrana ponovnog slanja  automatski otvori pregled
    if (prijenosInd == 1 && this.zabrana === true) {
      loading.present().then(() => {
        this.narudzbeService.getNarudzba(this.narudzbeService.NarudzbaID)
          .then((res) => this.artiklService.getStavke(this.narudzbeService.NarudzbaID))
          .then((res) => {
            //console.log(res)
            this.navCtrl.push("TerkomNarudzbaDetailPage", { vrstaDok: vrstaDok });
            setTimeout(() => {
              loading.dismiss();
            });
          }).catch((err) => {
            //console.log("greska pri otvaranju pregleda narudzbe")
            this.global.logError(err, false);
          });
      });
    }
    else {
      //dozvoli prijenos i ponovni prijenos, upozori ako je upozorenje true
      this.actionSheet(loading, id, broj, prijenosInd, vrstaDok);
    }


  }

  actionSheet(loading, id, broj, prijenosInd, vrstaDok) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Akcije narudžbe',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Pregled',
          icon: !this.platform.is('ios') ? 'clipboard' : null,
          handler: () => {

            loading.present().then(() => {
              this.narudzbeService.getNarudzba(this.narudzbeService.NarudzbaID)
                .then((res) => {

                  this.artiklService.getStavke(this.narudzbeService.NarudzbaID)
                })
                .then((res) => {

                  this.navCtrl.push("TerkomNarudzbaDetailPage", { vrstaDok: vrstaDok });
                  setTimeout(() => {
                    loading.dismiss();
                  });
                }).catch((err) => {
                  //console.log("greska pri otvaranju pregleda narudzbe")
                  this.global.logError(err, false);
                });
            });
          }
        },
        {
          text: 'Obriši',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //console.log('Delete clicked');
            if (prijenosInd == 0)
              this.deleteNarudzbe(id, broj);
            else
              this.global.presentToast("Ne možete obrisati narudžbu koja je poslana!");
          }
        },
        {
          text: 'Pošalji narudžbu',
          icon: !this.platform.is('ios') ? 'cloud-upload' : null,
          handler: () => {
            if (this.variable.hasInternet) {
              //prvo dohvati podatke o stavkama
              this.artiklService.getStavke(this.narudzbeService.NarudzbaID).then((res) => {
                //ako ima stavki salji 
                if (this.artiklService.stavke.length > 0) {
                  this.sendNarudzba(null, null, broj, prijenosInd);
                }
                else
                  this.global.presentToast("Narudzba nema niti jednu stavku!");
              })
            }
            else
              this.global.presentToast("Trenutno nemate internet konekciju.");

          }
        }
        // ,
        // {
        //   text: 'Pošalji neposlane narudžbe',
        //   icon: !this.platform.is('ios') ? 'send' : null,
        //   handler: () => {
        //     this.sendAll();
        //   }
        // }
      ]
    });
    actionSheet.present();
  }

  sendAll() {
    if (this.variable.hasInternet) {
      let all = true;
      this.narudzbeService.getNeposlaneNarudzbe()
        .then((res) => {

          if (this.narudzbeService.NeposlaneNarudzbeCnt <= 0) {
            this.global.presentToast("Nemate neposlanih narudžbi");
          }
          else {
            if (this.narudzbeService.NeposlaneNarudzbe.length > 0) {
              this.sendNarudzba(all, this.narudzbeService.NeposlaneNarudzbe);
            }
            else
              this.global.presentToast("Nema narudžbi za slanje");
          }
        })
    }
    else
      this.global.presentToast("Trenutno nemate internet konekciju.")
  }

  showAlert(title) {

    let alert = this.alertCtrl.create({
      title: title,
      buttons: [
        {
          text: 'Odustani',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {

          }
        }]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  sendNarudzba(all?, narudzbe?, broj?, prijenosInd?) {


    let content = 'Slanje...';
    let loading = this.loading.create({
      content: content,

    });

    let title;
    let message = "";
    if (all == true && this.zabrana == true) {
      title = "Želite poslati sve neposlane narudžbe?"
    }
    else if (all == true && this.zabrana == false) {
      title = "Želite poslati sve narudžbe?"
    }
    else {
      if (prijenosInd === 1 && this.zabrana == false) {
        title = "Narudžba broj " + broj + " već je poslana";
        message = "Želite ponovno poslati narudžbu?"
      }

      else
        title = "Želite  poslati narudžbu broj " + broj + "?"
    }

    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Odustani',
          handler: () => {
          }
        },
        {

          text: 'Pošalji',
          handler: () => {
            if (all == true) {
              let successCount: number = 0;
              let errCount: number = 0;
              loading.present().then(() => {

                setTimeout(() => {
                  this.dozvolislanje = true;
                  this.narudzbeService.getNeposlaneNarudzbe()
                    .then((res) => {
                      this.narudzbeService.postRequest().then((res) => {
                        loading.dismiss();
                        if (res && res.length > 0) {
                          res.forEach(re => {
                            if (re.success === true)
                              successCount++;
                            else
                              errCount++;
                          });
                        }
                        if (successCount == this.narudzbeService.NeposlaneNarudzbe.length)
                          this.global.presentToast("Uspješno poslane sve narudžbe (" + successCount + ")");
                        else
                          this.global.presentToast("Uspješno poslano " + successCount + " narudžba.\n Neuspješno " + errCount);
                      });
                    })
                    .catch(err => {
                      //console.log(Error) ;
                      loading.dismiss();
                      this.global.logError(err, false);
                      this.global.presentToast("Greška u slanju. Pokušajte ponovo kasnije.\n" + err);
                    });

                }, 1000);
                loading.dismiss();
              });

            }
            else

              loading.present().then(() => {

                setTimeout(() => {
                  this.dozvolislanje = true;
                  this.narudzbeService.getNeposlaneNarudzbe(this.narudzbeService.NarudzbaID)
                    .then((res) => {
                      if (this.sifarniciService.provjeriStanjePrilikomSlanja === 1) {

                        //za svaku narudzbu dohvati skladiste id i robe id stavki u string+
                        return this.checkStanjeArtiklaNaServeru(loading)
                      }
                      else
                        return res;
                    })
                    .then((res) => {
                      if (this.dozvolislanje)
                        this.narudzbeService.postRequest()
                          .then((res) => {
                            //console.log(res);
                            loading.dismiss();
                            if (res && res.length && res[0].success == true) {
                              this.global.presentToast("Uspješno poslana narudžba.")
                            }
                            else {
                              this.global.logError("Greška u slanju \n" + res[0].error, true)
                              // this.global.presentToast("Greška slanja. Pokušajte kasnije!")
                            }
                          })
                    }).catch(err => {
                      loading.dismiss();
                      this.global.logError(err, true)
                    })

                }, 1000);
                loading.dismiss();
              });

          }
        }]
    });
    // now present the alert on top of all other content
    alert.present();

  }


  checkStanjeArtiklaNaServeru(loading): Promise<INarudzba.Narudzba[]> {
    console.log("checkiram stanje na serveru")
    if (this.sifarniciService.provjeriStanjePrilikomSlanja != 1)
      return new Promise((resolve) => { resolve(); });

    return new Promise((resolve, reject) => {
      //za svaku narudzbu za svaki artikl provjeri stanje na skladistu na servisu i ustanovi moze lise poslati narudzba
      this.narudzbeService.NeposlaneNarudzbe.forEach((nar) => {

        let robaids: string = ""
        nar.stavke.forEach(stavka => {
          if (robaids === "")
            robaids += stavka.robaid.toString()
          else
            robaids += "," + stavka.robaid.toString()
        });


        this.artiklService.getStanjeArtikalaNarudzbeNaSkladistu(robaids, nar.skladisteid)
          .then((val) => {
            if (val && val.length > 0) {
              nar.stavke.forEach(stavka => {
                let stanjeNaSkladistu = this.storage.filterCollectionSingleValue(val, 'robaid', stavka.robaid);
                if ((Number(stanjeNaSkladistu.kolicina) - Number(stavka.kolicina)) < 0)
                  nar.posalji = false;
                stavka.imanastanju = (Number(stanjeNaSkladistu.kolicina) - Number(stavka.kolicina)) > 0
              });

            }
            let stavkeNaziv: string = ""
            if (!nar.posalji) {
              nar.stavke.forEach(stavka => {
                if (!stavka.imanastanju) {
                  if (stavkeNaziv === "")
                    stavkeNaziv += stavka.naziv;
                  else
                    stavkeNaziv += '<p>' + stavka.naziv + '</p>';
                }
              });

              loading.dismiss();
              this.dozvolislanje = false;
              let alert = this.alertCtrl.create({
                title: 'Arikla nema dovoljno na stanju!',
                subTitle: stavkeNaziv,
                buttons: ['Ok']
              });
              alert.present();
            }

            resolve(this.narudzbeService.NeposlaneNarudzbe);

          })
      })
    });
  }



  deleteNarudzbe(id, broj) {

    let alert = this.alertCtrl.create({
      title: 'Želite obrisati narudžbu broj ' + broj + ' ?',
      buttons: [
        {
          text: 'Odustani',
          handler: () => {
          }
        },
        {

          text: 'Obriši',
          handler: () => {
            //console.log(id)
            this.narudzbeService.delete(id).then((res) => {
              this.global.presentToast("Uspješno obrisana narudzba " + broj);
              //console.log("parstruid " + this.narudzbeService.parstruid );
              this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid);
              this.narudzbeService.getNarudzbe();
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


  // pageDetail() {
  //   this.navCtrl.push("TerkomNarudzbaDetailPage");
  // }


}
