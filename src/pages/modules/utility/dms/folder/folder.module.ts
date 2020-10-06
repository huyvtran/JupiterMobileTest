import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityDMSManagerPage } from './folder';
import { FolderItem } from '../folder_item/folder_item.component';
import { MediaItem } from '../media_item/media_item.component';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityDMSManagerPage,
    FolderItem,
    MediaItem
  ],
  imports: [
    IonicPageModule.forChild(UtilityDMSManagerPage),
    ComponentsModule
  ],
  exports: [
    UtilityDMSManagerPage,
    FolderItem,
    MediaItem
  ]
})
export class UtilityDMSManagerPageModule {}


