
import { Injectable } from '@angular/core';

import * as ICore from '../../../interfaces/ICore';
import * as IFile from '../../../interfaces/modules/dms/IFile';


import { ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import { GlobalProvider } from '../../core/global-provider';


import { PhotoViewer } from '@ionic-native/photo-viewer';

/*
  Generated class for the IzvidnikProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DMSProvider {

    public base64Image: Array<string> = [];
    public base64Files: Array<{fileName: string, path: string, base64 : string}> = [];
    public entityname = ""
    public entityid = null;

    constructor(private photoViewer: PhotoViewer, private global: GlobalProvider, private camera: Camera
        , private diagnostic: Diagnostic, public platform: Platform) {
            if (this.platform.is('cordova')) {
                this.checkPermissions();
            }
    }
  


    sendFile(file : IFile.File) {
        console.log("saljem")
        console.log(file)

        let properties: ICore.IPropertiesCore = {
            customApiEndPoint: "dms/insert"
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "xxx",
                    "params": {
                        "file": file.content,
                        "filename": file.filename,
                        "entityname": this.entityname,
                        "id": this.entityid
                    }
                }
            ]
        };

        return this.global.getData(dataDef, properties);

    }

    //slanje direktno iz DMS.a
    sendDMSFile(file : IFile.File) {


        let properties: ICore.IPropertiesCore = {
            customApiEndPoint: "dms/insertFromMobileDms"
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "xxx",
                    "params": {
                        "file": file.content,
                        "filename": file.filename,
                        "folderid": file.folderid
                    }
                }
            ]
        };

        return this.global.getData(dataDef, properties);

    }

    getFiles() {
        console.log("dohvacam")


        let properties: ICore.IPropertiesCore = {
            customApiEndPoint: "dms/getDocs"
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "xxx",
                    "params": {
                        "entityname": this.entityname,
                        "id": this.entityid
                    }
                }
            ]
        };

        return this.global.getData(dataDef, properties);

    }

    previewPicture(img) {
        this.photoViewer.show(img, null, { share: true });

    }
    

    checkPermissions() {
        this.diagnostic
            .isCameraAuthorized()
            .then((authorized) => {
                if (authorized//this.initializePreview();
                ) { } else {
                    this.diagnostic
                        .requestCameraAuthorization()
                        .then((status) => {
                            if (status == this.diagnostic.permissionStatus.GRANTED//this.initializePreview();
                            ) { } else {
                                // Permissions not granted Therefore, create and present toast
                                // this
                                //     .toast
                                //     .create({ message: "Nemoguće pristupiti kameri", position: "bottom", duration: 5000 })
                                //     .present();
                            }
                        });
                }
            })
            .catch((err) => console.log(err))
    }

   
    takePicture() {
        const options: CameraOptions = {
            correctOrientation: true,  
            encodingType: this.camera.EncodingType.JPEG, 
            destinationType: this.camera.DestinationType.DATA_URL, 
            targetWidth: 1000, 
            targetHeight: 1000
        }

        return this.camera
            .getPicture(options)
            .then((imageData) => {
                // imageData is a base64 encoded string this.base64Image =
                // "data:image/jpeg;base64," + imageData;
                return this
                    .base64Image
                    .push("data:image/jpeg;base64," + imageData);
            }, (err) => {
                throw err;
            });
    }

}

