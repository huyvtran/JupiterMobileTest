import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityKupUraGenDokumentiPage } from './dokumenti';
import { ComponentsModule } from '../../../../../components/components.module';
import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    UtilityKupUraGenDokumentiPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityKupUraGenDokumentiPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    UtilityKupUraGenDokumentiPage
  ]
})
export class UtilityKupUraGenDokumentiPageModule {}
