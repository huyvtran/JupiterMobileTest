import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityKupUraGenDokumentiViewPage } from './dokumenti-view';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityKupUraGenDokumentiViewPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityKupUraGenDokumentiViewPage),
    ComponentsModule
  ],
  exports: [
    UtilityKupUraGenDokumentiViewPage
  ]
})
export class UtilityKupUraGenDokumentiViewPageModule {}
