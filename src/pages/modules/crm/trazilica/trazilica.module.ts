import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMKonsolidacijaTrazilicaPage } from './trazilica';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    CRMKonsolidacijaTrazilicaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMKonsolidacijaTrazilicaPage),
    ComponentsModule
  ],
  exports: [
    CRMKonsolidacijaTrazilicaPage
  ]
})
export class CRMKonsolidacijaTrazilicaPageModule {}
