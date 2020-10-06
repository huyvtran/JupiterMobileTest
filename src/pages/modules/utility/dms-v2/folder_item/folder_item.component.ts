import { NavController } from 'ionic-angular';
import {Component, Input} from '@angular/core'
import {UtilityDMSV2FolderRef} from "./folder_ref";
import {UtilityDMSV2ManagerPage} from "../folder/folder";



@Component({
  selector: 'page-utility-dmsv2-folder-item',
  templateUrl: "folder_item.component.html"
})


export class UtilityDMSV2FolderItem {

  @Input() folder: UtilityDMSV2FolderRef;
  iconName = 'custom-folder';


  constructor(private navCtrl:NavController)
  {

  }

  ionViewWillEnter() {
    console.log(this.folder.type);
    if (this.folder.type=='omroot') {
      this.iconName = 'custom-folder-personal'
    }
  }

  goToPage(folder:UtilityDMSV2FolderRef){
    //console.log(params);
    if(folder.id){
      this.navCtrl.push(UtilityDMSV2ManagerPage, {id: folder.id, path: folder.path, allowAdd: folder.allowAdd});
    }
  }
}
