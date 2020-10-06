import { Component } from '@angular/core';
import {
  NavParams,
  IonicPage,
  NavController,
  ModalController,
  Platform
} from 'ionic-angular';

import { File } from "@ionic-native/file";

import { UtilityDMSV2MediaRef } from "../media_item/media_ref";
import { UtilityDMSV2FolderRef } from "../folder_item/folder_ref";

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';



@IonicPage()

@Component({
  selector: 'page-utility-dmsv2-folder',
  templateUrl: 'folder.html'
})

export class UtilityDMSV2ManagerPage extends BasePage {

  direktorij: string = "JupiterMobileDocs";
  fileList: Array<UtilityDMSV2MediaRef | UtilityDMSV2FolderRef> = [];
  currentPath: string;
  id: string;
  allowAdd: boolean;
  showClose: boolean = true;

  constructor(private navParams: NavParams, private modal: ModalController, private navCtrl: NavController,
    private file: File, private platform : Platform) {
      
    super();

    this.id = this.navParams.get("id");
    this.currentPath = this.navParams.get("path");
    this.allowAdd = this.navParams.get("allowAdd");

    if(!this.currentPath) this.showClose = true; 
    else this.showClose = false;

    if (!this.currentPath) this.currentPath = "x:\\";
    if (!this.id) this.id = null;
   
    
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
      for (let file of x.table1) {
        this.fileList.push(new UtilityDMSV2FolderRef(file, this.currentPath))
      }
      
      for (let file of x.table2) {
        this.fileList.push(new UtilityDMSV2MediaRef(file))
      }
    })
      .catch((err) => {
        console.error(err);
    });
  }


  getButtonState(): boolean {
    console.log('getButtonState');
    console.log(this.allowAdd);
    if (this.allowAdd == true)
      return false;
    else
      return true;
  }

  removeDir(dirname) {
    return this.file.removeRecursively(this.file.applicationStorageDirectory, dirname);
  }


  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobDmsExplorerQuery",
          "params": {
            "ParentFolderId": this.id,
            "OperaterId": "@@OperaterId",
            "Login": "@@login"
          }
        }
      ]
    }
    return this.global.getData(dataDef);

  }

  getFolders() {
    return this.fileList.filter(item => item instanceof UtilityDMSV2FolderRef);
  }

  getFiles() {
    return this.fileList.filter(item => item instanceof UtilityDMSV2MediaRef);
  }

  unos() {
    this.navCtrl.push('DMSGenericDetailPage', { folderid: this.id })
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
