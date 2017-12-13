import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMPregledUgovoraFilterForma2Page } from './filter-forma2';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMPregledUgovoraFilterForma2Page,
  ],
  imports: [
    IonicPageModule.forChild(CRMPregledUgovoraFilterForma2Page),
    ComponentsModule
  ],
  exports: [
    CRMPregledUgovoraFilterForma2Page
  ]
})
export class CRMPregledUgovoraFilterForma2PageModule {}
