import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMBiljeskeListaPage } from './lista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMBiljeskeListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMBiljeskeListaPage),
    ComponentsModule
  ],
  exports: [
    CRMBiljeskeListaPage
  ]
})
export class CRMBiljeskeListaPageModule {}
