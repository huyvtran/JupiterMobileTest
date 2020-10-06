import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityDMSV2ManagerPage } from './folder';
import { UtilityDMSV2FolderItem } from '../folder_item/folder_item.component';
import { UtilityDMSV2MediaItemPage } from '../media_item/media_item.component';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityDMSV2ManagerPage,
    UtilityDMSV2FolderItem,
    UtilityDMSV2MediaItemPage
  ],
  imports: [
    IonicPageModule.forChild(UtilityDMSV2ManagerPage),
    ComponentsModule
  ],
  exports: [
    UtilityDMSV2ManagerPage,
    UtilityDMSV2FolderItem,
    UtilityDMSV2MediaItemPage
  ]
})
export class UtilityDMSV2ManagerPageModule {}


