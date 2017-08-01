import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, App} from 'ionic-angular';
import {Camera} from '@ionic-native/camera';
import {Diagnostic} from '@ionic-native/diagnostic';

import { GlobalProvider } from '../../../providers/global-provider';


/*
  Generated class for the Bugshooter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@IonicPage()
@Component({selector: 'page-test-bugshooter', templateUrl: 'bugshooter.html'})
export class TestBugshooterPage {
    // public base64Image: string; public base64Image: any; public base64Image: any;
    public base64Image : Array < string > = new Array < string > ();

    constructor(public navCtrl : NavController, public navParams : NavParams, public toastCtrl : ToastController, private alertCtrl : AlertController, 
        private diagnostic: Diagnostic, private camera: Camera, private app: App, private globalProvider: GlobalProvider)
    {
        this.checkPermissions();
    }

    checkPermissions() {
        this.diagnostic
            .isCameraAuthorized()
            .then((authorized) => {
                if (authorized//this.initializePreview();
                ) {} else {
                    this.diagnostic
                        .requestCameraAuthorization()
                        .then((status) => {
                            if (status == this.diagnostic.permissionStatus.GRANTED//this.initializePreview();
                            ) {} else {
                                // Permissions not granted Therefore, create and present toast
                                this
                                    .toastCtrl
                                    .create({message: "Nemoguće pristupiti kameri", position: "bottom", duration: 5000})
                                    .present();
                            }
                        });
                }
            });
    }

    ionViewDidLoad() {}

    takePicture() {
        this.camera
            .getPicture({destinationType: this.camera.DestinationType.DATA_URL, targetWidth: 1000, targetHeight: 1000})
            .then((imageData) => {
                // imageData is a base64 encoded string this.base64Image =
                // "data:image/jpeg;base64," + imageData;
                this
                    .base64Image
                    .push("data:image/jpeg;base64," + imageData);
            }, (err) => {
                console.log(err);
            });
    }

    deletePicture(i) {
        this.deletePictureConfirm(i);
        //this.test.splice(i, 1);
    }

    deletePictureConfirm(i) {
        let alert = this
            .alertCtrl
            .create({
                message: 'Potvrdite brisanje slike...',
                buttons: [
                    {
                        text: 'Odustani',
                        role: 'cancel',
                        handler: () => {
                            console.log('Odustani...');
                        }
                    }, {
                        text: 'Potvrdi',
                        handler: () => {
                            this
                                .base64Image
                                .splice(i, 1);
                        }
                    }
                ]
            });
        alert.present();
    }

    uIzradi() {
        let message = "Funkcionalnost je u izradi";
        
        let toast = this
            .toastCtrl
            .create({message: message, duration: 3000, position: 'bottom'});

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

    goBack() {
        this
            .app
            .getRootNav()
            .setRoot('CoreCcTabsPage', {}, {
                animate: true,
                direction: 'backward'
            });
    }

}
