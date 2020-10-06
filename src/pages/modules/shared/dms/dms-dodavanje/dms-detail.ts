import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    AlertController
} from 'ionic-angular';

import { FileChooser } from '@ionic-native/file-chooser';
import { BasePage } from '../../../../../providers/base/base-page';
import * as IFile from '../../../../../interfaces/modules/dms/IFile';

import { FilePath } from '@ionic-native/file-path';
import { DMSProvider } from '../../../../../providers/modules/shared/dms-provider';
import { UtilityDMSService } from '../../../../../providers/modules/utility/utility-dms-provider';


/*
  Generated class for the Bugshooter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@IonicPage()
@Component(
    {
        selector: 'dms-detail-page',
        templateUrl: 'dms-detail.html'
    })
export class DMSGenericDetailPage extends BasePage {

    folderid: string = '';

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private alertCtrl: AlertController,
        private dms: UtilityDMSService,
        private dmsService: DMSProvider,
        private fileChooser: FileChooser,
        private filePath: FilePath) {
        super();

        this.folderid = this.navParams.get('folderid')

        console.log(this.folderid)

    }

    ionViewDidLoad() { }

    getButtonState(): boolean {
        //console.log(this.dmsService.base64Image)
        if (this.dmsService.base64Image.length == 0 && this.dmsService.base64Files.length == 0)
            return true;
        else
            return false;
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
                        }
                    }, {
                        text: 'Potvrdi',
                        handler: () => {
                            this
                                .dmsService.base64Image
                                .splice(i, 1);
                        }
                    }
                ]
            });
        alert.present();
    }

    deleteFileConfirm(i, slp) {
        let alert = this
            .alertCtrl
            .create({
                message: 'Potvrdite brisanje dokumenta...',
                buttons: [
                    {
                        text: 'Odustani',
                        role: 'cancel',
                        handler: () => {
                            slp.close();
                        }
                    }, {
                        text: 'Potvrdi',
                        handler: () => {
                            slp.close();
                            this
                                .dmsService.base64Files
                                .splice(i, 1);
                        }
                    }
                ]
            });
        alert.present();
    }

    openFile(file) {
        console.log(file)
        this.dms.openFile(file.path + file.fileName);
    }

    deleteFile(slp, i) {
        console.log(i)
        this.deleteFileConfirm(i, slp);

    }


    send() {
        this.variable.loaderActive = true;
        let promises = [];
        this.dmsService.base64Image.forEach((img, key) => {
            let image = img.split(',')[1]
            let file: IFile.File = {}
            if (this.folderid){
                file = {
                    content: image,
                    folderid: this.folderid,
                    filename: "Slika_" + key + ".jpg"
                }
                //console.log(file)
                promises.push(this.dmsService.sendDMSFile(file))
            }
            else{
                file = {
                    content: image,
                    entitiyid: this.dmsService.entityid,
                    entitiyname: this.dmsService.entityname,
                    filename: "Slika_" + key + ".jpg"
                }
                //console.log(file)
                promises.push(this.dmsService.sendFile(file))
            }
           
        });

        this.dmsService.base64Files.forEach((fileObject, key) => {
            let image = fileObject.base64.split(',')[1]
            let file: IFile.File = {}
            if (this.folderid) {
                //console.log()
                file = {
                    content: image,
                    folderid: this.folderid,
                    filename: fileObject.fileName
                }
                //console.log(file)
                promises.push(this.dmsService.sendDMSFile(file))
            }
            else {
                file = {
                    content: image,
                    entitiyid: this.dmsService.entityid,
                    entitiyname: this.dmsService.entityname,
                    filename: fileObject.fileName
                }
                //console.log(file)
                promises.push(this.dmsService.sendFile(file))
            }

           
        });
        

        Promise.all(promises)
            .then((res) => {
                this.dmsService.base64Image = [];
                this.dmsService.base64Files = [];
                this.navCtrl.pop();

            })
            .catch((err) => {
                this.variable.loaderActive = false;
                console.log(err)
            })
    }

    takePicture() {
        this.dmsService.takePicture()
            .catch(err => this.global.logError(err, false));

    }

    addFile() {
        if (this.dmsService.base64Files.length < 3)
            this.fileChooser.open()
                .then(uri => {
                    console.log(uri)

                    this.filePath.resolveNativePath(uri)
                        .then(filePath => {
                            console.log(filePath)
                            var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
                            var folder = filePath.substr(0, filePath.lastIndexOf('/') + 1);

                            this.dms.readFileAsDataURL(folder, fileName)
                                .then(data => {
                                    console.log("success")
                                    this.dmsService.base64Files
                                        .push({ fileName: fileName, path: folder, base64: data });
                                })
                        })
                        .catch(err => console.log(err));


                })
                .catch(e => console.log(e));
        else
            this.upozorenje();
    }


    upozorenje() {
        let alert = this
            .alertCtrl
            .create({
                message: 'Maksimalno 3 datoteke!',
                buttons: [
                    {
                        text: 'Ok',
                        handler: () => {

                        }
                    }
                ]
            });
        alert.present();
    }

    cropPicture(index) {
        console.log(index)
    }


}
