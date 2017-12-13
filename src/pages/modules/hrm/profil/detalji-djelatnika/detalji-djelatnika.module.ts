import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HrmProfilDetaljiDjelatnikaPage } from './detalji-djelatnika';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmProfilDetaljiDjelatnikaPage,
  ],
  imports: [
    IonicPageModule.forChild(HrmProfilDetaljiDjelatnikaPage),
    ComponentsModule
  ],
  exports: [
    HrmProfilDetaljiDjelatnikaPage
  ]
})
export class HrmProfilDetaljiDjelatnikaPageModule {}
