import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMAnalizaKupcaRobaListaPage } from './robalista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMAnalizaKupcaRobaListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMAnalizaKupcaRobaListaPage),
    ComponentsModule
  ],
  exports: [
    CRMAnalizaKupcaRobaListaPage
  ]
})
export class CRMAnalizaKupcaRobaListaPageModule {}
