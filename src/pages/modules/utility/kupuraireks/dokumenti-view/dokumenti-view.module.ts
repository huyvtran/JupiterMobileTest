import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityKupUraIreksDokumentiViewPage } from './dokumenti-view';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityKupUraIreksDokumentiViewPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityKupUraIreksDokumentiViewPage),
    ComponentsModule
  ],
  exports: [
    UtilityKupUraIreksDokumentiViewPage
  ]
})
export class UtilityKupUraIreksDokumentiViewPageModule {}
