import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMAnalizaKupcaListaPage } from './lista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMAnalizaKupcaListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMAnalizaKupcaListaPage),
    ComponentsModule
  ],
  exports: [
    CRMAnalizaKupcaListaPage
  ]
})
export class CRMAnalizaKupcaListaPageModule {}
