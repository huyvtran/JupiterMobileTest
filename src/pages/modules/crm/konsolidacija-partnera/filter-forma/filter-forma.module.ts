import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMKonsolidacijaFilterFormaPage } from './filter-forma';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMKonsolidacijaFilterFormaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMKonsolidacijaFilterFormaPage),
    ComponentsModule
  ],
  exports: [
    CRMKonsolidacijaFilterFormaPage
  ]
})
export class CRMKonsolidacijaFilterFormaPageModule {}
