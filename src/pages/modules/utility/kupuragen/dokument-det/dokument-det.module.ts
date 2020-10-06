import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityKupUraGenDokumentDetPage } from './dokument-det';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityKupUraGenDokumentDetPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityKupUraGenDokumentDetPage),
    ComponentsModule
  ],
  exports: [
    UtilityKupUraGenDokumentDetPage
  ]
})
export class UtilityKupUraGenDokumentDetPageModule {}
