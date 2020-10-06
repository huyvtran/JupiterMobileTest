import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityKupUraDokumentiViewPage } from './dokumenti-view';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityKupUraDokumentiViewPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityKupUraDokumentiViewPage),
    ComponentsModule
  ],
  exports: [
    UtilityKupUraDokumentiViewPage
  ]
})
export class UtilityKupUraDokumentiViewPageModule {}
