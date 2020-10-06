import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityKupUraIreksDokumentiPage } from './dokumenti';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityKupUraIreksDokumentiPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityKupUraIreksDokumentiPage),
    ComponentsModule
  ],
  exports: [
    UtilityKupUraIreksDokumentiPage
  ]
})
export class UtilityKupUraIreksDokumentiPageModule {}
