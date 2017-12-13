import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CRMUgovoriSDobavljacimaFilterForma2Page } from './filter-forma2';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMUgovoriSDobavljacimaFilterForma2Page,
  ],
  imports: [
    IonicPageModule.forChild(CRMUgovoriSDobavljacimaFilterForma2Page),
    ComponentsModule
  ],
  exports: [
    CRMUgovoriSDobavljacimaFilterForma2Page
  ]
})
export class CRMUgovoriSDobavljacimaFilterForma2PageModule {}
