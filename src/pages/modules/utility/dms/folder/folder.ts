import { Component } from '@angular/core';
import {
  NavParams,
  IonicPage,
  NavController,
  ModalController,
  Platform
} from 'ionic-angular';

import { File } from "@ionic-native/file";

import { MediaRef } from "../media_item/media_ref";
import { FolderRef } from "../folder_item/folder_ref";

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';



@IonicPage()

@Component({
  selector: 'folder-page',
  templateUrl: 'folder.html',
  styles: [`

    ion-list-header{
      margin-top: 10px;
    }
       
    ion-toast.error .toast-wrapper {
	    background: rgb(209, 71, 71) !important;
    }
    
    
    
  `]
})

export class UtilityDMSManagerPage extends BasePage {

  direktorij: string = "JupiterMobileDocs";
  fileList: Array<MediaRef | FolderRef> = [];
  currentPath: string;
  dokId: string;
  showClose: boolean = true;
  constructor(private navParams: NavParams, private modal: ModalController, private navCtrl: NavController,
    private file: File, private platform : Platform) {
      
    super();

    this.dokId = this.navParams.get("dokid");
    this.currentPath = this.navParams.get("path");

    if(!this.currentPath) this.showClose = true; 
    else this.showClose = false;

    if (!this.currentPath) this.currentPath = "./ root";
    if (!this.dokId) this.dokId = null;
   
    
    //obrisi folder
    if(this.platform.is('cordova'))
      this.removeDir(this.direktorij)
        .then((res) => console.log(res))
        .catch((err) => {
          this.global.logError(err);
          //this.variable.loaderActive = false;
        });
  }

  ionViewWillEnter() {
    this.getData().then(x => {
     
      this.fileList = [];
      //this.data = x.dokumenti
      for (let file of x.dokumenti) {
        //console.log(file)
        if (file.tip === 1) {
          this.fileList.push(new FolderRef(file, this.currentPath))
        } else {
          this.fileList.push(new MediaRef(file))
        }

      }
      //console.log(this.fileList)
    })
      .catch((err) => {
        console.error(err);
      });
  }


  getButtonState(): boolean {
    //console.log(this.dmsService.base64Image)
    if (this.dokId == null || this.dokId == undefined)
      return true;
    else
      return false;
  }

  removeDir(dirname) {
    return this.file.removeRecursively(this.file.applicationStorageDirectory, dirname);
  }


  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobDmsQuery",
          "params": {
            "action": "getStructure",
            "ParentFolderId": this.dokId,
            "dokid": null
          },
          "tablename": "dokumenti"
        }
      ]
    }
    return this.global.getData(dataDef);

  }

  getFolders() {
    return this.fileList.filter(item => item instanceof FolderRef);
  }

  getFiles() {
    return this.fileList.filter(item => item instanceof MediaRef);
  }

  unos() {
    this.navCtrl.push('DMSGenericDetailPage', { folderid: this.dokId })
  }



  searchOptions() {

    setTimeout(() => {
      let modal = this.modal.create("DMSFilterListPage", { data: null })
      modal.present();

      modal.onDidDismiss(data => {
        if (data) {
          this.navCtrl.push('DMSListPage')

        }
      });
    }, 200);


  }

}
