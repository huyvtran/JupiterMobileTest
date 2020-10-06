import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPPreglednefiskaliziranihracunaListaracunaPage } from './listaracuna';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPPreglednefiskaliziranihracunaListaracunaPage,
  ],
  imports: [
    IonicPageModule.forChild(MPPreglednefiskaliziranihracunaListaracunaPage),
    ComponentsModule
  ],
  exports: [
    MPPreglednefiskaliziranihracunaListaracunaPage
  ]
})
export class MPPreglednefiskaliziranihracunaListaracunaPageModule {}
