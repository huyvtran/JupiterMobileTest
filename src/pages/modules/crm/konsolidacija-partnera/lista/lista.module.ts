import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMKonsolidacijaListaPage } from './lista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMKonsolidacijaListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMKonsolidacijaListaPage),
    ComponentsModule
  ],
  exports: [
    CRMKonsolidacijaListaPage
  ]
})
export class CRMKonsolidacijaListaPageModule {}
