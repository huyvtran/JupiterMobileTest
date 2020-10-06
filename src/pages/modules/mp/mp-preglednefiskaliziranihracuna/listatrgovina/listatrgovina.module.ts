import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPPreglednefiskaliziranihracunaListatrgovinaPage } from './listatrgovina';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    MPPreglednefiskaliziranihracunaListatrgovinaPage,
  ],
  imports: [
    IonicPageModule.forChild(MPPreglednefiskaliziranihracunaListatrgovinaPage),
    ComponentsModule
  ],
  exports: [
    MPPreglednefiskaliziranihracunaListatrgovinaPage
  ]
})
export class MPPreglednefiskaliziranihracunaListatrgovinaPageModule {}
