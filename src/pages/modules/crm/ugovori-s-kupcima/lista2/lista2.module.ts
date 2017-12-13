import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMPregledUgovoraLista2Page } from './lista2';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMPregledUgovoraLista2Page,
  ],
  imports: [
    IonicPageModule.forChild(CRMPregledUgovoraLista2Page),
    ComponentsModule
  ],
  exports: [
    CRMPregledUgovoraLista2Page
  ]
})
export class CRMPregledUgovoraLista2PageModule {}
