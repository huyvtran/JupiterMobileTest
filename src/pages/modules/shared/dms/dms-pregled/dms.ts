import { Component } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams
} from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import { DMSProvider } from '../../../../../providers/modules/shared/dms-provider';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { GenericFormProvider } from '../../../../../providers/modules/utility/generic/generic_form_provider';
import { UtilityDMSService } from '../../../../../providers/modules/utility/utility-dms-provider';


/*
  Generated class for the Bugshooter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@IonicPage()
@Component({ selector: 'dms-page', templateUrl: 'dms.html'})
export class DMSGenericPage extends BasePage {


    public files: Array<string> = [];
    public images: Array<string> = []

    constructor(private photoViewer: PhotoViewer, private dms : UtilityDMSService, 
        private genericProvider: GenericFormProvider, public navCtrl: NavController, 
        public navParams: NavParams, 
        private dmsService: DMSProvider) {
        super();

        this.dmsService.entityname = this.navParams.get('entityname')
        this.dmsService.entityid = this.navParams.get('entityid')
        //this.entityid = 1500;
        //this.entityname = 'PonudeMob'
        this.genericProvider.refreshData = true;

    }

    ionViewWillEnter() {
        this.getDokumenti();
    }



    getDokumenti() {
        this.dmsService.getFiles()
            .then(res => {
                console.log(res)

                if (res)
                    this.razdijelislikeIFileove(res);
            })

    }

    previewPicture(file) {
        this.photoViewer.show('data:image/png;base64,' + file.base64, file.naziv, { share: true });

    }

    unos() {
        this.navCtrl.push('DMSGenericDetailPage', { folderid : null})
    }


    razdijelislikeIFileove(files) {
        this.files = []
        this.images = []
        files.forEach(element => {
            console.log(element)
            let fileType = element.naziv.substr(element.naziv.lastIndexOf('.') + 1);
            
            if(fileType.toLocaleLowerCase().includes('jpg') 
            || fileType.toLowerCase().includes('jpeg') 
            || fileType.toLowerCase().includes('png') 
            || fileType.toLowerCase().includes('gif') 
            || fileType.toLowerCase().includes('tiff')){
                this.images.push(element);
            }
            else
                this.files.push(element)
        });

        console.log(this.files)
    }

    openFile(file) {
        console.log(file)
        this.dms.saveFileOnDevice(file.base64 ,file.naziv);
    }

}
