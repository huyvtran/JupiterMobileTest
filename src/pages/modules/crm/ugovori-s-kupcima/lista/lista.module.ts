import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMPregledUgovoraListaPage } from './lista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMPregledUgovoraListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMPregledUgovoraListaPage),
    ComponentsModule
  ],
  exports: [
    CRMPregledUgovoraListaPage
  ]
})
export class CRMPregledUgovoraListaPageModule {}
