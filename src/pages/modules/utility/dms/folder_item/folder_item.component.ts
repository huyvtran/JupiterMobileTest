import { NavController } from 'ionic-angular';
import {Component, Input} from '@angular/core'
import {FolderRef} from "./folder_ref";
import {UtilityDMSManagerPage} from "../folder/folder";



@Component({
  selector: 'app-folder-item',
  templateUrl: "folder_item.component.html"
})


export class FolderItem{

  @Input() folder:FolderRef;


  constructor(private navCtrl:NavController)
  {

  }


  goToPage(params:any){
    //console.log(params);

    if(params.dokid){
      this.navCtrl.push(UtilityDMSManagerPage, {dokid: params.dokid, path: params.path});
    }


  }

}
