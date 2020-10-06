import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityKupUraIreksDokumentDetPage } from './dokument-det';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityKupUraIreksDokumentDetPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityKupUraIreksDokumentDetPage),
    ComponentsModule
  ],
  exports: [
    UtilityKupUraIreksDokumentDetPage
  ]
})
export class UtilityKupUraIreksDokumentDetPageModule {}
