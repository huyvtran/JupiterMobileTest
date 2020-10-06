import { Component } from '@angular/core';
import { NavParams, ViewController,IonicPage, LoadingController, ItemSliding, AlertController, ToastController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
import {TerproNarudzbaProvider} from '../../../../../providers/modules/terpro/terpro-narudzba-provider';
import {TerproSifarniciProvider} from '../../../../../providers/modules/terpro/terpro-sifarnici-provider';

/*
  Generated class for the ObilazakAkcijaIzbor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'terpro-page-obilazak-akcija-izbor',
  templateUrl: 'obilazak-akcija-izbor.html'
})
export class TerproObilazakAkcijaIzborPage extends BasePage{
  lokacija : string;
	data : any = []
  vrstaDok : string;
  razlogStorniranja: string = null;
  constructor(private toastCtrl:ToastController ,private loading: LoadingController, private sifarniciService: TerproSifarniciProvider, public navParams: NavParams, public narudzbeService : TerproNarudzbaProvider, public viewCtrl : ViewController, private alertCtrl: AlertController) 
  {
      super()
      this.lokacija = this.navParams.get('lokacija');
      this.vrstaDok = this.navParams.get('vrstaDok');
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObilazakAkcijaIzborPage');
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }


  createNarudzba(){
  	this.data.id = null;
  	this.viewCtrl.dismiss(this.data);
  }

  editNarudzba(id){
  	//console.log(id);
  	this.data.id = id;
  	this.viewCtrl.dismiss(this.data);
  }


  deleteNarudzba(slidingItem: ItemSliding,nar){


    if (nar.pronarudzbeglaid == null){
      slidingItem.close();
      return;
    }
      

    if (nar.vrstadokoznaka != "NAR" && nar.status != 1) {
      this.global.presentToast("Dokument se ne može brisati, možete ga stornirati");
      slidingItem.close();
      return;
    }

    let alert = this.alertCtrl.create({
      title: 'Želite obrisati dokument?',
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
          //delete  narudzbe
          this.narudzbeService.delete(nar.pronarudzbeglaid, nar.vrstadokid).then((res) => {
                slidingItem.close(); 
                if(res){
                  this.presentToast("Dokument uspješno obrisan"); 
                  //console.log("parstruid " + this.narudzbeService.parstruid );
                  this.narudzbeService.getNarudzbeLokacija()
                  .then((res) => this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid))
                  .then((res)=> this.narudzbeService.getNarudzbe())
                  .then((res)=> {
                    //console.log("zavrseno")
                  })
                } 
            
      
            }).catch((err) => {
              this.global.logError(err, false);
              this.global.logError("Greška prilikom brisanja!", true);
              slidingItem.close();
              //this.presentToast("Greška prilikom brisanja!");
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

  stornirajDokument(pronarudzbeglaid, razlog: string) {
    //dodaj ambalazu ovisno o vrsti dokumenta

    let content = 'Storniranje dokumenta...';
    let loading = this.loading.create({
      content: content

    });


    loading.present().then(() => {
      setTimeout(() => {
        this.narudzbeService.getIdNovogDokumenta()
          // .then((res) => { return this.narudzbeService.stornirajDokument(pronarudzbeglaid, razlog) })
          // .then((res) => {
          //   return this.narudzbeService.save(res)
          // })
          // .then((res) => { return this.narudzbeService.updateStornoDokStatus(razlog, pronarudzbeglaid) })

          //dohvati podatke novog dokumetna
          .then((res) => { return this.narudzbeService.stornirajDokument(pronarudzbeglaid, razlog) })
          .then((res) => {
            //spremi storno dokument
            return this.narudzbeService.save(res)
          })
          .then((res) => { return this.narudzbeService.updateStornoDokStatus(razlog, pronarudzbeglaid) })
          //ako je status = 1 znaci da je vrstadokid = 78 i treba na fiskalizaciju, 
          //dohvati taj dokument
          .then((res) => { return this.narudzbeService.getNarudzba(this.narudzbeService.newPronarudzbeglaid)})
          //obracunaj zaglavlje
          .then((res) => { return this.narudzbeService.getFinData(this.narudzbeService.newPronarudzbeglaid) })
          //
          .then((finData) => { return this.narudzbeService.zakljuciDokument(this.narudzbeService.newPronarudzbeglaid, finData)})
          .then((res) => {
            if (this.narudzbeService.narudzba.vrstadokid === 78)
              return this.narudzbeService.fiskalizirajDokument(this.narudzbeService.newPronarudzbeglaid)
            else
              return true
          })
          .then((res) => {
            this.narudzbeService.getNarudzbeLokacija()
            this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid)
            
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
          // .then((res) => this.narudzbeService.getNarudzbeLokacija())
          // .then((res) => this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid))
          // .then((res) => {
          //   //this.narudzbeService.getNarudzbe();
          //   loading.setContent("Uspješno storniran dokument.");
          //   setTimeout(() => {
          //     loading.dismiss()
          //   }, 1000);
          // })
          // .catch((err) => {
          //   //console.log(err)
          //   loading.setContent("Greška kod storniranja dokumenta.");
          //   setTimeout(() => {
          //     loading.dismiss()
          //   }, 3000);
          // })


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

                  this.narudzbeService.getNarudzbeLokacija()
                  .then((res) => this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid))
                  .then((res)=> this.narudzbeService.getNarudzbe())
                  .then((res)=> {
                    //console.log("zavrseno")
                  })

                  // //console.log("parstruid " + this.narudzbeService.parstruid );
                  // this.sifarniciService.loadVrsteDok(this.narudzbeService.parstruid);
                  // //this.narudzbeService.getNarudzbe();
                  // this.narudzbeService.getNarudzbeLokacija()
                }
               
              }).catch((err) => {
                console.log(err);
                this.global.logError(err, false);
                this.global.presentToast("Greška prilikom brisanja!");
              });
          }
        }]
    });
    // now present the alert on top of all other content
    alert.present();

  }



  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


}
