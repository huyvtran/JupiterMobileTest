import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMPregledUgovoraDetaljidetaljaPage } from './detaljidetalja';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMPregledUgovoraDetaljidetaljaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMPregledUgovoraDetaljidetaljaPage),
    ComponentsModule
  ],
  exports: [
    CRMPregledUgovoraDetaljidetaljaPage
  ]
})
export class CRMPregledUgovoraDetaljiDetaljaPageModule {}
