import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMUgovoriSDobavljacimaLista2Page } from './lista2';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMUgovoriSDobavljacimaLista2Page,
  ],
  imports: [
    IonicPageModule.forChild(CRMUgovoriSDobavljacimaLista2Page),
    ComponentsModule
  ],
  exports: [
    CRMUgovoriSDobavljacimaLista2Page
  ]
})
export class CRMUgovoriSDobavljacimaLista2PageModule {}
