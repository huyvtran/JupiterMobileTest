import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMListaPage } from './lista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMListaPage),
    ComponentsModule
  ],
  exports: [
    CRMListaPage
  ]
})
export class CRMListaPageModule {}
