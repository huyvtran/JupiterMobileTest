import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMKonsolidacijaDetaljiPage } from './detalji';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMKonsolidacijaDetaljiPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMKonsolidacijaDetaljiPage),
    ComponentsModule
  ],
  exports: [
    CRMKonsolidacijaDetaljiPage
  ]
})
export class CRMKonsolidacijaListaPageModule {}
