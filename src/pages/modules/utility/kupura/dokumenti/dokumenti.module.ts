import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityKupUraDokumentiPage } from './dokumenti';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityKupUraDokumentiPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityKupUraDokumentiPage),
    ComponentsModule
  ],
  exports: [
    UtilityKupUraDokumentiPage
  ]
})
export class UtilityKupUraDijumentiPageModule {}
