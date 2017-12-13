import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMUgovoriSDobavljacimaDetaljiDetaljaPage } from './detaljidetalja';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMUgovoriSDobavljacimaDetaljiDetaljaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMUgovoriSDobavljacimaDetaljiDetaljaPage),
    ComponentsModule
  ],
  exports: [
    CRMUgovoriSDobavljacimaDetaljiDetaljaPage
  ]
})
export class CRMUgovoriSDobavljacimaDetaljiDetaljaPageModule {}
