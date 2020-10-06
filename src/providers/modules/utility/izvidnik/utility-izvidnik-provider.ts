
import { Injectable } from '@angular/core';

import { GlobalProvider } from '../../../core/global-provider';
import * as ICore from '../../../../interfaces/ICore';
import { ConstProvider } from '../../../core/const-provider';
import { ModalController } from 'ionic-angular';
import { HelpersProvider } from '../../../core/helpers-provider';
import { Camera } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NativeNetworkPluginProvider } from '../../../native/network/network-provider';
import { NativeGeolocationPluginProvider } from '../../../native/geolocation/geolocation-provider';
import { Platform } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the IzvidnikProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UtilityIzvidnikProvider {

    parametriIzv: IParametri = {
        ID: null,
        Naziv: null,
        Oznaka: null,
        Povrsina: null
    };

    planSjetve: IPlanSjetve = {
        KultureId: null,
        SorteId: null
    };

    dismissType: string
    koordinate: any = { latitude: Number, longitude: Number }
    trenutniArkod: any

    base64Image: string[] = []
    menuPermissions: any[] = []

    isNetworkOnline: boolean = false

    constructor(private global: GlobalProvider, private constants: ConstProvider, private geolocation: NativeGeolocationPluginProvider, private camera: Camera
        , private diagnostic: Diagnostic, private network: NativeNetworkPluginProvider, public toast: ToastController, public platform: Platform) {

    }



    isEmpty(value): string{
        if (value == undefined || value == null) 
            return ""
        else
            return value;
      }
    

    getDogadjaji(action: string) {
        let properties: ICore.IProperties = {
            errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzv",
                    "params": {
                        "action": action,
                        "operateriid": "@@operaterid"
                    }
                }
            ]
        };

        return this.global.getData(dataDef, properties);

    }

    getComboValues() {
        let properties: ICore.IProperties = {
            errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzv",
                    "params": {
                        "action": "sorte"
                    },
                    "tablename": "sorte"
                },
                {
                    "query": "spMobRatIzv",
                    "params": {
                        "action": "kulture"
                    },
                    "tablename": "kulture"
                }
            ]
        };

        return this.global.getData(dataDef, properties);

    }

    getComboSorteById(kultureid: number) {
        let properties: ICore.IProperties = {
            errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzv",
                    "params": {
                        "action": "sortebykulture",
                        "kultureid": kultureid
                    },
                    "tablename": "sorte"
                }
            ]
        };

        return this.global.getData(dataDef, properties);

    }

    getPlanSjetve(ratArkodId: number){


        let properties: ICore.IProperties = {
        errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzv",
                    "params": {
                        "action": "getPlanSjetve",
                        "ratarkodid": ratArkodId
                    },
                    "tablename": "planSjetve"
                }
            ]
        };

        return this.global.getData(dataDef, properties);


    }

    insertSlika(UUID: string, image: string) {
        let properties: ICore.IProperties = {
            errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzvSlikaInsert",
                    "params": {
                        "UUID": UUID,
                        "image": image
                    },
                    "tablename": "slika"
                }
            ]
        };

        return this.global.getData(dataDef, properties);
    }

    insertData(InsertObject: any) {
        let properties: ICore.IProperties = {
            errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzvInsert",
                    "params": {
                        "operateriid": "@@operaterid",
                        "vrijeme": InsertObject.vrijeme,
                        "ratarkodid": InsertObject.ratarkodid,
                        "kultureid": InsertObject.kultureid,
                        "sorteid": InsertObject.sorteid,
                        "napomena": InsertObject.napomena,
                        "ratTipIzvidaId": InsertObject.ratTipIzvidaId,
                        "latitude": InsertObject.latitude,
                        "longitude": InsertObject.longitude,
                        "bolestind": InsertObject.bolestind,
                        "bolestopis": InsertObject.bolestopis,
                        "stetniciind": InsertObject.stetniciind,
                        "stetniciopis": InsertObject.stetniciopis,
                        "korovind": InsertObject.korovind,
                        "korovopis": InsertObject.korovopis,
                        "vodaind": InsertObject.vodaind,
                        "vodaopis": InsertObject.vodaopis,
                        "UUID": InsertObject.UUID,
                        "sklop": InsertObject.sklop,
                        "phInd": InsertObject.phInd,
                        "ph": Number(InsertObject.ph),
                        "sljedeciMonitoring" : Number(InsertObject.sljedeciMonitoring),
                        "preporuka" : InsertObject.preporuka

                    },
                    "tablename": "arkod"
                }
            ]
        };

        return this.global.getData(dataDef, properties);
    }

    getSearchResults(pojam: string) {
        let properties: ICore.IProperties = {
            errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzv",
                    "params": {
                        "action":'arkod',
                        "p1": pojam
                    }
                }
            ]
        };

        return this.global.getData(dataDef, properties);
    }

    getDetalji(action: string, id: number) {
        let properties: ICore.IProperties = {
            errorMessageCloseButton: true,
            showLoader: action=='deletedetalj' ? false : true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzv",
                    "params": {
                        "action": action,
                        "p0": id
                    }
                }
            ]
        };

        return this.global.getData(dataDef, properties);
    }

    getSlikeById(action: string, id: number) {
        let properties: ICore.IProperties = {
            errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzv",
                    "tablename": "detalji",
                    "params": {
                        "action": action,
                        "p0": id
                    }
                }
            ]
        };

        return this.global.getData(dataDef, properties);
    }


    obrisiDogadjaj(id: number) {

        this.getDetalji('deletedetalj', id).then(res => {
            console.log('dogadjaj obrisan')

            //TODO: refreshati page ispod modala

        })

    }

    // getIzvidnikGeoLocation() {

    //     this.geolocation.getLocationIzvidnik().then(resp => {

    //         this.koordinate.latitude = resp.coords.latitude
    //         this.koordinate.longitude = resp.coords.longitude

    //     })


    //     return this.koordinate

    // }

    
    getIzvidnikGeoLocation(): Promise<any> {
    return new Promise((resolve, reject) => {

        this.geolocation.getLocationIzvidnik().then(resp => {

            this.koordinate.latitude = resp.coords.latitude
            this.koordinate.longitude = resp.coords.longitude
            resolve(resp);
        }).catch( err => {

            this.toast.create(err);
        })

    });
    }



    getArkod(latitude: any, longitude: any) {

        let properties: ICore.IProperties = {
            errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzvGeolokacija",
                    "tablename": "arkod",
                    "params": {
                        "px": latitude,
                        "py": longitude
                    }
                }
            ]
        };

        return this.global.getData(dataDef, properties);

    }

    checkPermissions() {
        this.diagnostic
            .isCameraAuthorized()
            .then((authorized) => {
                if (authorized) {
                    this.takePicture();
                } else {
                    this.diagnostic
                        .requestCameraAuthorization()
                        .then((status) => {
                            if (status == this.diagnostic.permissionStatus.GRANTED) {
                                this.takePicture();
                            } else {
                                this.presentToast("Niste dozvolili pristup kameri.")
                                // Permissions not granted Therefore, create and present toast
                            }
                        });
                }
            });
    }

    takePicture() {


        this.platform.ready().then(() => {
            this.camera
                .getPicture({ correctOrientation: true,  encodingType: this.camera.EncodingType.JPEG, destinationType: this.camera.DestinationType.DATA_URL, targetWidth: 1000, targetHeight: 1000 })
                .then((imageData) => {
                    this.base64Image.push(imageData);
                    console.log(imageData)
                }, (err) => {
                    this.presentToast(err);
                });
        })
    }

    getMenuPermissions()
    {
        let properties: ICore.IProperties = {
            errorMessageCloseButton: true
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzv",
                    "tablename": "permissions",
                    "params": {
                        "action": 'getPostavke'                    
                    }
                }
            ]
        };

        this.global.getData(dataDef, properties).then(res => {

            this.menuPermissions = res.permissions;
            console.log(res.permissions)
        })
    }

    presentToast(message: any) {
        let toast = this.toast.create({
            message: message,
            duration: 3000,
            position: 'top'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
}

export interface IParametri {
    ID: number,
    Naziv: string,
    Oznaka: string,
    Povrsina: number
}

export interface IPlanSjetve {
    KultureId: number,
    SorteId: number
}
