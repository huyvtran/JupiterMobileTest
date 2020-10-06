import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityKupUraDokumentDetPage } from './dokument-det';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityKupUraDokumentDetPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityKupUraDokumentDetPage),
    ComponentsModule
  ],
  exports: [
    UtilityKupUraDokumentDetPage
  ]
})
export class UtilityKupUraDokumentDetPageModule {}
