import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, ToastController, AlertController, IonicPage } from 'ionic-angular';


import { BasePage } from '../../../../../providers/base/base-page';


import { TerproKomunikacijaProvider } from '../../../../../providers/modules/terpro/terpro-komunikacija-provider';
import { TerproSifarniciProvider } from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';
import { TerproNarudzbaProvider } from '../../../../../providers/modules/terpro/terpro-narudzba-provider';
import { TerproUserProvider } from '../../../../../providers/modules/terpro/terpro-user-provider';

/*
  Generated class for the Komunikacija page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-terpro-komunikacija',
  templateUrl: 'komunikacija.html'
})
export class TerproKomunikacijaPage extends BasePage {
  terminalId: number;
  data: any;
  text: string = "Dohvat podataka..."
  syncDate: Date
  syncActive: boolean = false;
  syncActiveSlanje: boolean = false;
  segment: string = "donos";

  successCnt: number = 0;
  errorCnt: number = 0;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController, public toastCtrl: ToastController, private komunikacijaservice: TerproKomunikacijaProvider,
    private sifarniciService: TerproSifarniciProvider, private narudzbeService: TerproNarudzbaProvider, private userProvider: TerproUserProvider) {

    super()
    this.getUserSyncData();

  }


  ionViewWillEnter() {
    // this.sifarniciService.initSifarnika()
    //   .then((res) => 
    this.narudzbeService.getKomunikacijaNeposlaneNarudzbe()
      .catch(err => this.global.logError(err, false))
  }


  getUserSyncData() {
    return this.userProvider.getUserInfo()
      .then((res) => {
        this.syncDate = res ? res.syncDate : null;
      })
  }


  getSegmentData() {
    if (this.segment === "donos")
      console.log("donos")
    else
      console.log("slanje")

  }


  syncData(refresher) {

    if (!this.variable.hasInternet) {
      //console.log("nema interneta")
      this.syncActive = false;
      this.global.presentToast("Nemate interneta!");
      if (refresher)
        refresher.complete();
    }
    else {
      if (this.narudzbeService.NeposlaneNarudzbeCnt > 0) {
        let alert = this.alertCtrl.create({
          title: 'Provjera neposlanih dokumenata',
          message: 'Postoje zaključeni dokumenti koji nisu poslani!',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                this.syncActive = false;
                if (refresher)
                  refresher.complete();
              }
            }
          ]
        });
        alert.present();
      }
      else {
        this.syncPodataka(refresher);
      }
    }
  }

  syncWithButton() {
    this.syncActive = true;
    this.syncData(null);
  }

  sendDocuments() {


    if (this.variable.hasInternet) {

      this.narudzbeService.getNeposlaneNarudzbe()
        .then((res) => {
          console.log(res)
          if (this.narudzbeService.NeposlaneNarudzbeCnt <= 0) {
            this.global.presentToast("Nemate neposlanih dokumenata");;
          }
          else {
            if (this.narudzbeService.NeposlaneNarudzbe.length > 0 || this.narudzbeService.NeFiskaliziraniRacuni.length > 0) {
              this.sendNarudzba(this.narudzbeService.NeposlaneNarudzbe);
            }
            else {
              this.global.presentToast("Nema dokumenata za slanje");
            }
          }
        })
    }
    else {
      this.global.presentToast("Trenutno nemate internet konekciju.")
    }


  }



  sendNarudzba(narudzbe?, prijenosInd?) {
    let title = "Želite poslati sve neposlane dokumente?";
    let message = "";



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
            this.syncActiveSlanje = true;

            this.successCnt = 0;
            this.errorCnt = 0;


            this.narudzbeService.postRequest()
              .then((res) => {
                console.log("finished update ")
                if (res && res.length > 0) {
                  res.forEach(re => {
                    if (re.success === true)
                      this.successCnt++;
                    else
                      this.errorCnt++;
                  });
                }

                return true;
              })
              .then((res) => {
                console.log("fiskal")
                var promises = []
                return this.fiskalizirajDokumente();

              })

              .then((res) => {
                console.log("get neposlane")
                this.syncActiveSlanje = false;
                this.narudzbeService.getNeposlaneNarudzbe().then((res) => {
                  let toastMessage = "Uspješno poslano " + this.successCnt + " dokumenata.";

                  if (this.errorCnt > 0)
                    toastMessage += " Neuspješno " + this.errorCnt;

                  if (this.successCnt == this.narudzbeService.NeposlaneNarudzbe.length) // + this.narudzbeService.NeFiskaliziraniRacuni.length
                    this.global.presentToast("Uspješno poslani svi dokumenti (" + this.successCnt + ")");
                  else
                    this.global.presentToast(toastMessage);
                })




              })
              .catch(err => {
                //console.log(Error) ;
                this.narudzbeService.getNeposlaneNarudzbe();
                this.syncActiveSlanje = false;
                this.global.logError(err, false);
                this.global.presentToast("Greška u slanju. Pokušajte ponovo kasnije.");
              });

          }
        }]
    });
    // now present the alert on top of all other content
    alert.present();

  }


  fiskalizirajDokumente(): Promise<any> {
    //console.log("kreiram json")

    return new Promise((resolve, reject) => {
      var promises = []
      this.narudzbeService.NeFiskaliziraniRacuni.forEach((racun) => {

        promises.push(this.narudzbeService.fiskalizirajDokument(racun.pronarudzbeglaid)
          .then((res) => {
            //uspjesno
            console.log("fiskall success")
            this.successCnt++;
          }).catch((err) => {
            console.log("fiskall error")
            this.errorCnt++;
          })
        )

      });

      resolve(Promise.all(promises));
    });
  }





  private syncPodataka(refresher) {
    this.komunikacijaservice.getSifarniciData()
      .then((val) => {
        this.data = val
        return this.komunikacijaservice.saveToStorage(this.data)
      })
      .then((val) => {
        //osvjezi sifarnike
        this.syncActive = false;
        return this.sifarniciService.initSifarnika()
      })
      //dodaj dodatke kolone na narudzbe
      .then((res) => {
        return this.komunikacijaservice.alterNarudzbeTable();
      })
      .then((res) => {
        return this.komunikacijaservice.alterStavkaTable();
      })

      //obrisi narudzbe priliko sinkronizacije
      //.then((val) => {return this.narudzbeService.isprazniNarudzbe()})
      .then((val) => { return this.userProvider.setSyncDate() })
      .then(() => { return this.getUserSyncData() })
      .then((val) => {
        this.syncActive = false;
        this.global.presentToast("Uspješna sinkronizacija");
        if (refresher)
          refresher.complete()
      })
      .catch((err) => {
        this.syncActive = false;
        this.global.logError(err, true);
        //this.global.logError("Dogodila se greška. Pokušajte ponovno");
        if (refresher)
          refresher.complete()
      })
  }

}
