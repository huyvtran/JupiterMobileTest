import { Injectable } from '@angular/core';
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";
import { ToastController } from 'ionic-angular';

import { VariableProvider } from '../../core/variable-provider';
import { ErrorProvider } from '../../core/error-provider';


@Injectable()

export class UtilityDMSService {

    parametri: IParametri = {
        naziv: '',
        tekst: '',
        datumdodanood: null,
        datumdodanodo: null,
        kreator: '',
        vlasnik: ''
    };

    public entityname = ""
    public entityid = null;

    searchString: string = "";

    public types: Array<{ type: string, mimetype: string }>;
    direktorij: string = "JupiterMobileDocs";
    //public fileMimeTypes : any;
    fileMimeType: string = ''
    reloadData: boolean = true;
    constructor(private file: File, private fileOpener: FileOpener, private variable: VariableProvider, private error: ErrorProvider, private toastCtrl: ToastController) {
        //console.log(this.fileMimeTypes)
        this.parametri.datumdodanood = new Date().toISOString();
        this.parametri.datumdodanodo = new Date().toISOString();
        this.fileMimeType = "application/octet-stream";
        this.removeDir(this.direktorij)
        .then((res) => console.log(res))
        .catch((err) => {
            console.log(err)
        });
    }



    b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    saveFileOnDevice(file, naziv) {
        //provjeri postoji li direktorij kupura
        try {
            return this.checkDirExists(this.direktorij)
                .then((res) => {
                    //console.log(res)
                    if (res === true)
                        return this.writeAndOpenFile(naziv, file)
                            .catch((err) => {
                                //console.log(err)
                                this.deactivateLoader();
                                this.error.logError(err, false);
                            })
                })
                .catch((err) => {
                    this.createDir(this.direktorij)
                        .then((res) => {
                            this.writeAndOpenFile(naziv, file);
                        })
                        .catch((err) => {
                            //console.log(err)
                            this.deactivateLoader();
                            this.error.logError(err, false);
                        })
                })
        }
        catch (err) {
            this.deactivateLoader();
            this.error.logError(err, false);
        }
    }


    removeDir(dirname) {
        return this.file.removeRecursively(this.file.externalApplicationStorageDirectory, dirname);
    }

    //spremanje bloba na file system i otvaranje filea
    writeAndOpenFile(naziv, file) {
        //console.log(naziv, file)
        naziv = naziv.replace(/ /g, '_').toLowerCase();
        
        let putanja: string = this.file.externalApplicationStorageDirectory + this.direktorij + "/" + naziv;
        
        return this.file.writeFile(this.file.externalApplicationStorageDirectory + this.direktorij, naziv, this.b64toBlob(file, 'application/octet-stream', 512), { replace: true })
            .then(res => {
                let fileType = res.name.substr(res.name.lastIndexOf('.') + 1);
                let mimetype = this.checkType(fileType.toLowerCase());

                if (Object.keys(mimetype).length != 0) { //mimetype != undefined  || mimetype != null){
                    this.fileMimeType = mimetype[0].mimetype;
                    return res;
                }
                else {
                    this.presentToastError("Instalirajte podršku za odabrani tip dokumenta!")
                }
            })
            .then((res) => {
                // this.fileOpener.open(res.toURL(), this.fileMimeType).then((res) => {
                this.fileOpener.open(putanja, this.fileMimeType).then((res) => {
                    this.variable.loaderActive = false;
                    //console.log("uspjesno otvoren file")
                }).catch(err => {
                    this.deactivateLoader();
                    this.presentToastError("Greška prilikom otvaranja datoteke!")
                    this.error.logError(err, false);
                });
            })
            .catch((err) => {
                this.deactivateLoader();
                this.error.logError(err, false);
            })
    }



    //otvaranje file sa file systema
    openFile(path) {
        //console.log(path)
        let fileType = path.substr(path.lastIndexOf('.') + 1);
        let mimetype = this.checkType(fileType);

        if (Object.keys(mimetype).length != 0) { //mimetype != undefined  || mimetype != null){
            this.fileMimeType = mimetype[0].mimetype;

            this.fileOpener.open(path, this.fileMimeType).then((res) => {
                this.variable.loaderActive = false;
    
                console.log("uspjesno otvoren file")
            }).catch(err => {
                this.deactivateLoader();
                this.presentToastError("Greška prilikom otvaranja datoteke!")
                this.error.logError(err, false);
                console.log('Error opening file', err)
            });
        }
        else {
            this.presentToastError("Instalirajte podršku za odabrani tip dokumenta!")
        }

        
    }


    readFileAsDataURL(folder, fileName) {
        return this.file.readAsDataURL(folder, fileName)
    }



    deactivateLoader() {
        this.variable.loaderActive = false;
    }


    checkDirExists(dirname) {
        //console.log(dirname);
        return this.file.checkDir(this.file.externalApplicationStorageDirectory, dirname)
    }

    createDir(dirname) {
        return this.file.createDir(this.file.externalApplicationStorageDirectory, dirname, false)
    }


    checkType(type): any {

        this.types = [

            { type: "apk", mimetype: "application/vnd.android.package-archive" },
            { type: "avi", mimetype: "video/x-msvideo" },
            { type: "bmp", mimetype: "image/bmp" },
            { type: "csv", mimetype: "text/csv" },
            { type: "doc", mimetype: "application/msword" },
            { type: "docx", mimetype: "application/msword" },
            { type: "gif", mimetype: "image/gif" },
            { type: "htm", mimetype: "text/html" },
            { type: "html", mimetype: "text/html" },
            { type: "ico", mimetype: "image/x-icon" },
            { type: "jpg", mimetype: "image/jpeg" },
            { type: "jpeg", mimetype: "image/jpeg" },
            { type: "json", mimetype: "application/json" },
            { type: "ods", mimetype: "application/vnd.oasis.opendocument.spreadsheet" },
            { type: "odt", mimetype: "application/vnd.oasis.opendocument.text" },
            { type: "pdf", mimetype: "application/pdf" },
            { type: "png", mimetype: "image/png" },
            { type: "rar", mimetype: "application/x-rar-compressed" },
            { type: "rtf", mimetype: "application/rtf" },
            { type: "sql", mimetype: "text/*" },
            { type: "txt", mimetype: "text/plain" },
            { type: "tar", mimetype: "application/x-tar" },
            { type: "txt", mimetype: "text/plain" },
            { type: "xls", mimetype: "application/vnd.ms-excel" },
            { type: "xlsx", mimetype: "application/vnd.ms-excel" },
            { type: "xml", mimetype: "application/xml" },
            { type: "zip", mimetype: "application/zip" },
            { type: "7z", mimetype: "application/x-7z-compressed" }

        ]


        return this.types.filter(function (item) {
            if (item.type.indexOf(type) > -1) {
                return true;
            }
            return false;
        });
        //return array.indexOf(type) > -1 ;
    }


    presentToastError(message: string) {

        let toast = this
            .toastCtrl
            .create({ message: message, duration: 5000, position: 'bottom', cssClass: "toast-error" });

        toast.onDidDismiss(() => {

        });

        toast.present();
    }

}


export interface IParametri {
    naziv?: string,
    tekst: string,
    datumdodanood: string,
    datumdodanodo: string,
    kreator: string,
    vlasnik: string
}
