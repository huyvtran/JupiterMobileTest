import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ItemSliding } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NativePrintProvider } from '../../../../../providers/native/print/nativeprint-provider';
import { PrinterService } from '../../../../../providers/native/print/printer-provider';

@IonicPage()
@Component({
  selector: 'page-printer-list',
  templateUrl: 'printer-list.html',
})
export class PrinterListPage {
  unpairedDevices: any;
  gettingDevices: Boolean = false;;

  constructor(private printService: PrinterService, public navCtrl: NavController, private printProvider: NativePrintProvider, public navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial) {
    //bluetoothSerial.enable();

  }

  ionViewDidLoad() {
    this.startScanning(null);
  }

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    this.startScanning(refresher)

  }

  settings() {
    this.printProvider.showBTSettings();
  }
  connect(device) {

    let alert = this.alertCtrl.create({
      title: 'Spajanje',
      message: 'Želite li se spojiti sa uređajem ' + device.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.viewCtrl.dismiss(null);
          }
        },
        {
          text: 'Spoji',
          handler: () => {
            this.printService.connect(device.address)
              .then(data => {
                this.printProvider.isConnected = true;
                this.viewCtrl.dismiss(device);

              }, err => {
                //ako izgubi konekciju - ugasen printer
                this.printProvider.isConnected = false;
                if (err != null && err.errorCode === 18)

                  this.showAlert("Greška spajanja!", "Drugi uređaj je konektiran na printer ili je printer ugašen.")
                console.log(err)
              })
          }
        }
      ]
    });
    alert.present();

  }


  startScanning(refresher) {

    //this.unpairedDevices = null;
    if (!refresher)
      this.gettingDevices = true;
    this.printProvider.discoveBTUnpaired()
      .then((success) => {
        console.log(success)
        if (refresher)
          refresher.complete();
        this.unpairedDevices = success;
        this.gettingDevices = false;
      },
        (err) => {
          console.log(err);
        })
  }


  showAlert(title: string, message?: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }]
    });
    // now present the alert 
    alert.present();
  }



}
